const express = require('express')
const router = express.Router()
const { getProfile, markAttendance, getAttendanceByCourse, enterResult, getStudentsByCourse, getPendingLeaves, reviewLeave } = require('../controllers/teacherController')
const { protect } = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

router.use(protect, authorize('teacher', 'admin'))

router.get('/profile',                    getProfile)
router.post('/attendance',                markAttendance)
router.get('/attendance/:courseId',       getAttendanceByCourse)
router.post('/results',                   enterResult)
router.get('/students/:courseId',         getStudentsByCourse)
router.get('/leaves',                     getPendingLeaves)
router.put('/leaves/:id',                 reviewLeave)

module.exports = router