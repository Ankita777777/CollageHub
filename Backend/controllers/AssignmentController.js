const Assignment = require('../models/Assignment')
const Teacher    = require('../models/Teacher')
const Student    = require('../models/Student')
const Course     = require('../models/Course')

const createAssignment = async (req, res) => {
  try {
    console.log('createAssignment called')
    const teacher = await Teacher.findOne({ user: req.user._id })
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' })
    }

    const { courseId, title, description, dueDate, totalMarks } = req.body

    if (!courseId || !title || !description || !dueDate) {
      return res.status(400).json({ message: 'Please fill all required fields' })
    }

    if (new Date(dueDate) < new Date()) {
      return res.status(400).json({ message: 'Due date must be in the future' })
    }

    const assignment = await Assignment.create({
      course:      courseId,
      teacher:     teacher._id,
      title:       title.trim(),
      description: description.trim(),
      dueDate:     new Date(dueDate),
      totalMarks:  Number(totalMarks) || 100,
      file:        req.file?.path || '',
    })

    return res.status(201).json({ message: 'Assignment created successfully', assignment })
  } catch (err) {
    console.error('createAssignment error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

const getMyAssignments = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' })
    }

    // Get courses for student's program and semester
    const courses   = await Course.find({
      program:  student.program,
      semester: student.semester,
    })

    if (courses.length === 0) {
      return res.json([])
    }

    const courseIds = courses.map((c) => c._id)

    const assignments = await Assignment.find({ course: { $in: courseIds } })
      .populate('course',   'name code')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name' } })
      .sort({ dueDate: 1 })

    return res.json(assignments)
  } catch (err) {
    console.error('getMyAssignments error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

const getAssignmentsByCourse = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId })
      .populate('course',   'name code')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name' } })
      .sort({ dueDate: 1 })

    return res.json(assignments)
  } catch (err) {
    console.error('getAssignmentsByCourse error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

const submitAssignment = async (req, res) => {
  try {
    const student    = await Student.findOne({ user: req.user._id })
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' })
    }

    const assignment = await Assignment.findById(req.params.id)
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' })
    }

    // Check already submitted
    const alreadySubmitted = assignment.submissions.find(
      (s) => s.student.toString() === student._id.toString()
    )
    if (alreadySubmitted) {
      return res.status(400).json({ message: 'You already submitted this assignment' })
    }

    const isLate = new Date() > new Date(assignment.dueDate)

    assignment.submissions.push({
      student:     student._id,
      file:        req.file?.path || '',
      submittedAt: new Date(),
      status:      isLate ? 'late' : 'submitted',
    })

    await assignment.save()

    return res.json({
      message: isLate
        ? 'Assignment submitted (Late submission recorded)'
        : 'Assignment submitted successfully!',
    })
  } catch (err) {
    console.error('submitAssignment error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

const gradeSubmission = async (req, res) => {
  try {
    const { studentId, marks, feedback } = req.body

    if (marks === undefined || marks < 0) {
      return res.status(400).json({ message: 'Valid marks are required' })
    }

    const assignment = await Assignment.findById(req.params.id)
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' })
    }

    const submission = assignment.submissions.find(
      (s) => s.student.toString() === studentId
    )
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' })
    }

    submission.marks    = Number(marks)
    submission.feedback = feedback || ''
    submission.status   = 'graded'
    await assignment.save()

    return res.json({ message: 'Submission graded successfully' })
  } catch (err) {
    console.error('gradeSubmission error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id)
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' })
    }
    return res.json({ message: 'Assignment deleted successfully' })
  } catch (err) {
    console.error('deleteAssignment error:', err.message)
    return res.status(500).json({ message: err.message })
  }
}

module.exports = {
  createAssignment,
  getMyAssignments,
  getAssignmentsByCourse,
  submitAssignment,
  gradeSubmission,
  deleteAssignment,
}