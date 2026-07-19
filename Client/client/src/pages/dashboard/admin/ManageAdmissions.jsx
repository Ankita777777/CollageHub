import { useEffect, useState } from 'react'
import {
  Box, Card, CardContent, Typography, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, CircularProgress, Grid, MenuItem,
  Avatar, Divider
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
    designation: 'Lecturer',
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

  const closeDialog = () => {
    setOpen(false)
    setCredentials(null)
    setError('')
    setSelected(null)
  }

  const handleUpdate = async () => {
    setError('')
    try {
      const res = await API.put(`/admissions/${selected._id}`, form)
      if (form.status === 'accepted' && res.data.credentials) {
        setCredentials(res.data.credentials)
        setSuccess(res.data.message)
      } else {
        setSuccess(res.data.message)
        closeDialog()
        setTimeout(() => setSuccess(''), 4000)
      }
      fetchAdmissions()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return
    try {
      await API.delete(`/admissions/${id}`)
      setAdmissions(admissions.filter((a) => a._id !== id))
      setSuccess('Application deleted')
      setTimeout(() => setSuccess(''), 3000)
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
                    <TableCell><strong>Applicant</strong></TableCell>
                    <TableCell><strong>Phone</strong></TableCell>
                    <TableCell><strong>Program</strong></TableCell>
                    <TableCell><strong>Percentage</strong></TableCell>
                    <TableCell><strong>Marksheet</strong></TableCell>
                    <TableCell><strong>Applied On</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {admissions.map((a) => (
                    <TableRow key={a._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 36, height: 36,
                              bgcolor: 'primary.main',
                              fontSize: 14,
                            }}
                          >
                            {a.name?.charAt(0)?.toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {a.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {a.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{a.phone}</TableCell>
                      <TableCell>
                        <Chip label={a.program} size="small" color="primary" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {a.percentage}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {a.marksheet ? (
                          <Button
                            size="small"
                            variant="outlined"
                            href={a.marksheet}
                            target="_blank"
                          >
                            View
                          </Button>
                        ) : (
                          <Typography variant="caption" color="text.disabled">
                            Not uploaded
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {new Date(a.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={a.status}
                          size="small"
                          color={statusColors[a.status]}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
      <Dialog
        open={open}
        onClose={() => { if (!credentials) closeDialog() }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontWeight={700}>
          {credentials
            ? '✅ Account Created'
            : form.status === 'accepted'
            ? '✅ Accept Admission'
            : '❌ Reject Admission'
          }
        </DialogTitle>

        <DialogContent>

          {/* ── Show credentials after accept ── */}
          {credentials ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                {form.role === 'teacher'
                  ? 'Teacher account created successfully!'
                  : 'Student account created successfully!'
                }
              </Alert>

              <Box sx={{
                bgcolor: '#f0f7f0',
                p: 3, borderRadius: 2,
                border: '1px solid #c8e6c9',
              }}>
                <Typography variant="h6" fontWeight={700} mb={2} color="success.main">
                  🔐 Login Credentials
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Role</Typography>
                    <Chip
                      label={credentials.role}
                      size="small"
                      color={credentials.role === 'teacher' ? 'secondary' : 'primary'}
                    />
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body2" fontWeight={600}>{credentials.email}</Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Password</Typography>
                    <Box sx={{
                      bgcolor: '#e8f5e9', px: 1.5, py: 0.5,
                      borderRadius: 1, fontFamily: 'monospace',
                      fontWeight: 700, fontSize: 14,
                    }}>
                      {credentials.password}
                    </Box>
                  </Box>
                  {credentials.rollNo && (
                    <>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Roll No</Typography>
                        <Typography variant="body2" fontWeight={700} color="primary.main">
                          {credentials.rollNo}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>

              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Please share these credentials with the applicant.
                  They can change their password after logging in.
                </Typography>
              </Alert>
            </Box>

          ) : (
            /* ── Accept / Reject form ── */
            <Box>

              {/* Applicant info */}
              <Box sx={{
                bgcolor: '#f5f7fa', p: 2,
                borderRadius: 2, mb: 2,
              }}>
                <Grid container spacing={1}>
                  {[
                    { label: 'Name',       value: selected?.name },
                    { label: 'Email',      value: selected?.email },
                    { label: 'Phone',      value: selected?.phone },
                    { label: 'Program',    value: selected?.program },
                    { label: 'School',     value: selected?.lastSchool },
                    { label: 'Percentage', value: `${selected?.percentage}%` },
                  ].map((info) => (
                    <Grid item xs={6} key={info.label}>
                      <Typography variant="caption" color="text.secondary">
                        {info.label}
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {info.value}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>

                {/* Marksheet */}
                {selected?.marksheet && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Marksheet
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      {selected.marksheet.endsWith('.pdf') ? (
                        <Button
                          variant="outlined"
                          size="small"
                          href={selected.marksheet}
                          target="_blank"
                        >
                          📄 View Marksheet PDF
                        </Button>
                      ) : (
                        <Box
                          component="img"
                          src={selected.marksheet}
                          alt="Marksheet"
                          sx={{
                            width: '100%',
                            maxHeight: 180,
                            objectFit: 'contain',
                            border: '1px solid #eee',
                            borderRadius: 2,
                            cursor: 'pointer',
                          }}
                          onClick={() => window.open(selected.marksheet, '_blank')}
                        />
                      )}
                    </Box>
                  </Box>
                )}

                {!selected?.marksheet && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.disabled">
                      No marksheet uploaded
                    </Typography>
                  </Box>
                )}
              </Box>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              {/* Accept fields */}
              {form.status === 'accepted' && (
                <Box>
                  {/* Role selector */}
                  <TextField
                    label="Accept as"
                    select
                    fullWidth
                    sx={{ mb: 2 }}
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

                  {/* Teacher fields */}
                  {form.role === 'teacher' && (
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <TextField
                          label="Department"
                          fullWidth
                          size="small"
                          value={form.department}
                          onChange={(e) => setForm({ ...form, department: e.target.value })}
                          placeholder="e.g. Computer Science"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Designation"
                          select
                          fullWidth
                          size="small"
                          value={form.designation}
                          onChange={(e) => setForm({ ...form, designation: e.target.value })}
                        >
                          {[
                            'Lecturer',
                            'Assistant Professor',
                            'Associate Professor',
                            'Professor',
                            'HOD',
                          ].map((d) => (
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

              {/* Review note */}
              <TextField
                label={
                  form.status === 'accepted'
                    ? 'Welcome note (optional)'
                    : 'Reason for rejection'
                }
                fullWidth
                multiline
                rows={3}
                value={form.reviewNote}
                onChange={(e) => setForm({ ...form, reviewNote: e.target.value })}
                placeholder={
                  form.status === 'accepted'
                    ? 'e.g. Welcome to PMC College! Your journey begins here.'
                    : 'e.g. Does not meet minimum percentage requirement.'
                }
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          {credentials ? (
            <Button
              variant="contained"
              fullWidth
              onClick={closeDialog}
            >
              Done
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                fullWidth
                color={form.status === 'accepted' ? 'success' : 'error'}
                onClick={handleUpdate}
              >
                Confirm {form.status === 'accepted' ? 'Accept' : 'Reject'}
              </Button>
            </Box>
          )}
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default ManageAdmissions