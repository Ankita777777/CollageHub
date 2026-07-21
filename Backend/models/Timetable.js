const mongoose = require('mongoose')

const timetableSchema = new mongoose.Schema({
  program:  { type: String, required: true },
  semester: { type: Number, required: true },
  day:      { type: String, enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], required: true },
  periods: [{
    startTime: { type: String, required: true },
    endTime:   { type: String, required: true },
    course:    { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    teacher:   { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    room:      { type: String },
  }],
}, { timestamps: true })

module.exports = mongoose.model('Timetable', timetableSchema)