const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rollNo:     { type: String, unique: true },
  semester:   { type: Number, default: 1 },
  program:    { type: String },
  batch:      { type: String },
  phone:      { type: String },
  address:    { type: String },
  fatherName: { type: String },
  feeStatus:  { type: String, enum: ['paid', 'due', 'partial'], default: 'due' },
  isActive:   { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Student', studentSchema)