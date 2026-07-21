const Timetable = require('../models/Timetable')
const Student   = require('../models/Student')

const createTimetable = async (req, res) => {
  try {
    const { program, semester, day, periods } = req.body

    if (!program || !semester || !day) {
      return res.status(400).json({ message: 'Program, semester and day are required' })
    }

    if (!periods || !Array.isArray(periods) || periods.length === 0) {
      return res.status(400).json({ message: 'At least one period is required' })
    }

    // Update if exists, create if not
    const timetable = await Timetable.findOneAndUpdate(
      { program, semester: Number(semester), day },
      { program, semester: Number(semester), day, periods },
      { upsert: true, new: true }
    )

    return res.status(201).json({ message: 'Timetable saved successfully', timetable })
  } catch (err) {
    console.error('createTimetable error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

const getMyTimetable = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' })
    }

    if (!student.program || !student.semester) {
      return res.json([])
    }

    const timetables = await Timetable.find({
      program:  student.program,
      semester: student.semester,
    })
      .populate({ path: 'periods.course',  select: 'name code' })
      .populate({ path: 'periods.teacher', populate: { path: 'user', select: 'name' } })

    return res.json(timetables)
  } catch (err) {
    console.error('getMyTimetable error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

const getAllTimetables = async (req, res) => {
  try {
    const { program, semester } = req.query
    const filter = {}
    if (program)  filter.program  = program
    if (semester) filter.semester = Number(semester)

    const timetables = await Timetable.find(filter)
      .populate({ path: 'periods.course',  select: 'name code' })
      .populate({ path: 'periods.teacher', populate: { path: 'user', select: 'name' } })

    return res.json(timetables)
  } catch (err) {
    console.error('getAllTimetables error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

const deleteTimetable = async (req, res) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id)
    return res.json({ message: 'Timetable deleted' })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = {
  createTimetable,
  getMyTimetable,
  getAllTimetables,
  deleteTimetable,
}