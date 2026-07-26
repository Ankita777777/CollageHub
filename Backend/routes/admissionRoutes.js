const express  = require('express')
const router   = express.Router()
const {
  submitAdmission, getAllAdmissions,
  getAdmission, updateAdmission, deleteAdmission,
} = require('../controllers/admissionController')
const { protect }        = require('../middleware/authMiddleware')
const { authorize }      = require('../middleware/roleMiddleware')
const { uploadMarksheet } = require('../middleware/uploadMiddleware')

router.post('/',       uploadMarksheet.single('marksheet'), submitAdmission)
router.get('/',        protect, authorize('admin'), getAllAdmissions)
router.get('/:id',     protect, authorize('admin'), getAdmission)
router.put('/:id',     protect, authorize('admin'), updateAdmission)
router.delete('/:id',  protect, authorize('admin'), deleteAdmission)

module.exports = router