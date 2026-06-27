const mongoose = require('mongoose')

const teacherSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId:  { type: String, unique: true },
  department:  { type: String },
  designation: { type: String },   // Lecturer, HOD, Professor
  phone:       { type: String },
  address:     { type: String },
  qualification: { type: String },
  subjects:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  joinDate:    { type: Date },
  salary:      { type: Number },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Teacher', teacherSchema)