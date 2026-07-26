const User    = require('../models/User')
const Student = require('../models/Student')
const Teacher = require('../models/Teacher')
const Course  = require('../models/Course')
const Payment = require('../models/Payment')

const getDashboardStats = async (req, res) => {
  try {
    const [totalStudents, totalTeachers, totalCourses, revenueData,
           studentsByProgram, studentsBySemester, teachersByDept] = await Promise.all([
      Student.countDocuments({ isActive: true }),
      Teacher.countDocuments(),
      Course.countDocuments(),
      Payment.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Student.aggregate([{ $match: { isActive: true } }, { $group: { _id: '$program', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Student.aggregate([{ $match: { isActive: true } }, { $group: { _id: '$semester', count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
      Teacher.aggregate([{ $group: { _id: '$department', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    ])
    return res.json({
      totalStudents, totalTeachers, totalCourses,
      totalRevenue: revenueData[0]?.total || 0,
      studentsByProgram, studentsBySemester, teachersByDept,
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

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
      const q = search.toLowerCase()
      students = students.filter((s) =>
        s.user?.name?.toLowerCase().includes(q) ||
        s.rollNo?.toLowerCase().includes(q) ||
        s.user?.email?.toLowerCase().includes(q)
      )
    }
    return res.json(students)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const createStudent = async (req, res) => {
  try {
    const { name, email, password, rollNo, semester, program, batch, fatherName, phone, address } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }
    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists) return res.status(400).json({ message: 'Email already registered' })

    const user    = await User.create({ name, email: email.toLowerCase(), password, role: 'student' })
    const student = await Student.create({ user: user._id, rollNo, semester: semester || 1, program, batch, fatherName, phone, address })
    return res.status(201).json({ message: 'Student created', student })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user', 'name email')
    if (!student) return res.status(404).json({ message: 'Student not found' })
    return res.json({ message: 'Student updated', student })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

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

const createTeacher = async (req, res) => {
  try {
    const { name, email, password, employeeId, department, designation, phone, qualification } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }
    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists) return res.status(400).json({ message: 'Email already registered' })

    const user    = await User.create({ name, email: email.toLowerCase(), password, role: 'teacher' })
    const teacher = await Teacher.create({ user: user._id, employeeId, department, designation, phone, qualification })
    return res.status(201).json({ message: 'Teacher created', teacher })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name' } })
      .sort({ program: 1, semester: 1 })
    return res.json(courses)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const createCourse = async (req, res) => {
  try {
    const { name, code, program, semester, creditHours, teacher, description } = req.body
    if (!name || !code || !program || !semester) {
      return res.status(400).json({ message: 'Name, code, program and semester are required' })
    }
    const exists = await Course.findOne({ code: code.toUpperCase() })
    if (exists) return res.status(400).json({ message: 'Course code already exists' })

    const course = await Course.create({ name, code, program, semester: Number(semester), creditHours: Number(creditHours) || 3, teacher: teacher || undefined, description })
    return res.status(201).json({ message: 'Course created', course })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!course) return res.status(404).json({ message: 'Course not found' })
    return res.json({ message: 'Course updated', course })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id)
    return res.json({ message: 'Course deleted' })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

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