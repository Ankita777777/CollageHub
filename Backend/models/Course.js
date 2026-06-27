const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  code:        { type: String, required: true, unique: true },  // e.g. BCA301
  program:     { type: String, required: true },                // BCA, BBA, BBS
  semester:    { type: Number, required: true },
  creditHours: { type: Number, default: 3 },
  teacher:     { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  description: { type: String },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Course', courseSchema)