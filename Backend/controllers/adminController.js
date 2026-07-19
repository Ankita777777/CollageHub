const User    = require('../models/User')
const Student = require('../models/Student')
const Teacher = require('../models/Teacher')
const Course  = require('../models/Course')
const Payment = require('../models/Payment')
const Notice  = require('../models/Notice')

// Dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ isActive: true })
    const totalTeachers = await Teacher.countDocuments()
    const totalCourses  = await Course.countDocuments()
    const revenueData   = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ])
    return res.json({
      totalStudents,
      totalTeachers,
      totalCourses,
      totalRevenue: revenueData[0]?.total || 0,
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const { program, semester, search } = req.query
    const filter = { isActive: true }
    if (program)  filter.program  = program
    if (semester) filter.semester = Number(semester)

    let students = await Student.find(filter)
      .populate('user', 'name email photo isActive')
      .sort({ createdAt: -1 })

    if (search) {
      students = students.filter((s) =>
        s.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo?.toLowerCase().includes(search.toLowerCase()) ||
        s.user?.email?.toLowerCase().includes(search.toLowerCase())
      )
    }
    return res.json(students)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// Create student manually
const createStudent = async (req, res) => {
  try {
    const {
      name, email, password, rollNo,
      semester, program, batch, fatherName, phone, address
    } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password required' })
    }

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email already registered' })

    const user    = await User.create({ name, email, password, role: 'student' })
    const student = await Student.create({
      user: user._id, rollNo, semester: semester || 1,
      program, batch, fatherName, phone, address,
    })
    return res.status(201).json({ message: 'Student created', student })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// Update student
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    ).populate('user', 'name email')
    if (!student) return res.status(404).json({ message: 'Student not found' })
    return res.json({ message: 'Student updated', student })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
    if (!student) return res.status(404).json({ message: 'Student not found' })
    await User.findByIdAndUpdate(student.user, { isActive: false })
    student.isActive = false
    await student.save()
    return res.json({ message: 'Student deactivated' })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// Get all teachers
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate('user', 'name email photo')
      .populate('subjects', 'name code')
    return res.json(teachers)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// Create teacher
const createTeacher = async (req, res) => {
  try {
    const { name, email, password, employeeId, department, designation, phone } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password required' })
    }
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email already registered' })

    const user    = await User.create({ name, email, password, role: 'teacher' })
    const teacher = await Teacher.create({
      user: user._id, employeeId, department, designation, phone,
    })
    return res.status(201).json({ message: 'Teacher created', teacher })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('teacher', 'user')
      .sort({ program: 1, semester: 1 })
    return res.json(courses)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// Create course
const createCourse = async (req, res) => {
  try {
    const { name, code, program, semester, creditHours, teacher, description } = req.body
    if (!name || !code || !program || !semester) {
      return res.status(400).json({ message: 'Please fill required fields' })
    }
    const exists = await Course.findOne({ code })
    if (exists) return res.status(400).json({ message: 'Course code already exists' })

    const course = await Course.create({
      name, code, program, semester: Number(semester),
      creditHours: Number(creditHours) || 3,
      teacher, description,
    })
    return res.status(201).json({ message: 'Course created', course })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// Update course
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    )
    if (!course) return res.status(404).json({ message: 'Course not found' })
    return res.json({ message: 'Course updated', course })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// Delete course
const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id)
    return res.json({ message: 'Course deleted' })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

// Get all payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .sort({ createdAt: -1 })
    return res.json(payments)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getDashboardStats,
  getAllStudents, createStudent, updateStudent, deleteStudent,
  getAllTeachers, createTeacher,
  getAllCourses, createCourse, updateCourse, deleteCourse,
  getAllPayments,
}