const Scholarship = require('../models/Scholarship')
const Student     = require('../models/Student')

const getAllScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find({ isActive: true }).sort({ deadline: 1 })
    return res.json(scholarships)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const createScholarship = async (req, res) => {
  try {
    const { name, description, amount, percentage, criteria, deadline, program } = req.body
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' })
    }
    const scholarship = await Scholarship.create({
      name, description, amount, percentage, criteria, deadline, program,
    })
    return res.status(201).json({ message: 'Scholarship created', scholarship })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const applyScholarship = async (req, res) => {
  try {
    const student     = await Student.findOne({ user: req.user._id })
    if (!student) return res.status(404).json({ message: 'Student not found' })

    const scholarship = await Scholarship.findById(req.params.id)
    if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' })

    const { reason } = req.body
    if (!reason || reason.trim().length < 10) {
      return res.status(400).json({ message: 'Please provide a reason (min 10 characters)' })
    }

    const alreadyApplied = scholarship.applications.find(
      (a) => a.student.toString() === student._id.toString()
    )
    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied for this scholarship' })
    }

    scholarship.applications.push({ student: student._id, reason })
    await scholarship.save()

    return res.json({ message: 'Application submitted successfully' })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const respondScholarship = async (req, res) => {
  try {
    const { studentId, status, response } = req.body
    const scholarship = await Scholarship.findById(req.params.id)
    if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' })

    const application = scholarship.applications.find(
      (a) => a.student.toString() === studentId
    )
    if (!application) return res.status(404).json({ message: 'Application not found' })

    application.status   = status
    application.response = response
    await scholarship.save()

    return res.json({ message: `Application ${status}` })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getMyScholarships = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
    if (!student) return res.status(404).json({ message: 'Student not found' })

    const scholarships = await Scholarship.find({
      'applications.student': student._id,
    })

    const myApps = scholarships.map((s) => {
      const app = s.applications.find(
        (a) => a.student.toString() === student._id.toString()
      )
      return {
        scholarship: { _id: s._id, name: s.name, description: s.description, amount: s.amount, percentage: s.percentage },
        application: app,
      }
    })

    return res.json(myApps)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getAllScholarships, createScholarship,
  applyScholarship, respondScholarship, getMyScholarships,
}