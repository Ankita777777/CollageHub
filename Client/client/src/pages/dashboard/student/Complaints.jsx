import { useState, useEffect } from 'react'
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Alert, Grid, MenuItem, CircularProgress,
  List, ListItem, Chip, FormControlLabel, Switch,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const categories = ['academic', 'facility', 'teacher', 'fee', 'hostel', 'other']
const priorities = ['low', 'medium', 'high']

const statusColors = {
  pending:   'warning',
  reviewing: 'info',
  resolved:  'success',
  rejected:  'error',
}

const priorityColors = {
  low: 'default', medium: 'warning', high: 'error'
}

const Complaints = () => {
  const [complaints, setComplaints] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [open,       setOpen]       = useState(false)
  const [success,    setSuccess]    = useState('')
  const [errors,     setErrors]     = useState({})
  const [submitLoad, setSubmitLoad] = useState(false)
  const [form, setForm] = useState({
    title:       '',
    category:    'academic',
    description: '',
    priority:    'medium',
    isAnonymous: false,
  })

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const res = await API.get('/complaints/my')
      setComplaints(res.data)
    } catch (err) {
      console.error('fetchComplaints error:', err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchComplaints() }, [])

  const validate = () => {
    const errs = {}
    if (!form.title.trim() || form.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters'
    }
    if (!form.description.trim() || form.description.trim().length < 10) {
      errs.description = 'Description must be at least 10 characters'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const resetForm = () => {
    setForm({ title: '', category: 'academic', description: '', priority: 'medium', isAnonymous: false })
    setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitLoad(true)
    setErrors({})

    try {
      await API.post('/complaints', {
        title:       form.title.trim(),
        category:    form.category,
        description: form.description.trim(),
        priority:    form.priority,
        isAnonymous: form.isAnonymous,
      })

      setSuccess('Complaint submitted successfully! Admin will respond soon.')
      setOpen(false)
      resetForm()
      fetchComplaints()
      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit complaint'
      setErrors({ submit: msg })
    } finally {
      setSubmitLoad(false)
    }
  }

  return (
    <Layout role="student">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>My Complaints</Typography>
        <Button
          variant="contained"
          startIcon={<ReportProblemIcon />}
          onClick={() => { resetForm(); setOpen(true) }}
        >
          New Complaint
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Card>
        <CardContent>
          {loading ? (
            <Box textAlign="center" py={6}><CircularProgress /></Box>
          ) : complaints.length === 0 ? (
            <Box textAlign="center" py={6}>
              <ReportProblemIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography color="text.secondary" mb={2}>
                No complaints yet
              </Typography>
              <Button variant="outlined" onClick={() => { resetForm(); setOpen(true) }}>
                Submit First Complaint
              </Button>
            </Box>
          ) : (
            <List disablePadding>
              {complaints.map((c) => (
                <Box
                  key={c._id}
                  sx={{
                    p: 2, mb: 2,
                    borderRadius: 2,
                    bgcolor: '#fafafa',
                    border: '1px solid #eee',
                    borderLeft: '4px solid',
                    borderLeftColor:
                      c.status === 'resolved'  ? 'success.main' :
                      c.status === 'rejected'  ? 'error.main'   :
                      c.status === 'reviewing' ? 'info.main'    : 'warning.main',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {c.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip label={c.priority}  size="small" color={priorityColors[c.priority]} />
                      <Chip label={c.category}  size="small" variant="outlined" sx={{ textTransform: 'capitalize' }} />
                      <Chip label={c.status}    size="small" color={statusColors[c.status]} sx={{ textTransform: 'capitalize' }} />
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {c.description}
                  </Typography>

                  {c.isAnonymous && (
                    <Chip label="Anonymous" size="small" sx={{ mb: 1 }} />
                  )}

                  {c.response && (
                    <Box sx={{ bgcolor: '#f0f7f0', p: 1.5, borderRadius: 2, mt: 1 }}>
                      <Typography variant="caption" color="success.main" fontWeight={700} display="block">
                        ✅ Admin Response:
                      </Typography>
                      <Typography variant="body2">{c.response}</Typography>
                    </Box>
                  )}

                  <Typography variant="caption" color="text.disabled" display="block" mt={1}>
                    Submitted: {new Date(c.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Submit Dialog */}
      <Dialog
        open={open}
        onClose={() => { setOpen(false); resetForm() }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontWeight={700}>Submit a Complaint</DialogTitle>
        <DialogContent>
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2 }}>{errors.submit}</Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="Title *"
                fullWidth
                value={form.title}
                onChange={(e) => {
                  setForm({ ...form, title: e.target.value })
                  setErrors({ ...errors, title: '' })
                }}
                error={Boolean(errors.title)}
                helperText={errors.title || 'Brief description of your issue'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                select
                fullWidth
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c} sx={{ textTransform: 'capitalize' }}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Priority"
                select
                fullWidth
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                {priorities.map((p) => (
                  <MenuItem key={p} value={p} sx={{ textTransform: 'capitalize' }}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description *"
                fullWidth
                multiline
                rows={4}
                value={form.description}
                onChange={(e) => {
                  setForm({ ...form, description: e.target.value })
                  setErrors({ ...errors, description: '' })
                }}
                error={Boolean(errors.description)}
                helperText={errors.description || 'Describe your complaint in detail (min 10 characters)'}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.isAnonymous}
                    onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
                    color="warning"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      Submit Anonymously
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Your name will not be shown to admin
                    </Typography>
                  </Box>
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => { setOpen(false); resetForm() }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitLoad}
          >
            {submitLoad
              ? <CircularProgress size={20} color="inherit" />
              : 'Submit Complaint'
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default Complaints