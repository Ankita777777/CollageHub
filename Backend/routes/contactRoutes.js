const express = require('express')
const router  = express.Router()
const {
  sendContactMessage,
  getAllMessages,
  deleteMessage,
} = require('../controllers/contactController')
const { protect }   = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')
const { validateContact } = require('../middleware/validateMiddleware')

router.post('/',  validateContact,    sendContactMessage)
router.get('/',       protect, authorize('admin'), getAllMessages)
router.delete('/:id', protect, authorize('admin'), deleteMessage)

module.exports = router