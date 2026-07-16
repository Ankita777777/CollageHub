const Admission = require('../models/Admission')
const User      = require('../models/User')
const Student   = require('../models/Student')

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

    const admission = await Admission.create({
      name, email, phone, address,
      program, lastSchool, percentage, message
    })

    return res.status(201).json({
      message: 'Application submitted! We will contact you soon.',
      admission,
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const getAllAdmissions = async (req, res) => {
  try {
    const { status, program } = req.query
    const filter = {}
    if (status)  filter.status  = status
    if (program) filter.program = program
    const admissions = await Admission.find(filter).sort({ createdAt: -1 })
    return res.json(admissions)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const getAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id)
    if (!admission) return res.status(404).json({ message: 'Not found' })
    return res.json(admission)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

// ✅ THIS IS THE KEY FUNCTION
// When admin accepts → auto creates User + Student account
const updateAdmission = async (req, res) => {
  try {
    const { status, reviewNote, semester, batch } = req.body

    const admission = await Admission.findById(req.params.id)
    if (!admission) return res.status(404).json({ message: 'Not found' })

    admission.status     = status     || admission.status
    admission.reviewNote = reviewNote || admission.reviewNote
    admission.reviewedBy = req.user._id
    await admission.save()

    // ✅ If accepted → create student account automatically
    if (status === 'accepted') {
      // Check if user already exists
      const existingUser = await User.findOne({ email: admission.email })

      if (!existingUser) {
        // Generate a default password
        const defaultPassword = `PMC@${admission.phone.slice(-4)}`

        // Create user account
        const user = await User.create({
          name:     admission.name,
          email:    admission.email,
          password: defaultPassword,
          role:     'student',
        })

        // Generate roll number
        const count  = await Student.countDocuments({ program: admission.program })
        const rollNo = `${admission.program}${new Date().getFullYear()}${String(count + 1).padStart(3, '0')}`

        // Create student profile
        await Student.create({
          user:       user._id,
          rollNo,
          semester:   semester || 1,
          program:    admission.program,
          batch:      batch || `${new Date().getFullYear()}-${new Date().getFullYear() + 4}`,
          phone:      admission.phone,
          address:    admission.address,
          fatherName: '',
          feeStatus:  'due',
        })

        console.log(`✅ Student account created:`)
        console.log(`   Email: ${admission.email}`)
        console.log(`   Password: ${defaultPassword}`)
        console.log(`   Roll No: ${rollNo}`)

        return res.json({
          message:         'Admission accepted! Student account created.',
          admission,
          loginEmail:      admission.email,
          loginPassword:   defaultPassword,
          rollNo,
        })
      }
    }

    return res.json({ message: `Application ${status}`, admission })
  } catch (error) {
    console.error('Update admission error:', error.message)
    return res.status(500).json({ message: error.message })
  }
}

const deleteAdmission = async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id)
    return res.json({ message: 'Application deleted' })
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