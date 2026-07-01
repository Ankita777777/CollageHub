const express   = require('express')
const dotenv    = require('dotenv')
const cors      = require('cors')
const connectDB = require('./config/db')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

dotenv.config()
connectDB()

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CLIENT_URL,
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/api/test', (req, res) => {
  res.json({ message: '✅ PMC Server is running!' })
})

// Routes
app.use('/api/auth',       require('./routes/authRoutes'))
app.use('/api/students',   require('./routes/studentRoutes'))
app.use('/api/teachers',   require('./routes/teacherRoutes'))
app.use('/api/admin',      require('./routes/adminRoutes'))
app.use('/api/results',    require('./routes/resultRoutes'))
app.use('/api/attendance', require('./routes/attendanceRoutes'))
app.use('/api/notices',    require('./routes/noticeRoutes'))
app.use('/api/payments',   require('./routes/paymentRoutes'))
app.use('/api/admissions', require('./routes/admissionRoutes'))  // NEW
app.use('/api/contact',    require('./routes/contactRoutes'))    // NEW

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))