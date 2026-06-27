const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  student:       { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  amount:        { type: Number, required: true },
  semester:      { type: Number, required: true },
  method:        { type: String, enum: ['esewa', 'khalti', 'cash', 'bank'], default: 'cash' },
  status:        { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  transactionId: { type: String },
  paidAt:        { type: Date },
  receiptNo:     { type: String, unique: true },
  remarks:       { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Payment', paymentSchema)