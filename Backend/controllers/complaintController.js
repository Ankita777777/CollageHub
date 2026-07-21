const Complaint = require('../models/Complaint')
const Student   = require('../models/Student')

const submitComplaint = async (req, res) => {
  try {
    console.log('submitComplaint called by user:', req.user._id)
    console.log('Body:', req.body)

    const student = await Student.findOne({ user: req.user._id })
    if (!student) {
      console.log('Student not found for user:', req.user._id)
      return res.status(404).json({
        message: 'Student profile not found. Contact admin.'
      })
    }

    const { title, category, description, priority, isAnonymous } = req.body

    if (!title || title.trim().length < 3) {
      return res.status(400).json({ message: 'Title must be at least 3 characters' })
    }
    if (!description || description.trim().length < 10) {
      return res.status(400).json({ message: 'Description must be at least 10 characters' })
    }

    const complaint = await Complaint.create({
      student:     student._id,
      title:       title.trim(),
      category:    category    || 'other',
      description: description.trim(),
      priority:    priority    || 'medium',
      isAnonymous: isAnonymous || false,
    })

    console.log('Complaint created:', complaint._id)
    return res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint,
    })
  } catch (err) {
    console.error('submitComplaint error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

const getMyComplaints = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' })
    }

    const complaints = await Complaint.find({ student: student._id })
      .sort({ createdAt: -1 })

    return res.json(complaints)
  } catch (err) {
    console.error('getMyComplaints error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

const getAllComplaints = async (req, res) => {
  try {
    const { status, category } = req.query
    const filter = {}
    if (status)   filter.status   = status
    if (category) filter.category = category

    const complaints = await Complaint.find(filter)
      .populate({
        path:     'student',
        populate: { path: 'user', select: 'name email' },
      })
      .sort({ createdAt: -1 })

    return res.json(complaints)
  } catch (err) {
    console.error('getAllComplaints error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

const respondComplaint = async (req, res) => {
  try {
    const { status, response } = req.body

    if (!response || response.trim().length < 3) {
      return res.status(400).json({ message: 'Response is required' })
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status:      status || 'reviewing',
        response:    response.trim(),
        respondedBy: req.user._id,
      },
      { new: true }
    )

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' })
    }

    return res.json({ message: 'Response sent successfully', complaint })
  } catch (err) {
    console.error('respondComplaint error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

module.exports = {
  submitComplaint,
  getMyComplaints,
  getAllComplaints,
  respondComplaint,
}