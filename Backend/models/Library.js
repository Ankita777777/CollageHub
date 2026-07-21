const mongoose = require('mongoose')

const librarySchema = new mongoose.Schema({
  title:       { type: String, required: true },
  author:      { type: String, required: true },
  isbn:        { type: String },
  category:    { type: String },
  program:     { type: String },
  totalCopies: { type: Number, default: 1 },
  available:   { type: Number, default: 1 },
  cover:       { type: String },
  description: { type: String },
  issues: [{
    student:    { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    issueDate:  { type: Date, default: Date.now },
    dueDate:    { type: Date },
    returnDate: { type: Date },
    status:     { type: String, enum: ['issued', 'returned', 'overdue'], default: 'issued' },
    fine:       { type: Number, default: 0 },
  }],
}, { timestamps: true })

module.exports = mongoose.model('Library', librarySchema)