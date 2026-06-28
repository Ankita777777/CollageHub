const Teacher = require('../models/Teacher')
const Attendance = require('../models/Attendance')
const Result = require('../models/Result')
const Student = require('../models/Student')
const Leave = require('../models/Leave')
const Course = require('../models/Course')

// @GET /api/teachers/profile
const getProfile = async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user._id })
    .populate('user', 'name email photo')
    .populate('subjects', 'name code')
  if (!teacher) return res.status(404).json({ message: 'Teacher not found' })
  res.json(teacher)
}

// @POST /api/teachers/attendance
const markAttendance = async (req, res) => {
  const { courseId, date, records } = req.body
  // records = [{ studentId, status }]

  const bulkOps = records.map((r) => ({
    updateOne: {
      filter: { student: r.studentId, course: courseId, date: new Date(date) },
      update: { $set: { status: r.status, markedBy: req.user._id } },
      upsert: true,
    },
  }))

  await Attendance.bulkWrite(bulkOps)
  res.json({ message: 'Attendance marked successfully' })
}

// @GET /api/teachers/attendance/:courseId
const getAttendanceByCourse = async (req, res) => {
  const records = await Attendance.find({ course: req.params.courseId })
    .populate('student', 'rollNo')
    .populate('student.user', 'name')
    .sort({ date: -1 })
  res.json(records)
}

// @POST /api/teachers/results
const enterResult = async (req, res) => {
  const { studentId, courseId, semester, marks } = req.body

  let grade = 'F'
  if (marks >= 90) grade = 'A+'
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
}

// @GET /api/teachers/students/:courseId
const getStudentsByCourse = async (req, res) => {
  const course = await Course.findById(req.params.courseId)
  const students = await Student.find({ program: course.program, semester: course.semester })
    .populate('user', 'name email photo')
  res.json(students)
}

// @GET /api/teachers/leaves
const getPendingLeaves = async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user._id })
  const leaves = await Leave.find({ status: 'pending' })
    .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
    .sort({ createdAt: -1 })
  res.json(leaves)
}

// @PUT /api/teachers/leaves/:id
const reviewLeave = async (req, res) => {
  const { status, reviewNote } = req.body
  const leave = await Leave.findByIdAndUpdate(
    req.params.id,
    { status, reviewNote, reviewedBy: req.user._id },
    { new: true }
  )
  res.json({ message: 'Leave reviewed', leave })
}

module.exports = { getProfile, markAttendance, getAttendanceByCourse, enterResult, getStudentsByCourse, getPendingLeaves, reviewLeave }