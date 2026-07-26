const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  code:        { type: String, required: true, unique: true, uppercase: true, trim: true },
  program:     { type: String, required: true },
  semester:    { type: Number, required: true },
  creditHours: { type: Number, default: 3 },
  teacher:     { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  description: { type: String, default: '' },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Course', courseSchema)