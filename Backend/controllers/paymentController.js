const Payment = require('../models/Payment')
const Student = require('../models/Student')

const initiatePayment = async (req, res) => {
  try {
    const { semester, amount, method } = req.body
    if (!semester || !amount) {
      return res.status(400).json({ message: 'Semester and amount are required' })
    }
    const student = await Student.findOne({ user: req.user._id })
    if (!student) return res.status(404).json({ message: 'Student not found' })

    const receiptNo = `PMC-${Date.now()}`
    const payment   = await Payment.create({
      student: student._id,
      amount,
      semester,
      method: method || 'cash',
      receiptNo,
      status: 'pending',
    })
    res.status(201).json({ message: 'Payment initiated', payment, receiptNo })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const verifyPayment = async (req, res) => {
  try {
    const { receiptNo, transactionId } = req.body
    const payment = await Payment.findOne({ receiptNo })
    if (!payment) return res.status(404).json({ message: 'Payment not found' })

    payment.status        = 'completed'
    payment.transactionId = transactionId
    payment.paidAt        = new Date()
    await payment.save()

    await Student.findByIdAndUpdate(payment.student, { feeStatus: 'paid' })
    res.json({ message: 'Payment verified', payment })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getPaymentHistory = async (req, res) => {
  try {
    const student  = await Student.findOne({ user: req.user._id })
    if (!student) return res.status(404).json({ message: 'Student not found' })
    const payments = await Payment.find({ student: student._id }).sort({ createdAt: -1 })
    res.json(payments)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { initiatePayment, verifyPayment, getPaymentHistory }