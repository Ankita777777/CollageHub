const Student    = require('../models/Student')
const Attendance = require('../models/Attendance')
const Result     = require('../models/Result')
const Leave      = require('../models/Leave')
const Payment    = require('../models/Payment')
const User       = require('../models/User')

const findStudent = async (userId) => {
  let student = await Student.findOne({ user: userId })
  if (!student) {
    const user = await User.findById(userId)
    if (user && user.role === 'student') {
      const count  = await Student.countDocuments()
      const year   = new Date().getFullYear()
      student = await Student.create({
        user:     userId,
        rollNo:   `GEN${year}${String(count + 1).padStart(3, '0')}`,
        semester: 1,
        program:  'General',
      })
    }
  }
  return student
}

const getProfile = async (req, res) => {
  try {
    const student = await findStudent(req.user._id)
    if (!student) return res.status(404).json({ message: 'Student profile not found. Contact admin.' })
    const full = await Student.findById(student._id).populate('user', 'name email photo')
    return res.json(full)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const updateProfile = async (req, res) => {
  try {
    const student = await findStudent(req.user._id)
    if (!student) return res.status(404).json({ message: 'Student profile not found' })

    const { phone, address, fatherName } = req.body
    if (phone)      student.phone      = phone
    if (address)    student.address    = address
    if (fatherName) student.fatherName = fatherName
    await student.save()

    if (req.body.name || req.file?.path) {
      const updateData = {}
      if (req.body.name)  updateData.name  = req.body.name
      if (req.file?.path) updateData.photo = req.file.path
      await User.findByIdAndUpdate(req.user._id, updateData)
    }

    const updated = await Student.findById(student._id).populate('user', 'name email photo')
    return res.json({ message: 'Profile updated', student: updated })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getAttendance = async (req, res) => {
  try {
    const student = await findStudent(req.user._id)
    if (!student) return res.status(404).json({ message: 'Student profile not found' })

    const records = await Attendance.find({ student: student._id })
      .populate('course', 'name code')
      .sort({ date: -1 })

    const summaryMap = {}
    records.forEach((r) => {
      if (!r.course) return
      const key = r.course._id.toString()
      if (!summaryMap[key]) summaryMap[key] = { course: r.course, total: 0, present: 0 }
      summaryMap[key].total++
      if (r.status === 'present') summaryMap[key].present++
    })

    const summary = Object.values(summaryMap).map((s) => ({
      course:     s.course,
      total:      s.total,
      present:    s.present,
      percentage: s.total > 0 ? ((s.present / s.total) * 100).toFixed(1) : '0',
    }))

    return res.json({ records, summary })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getResults = async (req, res) => {
  try {
    const student = await findStudent(req.user._id)
    if (!student) return res.status(404).json({ message: 'Student profile not found' })

    const results = await Result.find({ student: student._id })
      .populate('course', 'name code creditHours')
      .sort({ semester: 1 })
    return res.json(results)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getFeeStatus = async (req, res) => {
  try {
    const student = await findStudent(req.user._id)
    if (!student) return res.status(404).json({ message: 'Student profile not found' })

    const payments = await Payment.find({ student: student._id }).sort({ createdAt: -1 })
    return res.json({ feeStatus: student.feeStatus, payments })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const applyLeave = async (req, res) => {
  try {
    const student = await findStudent(req.user._id)
    if (!student) return res.status(404).json({ message: 'Student profile not found' })

    const { fromDate, toDate, reason } = req.body
    if (!fromDate || !toDate || !reason?.trim()) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    if (new Date(fromDate) > new Date(toDate)) {
      return res.status(400).json({ message: 'From date cannot be after to date' })
    }

    const leave = await Leave.create({ student: student._id, fromDate, toDate, reason: reason.trim() })
    return res.status(201).json({ message: 'Leave applied successfully', leave })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getLeaves = async (req, res) => {
  try {
    const student = await findStudent(req.user._id)
    if (!student) return res.status(404).json({ message: 'Student profile not found' })

    const leaves = await Leave.find({ student: student._id }).sort({ createdAt: -1 })
    return res.json(leaves)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = { getProfile, updateProfile, getAttendance, getResults, getFeeStatus, applyLeave, getLeaves }