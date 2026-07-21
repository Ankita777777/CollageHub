const Timetable = require('../models/Timetable')
const Student   = require('../models/Student')

const createTimetable = async (req, res) => {
  try {
    const { program, semester, day, periods } = req.body
    if (!program || !semester || !day || !periods?.length) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }

    const existing = await Timetable.findOne({ program, semester, day })
    if (existing) {
      existing.periods = periods
      await existing.save()
      return res.json({ message: 'Timetable updated', timetable: existing })
    }

    const timetable = await Timetable.create({ program, semester, day, periods })
    return res.status(201).json({ message: 'Timetable created', timetable })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getMyTimetable = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
    if (!student) return res.status(404).json({ message: 'Student not found' })

    const timetables = await Timetable.find({
      program:  student.program,
      semester: student.semester,
    })
      .populate({ path: 'periods.course',  select: 'name code' })
      .populate({ path: 'periods.teacher', populate: { path: 'user', select: 'name' } })
      .sort({ day: 1 })

    return res.json(timetables)
  } catch (err) {
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
  createTimetable, getMyTimetable,
  getAllTimetables, deleteTimetable,
}