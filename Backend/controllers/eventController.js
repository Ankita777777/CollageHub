const Event   = require('../models/Event')
const Student = require('../models/Student')

const createEvent = async (req, res) => {
  try {
    const { title, description, date, endDate, location, type } = req.body
    if (!title || !description || !date) {
      return res.status(400).json({ message: 'Title, description and date are required' })
    }
    if (new Date(date) < new Date()) {
      return res.status(400).json({ message: 'Event date must be in the future' })
    }

    const event = await Event.create({
      title, description, date, endDate, location,
      type:     type || 'other',
      image:    req.file?.path || '',
      isPublic: true,
      postedBy: req.user._id,
    })
    return res.status(201).json({ message: 'Event created', event })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ isPublic: true })
      .populate('postedBy', 'name')
      .sort({ date: 1 })
    return res.json(events)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const registerForEvent = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
    if (!student) return res.status(404).json({ message: 'Student not found' })

    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found' })

    const alreadyRegistered = event.registrations.includes(student._id)
    if (alreadyRegistered) {
      // Unregister
      event.registrations = event.registrations.filter(
        (s) => s.toString() !== student._id.toString()
      )
      await event.save()
      return res.json({ message: 'Unregistered from event', registered: false })
    }

    event.registrations.push(student._id)
    await event.save()
    return res.json({ message: 'Registered for event', registered: true })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id)
    return res.json({ message: 'Event deleted' })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = { createEvent, getAllEvents, registerForEvent, deleteEvent }