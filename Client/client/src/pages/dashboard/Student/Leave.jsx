import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { applyLeave } from '../../../features/student/studentSlice'
import API from '../../../api/axios'
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Table, TableHead, TableRow, TableCell,
  TableBody, Chip, Alert, CircularProgress, Grid
} from '@mui/material'
import Layout from '../../../components/Layout'

const Leave = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.student)
  const [leaves,  setLeaves]  = useState([])
  const [success, setSuccess] = useState('')
  const [error,   setError]   = useState('')
  const [form,    setForm]    = useState({ fromDate: '', toDate: '', reason: '' })

  const fetchLeaves = async () => {
    const res = await API.get('/students/leave')
    setLeaves(res.data)
  }

  useEffect(() => {
    fetchLeaves()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await dispatch(applyLeave(form)).unwrap()
      setSuccess('Leave application submitted successfully!')
      setForm({ fromDate: '', toDate: '', reason: '' })
      fetchLeaves()
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err || 'Failed to apply leave')
    }
  }

  const statusColor = { pending: 'warning', approved: 'success', rejected: 'error' }

  return (
    <Layout role="student">
      <Typography variant="h5" fontWeight={700} mb={3}>Leave Application</Typography>

      <Grid container spacing={3}>
        {/* Apply Form */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>Apply for Leave</Typography>
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  label="From Date" type="date" fullWidth margin="normal"
                  InputLabelProps={{ shrink: true }}
                  value={form.fromDate}
                  onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                  required
                />
                <TextField
                  label="To Date" type="date" fullWidth margin="normal"
                  InputLabelProps={{ shrink: true }}
                  value={form.toDate}
                  onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                  required
                />
                <TextField
                  label="Reason" fullWidth margin="normal" multiline rows={4}
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  required
                />
                <Button
                  type="submit" variant="contained" fullWidth
                  sx={{ mt: 1 }} disabled={loading}
                >
                  {loading ? <CircularProgress size={22} color="inherit" /> : 'Submit Application'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Leave History */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>My Leave History</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>From</strong></TableCell>
                    <TableCell><strong>To</strong></TableCell>
                    <TableCell><strong>Reason</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Note</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaves.map((l) => (
                    <TableRow key={l._id}>
                      <TableCell>{new Date(l.fromDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(l.toDate).toLocaleDateString()}</TableCell>
                      <TableCell sx={{ maxWidth: 150 }}>{l.reason}</TableCell>
                      <TableCell>
                        <Chip
                          label={l.status}
                          size="small"
                          color={statusColor[l.status]}
                        />
                      </TableCell>
                      <TableCell>{l.reviewNote || '-'}</TableCell>
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Leave