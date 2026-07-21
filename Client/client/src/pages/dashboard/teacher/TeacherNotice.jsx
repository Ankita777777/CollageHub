import { useEffect, useState } from 'react'
import {
  Box, Card, CardContent, Typography, Button, TextField,
  MenuItem, Alert, Grid, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, Chip, Switch,
  FormControlLabel, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress
} from '@mui/material'
import DeleteIcon       from '@mui/icons-material/Delete'
import AnnouncementIcon from '@mui/icons-material/Announcement'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const categories = ['general', 'exam', 'event', 'holiday']

const categoryColors = {
  exam: 'error', event: 'primary', holiday: 'success', general: 'default'
}

const TeacherNotice = () => {
  const [notices,  setNotices]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [open,     setOpen]     = useState(false)
  const [success,  setSuccess]  = useState('')
  const [errors,   setErrors]   = useState({})
  const [form, setForm] = useState({
    title: '', content: '', category: 'general', isPublic: false
  })

  const fetchNotices = async () => {
    try {
      const res = await API.get('/notices')
      setNotices(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNotices() }, [])

  const resetForm = () => {
    setForm({ title: '', content: '', category: 'general', isPublic: false })
    setErrors({})
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim() || form.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters'
    }
    if (!form.content.trim() || form.content.trim().length < 10) {
      errs.content = 'Content must be at least 10 characters'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleCreate = async () => {
    if (!validate()) return
    try {
      await API.post('/notices', form)
      setSuccess('Notice posted!')
      setOpen(false)
      resetForm()
      fetchNotices()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed' })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return
    try {
      await API.delete(`/notices/${id}`)
      setNotices(notices.filter((n) => n._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Layout role="teacher">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Post Notice</Typography>
        <Button
          variant="contained"
          startIcon={<AnnouncementIcon />}
          onClick={() => { resetForm(); setOpen(true) }}
        >
          Post Notice
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Card>
        <CardContent>
          {loading ? (
            <Box textAlign="center" py={4}><CircularProgress /></Box>
          ) : notices.length === 0 ? (
            <Typography textAlign="center" color="text.secondary" py={4}>
              No notices yet
            </Typography>
          ) : (
            <List>
              {notices.map((n) => (
                <ListItem
                  key={n._id}
                  sx={{
                    mb: 1, borderRadius: 2,
                    bgcolor: '#f9f9f9',
                    border: '1px solid #eee',
                    borderLeft: '4px solid',
                    borderLeftColor:
                      n.category === 'exam'    ? 'error.main' :
                      n.category === 'event'   ? 'primary.main' :
                      n.category === 'holiday' ? 'success.main' : 'grey.400',
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle2" fontWeight={600}>{n.title}</Typography>
                        <Chip label={n.category} size="small" color={categoryColors[n.category]} />
                        {n.isPublic && <Chip label="Public" size="small" color="success" variant="outlined" />}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">{n.content}</Typography>
                        <Typography variant="caption" color="text.disabled">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton color="error" onClick={() => handleDelete(n._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Post Notice Dialog */}
      <Dialog open={open} onClose={() => { setOpen(false); resetForm() }} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>Post New Notice</DialogTitle>
        <DialogContent>
          {errors.submit && <Alert severity="error" sx={{ mb: 2 }}>{errors.submit}</Alert>}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="Title *" fullWidth
                value={form.title}
                onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: '' }) }}
                error={Boolean(errors.title)}
                helperText={errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Content *" fullWidth multiline rows={4}
                value={form.content}
                onChange={(e) => { setForm({ ...form, content: e.target.value }); setErrors({ ...errors, content: '' }) }}
                error={Boolean(errors.content)}
                helperText={errors.content}
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
              <Box sx={{ mt: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isPublic}
                      onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                      color="success"
                    />
                  }
                  label={form.isPublic ? 'Public (shows on homepage)' : 'Internal only'}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); resetForm() }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Post Notice</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default TeacherNotice