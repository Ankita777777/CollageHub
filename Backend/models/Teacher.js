const mongoose = require('mongoose')

const teacherSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId:    { type: String },
  department:    { type: String, default: 'General' },
  designation:   { type: String, default: 'Lecturer' },
  phone:         { type: String, default: '' },
  address:       { type: String, default: '' },
  qualification: { type: String, default: '' },
  subjects:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  isActive:      { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Teacher', teacherSchema)