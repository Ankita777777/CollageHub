const Feedback = require('../models/Feedback')
const Student  = require('../models/Student')

const submitFeedback = async (req, res) => {
  try {
    console.log('submitFeedback called by user:', req.user._id)
    console.log('Body:', req.body)

    const student = await Student.findOne({ user: req.user._id })
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found. Contact admin.' })
    }

    const { courseId, teacherId, type, rating, comment, isAnonymous } = req.body

    // Validate
    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' })
    }
    if (!comment || comment.trim().length < 5) {
      return res.status(400).json({ message: 'Comment must be at least 5 characters' })
    }

    const feedbackData = {
      student:     student._id,
      type:        type        || 'general',
      rating:      Number(rating),
      comment:     comment.trim(),
      isAnonymous: isAnonymous || false,
    }

    // Only add courseId/teacherId if provided and not empty
    if (courseId  && courseId.trim()  !== '') feedbackData.course  = courseId
    if (teacherId && teacherId.trim() !== '') feedbackData.teacher = teacherId

    const feedback = await Feedback.create(feedbackData)
    console.log('Feedback created:', feedback._id)

    return res.status(201).json({ message: 'Feedback submitted successfully', feedback })
  } catch (err) {
    console.error('submitFeedback error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

const getAllFeedback = async (req, res) => {
  try {
    const { type } = req.query
    const filter   = {}
    if (type) filter.type = type

    const feedbacks = await Feedback.find(filter)
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
      .populate('course', 'name code')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 })

    return res.json(feedbacks)
  } catch (err) {
    console.error('getAllFeedback error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

const getMyFeedback = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' })
    }

    const feedbacks = await Feedback.find({ student: student._id })
      .populate('course', 'name code')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 })

    return res.json(feedbacks)
  } catch (err) {
    console.error('getMyFeedback error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

module.exports = { submitFeedback, getAllFeedback, getMyFeedback }