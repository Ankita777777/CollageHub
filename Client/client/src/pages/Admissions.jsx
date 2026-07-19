import { useState } from 'react'
import API from '../api/axios'
import {
  Box, Container, Typography, Card, CardContent,
  Grid, TextField, MenuItem, Button, Alert,
  CircularProgress, Stepper, Step, StepLabel
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const programs = ['BBA', 'BCA', 'BBS', 'BCIS', 'MBA', 'MBS']
const steps    = ['Personal Info', 'Academic Info', 'Review & Submit']

const Admissions = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [loading,    setLoading]    = useState(false)
  const [success,    setSuccess]    = useState(false)
  const [error,      setError]      = useState('')
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '',
    program: '', lastSchool: '', percentage: '', message: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleNext = () => {
    // Validate step 1
    if (activeStep === 0) {
      if (!form.name || !form.email || !form.phone || !form.address) {
        setError('Please fill all fields')
        return
      }
    }
    // Validate step 2
    if (activeStep === 1) {
      if (!form.program || !form.lastSchool || !form.percentage) {
        setError('Please fill all fields')
        return
      }
    }
    setError('')
    setActiveStep((s) => s + 1)
  }

  const handleBack = () => {
    setError('')
    setActiveStep((s) => s - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await API.post('/admissions', form)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // Success screen
  if (success) {
    return (
      <>
        <Navbar />
        <Container maxWidth="sm" sx={{ py: 10 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" fontWeight={700} mb={2}>
                Application Submitted!
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={1}>
                Thank you <strong>{form.name}</strong>!
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                We received your application for <strong>{form.program}</strong>.
                Our team will review and contact you at{' '}
                <strong>{form.email}</strong> within 3-5 working days.
              </Typography>
              <Alert severity="info" sx={{ textAlign: 'left', mb: 3 }}>
                Once your admission is accepted, you will receive your
                login credentials to access the student portal.
              </Alert>
              <Button variant="contained" href="/" size="large">
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </Container>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight={700}>Apply for Admission</Typography>
        <Typography sx={{ opacity: 0.8, mt: 1 }}>Academic Year 2081/82</Typography>
      </Box>

      <Container maxWidth="md" sx={{ py: 6 }}>
        {/* Steps */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        <Card>
          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>

              {/* Step 1 — Personal Info */}
              {activeStep === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight={600} mb={1}>
                      Personal Information
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="name" label="Full Name"
                      fullWidth required
                      value={form.name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="email" label="Email Address"
                      type="email" fullWidth required
                      value={form.email}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="phone" label="Phone Number"
                      fullWidth required
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="address" label="Address"
                      fullWidth required
                      value={form.address}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              )}

              {/* Step 2 — Academic Info */}
              {activeStep === 1 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight={600} mb={1}>
                      Academic Information
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="program" label="Select Program"
                      select fullWidth required
                      value={form.program}
                      onChange={handleChange}
                    >
                      {programs.map((p) => (
                        <MenuItem key={p} value={p}>{p}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="lastSchool" label="Last School / College"
                      fullWidth required
                      value={form.lastSchool}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="percentage" label="Percentage / GPA"
                      fullWidth required
                      value={form.percentage}
                      onChange={handleChange}
                    />
                  </Grid>
                  // Add this to step 2 in Admissions.jsx (Academic Info section)
// After percentage field add:

<Grid item xs={12}>
  <Typography variant="body2" color="text.secondary" mb={1}>
    Upload Marksheet (JPG, PNG or PDF, max 5MB)
  </Typography>
  <Box sx={{
    border: '2px dashed #ccc',
    borderRadius: 2, p: 3,
    textAlign: 'center',
    bgcolor: marksheet ? '#f0f7f0' : '#fafafa',
    cursor: 'pointer',
  }}>
    <input
      type="file"
      accept=".jpg,.jpeg,.png,.pdf"
      onChange={(e) => setMarksheet(e.target.files[0])}
      style={{ display: 'none' }}
      id="marksheet-upload"
    />
    <label htmlFor="marksheet-upload" style={{ cursor: 'pointer' }}>
      {marksheet ? (
        <Typography variant="body2" color="success.main" fontWeight={600}>
          ✅ {marksheet.name}
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary">
          📎 Click to upload marksheet
        </Typography>
      )}
    </label>
  </Box>
</Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="message"
                      label="Why do you want to join PMC? (Optional)"
                      fullWidth multiline rows={3}
                      value={form.message}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              )}

              {/* Step 3 — Review */}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Review Your Application
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      { label: 'Full Name',    value: form.name },
                      { label: 'Email',        value: form.email },
                      { label: 'Phone',        value: form.phone },
                      { label: 'Address',      value: form.address },
                      { label: 'Program',      value: form.program },
                      { label: 'Last School',  value: form.lastSchool },
                      { label: 'Percentage',   value: form.percentage },
                      { label: 'Message',      value: form.message || 'N/A' },
                    ].map((item) => (
                      <Grid item xs={12} sm={6} key={item.label}>
                        <Box sx={{ p: 1.5, bgcolor: '#f5f7fa', borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            {item.label}
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {item.value}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  <Alert severity="info" sx={{ mt: 3 }}>
                    Please review your details before submitting.
                    After submission, wait for admin approval.
                  </Alert>
                </Box>
              )}

              {/* Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  variant="outlined"
                  size="large"
                >
                  Back
                </Button>

                {activeStep < steps.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    size="large"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    size="large"
                    disabled={loading}
                  >
                    {loading
                      ? <CircularProgress size={24} color="inherit" />
                      : 'Submit Application'
                    }
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </>
  )
}

export default Admissions