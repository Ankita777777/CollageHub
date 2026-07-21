const multer                  = require('multer')
const { CloudinaryStorage }   = require('multer-storage-cloudinary')
const cloudinary              = require('../config/cloudinary')

// Cloudinary storage for profile photos
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'pmc/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }],
  },
})

// Cloudinary storage for marksheets
const marksheetStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'pmc/marksheets',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    resource_type:   'auto',
  },
})

// Local storage fallback if no Cloudinary
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + require('path').extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|pdf/
  const ext     = allowed.test(require('path').extname(file.originalname).toLowerCase())
  if (ext) cb(null, true)
  else cb(new Error('Only JPG, PNG and PDF files allowed'))
}

// Use Cloudinary if configured, else local
const useCloudinary = process.env.CLOUDINARY_NAME &&
                      process.env.CLOUDINARY_API_KEY &&
                      process.env.CLOUDINARY_API_SECRET

const uploadProfile   = multer({
  storage:    useCloudinary ? profileStorage   : localStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },  // 2MB
})

const uploadMarksheet = multer({
  storage:    useCloudinary ? marksheetStorage : localStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB
})

module.exports = { uploadProfile, uploadMarksheet }