const Admission = require('../models/Admission')
const sendEmail = require('../utils/sendEmail')

// ─────────────────────────────────────────────────
// @POST /api/admissions
// Public — student fills form
// ─────────────────────────────────────────────────
const submitAdmission = async (req, res) => {
  try {
    const {
      name, email, phone, address,
      program, lastSchool, percentage, message
    } = req.body

    if (!name || !email || !phone || !program || !lastSchool || !percentage) {
      return res.status(400).json({ message: 'Please fill all required fields' })
    }

    // Check duplicate application
    const existing = await Admission.findOne({ email, program })
    if (existing) {
      return res.status(400).json({
        message: 'You already applied for this program. We will contact you soon.'
      })
    }

    const admission = await Admission.create({
      name, email, phone, address,
      program, lastSchool, percentage, message
    })

    // Email to applicant
    try {
      await sendEmail({
        to:      email,
        subject: 'PMC College — Application Received',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#1565C0;">Application Received!</h2>
            <p>Dear <strong>${name}</strong>,</p>
            <p>Thank you for applying to PMC College. We have received your application.</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
              <tr style="background:#f5f5f5;">
                <td style="padding:8px;border:1px solid #ddd;"><strong>Program</strong></td>
                <td style="padding:8px;border:1px solid #ddd;">${program}</td>
              </tr>
              <tr>
                <td style="padding:8px;border:1px solid #ddd;"><strong>Last School</strong></td>
                <td style="padding:8px;border:1px solid #ddd;">${lastSchool}</td>
              </tr>
              <tr style="background:#f5f5f5;">
                <td style="padding:8px;border:1px solid #ddd;"><strong>Percentage/GPA</strong></td>
                <td style="padding:8px;border:1px solid #ddd;">${percentage}</td>
              </tr>
            </table>
            <p>Our admissions team will review your application and contact you within 3-5 working days.</p>
            <p style="color:#666;">PMC College Admissions Team</p>
          </div>
        `,
      })
    } catch (e) {
      console.log('Applicant email failed (non-critical)')
    }

    // Email to admin
    try {
      await sendEmail({
        to:      process.env.SMTP_USER,
        subject: `New Admission Application — ${program}`,
        html: `
          <h2>New Application Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Program:</strong> ${program}</p>
          <p><strong>Last School:</strong> ${lastSchool}</p>
          <p><strong>Percentage:</strong> ${percentage}</p>
          <p><strong>Message:</strong> ${message || 'N/A'}</p>
        `,
      })
    } catch (e) {
      console.log('Admin email failed (non-critical)')
    }

    res.status(201).json({
      message: 'Application submitted successfully! We will contact you soon.',
      admission,
    })
  } catch (error) {
    console.error('Admission submit error:', error)
    res.status(500).json({ message: error.message || 'Submission failed' })
  }
}

// ─────────────────────────────────────────────────
// @GET /api/admissions
// Admin only — get all applications
// ─────────────────────────────────────────────────
const getAllAdmissions = async (req, res) => {
  try {
    const { status, program } = req.query
    const filter = {}
    if (status)  filter.status  = status
    if (program) filter.program = program

    const admissions = await Admission.find(filter).sort({ createdAt: -1 })
    res.json(admissions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────────
// @GET /api/admissions/:id
// Admin only — get single application
// ─────────────────────────────────────────────────
const getAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id)
    if (!admission) return res.status(404).json({ message: 'Application not found' })
    res.json(admission)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────────
// @PUT /api/admissions/:id
// Admin only — update status (accept/reject)
// ─────────────────────────────────────────────────
const updateAdmission = async (req, res) => {
  try {
    const { status, reviewNote } = req.body

    const admission = await Admission.findById(req.params.id)
    if (!admission) return res.status(404).json({ message: 'Application not found' })

    admission.status     = status     || admission.status
    admission.reviewNote = reviewNote || admission.reviewNote
    admission.reviewedBy = req.user._id
    await admission.save()

    // Email applicant about decision
    try {
      const isAccepted = status === 'accepted'
      await sendEmail({
        to:      admission.email,
        subject: `PMC College — Application ${isAccepted ? 'Accepted' : 'Update'}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:${isAccepted ? '#2E7D32' : '#C62828'};">
              Application ${status.charAt(0).toUpperCase() + status.slice(1)}
            </h2>
            <p>Dear <strong>${admission.name}</strong>,</p>
            ${isAccepted
              ? `<p>Congratulations! Your application for <strong>${admission.program}</strong>
                 has been <strong style="color:#2E7D32;">accepted</strong>.</p>
                 <p>Please visit the college with your documents for enrollment.</p>`
              : `<p>Your application for <strong>${admission.program}</strong>
                 status has been updated to <strong>${status}</strong>.</p>`
            }
            ${reviewNote ? `<p><strong>Note:</strong> ${reviewNote}</p>` : ''}
            <p style="color:#666;">PMC College Admissions Team</p>
          </div>
        `,
      })
    } catch (e) {
      console.log('Status email failed (non-critical)')
    }

    res.json({ message: `Application ${status}`, admission })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────────
// @DELETE /api/admissions/:id
// Admin only
// ─────────────────────────────────────────────────
const deleteAdmission = async (req, res) => {
  try {
    await Admission.findByIdAndDelete(req.params.id)
    res.json({ message: 'Application deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  submitAdmission,
  getAllAdmissions,
  getAdmission,
  updateAdmission,
  deleteAdmission,
}