const nodemailer = require('nodemailer')

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST || 'smtp.gmail.com',
      port:   587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    const info = await transporter.sendMail({
      from:    `"PMC College" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    })

    console.log('Email sent:', info.messageId)
    return info
  } catch (error) {
    console.error('SendEmail error:', error.message)
    throw error
  }
}

module.exports = sendEmail