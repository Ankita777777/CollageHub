const mongoose = require('mongoose')

const scholarshipSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, required: true },
  amount:      { type: Number },
  percentage:  { type: Number },
  criteria:    { type: String },
  deadline:    { type: Date },
  isActive:    { type: Boolean, default: true },
  program:     { type: String },
  applications: [{
    student:   { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    reason:    { type: String },
    status:    { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    appliedAt: { type: Date, default: Date.now },
    response:  { type: String },
  }],
}, { timestamps: true })

module.exports = mongoose.model('Scholarship', scholarshipSchema)