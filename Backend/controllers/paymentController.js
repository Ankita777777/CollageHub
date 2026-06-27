const Payment = require('../models/Payment')
const Student = require('../models/Student')

// @POST /api/payments/initiate
const initiatePayment = async (req, res) => {
  const { semester, amount, method } = req.body
  const student = await Student.findOne({ user: req.user._id })

  const receiptNo = `PMC-${Date.now()}`
  const payment = await Payment.create({
    student: student._id,
    amount,
    semester,
    method,
    receiptNo,
    status: 'pending',
  })

  // For eSewa/Khalti — return payment details to frontend
  res.status(201).json({ message: 'Payment initiated', payment, receiptNo })
}

// @POST /api/payments/verify
const verifyPayment = async (req, res) => {
  const { receiptNo, transactionId } = req.body

  const payment = await Payment.findOne({ receiptNo })
  if (!payment) return res.status(404).json({ message: 'Payment not found' })

  payment.status = 'completed'
  payment.transactionId = transactionId
  payment.paidAt = new Date()
  await payment.save()

  // Update student fee status
  await Student.findByIdAndUpdate(payment.student, { feeStatus: 'paid' })

  res.json({ message: 'Payment verified', payment })
}

// @GET /api/payments/history
const getPaymentHistory = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id })
  const payments = await Payment.find({ student: student._id }).sort({ createdAt: -1 })
  res.json(payments)
}

module.exports = { initiatePayment, verifyPayment, getPaymentHistory }