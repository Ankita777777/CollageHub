const multer = require('multer')
const path   = require('path')
const fs     = require('fs')

// Create upload dirs
const dirs = ['uploads/profiles', 'uploads/marksheets', 'uploads/materials', 'uploads/assignments']
dirs.forEach((dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }) })

const createStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, `uploads/${folder}/`),
    filename:    (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, unique + path.extname(file.originalname).toLowerCase())
    },
  })

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/
  if (allowed.test(path.extname(file.originalname).toLowerCase()) &&
      allowed.test(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only JPG, PNG, WEBP images allowed'), false)
  }
}

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|pdf|doc|docx|ppt|pptx|zip|txt/
  if (allowed.test(path.extname(file.originalname).toLowerCase())) {
    cb(null, true)
  } else {
    cb(new Error('File type not allowed'), false)
  }
}

const uploadProfile   = multer({ storage: createStorage('profiles'),   fileFilter: imageFilter, limits: { fileSize: 2 * 1024 * 1024 } })
const uploadMarksheet = multer({ storage: createStorage('marksheets'), fileFilter,              limits: { fileSize: 5 * 1024 * 1024 } })
const uploadMaterial  = multer({ storage: createStorage('materials'),  fileFilter,              limits: { fileSize: 20 * 1024 * 1024 } })
const uploadAssignment = multer({ storage: createStorage('assignments'), fileFilter,             limits: { fileSize: 10 * 1024 * 1024 } })

module.exports = { uploadProfile, uploadMarksheet, uploadMaterial, uploadAssignment }