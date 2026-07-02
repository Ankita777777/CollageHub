const Attendance = require('../models/Attendance')

const getAllAttendance = async (req, res) => {
  try {
    const { courseId, date } = req.query
    const filter = {}
    if (courseId) filter.course = courseId
    if (date)     filter.date   = new Date(date)

    const records = await Attendance.find(filter)
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
      .populate('course', 'name code')
      .sort({ date: -1 })
    res.json(records)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getAttendanceReport = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.params.studentId })
      .populate('course', 'name code')
      .sort({ date: -1 })

    const summaryMap = {}
    records.forEach((r) => {
      const key = r.course._id.toString()
      if (!summaryMap[key]) {
        summaryMap[key] = { course: r.course, total: 0, present: 0, absent: 0 }
      }
      summaryMap[key].total++
      if (r.status === 'present') summaryMap[key].present++
      else summaryMap[key].absent++
    })

    const report = Object.values(summaryMap).map((s) => ({
      ...s,
      percentage: ((s.present / s.total) * 100).toFixed(1),
    }))

    res.json({ records, report })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getAllAttendance, getAttendanceReport }