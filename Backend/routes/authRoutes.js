const express  = require('express')
const router   = express.Router()
const {
  register, login, getMe, updateProfile,
  changePassword, forgotPassword, resetPassword,
} = require('../controllers/authController')
const { protect }       = require('../middleware/authMiddleware')
const { uploadProfile } = require('../middleware/uploadMiddleware')

router.post('/register',              register)
router.post('/login',                 login)
router.get('/me',                     protect, getMe)
router.put('/update-profile',         protect, uploadProfile.single('photo'), updateProfile)
router.put('/change-password',        protect, changePassword)
router.post('/forgot-password',       forgotPassword)
router.post('/reset-password/:token', resetPassword)

module.exports = router