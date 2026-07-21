const StudyMaterial = require('../models/StudyMaterial')
const Teacher       = require('../models/Teacher')
const Student       = require('../models/Student')

const createMaterial = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user._id })
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' })

    const { courseId, title, description, type, link, semester, program } = req.body
    if (!courseId || !title) {
      return res.status(400).json({ message: 'Course and title are required' })
    }

    const material = await StudyMaterial.create({
      course:      courseId,
      teacher:     teacher._id,
      title,
      description: description || '',
      type:        type        || 'note',
      file:        req.file?.path || '',
      link:        link        || '',
      semester,
      program,
    })

    return res.status(201).json({ message: 'Material uploaded', material })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getMaterialsByCourse = async (req, res) => {
  try {
    const materials = await StudyMaterial.find({
      course:      req.params.courseId,
      isPublished: true,
    })
      .populate('course',   'name code')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 })
    return res.json(materials)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getMyMaterials = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
    if (!student) return res.status(404).json({ message: 'Student not found' })

    const Course    = require('../models/Course')
    const courses   = await Course.find({
      program:  student.program,
      semester: student.semester,
    })
    const courseIds = courses.map((c) => c._id)

    const materials = await StudyMaterial.find({
      course:      { $in: courseIds },
      isPublished: true,
    })
      .populate('course', 'name code')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 })

    return res.json(materials)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const deleteMaterial = async (req, res) => {
  try {
    await StudyMaterial.findByIdAndDelete(req.params.id)
    return res.json({ message: 'Material deleted' })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = { createMaterial, getMaterialsByCourse, getMyMaterials, deleteMaterial }