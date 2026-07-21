const express = require('express')
const router  = express.Router()
const {
  submitComplaint, getMyComplaints,
  getAllComplaints, respondComplaint,
} = require('../controllers/complaintController')
const { protect }   = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

router.post('/',          protect, authorize('student'), submitComplaint)
router.get('/my',         protect, authorize('student'), getMyComplaints)
router.get('/',           protect, authorize('admin'),   getAllComplaints)
router.put('/:id/respond',protect, authorize('admin'),   respondComplaint)

module.exports = router