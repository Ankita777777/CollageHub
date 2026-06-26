const express = require('express')
const router = express.Router()
const { getAllResults, getStudentResults, deleteResult } = require('../controllers/resultController')
const { protect } = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

router.get('/',            protect, authorize('admin'), getAllResults)
router.get('/:studentId',  protect, authorize('admin', 'teacher'), getStudentResults)
router.delete('/:id',      protect, authorize('admin'), deleteResult)

module.exports = router