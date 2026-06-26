const express = require('express')
const router = express.Router()
const { initiatePayment, verifyPayment, getPaymentHistory } = require('../controllers/paymentController')
const { protect } = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

router.post('/initiate', protect, authorize('student'), initiatePayment)
router.post('/verify',   protect, authorize('student'), verifyPayment)
router.get('/history',   protect, authorize('student'), getPaymentHistory)

module.exports = router