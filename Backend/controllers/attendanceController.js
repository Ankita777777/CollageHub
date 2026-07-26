const Attendance = require('../models/Attendance')
const Student    = require('../models/Student')

const getAllAttendance = async (req, res) => {
  try {
    const { courseId, date } = req.query
    const filter = {}
    if (courseId) filter.course = courseId
    if (date)     filter.date   = { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 86400000) }

    const records = await Attendance.find(filter)
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
      .populate('course', 'name code')
      .sort({ date: -1 })
    return res.json(records)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getAttendanceReport = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.params.studentId })
      .populate('course', 'name code')
      .sort({ date: -1 })

    const summaryMap = {}
    records.forEach((r) => {
      if (!r.course) return
      const key = r.course._id.toString()
      if (!summaryMap[key]) summaryMap[key] = { course: r.course, total: 0, present: 0, absent: 0 }
      summaryMap[key].total++
      if (r.status === 'present') summaryMap[key].present++
      else summaryMap[key].absent++
    })

    const report = Object.values(summaryMap).map((s) => ({
      ...s, percentage: s.total > 0 ? ((s.present / s.total) * 100).toFixed(1) : '0'
    }))

    return res.json({ records, report })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = { getAllAttendance, getAttendanceReport }