const express = require('express')
const router  = express.Router()
const {
  createEvent, getAllEvents, registerForEvent, deleteEvent,
} = require('../controllers/eventController')
const { protect }   = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')
const { uploadProfile } = require('../middleware/uploadMiddleware')

router.get('/',          getAllEvents)
router.post('/',         protect, authorize('admin', 'teacher'), uploadProfile.single('image'), createEvent)
router.post('/:id/register', protect, authorize('student'), registerForEvent)
router.delete('/:id',    protect, authorize('admin'), deleteEvent)

module.exports = router