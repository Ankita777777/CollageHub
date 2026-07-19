import { useEffect, useState } from 'react'
import {
  Box, Card, CardContent, Typography, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, MenuItem, Chip, Grid,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  IconButton, Switch, FormControlLabel
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const categories = ['general', 'exam', 'event', 'holiday']

const ManageNotices = () => {
  const [notices, setNotices] = useState([])
  const [open,    setOpen]    = useState(false)
  const [success, setSuccess] = useState('')
  const [error,   setError]   = useState('')
  const [form, setForm] = useState({
    title: '', content: '', category: 'general', isPublic: true
  })

  const fetchNotices = async () => {
    try {
      const res = await API.get('/notices')
      setNotices(res.data)
    } catch (err) {
      setError('Failed to load notices')
    }
  }

  useEffect(() => { fetchNotices() }, [])

  const handleCreate = async () => {
    setError('')
    if (!form.title || !form.content) {
      return setError('Title and content are required')
    }
    try {
      await API.post('/notices', form)
      setSuccess('Notice posted!')
      setOpen(false)
      setForm({ title: '', content: '', category: 'general', isPublic: true })
      fetchNotices()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return
    try {
      await API.delete(`/notices/${id}`)
      setNotices(notices.filter((n) => n._id !== id))
    } catch (err) {
      setError('Failed to delete')
    }
  }

  const categoryColors = {
    exam: 'error', event: 'primary', holiday: 'success', general: 'default'
  }

  return (
    <Layout role="admin">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Manage Notices</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          + Post Notice
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          {notices.length === 0 ? (
            <Typography textAlign="center" color="text.secondary" py={4}>
              No notices yet. Post one!
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
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {n.title}
                        </Typography>
                        <Chip
                          label={n.category}
                          size="small"
                          color={categoryColors[n.category]}
                        />
                        {n.isPublic && (
                          <Chip label="Public" size="small" color="success" variant="outlined" />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {n.content}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          {new Date(n.createdAt).toLocaleDateString()} | By {n.postedBy?.name}
                        </Typography>
                      </>
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
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>Post New Notice</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="Title" fullWidth required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Content" fullWidth multiline rows={4} required
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
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
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.isPublic}
                    onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                    color="success"
                  />
                }
                label={form.isPublic ? 'Visible on Homepage' : 'Internal Only'}
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Post Notice</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default ManageNotices