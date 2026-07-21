const express = require('express')
const router  = express.Router()
const {
  submitFeedback, getAllFeedback, getMyFeedback,
} = require('../controllers/feedbackController')
const { protect }   = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

router.post('/',   protect, authorize('student'), submitFeedback)
router.get('/',    protect, authorize('admin'), getAllFeedback)
router.get('/my',  protect, authorize('student'), getMyFeedback)

module.exports = router