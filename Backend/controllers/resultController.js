const Result  = require('../models/Result')
const Student = require('../models/Student')

const getAllResults = async (req, res) => {
  try {
    const { semester, program } = req.query
    const students   = await Student.find(program ? { program } : {})
    const studentIds = students.map((s) => s._id)
    const filter     = { student: { $in: studentIds } }
    if (semester) filter.semester = Number(semester)

    const results = await Result.find(filter)
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
      .populate('course', 'name code')
    res.json(results)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getStudentResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.params.studentId })
      .populate('course', 'name code creditHours')
      .sort({ semester: 1 })
    res.json(results)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deleteResult = async (req, res) => {
  try {
    await Result.findByIdAndDelete(req.params.id)
    res.json({ message: 'Result deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getAllResults, getStudentResults, deleteResult }