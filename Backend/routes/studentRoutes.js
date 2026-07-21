const express = require('express')
const router  = express.Router()
const {
  getProfile, updateProfile, getAttendance,
  getResults, getFeeStatus, applyLeave, getLeaves,
} = require('../controllers/studentController')
const { protect }   = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')
const { uploadProfile } = require('../middleware/uploadMiddleware')
const { validateLeave } = require('../middleware/validateMiddleware')

router.use(protect, authorize('student'))

router.get('/profile',    getProfile)
router.put('/profile',    uploadProfile.single('photo'), updateProfile)
router.get('/attendance', getAttendance)
router.get('/results',    getResults)
router.get('/fee',        getFeeStatus)
router.post('/leave',     validateLeave, applyLeave)
router.get('/leave',      getLeaves)

module.exports = router