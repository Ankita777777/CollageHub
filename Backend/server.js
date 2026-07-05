const express   = require('express')
const dotenv    = require('dotenv')
const cors      = require('cors')
const mongoose  = require('mongoose')

dotenv.config()

const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('DB Error:', err.message))

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server works' })
})

// Load routes ONE BY ONE — comment all out first
// then uncomment one at a time to find which one crashes

app.use('/api/auth',       require('./routes/authRoutes'))
// app.use('/api/students',   require('./routes/studentRoutes'))
// app.use('/api/teachers',   require('./routes/teacherRoutes'))
// app.use('/api/admin',      require('./routes/adminRoutes'))
// app.use('/api/results',    require('./routes/resultRoutes'))
// app.use('/api/attendance', require('./routes/attendanceRoutes'))
// app.use('/api/notices',    require('./routes/noticeRoutes'))
// app.use('/api/payments',   require('./routes/paymentRoutes'))
// app.use('/api/admissions', require('./routes/admissionRoutes'))
// app.use('/api/contact',    require('./routes/contactRoutes'))

// Error handler
app.use((err, req, res, next) => {
  console.error('ERROR:', err.message)
  console.error('STACK:', err.stack)
  res.status(500).json({ message: err.message })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))