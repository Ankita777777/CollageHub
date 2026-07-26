const crypto = require('crypto')
const User   = require('../models/User')
const jwt    = require('jsonwebtoken')

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' })

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }
    const exists = await User.findOne({ email: email.toLowerCase().trim() })
    if (exists) return res.status(400).json({ message: 'Email already registered' })

    const user = await User.create({
      name:     name.trim(),
      email:    email.toLowerCase().trim(),
      password,
      role:     role || 'student',
    })
    return res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, photo: user.photo,
      token: generateToken(user._id),
    })
  } catch (err) {
    console.error('Register error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) return res.status(401).json({ message: 'Invalid email or password' })

    const isMatch = await user.matchPassword(password)
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' })

    if (!user.isActive) return res.status(403).json({ message: 'Account deactivated. Contact admin.' })

    return res.json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, photo: user.photo,
      token: generateToken(user._id),
    })
  } catch (err) {
    console.error('Login error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    return res.json(user)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (req.body.name)  user.name  = req.body.name.trim()
    if (req.file?.path) user.photo = req.file.path
    await user.save()
    return res.json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, photo: user.photo,
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both passwords are required' })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' })
    }
    const user    = await User.findById(req.user._id)
    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' })
    user.password = newPassword
    await user.save()
    return res.json({ message: 'Password changed successfully' })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email is required' })
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) return res.status(404).json({ message: 'No account found with that email' })

    const resetToken         = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken  = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000
    await user.save({ validateBeforeSave: false })

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    console.log('Reset URL:', resetUrl)

    return res.json({ message: 'Reset link generated. Check terminal.', resetUrl })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
      resetPasswordToken:  hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    })
    if (!user) return res.status(400).json({ message: 'Reset link invalid or expired' })
    user.password            = password
    user.resetPasswordToken  = undefined
    user.resetPasswordExpire = undefined
    await user.save()
    return res.json({ message: 'Password reset successful', token: generateToken(user._id) })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = { register, login, getMe, updateProfile, changePassword, forgotPassword, resetPassword }