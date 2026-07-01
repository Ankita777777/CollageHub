const crypto = require('crypto')
const User   = require('../models/User')
const jwt    = require('jsonwebtoken')

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  })

// @POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' })
    }

    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
    })

    return res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      token: generateToken(user._id),
    })
  } catch (error) {
    console.error('Register error:', error.message)
    return res.status(500).json({ message: error.message || 'Registration failed' })
  }
}

// @POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account deactivated. Contact admin.' })
    }

    return res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      photo: user.photo,
      token: generateToken(user._id),
    })
  } catch (error) {
    console.error('Login error:', error.message)
    return res.status(500).json({ message: error.message || 'Login failed' })
  }
}

// @GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    return res.json(user)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

// @PUT /api/auth/update-profile
const updateProfile = async (req, res) => {
  try {
    const { name, photo } = req.body
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.name  = name  || user.name
    user.photo = photo || user.photo
    await user.save()

    return res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      photo: user.photo,
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

// @PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both passwords' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const user = await User.findById(req.user._id)
    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }

    user.password = newPassword
    await user.save()

    return res.json({ message: 'Password changed successfully' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

// @POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Please provide your email' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email' })
    }

    const resetToken         = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken  = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000
    await user.save({ validateBeforeSave: false })

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    console.log('🔗 Reset URL:', resetUrl)

    // Only send email if SMTP is configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const sendEmail = require('../utils/sendEmail')
        await sendEmail({
          to:      user.email,
          subject: 'PMC College — Password Reset',
          html: `
            <h2>Password Reset</h2>
            <p>Hello ${user.name},</p>
            <a href="${resetUrl}">Click here to reset your password</a>
            <p>Expires in 10 minutes.</p>
          `,
        })
        return res.json({ message: `Reset link sent to ${email}` })
      } catch (emailErr) {
        console.error('Email error:', emailErr.message)
        user.resetPasswordToken  = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })
        return res.status(500).json({ message: 'Email could not be sent' })
      }
    }

    // No SMTP — return token for testing
    return res.json({
      message:    'Reset token created (check terminal for URL)',
      resetToken,
      resetUrl,
    })
  } catch (error) {
    console.error('Forgot password error:', error.message)
    return res.status(500).json({ message: error.message || 'Something went wrong' })
  }
}

// @POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body

    if (!password) {
      return res.status(400).json({ message: 'Please provide a new password' })
    }

    if (password.length < 6) {
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
  } catch (error) {
    console.error('Reset password error:', error.message)
    return res.status(500).json({ message: error.message || 'Password reset failed' })
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
}