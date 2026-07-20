const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body
  const errors = []

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters')
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required')
  }
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters')
  }
  if (role && !['student', 'teacher', 'admin'].includes(role)) {
    errors.push('Invalid role')
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors })
  }
  next()
}

const validateLogin = (req, res, next) => {
  const { email, password } = req.body
  const errors = []

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required')
  }
  if (!password) {
    errors.push('Password is required')
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors })
  }
  next()
}

const validateCourse = (req, res, next) => {
  const { name, code, program, semester } = req.body
  const errors = []

  if (!name || name.trim().length < 2) errors.push('Course name is required')
  if (!code || code.trim().length < 3)  errors.push('Course code is required')
  if (!program)                          errors.push('Program is required')
  if (!semester || semester < 1 || semester > 8) errors.push('Valid semester (1-8) is required')

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors })
  }
  next()
}

const validateNotice = (req, res, next) => {
  const { title, content } = req.body
  const errors = []

  if (!title || title.trim().length < 3)   errors.push('Title must be at least 3 characters')
  if (!content || content.trim().length < 10) errors.push('Content must be at least 10 characters')

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors })
  }
  next()
}

const validateResult = (req, res, next) => {
  const { studentId, courseId, semester, marks } = req.body
  const errors = []

  if (!studentId) errors.push('Student is required')
  if (!courseId)  errors.push('Course is required')
  if (!semester || semester < 1 || semester > 8) errors.push('Valid semester is required')
  if (marks === undefined || marks === null || marks < 0 || marks > 100) {
    errors.push('Marks must be between 0 and 100')
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors })
  }
  next()
}

const validateLeave = (req, res, next) => {
  const { fromDate, toDate, reason } = req.body
  const errors = []

  if (!fromDate) errors.push('From date is required')
  if (!toDate)   errors.push('To date is required')
  if (!reason || reason.trim().length < 5) errors.push('Reason must be at least 5 characters')
  if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
    errors.push('From date cannot be after To date')
  }
  if (fromDate && new Date(fromDate) < new Date(new Date().setHours(0,0,0,0))) {
    errors.push('Cannot apply leave for past dates')
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors })
  }
  next()
}

const validateAttendance = (req, res, next) => {
  const { courseId, date, records } = req.body
  const errors = []

  if (!courseId) errors.push('Course is required')
  if (!date)     errors.push('Date is required')
  if (!records || !Array.isArray(records) || records.length === 0) {
    errors.push('Attendance records are required')
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors })
  }
  next()
}

const validateContact = (req, res, next) => {
  const { name, email, subject, message } = req.body
  const errors = []

  if (!name || name.trim().length < 2)       errors.push('Name must be at least 2 characters')
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required')
  if (!subject || subject.trim().length < 3) errors.push('Subject must be at least 3 characters')
  if (!message || message.trim().length < 10) errors.push('Message must be at least 10 characters')

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors })
  }
  next()
}

const validateAdmission = (req, res, next) => {
  const { name, email, phone, address, program, lastSchool, percentage } = req.body
  const errors = []

  if (!name || name.trim().length < 2)        errors.push('Full name is required')
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required')
  if (!phone || !/^[0-9]{10}$/.test(phone))   errors.push('Valid 10-digit phone number is required')
  if (!address || address.trim().length < 3)  errors.push('Address is required')
  if (!program)                                errors.push('Program is required')
  if (!lastSchool || lastSchool.trim().length < 2) errors.push('Last school name is required')
  if (!percentage || isNaN(percentage) || percentage < 0 || percentage > 100) {
    errors.push('Valid percentage (0-100) is required')
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0], errors })
  }
  next()
}

module.exports = {
  validateRegister,
  validateLogin,
  validateCourse,
  validateNotice,
  validateResult,
  validateLeave,
  validateAttendance,
  validateContact,
  validateAdmission,
}