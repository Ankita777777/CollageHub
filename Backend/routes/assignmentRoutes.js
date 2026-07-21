const express = require('express')
const router  = express.Router()
const {
  createAssignment, getAssignmentsByCourse,
  getMyAssignments, submitAssignment,
  gradeSubmission, deleteAssignment,
} = require('../controllers/assignmentController')
const { protect }   = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')
const { uploadMarksheet } = require('../middleware/uploadMiddleware')

router.post('/',                    protect, authorize('teacher', 'admin'), uploadMarksheet.single('file'), createAssignment)
router.get('/my',                   protect, authorize('student'), getMyAssignments)
router.get('/course/:courseId',     protect, getAssignmentsByCourse)
router.post('/:id/submit',          protect, authorize('student'), uploadMarksheet.single('file'), submitAssignment)
router.put('/:id/grade',            protect, authorize('teacher', 'admin'), gradeSubmission)
router.delete('/:id',               protect, authorize('teacher', 'admin'), deleteAssignment)

module.exports = router