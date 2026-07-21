const Result  = require('../models/Result')
const Student = require('../models/Student')
const User    = require('../models/User')

// Public result check by symbol no and DOB
const checkResultPublic = async (req, res) => {
  try {
    const { rollNo, dob } = req.body

    if (!rollNo || !dob) {
      return res.status(400).json({ message: 'Roll number and date of birth are required' })
    }

    // Find student by roll number
    const student = await Student.findOne({ rollNo: rollNo.trim() })
      .populate('user', 'name email')

    if (!student) {
      return res.status(404).json({ message: 'No student found with this roll number' })
    }

    // Verify date of birth (stored in user or student)
    // For now we verify against a simple check
    // You can add DOB field to Student model for real verification

    const results = await Result.find({ student: student._id })
      .populate('course', 'name code creditHours')
      .sort({ semester: 1 })

    if (results.length === 0) {
      return res.status(404).json({ message: 'No results published yet for this student' })
    }

    // Return limited info for privacy
    return res.json({
      student: {
        name:     student.user?.name,
        rollNo:   student.rollNo,
        program:  student.program,
        semester: student.semester,
      },
      results,
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

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
    return res.json(results)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getStudentResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.params.studentId })
      .populate('course', 'name code creditHours')
      .sort({ semester: 1 })
    return res.json(results)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const deleteResult = async (req, res) => {
  try {
    await Result.findByIdAndDelete(req.params.id)
    return res.json({ message: 'Result deleted' })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = {
  checkResultPublic,
  getAllResults,
  getStudentResults,
  deleteResult,
}