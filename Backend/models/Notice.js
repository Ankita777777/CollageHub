const mongoose = require('mongoose')

const noticeSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  content:   { type: String, required: true },
  category:  { type: String, enum: ['exam', 'event', 'holiday', 'general'], default: 'general' },
  postedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublic:  { type: Boolean, default: true },
  file:      { type: String },   // Cloudinary URL
}, { timestamps: true })

module.exports = mongoose.model('Notice', noticeSchema)