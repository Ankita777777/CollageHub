const mongoose = require('mongoose')

const complaintSchema = new mongoose.Schema({
  student:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  title:       { type: String, required: true },
  category:    {
    type: String,
    enum: ['academic', 'facility', 'teacher', 'fee', 'hostel', 'other'],
    default: 'other'
  },
  description: { type: String, required: true },
  status:      {
    type: String,
    enum: ['pending', 'reviewing', 'resolved', 'rejected'],
    default: 'pending'
  },
  priority:    { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  response:    { type: String },
  respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isAnonymous: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Complaint', complaintSchema)