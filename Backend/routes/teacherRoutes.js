const express = require('express')
const router = express.Router()
const { getProfile, markAttendance, getAttendanceByCourse, enterResult, getStudentsByCourse, getPendingLeaves, reviewLeave } = require('../controllers/teacherController')
const { protect } = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

const {
  validateAttendance,
  validateResult,
} = require('../middleware/validateMiddleware')

router.use(protect, authorize('teacher', 'admin'))


router.get('/profile',              getProfile)
router.put('/profile',              updateProfile)
router.get('/stats',                getMyStats)
router.get('/my-courses',           getMyCourses)
router.get('/my-students',          getMyStudents)
router.get('/my-results',           getMyResults)
router.post('/attendance',          validateAttendance, markAttendance)
router.get('/attendance/:courseId', getAttendanceByCourse)
router.post('/results',             validateResult,     enterResult)
router.get('/students/:courseId',   getStudentsByCourse)
router.get('/leaves',               getPendingLeaves)
router.put('/leaves/:id',           reviewLeave)

module.exports = router