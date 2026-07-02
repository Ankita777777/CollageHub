const Teacher    = require('../models/Teacher')
const Attendance = require('../models/Attendance')
const Result     = require('../models/Result')
const Student    = require('../models/Student')
const Leave      = require('../models/Leave')
const Course     = require('../models/Course')

const getProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user._id })
      .populate('user', 'name email photo')
      .populate('subjects', 'name code')
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' })
    res.json(teacher)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const markAttendance = async (req, res) => {
  try {
    const { courseId, date, records } = req.body
    if (!courseId || !date || !records) {
      return res.status(400).json({ message: 'Please provide all fields' })
    }
    const bulkOps = records.map((r) => ({
      updateOne: {
        filter: { student: r.studentId, course: courseId, date: new Date(date) },
        update: { $set: { status: r.status, markedBy: req.user._id } },
        upsert: true,
      },
    }))
    await Attendance.bulkWrite(bulkOps)
    res.json({ message: 'Attendance marked successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getAttendanceByCourse = async (req, res) => {
  try {
    const records = await Attendance.find({ course: req.params.courseId })
      .populate('student')
      .sort({ date: -1 })
    res.json(records)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const enterResult = async (req, res) => {
  try {
    const { studentId, courseId, semester, marks } = req.body
    if (!studentId || !courseId || !semester || marks === undefined) {
      return res.status(400).json({ message: 'Please provide all fields' })
    }
    let grade = 'F'
    if (marks >= 90)      grade = 'A+'
    else if (marks >= 80) grade = 'A'
    else if (marks >= 70) grade = 'B+'
    else if (marks >= 60) grade = 'B'
    else if (marks >= 50) grade = 'C'
    else if (marks >= 40) grade = 'D'

    const result = await Result.findOneAndUpdate(
      { student: studentId, course: courseId },
      { marks, grade, semester, status: marks >= 40 ? 'pass' : 'fail' },
      { upsert: true, new: true }
    )
    res.json({ message: 'Result saved', result })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getStudentsByCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })
    const students = await Student.find({
      program:  course.program,
      semester: course.semester,
    }).populate('user', 'name email photo')
    res.json(students)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getPendingLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ status: 'pending' })
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .sort({ createdAt: -1 })
    res.json(leaves)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const reviewLeave = async (req, res) => {
  try {
    const { status, reviewNote } = req.body
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status, reviewNote, reviewedBy: req.user._id },
      { new: true }
    )
    if (!leave) return res.status(404).json({ message: 'Leave not found' })
    res.json({ message: 'Leave reviewed', leave })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getProfile, markAttendance, getAttendanceByCourse,
  enterResult, getStudentsByCourse, getPendingLeaves, reviewLeave,
}