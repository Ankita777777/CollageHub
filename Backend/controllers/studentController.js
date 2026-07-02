const Student    = require('../models/Student')
const Attendance = require('../models/Attendance')
const Result     = require('../models/Result')
const Leave      = require('../models/Leave')
const Payment    = require('../models/Payment')

const getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate('user', 'name email photo')
    if (!student) return res.status(404).json({ message: 'Student not found' })
    res.json(student)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
    if (!student) return res.status(404).json({ message: 'Student not found' })
    const { phone, address } = req.body
    student.phone   = phone   || student.phone
    student.address = address || student.address
    await student.save()
    res.json({ message: 'Profile updated', student })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
    if (!student) return res.status(404).json({ message: 'Student not found' })

    const records = await Attendance.find({ student: student._id })
      .populate('course', 'name code')
      .sort({ date: -1 })

    const summaryMap = {}
    records.forEach((r) => {
      const key = r.course._id.toString()
      if (!summaryMap[key]) {
        summaryMap[key] = { course: r.course, total: 0, present: 0 }
      }
      summaryMap[key].total++
      if (r.status === 'present') summaryMap[key].present++
    })

    const summary = Object.values(summaryMap).map((s) => ({
      course:     s.course,
      total:      s.total,
      present:    s.present,
      percentage: ((s.present / s.total) * 100).toFixed(1),
    }))

    res.json({ records, summary })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getResults = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
    if (!student) return res.status(404).json({ message: 'Student not found' })
    const results = await Result.find({ student: student._id })
      .populate('course', 'name code creditHours')
      .sort({ semester: 1 })
    res.json(results)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getFeeStatus = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
    if (!student) return res.status(404).json({ message: 'Student not found' })
    const payments = await Payment.find({ student: student._id }).sort({ createdAt: -1 })
    res.json({ feeStatus: student.feeStatus, payments })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const applyLeave = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
    if (!student) return res.status(404).json({ message: 'Student not found' })
    const { fromDate, toDate, reason } = req.body
    if (!fromDate || !toDate || !reason) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }
    const leave = await Leave.create({ student: student._id, fromDate, toDate, reason })
    res.status(201).json({ message: 'Leave applied', leave })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getLeaves = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
    if (!student) return res.status(404).json({ message: 'Student not found' })
    const leaves = await Leave.find({ student: student._id }).sort({ createdAt: -1 })
    res.json(leaves)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getProfile, updateProfile, getAttendance,
  getResults, getFeeStatus, applyLeave, getLeaves,
}