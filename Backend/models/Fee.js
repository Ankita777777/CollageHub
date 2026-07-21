const mongoose = require('mongoose')

const feeSchema = new mongoose.Schema({
  student:   { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  semester:  { type: Number, required: true },
  amount:    { type: Number, required: true },
  dueDate:   { type: Date },
  paidDate:  { type: Date },
  method:    { type: String, enum: ['cash', 'bank', 'esewa', 'khalti'] },
  receiptNo: { type: String },
  status:    { type: String, enum: ['paid', 'due', 'partial', 'overdue'], default: 'due' },
  remarks:   { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Fee', feeSchema)