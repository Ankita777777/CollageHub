const express      = require('express')
const dotenv       = require('dotenv')
const cors         = require('cors')
const helmet       = require('helmet')
const morgan       = require('morgan')
const compression  = require('compression')
const rateLimit    = require('express-rate-limit')
const path         = require('path')
const connectDB    = require('./config/db')

dotenv.config()
connectDB()

const app = express()

// ── Security Headers ──────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))

// ── Compression ───────────────────────────────────
app.use(compression())

// ── Logging ───────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// ── Rate Limiting ─────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max:      100,
  message:  { message: 'Too many requests, please try again later' },
})
app.use('/api/', limiter)

// Stricter limit for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max:      20,
  message:  { message: 'Too many login attempts, please try again after 1 hour' },
})
app.use('/api/auth/login',    authLimiter)
app.use('/api/auth/register', authLimiter)

// ── CORS ──────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── Static Files ──────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── Health Check ──────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    uptime:    process.uptime(),
  })
})

// ── Routes ────────────────────────────────────────
app.use('/api/auth',            require('./routes/authRoutes'))
app.use('/api/students',        require('./routes/studentRoutes'))
app.use('/api/teachers',        require('./routes/teacherRoutes'))
app.use('/api/admin',           require('./routes/adminRoutes'))
app.use('/api/results',         require('./routes/resultRoutes'))
app.use('/api/attendance',      require('./routes/attendanceRoutes'))
app.use('/api/notices',         require('./routes/noticeRoutes'))
app.use('/api/payments',        require('./routes/paymentRoutes'))
app.use('/api/admissions',      require('./routes/admissionRoutes'))
app.use('/api/contact',         require('./routes/contactRoutes'))
app.use('/api/complaints',      require('./routes/complaintRoutes'))
app.use('/api/assignments',     require('./routes/assignmentRoutes'))
app.use('/api/timetable',       require('./routes/timetableRoutes'))
app.use('/api/study-materials', require('./routes/studyMaterialRoutes'))
app.use('/api/events',          require('./routes/eventRoutes'))
app.use('/api/library',         require('./routes/libraryRoutes'))
app.use('/api/scholarships',    require('./routes/scholarshipRoutes'))
app.use('/api/feedback',        require('./routes/feedbackRoutes'))

// ── 404 Handler ───────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
})

// ── Global Error Handler ──────────────────────────
app.use((err, req, res, next) => {
  console.error('Global Error:', err.message)
  const status = err.statusCode || res.statusCode || 500
  res.status(status).json({
    message: err.message || 'Internal Server Error',
    stack:   process.env.NODE_ENV === 'production' ? null : err.stack,
  })
})

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV} mode`)
})

// ── Handle Unhandled Rejections ───────────────────
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message)
  server.close(() => process.exit(1))
})

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message)
  process.exit(1)
})