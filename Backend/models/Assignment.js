const mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema({
  course:      { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  teacher:     { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  dueDate:     { type: Date, required: true },
  totalMarks:  { type: Number, default: 100 },
  file:        { type: String },
  submissions: [{
    student:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    file:        { type: String },
    submittedAt: { type: Date, default: Date.now },
    marks:       { type: Number },
    feedback:    { type: String },
    status:      { type: String, enum: ['submitted', 'late', 'graded'], default: 'submitted' },
  }],
}, { timestamps: true })

module.exports = mongoose.model('Assignment', assignmentSchema)