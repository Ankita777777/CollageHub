const crypto = require('crypto')
const User   = require('../models/User')
const jwt    = require('jsonwebtoken')

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  })

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' })
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() })
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const user = await User.create({
      name:     name.trim(),
      email:    email.toLowerCase().trim(),
      password,
      role:     role || 'student',
    })

    return res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      photo: user.photo,
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

    console.log('Login attempt for:', email)

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    // Find user with case insensitive email
    const user = await User.findOne({ email: email.toLowerCase().trim() })

    if (!user) {
      console.log('User not found for email:', email)
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    console.log('User found:', user.email, '| Role:', user.role, '| Active:', user.isActive)

    const isMatch = await user.matchPassword(password)
    console.log('Password match:', isMatch)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated. Contact admin.' })
    }

    console.log('Login successful for:', user.email)

    return res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      photo: user.photo || '',
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
    if (!user) return res.status(404).json({ message: 'User not found' })
    return res.json(user)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name, photo } = req.body
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (name)  user.name  = name.trim()
    if (photo) user.photo = photo

    // Handle uploaded file
    if (req.file?.path) user.photo = req.file.path

    await user.save()

    return res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      photo: user.photo,
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both passwords' })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' })
    }

    const user    = await User.findById(req.user._id)
    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }

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
    if (!email) {
      return res.status(400).json({ message: 'Please provide your email' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email' })
    }

    const resetToken         = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken  = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000
    await user.save({ validateBeforeSave: false })

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    console.log('Password reset URL:', resetUrl)

    return res.json({
      message:  'Reset token created. Check terminal for URL.',
      resetUrl,
    })
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

    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex')

    const user = await User.findOne({
      resetPasswordToken:  hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: 'Reset link is invalid or has expired' })
    }

    user.password            = password
    user.resetPasswordToken  = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    return res.json({
      message: 'Password reset successful. You can now login.',
      token:   generateToken(user._id),
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = {
  register, login, getMe,
  updateProfile, changePassword,
  forgotPassword, resetPassword,
}