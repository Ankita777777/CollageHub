const jwt  = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
      return res.status(401).json({ message: 'No token provided. Please login.' })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user    = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'User not found. Please login again.' })
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account deactivated. Contact admin.' })
    }
    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please login again.' })
    }
    return res.status(401).json({ message: 'Invalid token. Please login again.' })
  }
}

module.exports = { protect }