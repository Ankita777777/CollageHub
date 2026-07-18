const Admission = require('../models/Admission')
const User      = require('../models/User')
const Student   = require('../models/Student')

// @POST /api/admissions
// Public — student fills form
const submitAdmission = async (req, res) => {
  try {
    const {
      name, email, phone, address,
      program, lastSchool, percentage, message
    } = req.body

    if (!name || !email || !phone || !address || !program || !lastSchool || !percentage) {
      return res.status(400).json({ message: 'Please fill all required fields' })
    }

    // Check duplicate
    const existing = await Admission.findOne({ email, program })
    if (existing) {
      return res.status(400).json({
        message: 'You already applied for this program. We will contact you soon.'
      })
    }

    const admission = await Admission.create({
      name, email, phone, address,
      program, lastSchool, percentage,
      message: message || ''
    })

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully! We will contact you soon.',
      admission,
    })
  } catch (error) {
    console.error('Submit admission error:', error.message)
    return res.status(500).json({ message: error.message })
  }
}

// @GET /api/admissions
// Admin only — see all applications
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

// @GET /api/admissions/:id
// Admin only — single application
const getAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id)
    if (!admission) {
      return res.status(404).json({ message: 'Application not found' })
    }
    return res.json(admission)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

// @PUT /api/admissions/:id
// Admin only — accept or reject
const updateAdmission = async (req, res) => {
  try {
    const { status, reviewNote, semester, batch } = req.body

    const admission = await Admission.findById(req.params.id)
    if (!admission) {
      return res.status(404).json({ message: 'Application not found' })
    }

    // If already accepted dont accept again
    if (admission.status === 'accepted') {
      return res.status(400).json({ message: 'Application already accepted' })
    }

    admission.status     = status
    admission.reviewNote = reviewNote || ''
    admission.reviewedBy = req.user._id
    await admission.save()

    // ✅ If accepted — auto create student account
    if (status === 'accepted') {
      // Check if user already exists with this email
      let user = await User.findOne({ email: admission.email })

      if (!user) {
        // Generate default password from phone number
        const defaultPassword = `PMC@${admission.phone.slice(-4)}`

        // Create user account with student role
        user = await User.create({
          name:     admission.name,
          email:    admission.email,
          password: defaultPassword,
          role:     'student',
        })

        // Generate roll number
        const count  = await Student.countDocuments({ program: admission.program })
        const year   = new Date().getFullYear()
        const rollNo = `${admission.program}${year}${String(count + 1).padStart(3, '0')}`

        // Create student profile
        await Student.create({
          user:     user._id,
          rollNo,
          semester: Number(semester) || 1,
          program:  admission.program,
          batch:    batch || `${year}-${year + 4}`,
          phone:    admission.phone,
          address:  admission.address,
        })

        // Save reference to student user in admission
        admission.studentUser = user._id
        await admission.save()

        console.log('✅ Student account created!')
        console.log('   Email:', admission.email)
        console.log('   Password:', defaultPassword)
        console.log('   Roll No:', rollNo)

        return res.json({
          success:       true,
          message:       'Admission accepted! Student account created successfully.',
          admission,
          credentials: {
            email:       admission.email,
            password:    defaultPassword,
            rollNo,
          },
        })
      } else {
        // User already exists — just update role
        user.role = 'student'
        await user.save()

        return res.json({
          success: true,
          message: 'Admission accepted! Existing account updated to student.',
          admission,
        })
      }
    }

    return res.json({
      success: true,
      message: `Application ${status}`,
      admission,
    })
  } catch (error) {
    console.error('Update admission error:', error.message)
    return res.status(500).json({ message: error.message })
  }
}

// @DELETE /api/admissions/:id
// Admin only
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