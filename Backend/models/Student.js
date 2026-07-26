const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rollNo:     { type: String },
  semester:   { type: Number, default: 1 },
  program:    { type: String, default: 'General' },
  batch:      { type: String },
  phone:      { type: String, default: '' },
  address:    { type: String, default: '' },
  fatherName: { type: String, default: '' },
  feeStatus:  { type: String, enum: ['paid', 'due', 'partial'], default: 'due' },
  isActive:   { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Student', studentSchema)