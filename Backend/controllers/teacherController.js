const Teacher    = require('../models/Teacher')
const Attendance = require('../models/Attendance')
const Result     = require('../models/Result')
const Student    = require('../models/Student')
const Leave      = require('../models/Leave')
const Course     = require('../models/Course')

// Helper — get or create teacher profile
const getOrCreateTeacher = async (userId) => {
  let teacher = await Teacher.findOne({ user: userId })
  if (!teacher) {
    teacher = await Teacher.create({
      user:        userId,
      employeeId:  `EMP${Date.now()}`,
      department:  'General',
      designation: 'Lecturer',
      phone:       '',
      address:     '',
      qualification: '',
    })
  }
  return teacher
}

// @GET /api/teachers/profile
const getProfile = async (req, res) => {
  try {
    const teacher = await getOrCreateTeacher(req.user._id)
    const full    = await Teacher.findById(teacher._id)
      .populate('user', 'name email photo')
      .populate('subjects', 'name code')
    return res.json(full)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// @PUT /api/teachers/profile
const updateProfile = async (req, res) => {
  try {
    const teacher = await getOrCreateTeacher(req.user._id)
    const {
      phone, address, qualification,
      department, designation, photo, name
    } = req.body

    if (phone)         teacher.phone         = phone
    if (address)       teacher.address       = address
    if (qualification) teacher.qualification = qualification
    if (department)    teacher.department    = department
    if (designation)   teacher.designation   = designation
    await teacher.save()

    // Update name and photo in User model
    const User = require('../models/User')
    const updateData = {}
    if (photo) updateData.photo = photo
    if (name)  updateData.name  = name
    if (Object.keys(updateData).length > 0) {
      await User.findByIdAndUpdate(req.user._id, updateData)
    }

    const updated = await Teacher.findById(teacher._id)
      .populate('user', 'name email photo')
    return res.json({ message: 'Profile updated successfully', teacher: updated })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// @GET /api/teachers/stats
const getMyStats = async (req, res) => {
  try {
    const teacher   = await getOrCreateTeacher(req.user._id)
    const myCourses = await Course.find({ teacher: teacher._id })
    const courseIds = myCourses.map((c) => c._id)
    const programs  = [...new Set(myCourses.map((c) => c.program))]
    const semesters = [...new Set(myCourses.map((c) => c.semester))]

    let totalStudents = 0
    if (programs.length > 0) {
      totalStudents = await Student.countDocuments({
        program:  { $in: programs },
        semester: { $in: semesters },
        isActive: true,
      })
    }

    const attendanceMarked = await Attendance.countDocuments({ markedBy: req.user._id })
    const resultsEntered   = await Result.countDocuments({ course: { $in: courseIds } })
    const pendingLeaves    = await Leave.countDocuments({ status: 'pending' })

    return res.json({
      totalCourses: myCourses.length,
      totalStudents,
      attendanceMarked,
      resultsEntered,
      pendingLeaves,
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// @GET /api/teachers/my-courses
const getMyCourses = async (req, res) => {
  try {
    const teacher = await getOrCreateTeacher(req.user._id)
    const courses = await Course.find({ teacher: teacher._id })
    return res.json(courses)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// @GET /api/teachers/my-students
const getMyStudents = async (req, res) => {
  try {
    const teacher   = await getOrCreateTeacher(req.user._id)
    const myCourses = await Course.find({ teacher: teacher._id })
    const programs  = [...new Set(myCourses.map((c) => c.program))]
    const semesters = [...new Set(myCourses.map((c) => c.semester))]

    if (programs.length === 0) return res.json([])

    const students = await Student.find({
      program:  { $in: programs },
      semester: { $in: semesters },
      isActive: true,
    }).populate('user', 'name email photo')

    return res.json(students)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// @GET /api/teachers/my-results
const getMyResults = async (req, res) => {
  try {
    const teacher   = await getOrCreateTeacher(req.user._id)
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

// @POST /api/teachers/attendance
const markAttendance = async (req, res) => {
  try {
    const { courseId, date, records } = req.body
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

// @GET /api/teachers/attendance/:courseId
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

// @POST /api/teachers/results
const enterResult = async (req, res) => {
  try {
    const { studentId, courseId, semester, marks } = req.body

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
    return res.json({ message: 'Result saved', result })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// @GET /api/teachers/students/:courseId
const getStudentsByCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
    if (!course) return res.status(404).json({ message: 'Course not found' })

    const students = await Student.find({
      program:  course.program,
      semester: course.semester,
      isActive: true,
    }).populate('user', 'name email photo')

    return res.json(students)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// @GET /api/teachers/leaves
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

// @PUT /api/teachers/leaves/:id
const reviewLeave = async (req, res) => {
  try {
    const { status, reviewNote } = req.body
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