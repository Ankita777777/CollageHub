const express = require('express')
const router  = express.Router()
const {
  getAllScholarships, createScholarship,
  applyScholarship, respondScholarship, getMyScholarships,
} = require('../controllers/scholarshipController')
const { protect }   = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')

router.get('/',              protect, getAllScholarships)
router.post('/',             protect, authorize('admin'), createScholarship)
router.post('/:id/apply',    protect, authorize('student'), applyScholarship)
router.put('/:id/respond',   protect, authorize('admin'), respondScholarship)
router.get('/my',            protect, authorize('student'), getMyScholarships)

module.exports = router