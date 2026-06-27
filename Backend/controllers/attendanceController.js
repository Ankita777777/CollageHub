const Attendance = require('../models/Attendance')
const Student = require('../models/Student')

// @GET /api/attendance (admin)
const getAllAttendance = async (req, res) => {
  const { courseId, date } = req.query
  const filter = {}
  if (courseId) filter.course = courseId
  if (date) filter.date = new Date(date)

  const records = await Attendance.find(filter)
    .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
    .populate('course', 'name code')
    .sort({ date: -1 })
  res.json(records)
}

// @GET /api/attendance/report/:studentId
const getAttendanceReport = async (req, res) => {
  const records = await Attendance.find({ student: req.params.studentId })
    .populate('course', 'name code')
    .sort({ date: -1 })

  const summary = {}
  records.forEach((r) => {
    const key = r.course._id.toString()
    if (!summary[key]) summary[key] = { course: r.course, total: 0, present: 0, absent: 0 }
    summary[key].total++
    if (r.status === 'present') summary[key].present++
    else summary[key].absent++
  })

  const report = Object.values(summary).map((s) => ({
    ...s,
    percentage: ((s.present / s.total) * 100).toFixed(1),
  }))

  res.json({ records, report })
}

module.exports = { getAllAttendance, getAttendanceReport }