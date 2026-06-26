const express = require('express')
const router = express.Router()
const { getAllAttendance, getAttendanceReport } = require('../controllers/attendanceController')
const { protect } = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

router.get('/',               protect, authorize('admin'), getAllAttendance)
router.get('/report/:studentId', protect, authorize('admin', 'teacher'), getAttendanceReport)

module.exports = router