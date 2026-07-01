const crypto    = require('crypto')
const User      = require('../models/User')
const jwt       = require('jsonwebtoken')
const sendEmail = require('../utils/sendEmail')

// helper
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  })

// ─────────────────────────────────────────────────
// @POST /api/auth/register
// ─────────────────────────────────────────────────
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

    // Send welcome email
    try {
      await sendEmail({
        to:      email,
        subject: 'Welcome to PMC College Portal',
        html: `
          <h2>Welcome ${name}!</h2>
          <p>Your account has been created successfully.</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Role:</strong> ${role || 'student'}</p>
          <p>You can now login to the PMC College Portal.</p>
        `,
      })
    } catch (emailErr) {
      console.log('Welcome email failed (non-critical):', emailErr.message)
    }

    res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      token: generateToken(user._id),
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: error.message || 'Registration failed' })
  }
}

// ─────────────────────────────────────────────────
// @POST /api/auth/login
// ─────────────────────────────────────────────────
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

    res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      photo: user.photo,
      token: generateToken(user._id),
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: error.message || 'Login failed' })
  }
}

// ─────────────────────────────────────────────────
// @GET /api/auth/me
// ─────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────────
// @PUT /api/auth/update-profile
// ─────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, photo } = req.body
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.name  = name  || user.name
    user.photo = photo || user.photo
    await user.save()

    res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      photo: user.photo,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────────
// @PUT /api/auth/change-password
// ─────────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }

    user.password = newPassword
    await user.save()

    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────────
// @POST /api/auth/forgot-password
// ─────────────────────────────────────────────────
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

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')

    user.resetPasswordToken  = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000  // 10 mins

    await user.save({ validateBeforeSave: false })

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

    try {
      await sendEmail({
        to:      user.email,
        subject: 'PMC College — Password Reset Request',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#1565C0;">Password Reset Request</h2>
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>You requested to reset your password. Click the button below:</p>
            <a href="${resetUrl}"
              style="display:inline-block;background:#1565C0;color:white;
              padding:12px 24px;border-radius:6px;text-decoration:none;
              font-weight:bold;margin:16px 0;">
              Reset My Password
            </a>
            <p style="color:#666;">This link will expire in <strong>10 minutes</strong>.</p>
            <p style="color:#666;">If you did not request this, ignore this email.</p>
            <hr/>
            <p style="color:#999;font-size:12px;">PMC College Portal</p>
          </div>
        `,
      })

      res.json({ message: `Reset link sent to ${email}` })
    } catch (emailErr) {
      // Rollback token if email fails
      user.resetPasswordToken  = undefined
      user.resetPasswordExpire = undefined
      await user.save({ validateBeforeSave: false })

      console.error('Email send error:', emailErr)
      res.status(500).json({ message: 'Email could not be sent. Try again later.' })
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ message: error.message || 'Something went wrong' })
  }
}

// ─────────────────────────────────────────────────
// @POST /api/auth/reset-password/:token
// ─────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body

    if (!password) {
      return res.status(400).json({ message: 'Please provide a new password' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    // Hash the token from URL and compare
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

    // Set new password
    user.password            = password
    user.resetPasswordToken  = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    // Send confirmation email
    try {
      await sendEmail({
        to:      user.email,
        subject: 'PMC College — Password Changed Successfully',
        html: `
          <h2 style="color:#1565C0;">Password Changed</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Your password has been reset successfully.</p>
          <p>If you did not do this, contact admin immediately.</p>
        `,
      })
    } catch (e) {
      console.log('Confirmation email failed (non-critical)')
    }

    res.json({
      message: 'Password reset successful. You can now login.',
      token:   generateToken(user._id),
    })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ message: error.message || 'Password reset failed' })
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