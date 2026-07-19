import { useEffect, useState } from 'react'
import {
  Box, Card, CardContent, Typography, Table,
  TableHead, TableRow, TableCell, TableBody,
  Chip, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField,
  Alert, CircularProgress, Grid, MenuItem
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
    status:      '',
    reviewNote:  '',
    role:        'student',
    semester:    1,
    batch:       '',
    department:  '',
    designation: '',
  })

  const fetchAdmissions = async () => {
    setLoading(true)
    try {
      const res = await API.get('/admissions')
      setAdmissions(res.data)
    } catch (err) {
      setError('Failed to load')
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
      status:      action,
      reviewNote:  '',
      role:        'student',
      semester:    1,
      batch:       `${year}-${year + 4}`,
      department:  '',
      designation: 'Lecturer',
    })
    setOpen(true)
  }

  const handleUpdate = async () => {
    setError('')
    try {
      const res = await API.put(`/admissions/${selected._id}`, form)
      if (res.data.credentials) {
        setCredentials(res.data.credentials)
        setSuccess(res.data.message)
      } else {
        setSuccess(res.data.message)
        setOpen(false)
        setTimeout(() => setSuccess(''), 4000)
      }
      fetchAdmissions()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return
    await API.delete(`/admissions/${id}`)
    setAdmissions(admissions.filter((a) => a._id !== id))
  }

  return (
    <Layout role="admin">
      <Typography variant="h5" fontWeight={700} mb={3}>
        Admission Applications
      </Typography>

      {/* Stats */}
      <Grid container spacing={2} mb={3}>
        {[
          { label: 'Total',    value: admissions.length,                                      color: '#1565C0' },
          { label: 'Pending',  value: admissions.filter(a => a.status === 'pending').length,  color: '#E65100' },
          { label: 'Accepted', value: admissions.filter(a => a.status === 'accepted').length, color: '#2E7D32' },
          { label: 'Rejected', value: admissions.filter(a => a.status === 'rejected').length, color: '#C62828' },
        ].map((s) => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" fontWeight={700} sx={{ color: s.color }}>
                  {s.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">{s.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}

      {/* Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box textAlign="center" py={6}><CircularProgress /></Box>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Phone</strong></TableCell>
                    <TableCell><strong>Program</strong></TableCell>
                    <TableCell><strong>%</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
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
                            </>
                          )}
                          {a.status === 'accepted' && (
                            <Chip label="Enrolled" size="small" color="success" variant="outlined" />
                          )}
                          {a.status === 'rejected' && (
                            <Button size="small" color="error" onClick={() => handleDelete(a._id)}>
                              Delete
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!admissions.length && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
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

      {/* Dialog */}
      <Dialog
        open={open}
        onClose={() => { if (!credentials) setOpen(false) }}
        maxWidth="sm" fullWidth
      >
        <DialogTitle fontWeight={700}>
          {form.status === 'accepted' ? '✅ Accept' : '❌ Reject'} Application
        </DialogTitle>

        <DialogContent>
          {/* Show credentials */}
          {credentials ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                Account created successfully!
              </Alert>
              <Box sx={{ bgcolor: '#f0f7f0', p: 3, borderRadius: 2, border: '1px solid #c8e6c9' }}>
                <Typography variant="h6" fontWeight={700} mb={2} color="success.main">
                  Login Credentials
                </Typography>
                <Typography variant="body1" mb={1}>
                  <strong>Role:</strong>{' '}
                  <Chip
                    label={credentials.role}
                    size="small"
                    color={credentials.role === 'teacher' ? 'secondary' : 'primary'}
                  />
                </Typography>
                <Typography variant="body1" mb={1}>
                  <strong>Email:</strong> {credentials.email}
                </Typography>
                <Typography variant="body1" mb={1}>
                  <strong>Password:</strong>{' '}
                  <code style={{ background: '#e8f5e9', padding: '2px 8px', borderRadius: 4 }}>
                    {credentials.password}
                  </code>
                </Typography>
                {credentials.rollNo && (
                  <Typography variant="body1">
                    <strong>Roll No:</strong> {credentials.rollNo}
                  </Typography>
                )}
              </Box>
              <Alert severity="warning" sx={{ mt: 2 }}>
                Share these credentials with the applicant.
                They can change password after logging in.
              </Alert>
            </Box>
          ) : (
            <Box>
              {/* Applicant info */}
              <Box sx={{ bgcolor: '#f5f7fa', p: 2, borderRadius: 2, mb: 2 }}>
                <Typography variant="body2">
                  <strong>Name:</strong> {selected?.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {selected?.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong> {selected?.phone}
                </Typography>
                <Typography variant="body2">
                  <strong>Program:</strong> {selected?.program}
                </Typography>
              </Box>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              {form.status === 'accepted' && (
                <Box>
                  {/* Role selector */}
                  <TextField
                    label="Accept as"
                    select fullWidth sx={{ mb: 2 }}
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="teacher">Teacher</MenuItem>
                  </TextField>

                  {/* Student fields */}
                  {form.role === 'student' && (
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <TextField
                          label="Semester" type="number"
                          fullWidth size="small"
                          value={form.semester}
                          onChange={(e) => setForm({ ...form, semester: e.target.value })}
                          inputProps={{ min: 1, max: 8 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Batch e.g. 2024-2028"
                          fullWidth size="small"
                          value={form.batch}
                          onChange={(e) => setForm({ ...form, batch: e.target.value })}
                        />
                      </Grid>
                    </Grid>
                  )}

                  {/* Teacher fields */}
                  {form.role === 'teacher' && (
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <TextField
                          label="Department"
                          fullWidth size="small"
                          value={form.department}
                          onChange={(e) => setForm({ ...form, department: e.target.value })}
                          placeholder="e.g. Computer Science"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Designation" select
                          fullWidth size="small"
                          value={form.designation}
                          onChange={(e) => setForm({ ...form, designation: e.target.value })}
                        >
                          {['Lecturer', 'Assistant Professor', 'Associate Professor', 'Professor', 'HOD'].map((d) => (
                            <MenuItem key={d} value={d}>{d}</MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                  )}

                  <Alert severity="info" sx={{ mb: 2 }}>
                    Default password will be:{' '}
                    <strong>PMC@{selected?.phone?.slice(-4)}</strong>
                  </Alert>
                </Box>
              )}

              <TextField
                label={form.status === 'accepted' ? 'Welcome note (optional)' : 'Reason for rejection'}
                fullWidth multiline rows={3}
                value={form.reviewNote}
                onChange={(e) => setForm({ ...form, reviewNote: e.target.value })}
              />
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