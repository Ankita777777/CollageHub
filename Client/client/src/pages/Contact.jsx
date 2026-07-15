import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendContact, resetContact } from '../features/contact/contactSlice'
import {
  Container, Grid, Typography, Box, Card, CardContent,
  TextField, Button, Alert, CircularProgress
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon      from '@mui/icons-material/Phone'
import EmailIcon      from '@mui/icons-material/Email'
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
  }

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight={700}>Contact Us</Typography>
        <Typography sx={{ opacity: 0.8, mt: 1 }}>We'd love to hear from you</Typography>
      </Box>

      <Container sx={{ py: 6 }}>
        <Grid container spacing={4}>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            {[
              { icon: <LocationOnIcon />, title: 'Address', text: 'Pokhara, Gandaki Province, Nepal' },
              { icon: <PhoneIcon />,      title: 'Phone',   text: '+977-61-XXXXXX' },
              { icon: <EmailIcon />,      title: 'Email',   text: 'info@pmccollege.edu.np' },
            ].map((info) => (
              <Card key={info.title} sx={{ mb: 2 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ bgcolor: 'primary.main', p: 1.5, borderRadius: 2, color: 'white' }}>
                    {info.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>{info.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{info.text}</Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} mb={3}>
                  Send a Message
                </Typography>

                {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="name" label="Your Name"
                        fullWidth required
                        value={form.name} onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="email" label="Email" type="email"
                        fullWidth required
                        value={form.email} onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="subject" label="Subject"
                        fullWidth required
                        value={form.subject} onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="message" label="Message"
                        fullWidth multiline rows={5} required
                        value={form.message} onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit" variant="contained"
                        size="large" fullWidth
                        disabled={loading}
                      >
                        {loading
                          ? <CircularProgress size={24} color="inherit" />
                          : 'Send Message'
                        }
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