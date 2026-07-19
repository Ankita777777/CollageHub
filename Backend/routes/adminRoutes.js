const express = require('express')
const router  = express.Router()
const {
  getDashboardStats,
  getAllStudents, createStudent, updateStudent, deleteStudent,
  getAllTeachers, createTeacher,
  getAllCourses, createCourse, updateCourse, deleteCourse,
  getAllPayments,
} = require('../controllers/adminController')
const { protect }   = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

router.use(protect, authorize('admin'))

router.get('/stats',            getDashboardStats)
router.get('/students',         getAllStudents)
router.post('/students',        createStudent)
router.put('/students/:id',     updateStudent)
router.delete('/students/:id',  deleteStudent)
router.get('/teachers',         getAllTeachers)
router.post('/teachers',        createTeacher)
router.get('/courses',          getAllCourses)
router.post('/courses',         createCourse)
router.put('/courses/:id',      updateCourse)
router.delete('/courses/:id',   deleteCourse)
router.get('/payments',         getAllPayments)

module.exports = router