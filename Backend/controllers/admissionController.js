const Admission = require('../models/Admission')
const User      = require('../models/User')
const Student   = require('../models/Student')
const Teacher   = require('../models/Teacher')

// In submitAdmission function add marksheet handling:
const submitAdmission = async (req, res) => {
  try {
    const {
      name, email, phone, address,
      program, lastSchool, percentage, message
    } = req.body

    if (!name || !email || !phone || !address || !program || !lastSchool || !percentage) {
      return res.status(400).json({ message: 'Please fill all required fields' })
    }

    const existing = await Admission.findOne({ email, program })
    if (existing) {
      return res.status(400).json({ message: 'You already applied for this program' })
    }

    // Get uploaded file path
    const marksheet = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : ''

    const admission = await Admission.create({
      name, email, phone, address,
      program, lastSchool, percentage,
      message: message || '',
      marksheet,
    })

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      admission,
    })
  } catch (error) {
    console.error('Submit error:', error.message)
    return res.status(500).json({ message: error.message })
  }
}

const getAllAdmissions = async (req, res) => {
  try {
    const { status, program } = req.query
    const filter = {}
    if (status)  filter.status  = status
    if (program) filter.program = program
    const admissions = await Admission.find(filter)
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 })
    return res.json(admissions)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const getAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id)
    if (!admission) {
      return res.status(404).json({ message: 'Not found' })
    }
    return res.json(admission)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const updateAdmission = async (req, res) => {
  try {
    const { status, reviewNote, semester, batch, role } = req.body

    const admission = await Admission.findById(req.params.id)
    if (!admission) {
      return res.status(404).json({ message: 'Application not found' })
    }

    if (admission.status === 'accepted') {
      return res.status(400).json({ message: 'Already accepted' })
    }

    admission.status     = status
    admission.reviewNote = reviewNote || ''
    admission.reviewedBy = req.user._id
    await admission.save()

    // ─── ACCEPT AS STUDENT ───────────────────────────
    if (status === 'accepted' && (!role || role === 'student')) {
      const defaultPassword = `PMC@${admission.phone.slice(-4)}`
      let user = await User.findOne({ email: admission.email })

      if (!user) {
        // Create new user
        user = await User.create({
          name:     admission.name,
          email:    admission.email,
          password: defaultPassword,
          role:     'student',
        })
      } else {
        // Update existing user role
        user.role = 'student'
        await user.save()
      }

      // Create student profile if not exists
      let student = await Student.findOne({ user: user._id })
      if (!student) {
        const count  = await Student.countDocuments()
        const year   = new Date().getFullYear()
        const rollNo = `${admission.program}${year}${String(count + 1).padStart(3, '0')}`

        student = await Student.create({
          user:     user._id,
          rollNo,
          semester: Number(semester) || 1,
          program:  admission.program,
          batch:    batch || `${year}-${year + 4}`,
          phone:    admission.phone,
          address:  admission.address,
          feeStatus: 'due',
          isActive:  true,
        })

        console.log('✅ Student created:', admission.email)
        console.log('   Password:', defaultPassword)
        console.log('   Roll No:', rollNo)
      }

      admission.studentUser = user._id
      await admission.save()

      return res.json({
        success: true,
        message: 'Admission accepted! Student account created.',
        admission,
        credentials: {
          email:    admission.email,
          password: defaultPassword,
          rollNo:   student.rollNo,
          role:     'student',
        },
      })
    }

    // ─── ACCEPT AS TEACHER ───────────────────────────
    if (status === 'accepted' && role === 'teacher') {
      const defaultPassword = `PMC@${admission.phone.slice(-4)}`
      let user = await User.findOne({ email: admission.email })

      if (!user) {
        user = await User.create({
          name:     admission.name,
          email:    admission.email,
          password: defaultPassword,
          role:     'teacher',
        })
      } else {
        user.role = 'teacher'
        await user.save()
      }

      // Create teacher profile if not exists
      let teacher = await Teacher.findOne({ user: user._id })
      if (!teacher) {
        teacher = await Teacher.create({
          user:        user._id,
          employeeId:  `EMP${Date.now()}`,
          department:  req.body.department  || 'General',
          designation: req.body.designation || 'Lecturer',
          phone:       admission.phone,
          isActive:    true,
        })
        console.log('✅ Teacher created:', admission.email)
      }

      return res.json({
        success: true,
        message: 'Accepted as Teacher! Account created.',
        admission,
        credentials: {
          email:    admission.email,
          password: defaultPassword,
          role:     'teacher',
        },
      })
    }

    // ─── REJECTED ────────────────────────────────────
    return res.json({
      success: true,
      message: 'Application rejected',
      admission,
    })
  } catch (error) {
    console.error('Update admission error:', error.message)
    return res.status(500).json({ message: error.message })
  }
}

const deleteAdmission = async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id)
    return res.json({ message: 'Deleted' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = {
  submitAdmission,
  getAllAdmissions,
  getAdmission,
  updateAdmission,
  deleteAdmission,
}