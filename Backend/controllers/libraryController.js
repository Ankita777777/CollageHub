const Library = require('../models/Library')
const Student = require('../models/Student')

const getAllBooks = async (req, res) => {
  try {
    const { search, category, program } = req.query
    const filter = {}
    if (category) filter.category = category
    if (program)  filter.program  = program

    let books = await Library.find(filter).sort({ title: 1 })

    if (search) {
      books = books.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.isbn?.includes(search)
      )
    }
    return res.json(books)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const addBook = async (req, res) => {
  try {
    const { title, author, isbn, category, program, totalCopies, description } = req.body
    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author are required' })
    }
    const book = await Library.create({
      title, author, isbn, category, program,
      totalCopies: totalCopies || 1,
      available:   totalCopies || 1,
      description: description || '',
      cover:       req.file?.path || '',
    })
    return res.status(201).json({ message: 'Book added', book })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const issueBook = async (req, res) => {
  try {
    const book = await Library.findById(req.params.id)
    if (!book) return res.status(404).json({ message: 'Book not found' })

    if (book.available <= 0) {
      return res.status(400).json({ message: 'No copies available' })
    }

    const { studentId } = req.body

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)  // 2 weeks

    book.issues.push({
      student:   studentId,
      issueDate: new Date(),
      dueDate,
      status:    'issued',
    })
    book.available -= 1
    await book.save()

    return res.json({ message: 'Book issued successfully', dueDate })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const returnBook = async (req, res) => {
  try {
    const book = await Library.findById(req.params.id)
    if (!book) return res.status(404).json({ message: 'Book not found' })

    const { issueId } = req.body
    const issue = book.issues.id(issueId)
    if (!issue) return res.status(404).json({ message: 'Issue record not found' })

    const returnDate = new Date()
    let fine = 0

    if (returnDate > new Date(issue.dueDate)) {
      const overdueDays = Math.ceil(
        (returnDate - new Date(issue.dueDate)) / (1000 * 60 * 60 * 24)
      )
      fine = overdueDays * 5  // Rs. 5 per day fine
    }

    issue.returnDate = returnDate
    issue.status     = 'returned'
    issue.fine       = fine
    book.available  += 1
    await book.save()

    return res.json({ message: 'Book returned', fine })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getMyBooks = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
    if (!student) return res.status(404).json({ message: 'Student not found' })

    const books = await Library.find({
      'issues.student': student._id,
      'issues.status':  'issued',
    })

    const myIssues = books.map((book) => {
      const issue = book.issues.find(
        (i) => i.student.toString() === student._id.toString() &&
               i.status === 'issued'
      )
      return {
        book:      { _id: book._id, title: book.title, author: book.author, cover: book.cover },
        issue,
        isOverdue: new Date() > new Date(issue?.dueDate),
      }
    })

    return res.json(myIssues)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = { getAllBooks, addBook, issueBook, returnBook, getMyBooks }