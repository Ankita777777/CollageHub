import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { submitAdmission, resetAdmission } from '../features/admission/admissionSlice'
import {
  Container, Typography, Box, Grid, Card, CardContent,
  TextField, MenuItem, Button, Alert, Stepper, Step, StepLabel,
  CircularProgress
} from '@mui/material'
import Navbar  from '../components/Navbar'
import Footer  from '../components/Footer'

const steps    = ['Personal Info', 'Academic Info', 'Review & Submit']
const programs = ['BBA', 'BCA', 'BBS', 'BCIS', 'MBA', 'MBS']

const Admissions = () => {
  const dispatch = useDispatch()
  const { loading, error, success } = useSelector((state) => state.admission)

  const [activeStep, setActiveStep] = useState(0)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '',
    program: '', lastSchool: '', percentage: '', message: ''
  })

  useEffect(() => {
    return () => dispatch(resetAdmission())
  }, [dispatch])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleNext = () => setActiveStep((s) => s + 1)
  const handleBack = () => setActiveStep((s) => s - 1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(submitAdmission(form))
  }

  if (success) {
    return (
      <>
        <Navbar />
        <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
          <Alert severity="success" sx={{ fontSize: 16, mb: 3 }}>
            ✅ Application submitted successfully!
            We will contact you within 3-5 working days.
          </Alert>
          <Button variant="contained" href="/">
            Back to Home
          </Button>
        </Container>
        <Footer />
      </>
    )
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

        <Card>
          <CardContent sx={{ p: 4 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>

              {/* Step 1 — Personal Info */}
              {activeStep === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="name" label="Full Name"
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="phone" label="Phone Number"
                      fullWidth required
                      value={form.phone} onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="address" label="Address"
                      fullWidth required
                      value={form.address} onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              )}

              {/* Step 2 — Academic Info */}
              {activeStep === 1 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="program" label="Program" select
                      fullWidth required
                      value={form.program} onChange={handleChange}
                    >
                      {programs.map((p) => (
                        <MenuItem key={p} value={p}>{p}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="lastSchool" label="Last School/College"
                      fullWidth required
                      value={form.lastSchool} onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="percentage" label="Percentage / GPA"
                      fullWidth required
                      value={form.percentage} onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="message" label="Why do you want to join PMC?"
                      fullWidth multiline rows={3}
                      value={form.message} onChange={handleChange}
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
                  <Grid container spacing={1}>
                    {Object.entries(form).map(([key, val]) => val && (
                      <Grid item xs={12} sm={6} key={key}>
                        <Typography variant="body2">
                          <strong style={{ textTransform: 'capitalize' }}>
                            {key}:
                          </strong>{' '}
                          {val}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                >
                  Back
                </Button>

                {activeStep < steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={
                      activeStep === 0
                        ? !form.name || !form.email || !form.phone || !form.address
                        : !form.program || !form.lastSchool || !form.percentage
                    }
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    disabled={loading}
                  >
                    {loading
                      ? <CircularProgress size={22} color="inherit" />
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