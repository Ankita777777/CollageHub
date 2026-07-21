const express = require('express')
const router  = express.Router()
const {
  getAllBooks, addBook, issueBook, returnBook, getMyBooks,
} = require('../controllers/libraryController')
const { protect }   = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')
const { uploadProfile } = require('../middleware/uploadMiddleware')

router.get('/',          protect, getAllBooks)
router.post('/',         protect, authorize('admin'), uploadProfile.single('cover'), addBook)
router.post('/:id/issue',  protect, authorize('admin'), issueBook)
router.post('/:id/return', protect, authorize('admin'), returnBook)
router.get('/my',        protect, authorize('student'), getMyBooks)

module.exports = router