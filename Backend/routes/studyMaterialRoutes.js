const express = require('express')
const router  = express.Router()
const {
  createMaterial, getMaterialsByCourse,
  getMyMaterials, deleteMaterial,
} = require('../controllers/studyMaterialController')
const { protect }   = require('../middleware/authMiddleware')
const { authorize } = require('../middleware/roleMiddleware')
const { uploadMarksheet } = require('../middleware/uploadMiddleware')

router.post('/',                 protect, authorize('teacher', 'admin'), uploadMarksheet.single('file'), createMaterial)
router.get('/my',                protect, authorize('student'), getMyMaterials)
router.get('/course/:courseId',  protect, getMaterialsByCourse)
router.delete('/:id',            protect, authorize('teacher', 'admin'), deleteMaterial)

module.exports = router