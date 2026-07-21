const mongoose = require('mongoose')

const studyMaterialSchema = new mongoose.Schema({
  course:       { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  teacher:      { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  title:        { type: String, required: true },
  description:  { type: String },
  type:         { type: String, enum: ['note', 'slides', 'video', 'link', 'other'], default: 'note' },
  file:         { type: String },
  link:         { type: String },
  semester:     { type: Number },
  program:      { type: String },
  isPublished:  { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema)