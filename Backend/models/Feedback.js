const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
  student:   { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course:    { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  teacher:   { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  type:      { type: String, enum: ['course', 'teacher', 'facility', 'general'], default: 'general' },
  rating:    { type: Number, min: 1, max: 5, required: true },
  comment:   { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Feedback', feedbackSchema)