import { useState } from 'react'
import {
  Box, Container, Typography, Card, CardContent,
  TextField, Button, Alert, CircularProgress,
  Table, TableHead, TableRow, TableCell, TableBody,
  Chip, Grid, Divider
} from '@mui/material'
import SearchIcon      from '@mui/icons-material/Search'
import SchoolIcon      from '@mui/icons-material/School'
import API    from '../api/axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const getGradeColor = (grade) => {
  if (['A+', 'A'].includes(grade)) return 'success'
  if (['B+', 'B'].includes(grade)) return 'primary'
  if (['C', 'D'].includes(grade))  return 'warning'
  return 'error'
}

const ResultCheck = () => {
  const [form,    setForm]    = useState({ rollNo: '', dob: '' })
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [errors,  setErrors]  = useState({})

  const validate = () => {
    const errs = {}
    if (!form.rollNo.trim()) errs.rollNo = 'Roll number is required'
    if (!form.dob)           errs.dob    = 'Date of birth is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleCheck = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await API.post('/results/check', form)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Result not found')
    } finally {
      setLoading(false)
    }
  }

  const totalMarks   = result?.results?.reduce((s, r) => s + (r.marks || 0), 0)
  const avgMarks     = result?.results?.length ? (totalMarks / result.results.length).toFixed(1) : 0
  const passedCount  = result?.results?.filter((r) => r.status === 'pass').length
  const failedCount  = result?.results?.filter((r) => r.status === 'fail').length

  return (
    <>
      <Navbar />

      {/* Hero */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0D47A1, #1E88E5)',
        color: 'white', py: 8, textAlign: 'center',
      }}>
        <SchoolIcon sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="h3" fontWeight={800} mb={1}>Result Portal</Typography>
        <Typography variant="h6" sx={{ opacity: 0.8 }}>
          Check your academic results online
        </Typography>
      </Box>

      <Container maxWidth="md" sx={{ py: 6 }}>
        {/* Search Form */}
        <Card sx={{ mb: 4, borderTop: '4px solid #1565C0' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} mb={1}>
              Check Your Result
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Enter your roll number and date of birth to view your results
            </Typography>

            <Box component="form" onSubmit={handleCheck}>
              <Grid container spacing={2} alignItems="flex-start">
                <Grid item xs={12} sm={5}>
                  <TextField
                    label="Roll Number"
                    fullWidth
                    value={form.rollNo}
                    onChange={(e) => {
                      setForm({ ...form, rollNo: e.target.value })
                      setErrors({ ...errors, rollNo: '' })
                    }}
                    error={Boolean(errors.rollNo)}
                    helperText={errors.rollNo || 'e.g. BCA20240001'}
                    placeholder="Enter your roll number"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Date of Birth"
                    type="date"
                    fullWidth
                    value={form.dob}
                    onChange={(e) => {
                      setForm({ ...form, dob: e.target.value })
                      setErrors({ ...errors, dob: '' })
                    }}
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.dob)}
                    helperText={errors.dob || 'For verification'}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    startIcon={loading
                      ? <CircularProgress size={20} color="inherit" />
                      : <SearchIcon />
                    }
                    sx={{ height: 56 }}
                  >
                    {loading ? 'Checking...' : 'Check Result'}
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
            )}
          </CardContent>
        </Card>

        {/* Result Display */}
        {result && (
          <Box>
            {/* Student Info */}
            <Card sx={{ mb: 3, bgcolor: '#f0f7ff', border: '1px solid #bbdefb' }}>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  {[
                    { label: 'Student Name', value: result.student?.name },
                    { label: 'Roll No',      value: result.student?.rollNo },
                    { label: 'Program',      value: result.student?.program },
                    { label: 'Semester',     value: `Semester ${result.student?.semester}` },
                  ].map((item) => (
                    <Grid item xs={6} sm={3} key={item.label}>
                      <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                      <Typography variant="body1" fontWeight={700}>{item.value}</Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Summary */}
            <Grid container spacing={2} mb={3}>
              {[
                { label: 'Total Subjects', value: result.results?.length,  color: '#1565C0' },
                { label: 'Passed',         value: passedCount,             color: '#2E7D32' },
                { label: 'Failed',         value: failedCount,             color: '#C62828' },
                { label: 'Average',        value: `${avgMarks}%`,          color: '#E65100' },
              ].map((s) => (
                <Grid item xs={6} sm={3} key={s.label}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="h4" fontWeight={800} sx={{ color: s.color }}>
                        {s.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Results Table */}
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={2}>Subject-wise Results</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                      <TableCell><strong>Subject</strong></TableCell>
                      <TableCell><strong>Code</strong></TableCell>
                      <TableCell><strong>Credit Hrs</strong></TableCell>
                      <TableCell align="center"><strong>Marks</strong></TableCell>
                      <TableCell align="center"><strong>Grade</strong></TableCell>
                      <TableCell align="center"><strong>Status</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result.results?.map((r) => (
                      <TableRow key={r._id} hover
                        sx={{ bgcolor: r.status === 'fail' ? '#fff3f3' : 'inherit' }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {r.course?.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={r.course?.code} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="center">{r.course?.creditHours}</TableCell>
                        <TableCell align="center">
                          <Typography variant="body1" fontWeight={700}>
                            {r.marks}/100
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={r.grade}
                            size="small"
                            color={getGradeColor(r.grade)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={r.status === 'pass' ? '✅ Pass' : '❌ Fail'}
                            size="small"
                            color={r.status === 'pass' ? 'success' : 'error'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="body1">
                    Total Marks:{' '}
                    <strong>{totalMarks}/{(result.results?.length || 0) * 100}</strong>{' '}
                    | Average:{' '}
                    <strong style={{ color: avgMarks >= 40 ? 'green' : 'red' }}>
                      {avgMarks}%
                    </strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Container>
      <Footer />
    </>
  )
}

export default ResultCheck