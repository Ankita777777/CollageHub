import { useEffect, useState } from 'react'
import {
  Box, Card, CardContent, Typography, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, CircularProgress, MenuItem, Grid
} from '@mui/material'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const statusColors = {
  pending:   'warning',
  reviewing: 'info',
  accepted:  'success',
  rejected:  'error',
}

const ManageAdmissions = () => {
  const [admissions, setAdmissions] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [selected,   setSelected]   = useState(null)
  const [open,       setOpen]       = useState(false)
  const [success,    setSuccess]    = useState('')
  const [error,      setError]      = useState('')
  const [form,       setForm]       = useState({
    status: '', reviewNote: '', semester: 1, batch: ''
  })

  const fetchAdmissions = async () => {
    setLoading(true)
    try {
      const res = await API.get('/admissions')
      setAdmissions(res.data)
    } catch (err) {
      setError('Failed to fetch admissions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmissions()
  }, [])

  const openDialog = (admission, action) => {
    setSelected(admission)
    setForm({
      status:     action,
      reviewNote: '',
      semester:   1,
      batch:      `${new Date().getFullYear()}-${new Date().getFullYear() + 4}`,
    })
    setOpen(true)
  }

  const handleUpdate = async () => {
    setError('')
    try {
      const res = await API.put(`/admissions/${selected._id}`, form)
      setSuccess(res.data.message)

      // Show login credentials if accepted
      if (form.status === 'accepted' && res.data.loginEmail) {
        setSuccess(
          `✅ Student account created!\n` +
          `Email: ${res.data.loginEmail}\n` +
          `Password: ${res.data.loginPassword}\n` +
          `Roll No: ${res.data.rollNo}`
        )
      }

      setOpen(false)
      fetchAdmissions()
      setTimeout(() => setSuccess(''), 8000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return
    try {
      await API.delete(`/admissions/${id}`)
      setAdmissions(admissions.filter((a) => a._id !== id))
    } catch (err) {
      setError('Failed to delete')
    }
  }

  const pending  = admissions.filter((a) => a.status === 'pending').length
  const accepted = admissions.filter((a) => a.status === 'accepted').length
  const rejected = admissions.filter((a) => a.status === 'rejected').length

  return (
    <Layout role="admin">
      <Typography variant="h5" fontWeight={700} mb={3}>
        Manage Admissions
      </Typography>

      {/* Stats */}
      <Grid container spacing={2} mb={3}>
        {[
          { label: 'Total',    value: admissions.length, color: 'primary' },
          { label: 'Pending',  value: pending,           color: 'warning' },
          { label: 'Accepted', value: accepted,          color: 'success' },
          { label: 'Rejected', value: rejected,          color: 'error'   },
        ].map((s) => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={700} color={`${s.color}.main`}>
                  {s.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">{s.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {success && (
        <Alert severity="success" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
          {success}
        </Alert>
      )}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          {loading ? (
            <Box textAlign="center" py={4}><CircularProgress /></Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Phone</strong></TableCell>
                  <TableCell><strong>Program</strong></TableCell>
                  <TableCell><strong>Percentage</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admissions.map((a) => (
                  <TableRow key={a._id}>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>{a.email}</TableCell>
                    <TableCell>{a.phone}</TableCell>
                    <TableCell>{a.program}</TableCell>
                    <TableCell>{a.percentage}%</TableCell>
                    <TableCell>
                      <Chip
                        label={a.status}
                        size="small"
                        color={statusColors[a.status]}
                      />
                    </TableCell>
                    <TableCell>
                      {a.status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small" variant="contained" color="success"
                            onClick={() => openDialog(a, 'accepted')}
                          >
                            Accept
                          </Button>
                          <Button
                            size="small" variant="outlined" color="error"
                            onClick={() => openDialog(a, 'rejected')}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                      {a.status !== 'pending' && (
                        <Button
                          size="small" color="error"
                          onClick={() => handleDelete(a._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {!admissions.length && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No applications yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Accept/Reject Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {form.status === 'accepted' ? '✅ Accept' : '❌ Reject'} Application
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Applicant: <strong>{selected?.name}</strong> |
            Program: <strong>{selected?.program}</strong>
          </Typography>

          {form.status === 'accepted' && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  label="Starting Semester" type="number"
                  fullWidth size="small"
                  value={form.semester}
                  onChange={(e) => setForm({ ...form, semester: e.target.value })}
                  inputProps={{ min: 1, max: 8 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Batch" fullWidth size="small"
                  value={form.batch}
                  onChange={(e) => setForm({ ...form, batch: e.target.value })}
                  placeholder="2024-2028"
                />
              </Grid>
            </Grid>
          )}

          <TextField
            label="Note to applicant (optional)"
            fullWidth multiline rows={3}
            value={form.reviewNote}
            onChange={(e) => setForm({ ...form, reviewNote: e.target.value })}
          />

          {form.status === 'accepted' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              This will automatically create a student account.
              Default password will be <strong>PMC@[last 4 digits of phone]</strong>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color={form.status === 'accepted' ? 'success' : 'error'}
            onClick={handleUpdate}
          >
            Confirm {form.status === 'accepted' ? 'Accept' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default ManageAdmissions