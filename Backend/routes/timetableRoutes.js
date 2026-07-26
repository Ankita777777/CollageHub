const express = require('express')
const router  = express.Router()
const { createTimetable, getMyTimetable, getAllTimetables, deleteTimetable } = require('../controllers/timetableController')
const { protect }   = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

router.get('/my',     protect, authorize('student'),          getMyTimetable)
router.get('/',       protect, authorize('admin', 'teacher'), getAllTimetables)
router.post('/',      protect, authorize('admin'),            createTimetable)
router.delete('/:id', protect, authorize('admin'),            deleteTimetable)

module.exports = router