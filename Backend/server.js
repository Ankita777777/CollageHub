const express     = require('express')
const dotenv      = require('dotenv')
const cors        = require('cors')
const path        = require('path')
const connectDB   = require('./config/db')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

dotenv.config()
connectDB()

const app = express()

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CollageHub API is running 🚀'
  });
});
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }))

// All routes
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

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`✅ Server on port ${PORT}`))