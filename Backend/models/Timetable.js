const mongoose = require('mongoose')

const timetableSchema = new mongoose.Schema({
  program:  { type: String, required: true },
  semester: { type: Number, required: true },
  day:      { type: String, enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], required: true },
  periods: [{
    startTime: { type: String },
    endTime:   { type: String },
    course:    { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    teacher:   { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    room:      { type: String },
  }],
}, { timestamps: true })

timetableSchema.index({ program: 1, semester: 1, day: 1 }, { unique: true })

module.exports = mongoose.model('Timetable', timetableSchema)