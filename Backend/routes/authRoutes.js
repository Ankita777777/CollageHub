const express  = require('express')
const router   = express.Router()
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')
const {
  validateRegister,
  validateLogin,
} = require('../middleware/validateMiddleware')

router.post('/register',             validateRegister,  register)
router.post('/login', validateLogin,                 login)
router.get('/me',                      protect, getMe)
router.put('/update-profile',          protect, updateProfile)
router.put('/change-password',         protect, changePassword)
router.post('/forgot-password',        forgotPassword)
router.post('/reset-password/:token',  resetPassword)

module.exports = router