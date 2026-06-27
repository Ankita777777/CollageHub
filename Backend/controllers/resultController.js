const Result = require('../models/Result')
const Student = require('../models/Student')

// @GET /api/results (admin - all results)
const getAllResults = async (req, res) => {
  const { semester, program } = req.query
  const students = await Student.find(program ? { program } : {})
  const studentIds = students.map((s) => s._id)

  const filter = { student: { $in: studentIds } }
  if (semester) filter.semester = Number(semester)

  const results = await Result.find(filter)
    .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
    .populate('course', 'name code')
  res.json(results)
}

// @GET /api/results/:studentId
const getStudentResults = async (req, res) => {
  const results = await Result.find({ student: req.params.studentId })
    .populate('course', 'name code creditHours')
    .sort({ semester: 1 })
  res.json(results)
}

// @DELETE /api/results/:id
const deleteResult = async (req, res) => {
  await Result.findByIdAndDelete(req.params.id)
  res.json({ message: 'Result deleted' })
}

module.exports = { getAllResults, getStudentResults, deleteResult }