const Contact = require('../models/Contact')

const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }
    await Contact.create({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() })
    return res.json({ message: 'Message sent successfully! We will reply within 24 hours.' })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 })
    return res.json(messages)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const deleteMessage = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id)
    return res.json({ message: 'Deleted' })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const markAsRead = async (req, res) => {
  try {
    const msg = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true })
    return res.json(msg)
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

module.exports = { sendContactMessage, getAllMessages, deleteMessage, markAsRead }