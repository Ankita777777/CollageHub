const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

dotenv.config()
connectDB()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth',       require('./routes/authRoutes'))
app.use('/api/students',   require('./routes/studentRoutes'))
app.use('/api/teachers',   require('./routes/teacherRoutes'))
app.use('/api/admin',      require('./routes/adminRoutes'))
app.use('/api/results',    require('./routes/resultRoutes'))
app.use('/api/attendance', require('./routes/attendanceRoutes'))
app.use('/api/notices',    require('./routes/noticeRoutes'))
app.use('/api/payments',   require('./routes/paymentRoutes'))

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))