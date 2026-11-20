import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { applyLeave, fetchLeaves } from '../../../features/student/studentSlice'
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Alert, Grid, CircularProgress, Chip, Table,
  TableHead, TableRow, TableCell, TableBody
} from '@mui/material'
import Layout from '../../../components/Layout'

const Leave = () => {
  const dispatch = useDispatch()
  const { leaves, loading, error } = useSelector((state) => state.student)
  const [success, setSuccess] = useState('')
  const [errors,  setErrors]  = useState({})
  const [form,    setForm]    = useState({ fromDate: '', toDate: '', reason: '' })

  useEffect(() => { dispatch(fetchLeaves()) }, [dispatch])

  const validate = () => {
    const errs = {}
    if (!form.fromDate)                         errs.fromDate = 'From date is required'
    if (!form.toDate)                           errs.toDate   = 'To date is required'
    if (form.fromDate && form.toDate && new Date(form.fromDate) > new Date(form.toDate)) {
      errs.toDate = 'To date must be after from date'
    }
    if (!form.reason?.trim() || form.reason.trim().length < 5) {
      errs.reason = 'Reason must be at least 5 characters'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const result = await dispatch(applyLeave(form))
    if (applyLeave.fulfilled.match(result)) {
      setSuccess('Leave applied successfully!')
      setForm({ fromDate: '', toDate: '', reason: '' })
      dispatch(fetchLeaves())
      setTimeout(() => setSuccess(''), 4000)
    }
  }

  const getDays = (from, to) =>
    Math.ceil((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)) + 1

  return (
    <Layout role="student">
      <Typography variant="h5" fontWeight={700} mb={3}>Leave Application</Typography>

      <Grid container spacing={3}>
        {/* Form */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>Apply for Leave</Typography>

              {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  label="From Date" type="date" fullWidth margin="normal"
                  InputLabelProps={{ shrink: true }}
                  value={form.fromDate}
                  onChange={(e) => { setForm({ ...form, fromDate: e.target.value }); setErrors({ ...errors, fromDate: '' }) }}
                  error={Boolean(errors.fromDate)}
                  helperText={errors.fromDate}
                  inputProps={{ min: new Date().toISOString().split('T')[0] }}
                />
                <TextField
                  label="To Date" type="date" fullWidth margin="normal"
                  InputLabelProps={{ shrink: true }}
                  value={form.toDate}
                  onChange={(e) => { setForm({ ...form, toDate: e.target.value }); setErrors({ ...errors, toDate: '' }) }}
                  error={Boolean(errors.toDate)}
                  helperText={errors.toDate}
                  inputProps={{ min: form.fromDate || new Date().toISOString().split('T')[0] }}
                />
                <TextField
                  label="Reason *" fullWidth margin="normal" multiline rows={4}
                  value={form.reason}
                  onChange={(e) => { setForm({ ...form, reason: e.target.value }); setErrors({ ...errors, reason: '' }) }}
                  error={Boolean(errors.reason)}
                  helperText={errors.reason || 'Minimum 5 characters'}
                  placeholder="Explain your reason for leave..."
                />
                {form.fromDate && form.toDate && new Date(form.fromDate) <= new Date(form.toDate) && (
                  <Alert severity="info" sx={{ mb: 1 }}>
                    Duration: <strong>{getDays(form.fromDate, form.toDate)} day(s)</strong>
                  </Alert>
                )}
                <Button
                  type="submit" variant="contained"
                  fullWidth size="large" sx={{ mt: 1 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={22} color="inherit" /> : 'Submit Application'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* History */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Leave History ({leaves.length})
              </Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>From</strong></TableCell>
                      <TableCell><strong>To</strong></TableCell>
                      <TableCell><strong>Days</strong></TableCell>
                      <TableCell><strong>Reason</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaves.map((l) => (
                      <TableRow key={l._id} hover>
                        <TableCell>{new Date(l.fromDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(l.toDate).toLocaleDateString()}</TableCell>
                        <TableCell>{getDays(l.fromDate, l.toDate)}</TableCell>
                        <TableCell sx={{ maxWidth: 150 }}>
                          <Typography variant="body2" noWrap>{l.reason}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Chip
                              label={l.status}
                              size="small"
                              color={l.status === 'approved' ? 'success' : l.status === 'rejected' ? 'error' : 'warning'}
                            />
                            {l.reviewNote && (
                              <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                                {l.reviewNote}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!leaves.length && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          No leave applications yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Leave