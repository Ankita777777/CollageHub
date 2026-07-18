const express = require('express')
const router  = express.Router()
const {
  submitAdmission,
  getAllAdmissions,
  getAdmission,
  updateAdmission,
  deleteAdmission,
} = require('../controllers/admissionController')
const { protect }   = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

// ✅ Public — no login needed to apply
router.post('/', submitAdmission)

// ✅ Admin only
router.get('/',       protect, authorize('admin'), getAllAdmissions)
router.get('/:id',    protect, authorize('admin'), getAdmission)
router.put('/:id',    protect, authorize('admin'), updateAdmission)
router.delete('/:id', protect, authorize('admin'), deleteAdmission)

module.exports = router