import { useState } from 'react'
import {
  Container, Typography, Box, Grid, Card, CardContent,
  TextField, MenuItem, Button, Alert, Stepper, Step, StepLabel
} from '@mui/material'
import API from '../api/axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const steps = ['Personal Info', 'Academic Info', 'Submit']

const Admissions = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '',
    program: '', lastSchool: '', percentage: '', message: ''
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.post('/admissions', form)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed')
    }
  }

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight={700}>Apply for Admission</Typography>
        <Typography sx={{ opacity: 0.8, mt: 1 }}>Academic Year 2081/82</Typography>
      </Box>

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        {success ? (
          <Alert severity="success" sx={{ fontSize: 16 }}>
            Application submitted successfully! We will contact you soon.
          </Alert>
        ) : (
          <Card>
            <CardContent sx={{ p: 4 }}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <Box component="form" onSubmit={handleSubmit}>
                {activeStep === 0 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField name="name"    label="Full Name"    fullWidth required value={form.name}    onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField name="email"   label="Email"        fullWidth required value={form.email}   onChange={handleChange} type="email" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField name="phone"   label="Phone"        fullWidth required value={form.phone}   onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField name="address" label="Address"      fullWidth required value={form.address} onChange={handleChange} />
                    </Grid>
                  </Grid>
                )}

                {activeStep === 1 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField name="program" label="Program" select fullWidth required value={form.program} onChange={handleChange}>
                        {['BBA', 'BCA', 'BBS', 'BCIS', 'MBA', 'MBS'].map((p) => (
                          <MenuItem key={p} value={p}>{p}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField name="lastSchool"  label="Last School/College" fullWidth required value={form.lastSchool}  onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField name="percentage"  label="Percentage / GPA"    fullWidth required value={form.percentage}  onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField name="message" label="Why PMC?" fullWidth multiline rows={3} value={form.message} onChange={handleChange} />
                    </Grid>
                  </Grid>
                )}

                {activeStep === 2 && (
                  <Box>
                    <Typography variant="h6" mb={2}>Review Your Application</Typography>
                    {Object.entries(form).map(([key, val]) => val && (
                      <Typography key={key} variant="body2" mb={0.5}>
                        <strong>{key}:</strong> {val}
                      </Typography>
                    ))}
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button disabled={activeStep === 0} onClick={() => setActiveStep((s) => s - 1)}>
                    Back
                  </Button>
                  {activeStep < steps.length - 1 ? (
                    <Button variant="contained" onClick={() => setActiveStep((s) => s + 1)}>
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" variant="contained" color="success">
                      Submit Application
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
      <Footer />
    </>
  )
}

export default Admissions