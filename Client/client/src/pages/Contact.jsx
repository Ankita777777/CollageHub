import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendContact, resetContact } from '../features/contact/contactSlice'
import {
  Box, Container, Typography, Grid, Card, CardContent,
  TextField, Button, Alert, CircularProgress, Divider
} from '@mui/material'
import LocationOnIcon  from '@mui/icons-material/LocationOn'
import PhoneIcon       from '@mui/icons-material/Phone'
import EmailIcon       from '@mui/icons-material/Email'
import AccessTimeIcon  from '@mui/icons-material/AccessTime'
import SendIcon        from '@mui/icons-material/Send'
import Navbar  from '../components/Navbar'
import Footer  from '../components/Footer'

const Contact = () => {
  const dispatch = useDispatch()
  const { loading, error, success, message } = useSelector((state) => state.contact)
  const [form, setForm] = useState({
    name: '', email: '', subject: '', message: ''
  })

  useEffect(() => {
    return () => dispatch(resetContact())
  }, [dispatch])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(sendContact(form))
    if (success) {
      setForm({ name: '', email: '', subject: '', message: '' })
    }
  }

  const contactInfo = [
    {
      icon:  <LocationOnIcon sx={{ fontSize: 28 }} />,
      title: 'Our Address',
      text:  'Pokhara-8, Gandaki Province, Nepal',
      color: '#1565C0',
    },
    {
      icon:  <PhoneIcon sx={{ fontSize: 28 }} />,
      title: 'Phone Number',
      text:  '+977-61-XXXXXX',
      color: '#2E7D32',
    },
    {
      icon:  <EmailIcon sx={{ fontSize: 28 }} />,
      title: 'Email Address',
      text:  'info@pmccollege.edu.np',
      color: '#E65100',
    },
    {
      icon:  <AccessTimeIcon sx={{ fontSize: 28 }} />,
      title: 'Office Hours',
      text:  'Sunday - Friday: 9AM - 5PM',
      color: '#6A1B9A',
    },
  ]

  return (
    <>
      <Navbar />

      {/* Hero */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0D47A1, #1E88E5)',
        color: 'white', py: 8, textAlign: 'center',
      }}>
        <Typography variant="h3" fontWeight={800} mb={1}>Contact Us</Typography>
        <Typography variant="h6" sx={{ opacity: 0.8 }}>
          We would love to hear from you
        </Typography>
      </Box>

      <Container sx={{ py: 7 }}>
        <Grid container spacing={4}>

          {/* Left — Contact Info */}
          <Grid item xs={12} md={5}>
            <Typography variant="h5" fontWeight={700} mb={1}>
              Get In Touch
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Have questions about admissions, programs, or anything else?
              Send us a message and our team will get back to you soon.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
              {contactInfo.map((info) => (
                <Box
                  key={info.title}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: '#f9f9f9',
                    border: '1px solid #eee',
                  }}
                >
                  <Box sx={{
                    bgcolor: info.color + '15',
                    color: info.color,
                    p: 1.5, borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    {info.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {info.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {info.text}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Map placeholder */}
            <Box sx={{
              bgcolor: '#e8eaf6',
              borderRadius: 3,
              p: 4,
              textAlign: 'center',
              border: '2px dashed #9fa8da',
            }}>
              <LocationOnIcon sx={{ fontSize: 40, color: '#3949ab', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Pokhara Management College
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Pokhara-8, Gandaki Province, Nepal
              </Typography>
            </Box>
          </Grid>

          {/* Right — Contact Form */}
          <Grid item xs={12} md={7}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} mb={0.5}>
                  Send a Message
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Fill the form below and we will reply within 24-48 hours.
                  Messages are received by our admin team.
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {message || 'Message sent! We will reply soon.'}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="name"
                        label="Your Full Name"
                        fullWidth
                        required
                        value={form.name}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        required
                        value={form.email}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="subject"
                        label="Subject"
                        fullWidth
                        required
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="e.g. Admission inquiry, Fee structure..."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="message"
                        label="Your Message"
                        fullWidth
                        multiline
                        rows={5}
                        required
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Write your message here..."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        sx={{ py: 1.5 }}
                      >
                        {loading ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container>

      <Footer />
    </>
  )
}

export default Contact