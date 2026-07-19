// backend/controllers/contactController.js
const Contact = require('../models/Contact')

const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }

    // Save to database instead of email
    const contact = await Contact.create({ name, email, subject, message })

    console.log('📧 New Contact Message:')
    console.log('   From:', name, `(${email})`)
    console.log('   Subject:', subject)
    console.log('   Message:', message)

    return res.json({
      message: 'Message sent successfully! We will reply within 24 hours.'
    })
  } catch (error) {
    console.error('Contact error:', error.message)
    return res.status(500).json({ message: error.message })
  }
}

const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 })
    return res.json(messages)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const deleteMessage = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id)
    return res.json({ message: 'Message deleted' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = { sendContactMessage, getAllMessages, deleteMessage }