import { useEffect, useState } from 'react'
import {
  Box, Card, CardContent, Typography, List, ListItem,
  ListItemText, ListItemSecondaryAction, IconButton,
  Alert, CircularProgress, Chip, Badge
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon  from '@mui/icons-material/Email'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const ManageMessages = () => {
  const [messages, setMessages] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const res = await API.get('/contact')
      setMessages(res.data)
    } catch (err) {
      setError('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMessages() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return
    try {
      await API.delete(`/contact/${id}`)
      setMessages(messages.filter((m) => m._id !== id))
    } catch (err) {
      setError('Failed to delete')
    }
  }

  return (
    <Layout role="admin">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Contact Messages</Typography>
        <Chip label={messages.length} color="primary" size="small" />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          {loading ? (
            <Box textAlign="center" py={6}><CircularProgress /></Box>
          ) : messages.length === 0 ? (
            <Box textAlign="center" py={6}>
              <EmailIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography color="text.secondary">No messages yet</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {messages.map((m) => (
                <ListItem
                  key={m._id}
                  sx={{
                    mb: 1.5, borderRadius: 2,
                    bgcolor: '#f9f9f9',
                    border: '1px solid #eee',
                    alignItems: 'flex-start',
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {m.subject}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" mb={0.5}>
                          {m.message}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          From: <strong>{m.name}</strong> ({m.email}) |{' '}
                          {new Date(m.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton color="error" onClick={() => handleDelete(m._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Layout>
  )
}

export default ManageMessages