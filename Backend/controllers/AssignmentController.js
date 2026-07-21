const Assignment = require('../models/Assignment')
const Teacher    = require('../models/Teacher')
const Student    = require('../models/Student')

const createAssignment = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user._id })
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' })

    const { courseId, title, description, dueDate, totalMarks } = req.body

    if (!title || !description || !dueDate || !courseId) {
      return res.status(400).json({ message: 'Please fill all required fields' })
    }
    if (new Date(dueDate) < new Date()) {
      return res.status(400).json({ message: 'Due date must be in the future' })
    }

    const assignment = await Assignment.create({
      course:      courseId,
      teacher:     teacher._id,
      title,
      description,
      dueDate,
      totalMarks:  totalMarks || 100,
      file:        req.file?.path || '',
    })

    return res.status(201).json({ message: 'Assignment created', assignment })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getAssignmentsByCourse = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId })
      .populate('course', 'name code')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name' } })
      .sort({ dueDate: 1 })
    return res.json(assignments)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getMyAssignments = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
    if (!student) return res.status(404).json({ message: 'Student not found' })

    const Course = require('../models/Course')
    const courses = await Course.find({
      program:  student.program,
      semester: student.semester,
    })
    const courseIds = courses.map((c) => c._id)

    const assignments = await Assignment.find({ course: { $in: courseIds } })
      .populate('course', 'name code')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name' } })
      .sort({ dueDate: 1 })

    return res.json(assignments)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const submitAssignment = async (req, res) => {
  try {
    const student    = await Student.findOne({ user: req.user._id })
    if (!student) return res.status(404).json({ message: 'Student not found' })

    const assignment = await Assignment.findById(req.params.id)
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' })

    const alreadySubmitted = assignment.submissions.find(
      (s) => s.student.toString() === student._id.toString()
    )
    if (alreadySubmitted) {
      return res.status(400).json({ message: 'Already submitted' })
    }

    const isLate   = new Date() > new Date(assignment.dueDate)
    assignment.submissions.push({
      student:     student._id,
      file:        req.file?.path || '',
      submittedAt: new Date(),
      status:      isLate ? 'late' : 'submitted',
    })
    await assignment.save()

    return res.json({
      message: isLate ? 'Submitted (Late submission)' : 'Assignment submitted successfully',
    })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const gradeSubmission = async (req, res) => {
  try {
    const { studentId, marks, feedback } = req.body
    const assignment = await Assignment.findById(req.params.id)
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' })

    const submission = assignment.submissions.find(
      (s) => s.student.toString() === studentId
    )
    if (!submission) return res.status(404).json({ message: 'Submission not found' })

    submission.marks    = marks
    submission.feedback = feedback
    submission.status   = 'graded'
    await assignment.save()

    return res.json({ message: 'Submission graded' })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const deleteAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id)
    return res.json({ message: 'Assignment deleted' })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = {
  createAssignment, getAssignmentsByCourse,
  getMyAssignments, submitAssignment,
  gradeSubmission, deleteAssignment,
}