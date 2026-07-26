const express = require('express')
const router  = express.Router()
const { createMaterial, getMaterialsByCourse, getMyMaterials, deleteMaterial } = require('../controllers/studyMaterialController')
const { protect }        = require('../middleware/authMiddleware')
const { authorize }      = require('../middleware/roleMiddleware')
const { uploadMaterial } = require('../middleware/uploadMiddleware')

router.get('/my',               protect, authorize('student'),           getMyMaterials)
router.get('/course/:courseId', protect,                                 getMaterialsByCourse)
router.post('/',                protect, authorize('teacher', 'admin'),  uploadMaterial.single('file'), createMaterial)
router.delete('/:id',           protect, authorize('teacher', 'admin'),  deleteMaterial)

module.exports = router