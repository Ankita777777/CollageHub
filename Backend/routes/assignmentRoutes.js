const express = require('express')
const router  = express.Router()
const {
  createAssignment, getMyAssignments, getAssignmentsByCourse,
  submitAssignment, gradeSubmission, deleteAssignment,
} = require('../controllers/assignmentController')
const { protect }          = require('../middleware/authMiddleware')
const { authorize }        = require('../middleware/roleMiddleware')
const { uploadAssignment } = require('../middleware/uploadMiddleware')

router.get('/my',               protect, authorize('student'),           getMyAssignments)
router.get('/course/:courseId', protect,                                 getAssignmentsByCourse)
router.post('/',                protect, authorize('teacher', 'admin'),  uploadAssignment.single('file'), createAssignment)
router.post('/:id/submit',      protect, authorize('student'),           uploadAssignment.single('file'), submitAssignment)
router.put('/:id/grade',        protect, authorize('teacher', 'admin'),  gradeSubmission)
router.delete('/:id',           protect, authorize('teacher', 'admin'),  deleteAssignment)

module.exports = router