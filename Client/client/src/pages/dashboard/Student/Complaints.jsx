import { useState, useEffect } from 'react'
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Alert, Grid, MenuItem, CircularProgress,
  List, ListItem, ListItemText, Chip, Divider,
  FormControlLabel, Switch, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material'
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
      console.error(err)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitLoad(true)
    try {
      await API.post('/complaints', form)
      setSuccess('Complaint submitted! Admin will respond soon.')
      setOpen(false)
      setForm({ title: '', category: 'academic', description: '', priority: 'medium', isAnonymous: false })
      fetchComplaints()
      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to submit' })
    } finally {
      setSubmitLoad(false)
    }
  }

  return (
    <Layout role="student">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>My Complaints</Typography>
        <Button variant="contained" onClick={() => { setErrors({}); setOpen(true) }}>
          + New Complaint
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Card>
        <CardContent>
          {loading ? (
            <Box textAlign="center" py={6}><CircularProgress /></Box>
          ) : complaints.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Typography color="text.secondary">
                No complaints submitted yet.
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {complaints.map((c) => (
                <Box key={c._id}>
                  <ListItem
                    sx={{
                      borderRadius: 2,
                      bgcolor: '#fafafa',
                      border: '1px solid #eee',
                      mb: 1.5,
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700}>{c.title}</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip label={c.priority}  size="small" color={priorityColors[c.priority]} />
                        <Chip label={c.category}  size="small" variant="outlined" />
                        <Chip label={c.status}    size="small" color={statusColors[c.status]} />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {c.description}
                    </Typography>
                    {c.isAnonymous && (
                      <Chip label="Anonymous" size="small" sx={{ mb: 1 }} />
                    )}
                    {c.response && (
                      <Box sx={{ bgcolor: '#f0f7f0', p: 1.5, borderRadius: 2, width: '100%', mt: 1 }}>
                        <Typography variant="caption" color="success.main" fontWeight={700}>
                          Admin Response:
                        </Typography>
                        <Typography variant="body2">{c.response}</Typography>
                      </Box>
                    )}
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 1 }}>
                      Submitted: {new Date(c.createdAt).toLocaleDateString()}
                    </Typography>
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Submit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>Submit a Complaint</DialogTitle>
        <DialogContent>
          {errors.submit && <Alert severity="error" sx={{ mb: 2 }}>{errors.submit}</Alert>}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="Title *"
                fullWidth
                value={form.title}
                onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: '' }) }}
                error={Boolean(errors.title)}
                helperText={errors.title}
                placeholder="Brief title of your complaint"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category" select fullWidth
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
                label="Priority" select fullWidth
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
                fullWidth multiline rows={4}
                value={form.description}
                onChange={(e) => { setForm({ ...form, description: e.target.value }); setErrors({ ...errors, description: '' }) }}
                error={Boolean(errors.description)}
                helperText={errors.description}
                placeholder="Describe your complaint in detail..."
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
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={submitLoad}>
            {submitLoad ? <CircularProgress size={20} color="inherit" /> : 'Submit Complaint'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default Complaints