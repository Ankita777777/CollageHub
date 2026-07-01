const sendEmail = require('../utils/sendEmail')

// @POST /api/contact
const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }

    // Email to admin
    await sendEmail({
      to:      process.env.SMTP_USER,
      subject: `PMC Contact Form — ${subject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    // Auto reply to sender
    await sendEmail({
      to:      email,
      subject: 'PMC College — Message Received',
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>We received your message and will get back to you within 24-48 hours.</p>
        <p><strong>Your message:</strong> ${message}</p>
        <p>PMC College Team</p>
      `,
    })

    res.json({ message: 'Message sent successfully! We will reply soon.' })
  } catch (error) {
    console.error('Contact error:', error)
    res.status(500).json({ message: 'Failed to send message. Try again.' })
  }
}

module.exports = { sendContactMessage }