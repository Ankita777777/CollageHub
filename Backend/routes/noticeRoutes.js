const express = require('express')
const router = express.Router()
const { getNotices, getNotice, createNotice, updateNotice, deleteNotice } = require('../controllers/noticeController')
const { protect } = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

router.get('/',      getNotices)           // public
router.get('/:id',   getNotice)            // public
router.post('/',     protect, authorize('admin', 'teacher'), createNotice)
router.put('/:id',   protect, authorize('admin', 'teacher'), updateNotice)
router.delete('/:id',protect, authorize('admin'), deleteNotice)

module.exports = router