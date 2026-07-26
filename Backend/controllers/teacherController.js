const Teacher    = require('../models/Teacher')
const Attendance = require('../models/Attendance')
const Result     = require('../models/Result')
const Student    = require('../models/Student')
const Leave      = require('../models/Leave')
const Course     = require('../models/Course')
const User       = require('../models/User')

const findTeacher = async (userId) => {
  let teacher = await Teacher.findOne({ user: userId })
  if (!teacher) {
    teacher = await Teacher.create({
      user:        userId,
      employeeId:  `EMP${Date.now()}`,
      department:  'General',
      designation: 'Lecturer',
    })
  }
  return teacher
}

const getProfile = async (req, res) => {
  try {
    const teacher = await findTeacher(req.user._id)
    const full    = await Teacher.findById(teacher._id)
      .populate('user', 'name email photo')
      .populate('subjects', 'name code')
    return res.json(full)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const updateProfile = async (req, res) => {
  try {
    const teacher = await findTeacher(req.user._id)
    const { phone, address, qualification, department, designation, name } = req.body

    if (phone)         teacher.phone         = phone
    if (address)       teacher.address       = address
    if (qualification) teacher.qualification = qualification
    if (department)    teacher.department    = department
    if (designation)   teacher.designation   = designation
    await teacher.save()

    const updateData = {}
    if (name)           updateData.name  = name.trim()
    if (req.file?.path) updateData.photo = req.file.path
    if (Object.keys(updateData).length > 0) {
      await User.findByIdAndUpdate(req.user._id, updateData)
    }

    const updated = await Teacher.findById(teacher._id).populate('user', 'name email photo')
    return res.json({ message: 'Profile updated', teacher: updated })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getMyStats = async (req, res) => {
  try {
    const teacher   = await findTeacher(req.user._id)
    const myCourses = await Course.find({ teacher: teacher._id })
    const courseIds = myCourses.map((c) => c._id)
    const programs  = [...new Set(myCourses.map((c) => c.program))]
    const semesters = [...new Set(myCourses.map((c) => c.semester))]

    let totalStudents = 0
    if (programs.length > 0) {
      totalStudents = await Student.countDocuments({
        program: { $in: programs }, semester: { $in: semesters }, isActive: true
      })
    }

    const attendanceMarked = await Attendance.countDocuments({ markedBy: req.user._id })
    const resultsEntered   = await Result.countDocuments({ course: { $in: courseIds } })
    const pendingLeaves    = await Leave.countDocuments({ status: 'pending' })

    return res.json({ totalCourses: myCourses.length, totalStudents, attendanceMarked, resultsEntered, pendingLeaves })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getMyCourses = async (req, res) => {
  try {
    const teacher = await findTeacher(req.user._id)
    const courses = await Course.find({ teacher: teacher._id })
    return res.json(courses)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getMyStudents = async (req, res) => {
  try {
    const teacher   = await findTeacher(req.user._id)
    const myCourses = await Course.find({ teacher: teacher._id })
    if (myCourses.length === 0) return res.json([])

    const programs  = [...new Set(myCourses.map((c) => c.program))]
    const semesters = [...new Set(myCourses.map((c) => c.semester))]

    const students = await Student.find({
      program: { $in: programs }, semester: { $in: semesters }, isActive: true
    }).populate('user', 'name email photo')

    return res.json(students)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getMyResults = async (req, res) => {
  try {
    const teacher   = await findTeacher(req.user._id)
    const myCourses = await Course.find({ teacher: teacher._id })
    const courseIds = myCourses.map((c) => c._id)

    const results = await Result.find({ course: { $in: courseIds } })
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
      .populate('course', 'name code')
      .sort({ createdAt: -1 })
    return res.json(results)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const markAttendance = async (req, res) => {
  try {
    const { courseId, date, records } = req.body
    if (!courseId || !date || !records?.length) {
      return res.status(400).json({ message: 'courseId, date and records are required' })
    }

    const bulkOps = records.map((r) => ({
      updateOne: {
        filter: { student: r.studentId, course: courseId, date: new Date(date) },
        update: { $set: { status: r.status, markedBy: req.user._id } },
        upsert: true,
      },
    }))

    await Attendance.bulkWrite(bulkOps)
    return res.json({ message: `Attendance marked for ${records.length} students` })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getAttendanceByCourse = async (req, res) => {
  try {
    const records = await Attendance.find({ course: req.params.courseId })
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
      .sort({ date: -1 })
    return res.json(records)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const enterResult = async (req, res) => {
  try {
    const { studentId, courseId, semester, marks } = req.body
    if (!studentId || !courseId || !semester || marks === undefined) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    if (Number(marks) < 0 || Number(marks) > 100) {
      return res.status(400).json({ message: 'Marks must be between 0 and 100' })
    }

    let grade = 'F'
    const m   = Number(marks)
    if (m >= 90) grade = 'A+'
    else if (m >= 80) grade = 'A'
    else if (m >= 70) grade = 'B+'
    else if (m >= 60) grade = 'B'
    else if (m >= 50) grade = 'C'
    else if (m >= 40) grade = 'D'

    const result = await Result.findOneAndUpdate(
      { student: studentId, course: courseId },
      { marks: m, grade, semester: Number(semester), status: m >= 40 ? 'pass' : 'fail' },
      { upsert: true, new: true }
    )
    return res.json({ message: 'Result saved', result })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getStudentsByCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const students = await Student.find({
      program: course.program, semester: course.semester, isActive: true
    }).populate('user', 'name email photo')
    return res.json(students)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getPendingLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ status: 'pending' })
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .sort({ createdAt: -1 })
    return res.json(leaves)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const reviewLeave = async (req, res) => {
  try {
    const { status, reviewNote } = req.body
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' })
    }
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status, reviewNote: reviewNote || '', reviewedBy: req.user._id },
      { new: true }
    )
    if (!leave) return res.status(404).json({ message: 'Leave not found' })
    return res.json({ message: `Leave ${status}`, leave })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getProfile, updateProfile, getMyStats,
  getMyCourses, getMyStudents, getMyResults,
  markAttendance, getAttendanceByCourse,
  enterResult, getStudentsByCourse,
  getPendingLeaves, reviewLeave,
}