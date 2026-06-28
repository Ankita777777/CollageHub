const User = require('../models/User')
const Student = require('../models/Student')
const Teacher = require('../models/Teacher')
const Course = require('../models/Course')
const Payment = require('../models/Payment')

// @GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  const totalStudents = await Student.countDocuments({ isActive: true })
  const totalTeachers = await Teacher.countDocuments({ isActive: true })
  const totalCourses  = await Course.countDocuments({ isActive: true })
  const totalRevenue  = await Payment.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ])
  res.json({
    totalStudents, 
    totalTeachers,
    totalCourses,
    totalRevenue: totalRevenue[0]?.total || 0,
  })
}

// @GET /api/admin/students
const getAllStudents = async (req, res) => {
  const { program, semester, search } = req.query
  let filter = {}
  if (program) filter.program = program
  if (semester) filter.semester = Number(semester)

  let students = await Student.find(filter)
    .populate('user', 'name email photo isActive')
    .sort({ createdAt: -1 })

  if (search) {
    students = students.filter((s) =>
      s.user.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo?.includes(search)
    )
  }
  res.json(students)
}

// @POST /api/admin/students
const createStudent = async (req, res) => {
  const { name, email, password, rollNo, semester, program, batch, fatherName, phone, address } = req.body

  const exists = await User.findOne({ email })
  if (exists) return res.status(400).json({ message: 'Email already registered' })

  const user = await User.create({ name, email, password, role: 'student' })
  const student = await Student.create({ user: user._id, rollNo, semester, program, batch, fatherName, phone, address })

  res.status(201).json({ message: 'Student created', student })
}

// @PUT /api/admin/students/:id
const updateStudent = async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!student) return res.status(404).json({ message: 'Student not found' })
  res.json({ message: 'Student updated', student })
}

// @DELETE /api/admin/students/:id
const deleteStudent = async (req, res) => {
  const student = await Student.findById(req.params.id)
  if (!student) return res.status(404).json({ message: 'Student not found' })
  await User.findByIdAndUpdate(student.user, { isActive: false })
  student.isActive = false
  await student.save()
  res.json({ message: 'Student deactivated' })
}

// @GET /api/admin/teachers
const getAllTeachers = async (req, res) => {
  const teachers = await Teacher.find()
    .populate('user', 'name email photo')
    .populate('subjects', 'name code')
  res.json(teachers)
}

// @POST /api/admin/teachers
const createTeacher = async (req, res) => {
  const { name, email, password, employeeId, department, designation, phone, qualification } = req.body

  const exists = await User.findOne({ email })
  if (exists) return res.status(400).json({ message: 'Email already registered' })

  const user = await User.create({ name, email, password, role: 'teacher' })
  const teacher = await Teacher.create({ user: user._id, employeeId, department, designation, phone, qualification })

  res.status(201).json({ message: 'Teacher created', teacher })
}

// @GET /api/admin/courses
const getAllCourses = async (req, res) => {
  const courses = await Course.find().populate('teacher', 'user').sort({ program: 1, semester: 1 })
  res.json(courses)
}

// @POST /api/admin/courses
const createCourse = async (req, res) => {
  const { name, code, program, semester, creditHours, teacher, description } = req.body
  const exists = await Course.findOne({ code })
  if (exists) return res.status(400).json({ message: 'Course code already exists' })
  const course = await Course.create({ name, code, program, semester, creditHours, teacher, description })
  res.status(201).json({ message: 'Course created', course })
}

// @GET /api/admin/payments
const getAllPayments = async (req, res) => {
  const payments = await Payment.find()
    .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
    .sort({ createdAt: -1 })
  res.json(payments)
}

module.exports = {
  getDashboardStats, getAllStudents, createStudent, updateStudent, deleteStudent,
  getAllTeachers, createTeacher, getAllCourses, createCourse, getAllPayments
}