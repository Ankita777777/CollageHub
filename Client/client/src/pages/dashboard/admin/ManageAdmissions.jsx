import { useEffect, useState } from 'react'
import {
  Box, Card, CardContent, Typography, Table,
  TableHead, TableRow, TableCell, TableBody,
  Chip, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField,
  Alert, CircularProgress, MenuItem, Grid
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
  const [admissions,  setAdmissions]  = useState([])
  const [loading,     setLoading]     = useState(true)
  const [selected,    setSelected]    = useState(null)
  const [open,        setOpen]        = useState(false)
  const [success,     setSuccess]     = useState('')
  const [error,       setError]       = useState('')
  const [credentials, setCredentials] = useState(null)
  const [form, setForm] = useState({
    status: '', reviewNote: '', semester: 1, batch: ''
  })

  const fetchAdmissions = async () => {
    setLoading(true)
    try {
      const res = await API.get('/admissions')
      setAdmissions(res.data)
    } catch (err) {
      setError('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmissions()
  }, [])

  const openDialog = (admission, action) => {
    setSelected(admission)
    setCredentials(null)
    setError('')
    const year = new Date().getFullYear()
    setForm({
      status:     action,
      reviewNote: '',
      semester:   1,
      batch:      `${year}-${year + 4}`,
    })
    setOpen(true)
  }

  const handleUpdate = async () => {
    setError('')
    try {
      const res = await API.put(`/admissions/${selected._id}`, form)

      // If accepted show credentials
      if (form.status === 'accepted' && res.data.credentials) {
        setCredentials(res.data.credentials)
        setSuccess('Student account created successfully!')
      } else {
        setSuccess(res.data.message)
        setOpen(false)
      }

      fetchAdmissions()
      if (!res.data.credentials) {
        setTimeout(() => setSuccess(''), 4000)
      }
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

  const counts = {
    total:    admissions.length,
    pending:  admissions.filter((a) => a.status === 'pending').length,
    accepted: admissions.filter((a) => a.status === 'accepted').length,
    rejected: admissions.filter((a) => a.status === 'rejected').length,
  }

  return (
    <Layout role="admin">
      <Typography variant="h5" fontWeight={700} mb={3}>
        Admission Applications
      </Typography>

      {/* Stats */}
      <Grid container spacing={2} mb={3}>
        {[
          { label: 'Total',    value: counts.total,    color: '#1565C0' },
          { label: 'Pending',  value: counts.pending,  color: '#E65100' },
          { label: 'Accepted', value: counts.accepted, color: '#2E7D32' },
          { label: 'Rejected', value: counts.rejected, color: '#C62828' },
        ].map((s) => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" fontWeight={700} sx={{ color: s.color }}>
                  {s.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {s.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      {/* Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box textAlign="center" py={6}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Phone</strong></TableCell>
                    <TableCell><strong>Program</strong></TableCell>
                    <TableCell><strong>Percentage</strong></TableCell>
                    <TableCell><strong>Applied On</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {admissions.map((a) => (
                    <TableRow key={a._id} hover>
                      <TableCell>{a.name}</TableCell>
                      <TableCell>{a.email}</TableCell>
                      <TableCell>{a.phone}</TableCell>
                      <TableCell>
                        <Chip label={a.program} size="small" color="primary" />
                      </TableCell>
                      <TableCell>{a.percentage}%</TableCell>
                      <TableCell>
                        {new Date(a.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={a.status}
                          size="small"
                          color={statusColors[a.status]}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {a.status === 'pending' && (
                            <>
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() => openDialog(a, 'accepted')}
                              >
                                Accept
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => openDialog(a, 'rejected')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {a.status === 'accepted' && (
                            <Chip
                              label="Enrolled"
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          )}
                          {a.status === 'rejected' && (
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleDelete(a._id)}
                            >
                              Delete
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {admissions.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        align="center"
                        sx={{ py: 6, color: 'text.secondary' }}
                      >
                        No applications yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Accept / Reject Dialog */}
      <Dialog open={open} onClose={() => {
        if (!credentials) setOpen(false)
      }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {form.status === 'accepted'
            ? '✅ Accept Admission'
            : '❌ Reject Admission'
          }
        </DialogTitle>

        <DialogContent>
          {/* Show credentials after accept */}
          {credentials ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                Student account created successfully!
              </Alert>
              <Box sx={{ bgcolor: '#f5f7fa', p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  Student Login Credentials
                </Typography>
                <Typography variant="body1" mb={1}>
                  <strong>Email:</strong> {credentials.email}
                </Typography>
                <Typography variant="body1" mb={1}>
                  <strong>Password:</strong> {credentials.password}
                </Typography>
                <Typography variant="body1" mb={1}>
                  <strong>Roll No:</strong> {credentials.rollNo}
                </Typography>
              </Box>
              <Alert severity="warning" sx={{ mt: 2 }}>
                Please share these credentials with the student.
                They can change their password after logging in.
              </Alert>
            </Box>
          ) : (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Applicant: <strong>{selected?.name}</strong> |
                Program: <strong>{selected?.program}</strong> |
                Phone: <strong>{selected?.phone}</strong>
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
              )}

              {form.status === 'accepted' && (
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      label="Starting Semester"
                      type="number"
                      fullWidth
                      size="small"
                      value={form.semester}
                      onChange={(e) => setForm({ ...form, semester: e.target.value })}
                      inputProps={{ min: 1, max: 8 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Batch e.g. 2024-2028"
                      fullWidth
                      size="small"
                      value={form.batch}
                      onChange={(e) => setForm({ ...form, batch: e.target.value })}
                    />
                  </Grid>
                </Grid>
              )}

              <TextField
                label="Note (optional)"
                fullWidth
                multiline
                rows={3}
                value={form.reviewNote}
                onChange={(e) => setForm({ ...form, reviewNote: e.target.value })}
                placeholder={
                  form.status === 'accepted'
                    ? 'Welcome message...'
                    : 'Reason for rejection...'
                }
              />

              {form.status === 'accepted' && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  This will automatically:
                  <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                    <li>Create a student account</li>
                    <li>Generate a roll number</li>
                    <li>Set default password: PMC@[last 4 digits of phone]</li>
                  </ul>
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          {credentials ? (
            <Button
              variant="contained"
              onClick={() => {
                setCredentials(null)
                setOpen(false)
              }}
            >
              Done
            </Button>
          ) : (
            <>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                color={form.status === 'accepted' ? 'success' : 'error'}
                onClick={handleUpdate}
              >
                Confirm {form.status === 'accepted' ? 'Accept' : 'Reject'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default ManageAdmissions