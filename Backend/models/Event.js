const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  date:        { type: Date, required: true },
  endDate:     { type: Date },
  location:    { type: String },
  type:        { type: String, enum: ['cultural', 'sports', 'academic', 'seminar', 'other'], default: 'other' },
  image:       { type: String },
  isPublic:    { type: Boolean, default: true },
  postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
}, { timestamps: true })

module.exports = mongoose.model('Event', eventSchema)