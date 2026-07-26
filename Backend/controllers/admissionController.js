const Admission = require('../models/Admission')
const User      = require('../models/User')
const Student   = require('../models/Student')
const Teacher   = require('../models/Teacher')

const submitAdmission = async (req, res) => {
  try {
    const { name, email, phone, address, program, lastSchool, percentage, message } = req.body
    if (!name || !email || !phone || !address || !program || !lastSchool || !percentage) {
      return res.status(400).json({ message: 'Please fill all required fields' })
    }

    const existing = await Admission.findOne({ email: email.toLowerCase(), program })
    if (existing) return res.status(400).json({ message: 'You already applied for this program' })

    const admission = await Admission.create({
      name, email: email.toLowerCase(), phone, address,
      program, lastSchool, percentage,
      message:   message || '',
      marksheet: req.file?.path || '',
    })
    return res.status(201).json({ message: 'Application submitted successfully!', admission })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getAllAdmissions = async (req, res) => {
  try {
    const { status, program } = req.query
    const filter = {}
    if (status)  filter.status  = status
    if (program) filter.program = program
    const admissions = await Admission.find(filter).populate('reviewedBy', 'name').sort({ createdAt: -1 })
    return res.json(admissions)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id)
    if (!admission) return res.status(404).json({ message: 'Not found' })
    return res.json(admission)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const updateAdmission = async (req, res) => {
  try {
    const { status, reviewNote, semester, batch, role } = req.body
    const admission = await Admission.findById(req.params.id)
    if (!admission) return res.status(404).json({ message: 'Not found' })
    if (admission.status === 'accepted') return res.status(400).json({ message: 'Already accepted' })

    admission.status     = status
    admission.reviewNote = reviewNote || ''
    admission.reviewedBy = req.user._id
    await admission.save()

    if (status === 'accepted') {
      const defaultPassword = `PMC@${admission.phone.slice(-4)}`
      const targetRole      = role === 'teacher' ? 'teacher' : 'student'

      let user = await User.findOne({ email: admission.email })
      if (!user) {
        user = await User.create({ name: admission.name, email: admission.email, password: defaultPassword, role: targetRole })
      } else {
        user.role = targetRole
        await user.save()
      }

      if (targetRole === 'student') {
        const existingStudent = await Student.findOne({ user: user._id })
        if (!existingStudent) {
          const count  = await Student.countDocuments()
          const year   = new Date().getFullYear()
          const rollNo = `${admission.program}${year}${String(count + 1).padStart(3, '0')}`
          await Student.create({
            user: user._id, rollNo,
            semester: Number(semester) || 1,
            program: admission.program,
            batch:   batch || `${year}-${year + 4}`,
            phone:   admission.phone,
            address: admission.address,
          })
          admission.studentUser = user._id
          await admission.save()
          return res.json({
            success: true, message: 'Admission accepted! Student account created.',
            admission, credentials: { email: admission.email, password: defaultPassword, rollNo, role: 'student' },
          })
        }
      }

      if (targetRole === 'teacher') {
        const existingTeacher = await Teacher.findOne({ user: user._id })
        if (!existingTeacher) {
          await Teacher.create({
            user: user._id, employeeId: `EMP${Date.now()}`,
            department: req.body.department || 'General',
            designation: req.body.designation || 'Lecturer',
            phone: admission.phone,
          })
        }
        return res.json({
          success: true, message: 'Accepted as Teacher!',
          admission, credentials: { email: admission.email, password: defaultPassword, role: 'teacher' },
        })
      }
    }

    return res.json({ success: true, message: `Application ${status}`, admission })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const deleteAdmission = async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id)
    return res.json({ message: 'Deleted' })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = { submitAdmission, getAllAdmissions, getAdmission, updateAdmission, deleteAdmission }