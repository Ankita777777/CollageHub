import { useState, useEffect } from 'react'
import {
  Box, Card, CardContent, Typography, Grid, Chip,
  CircularProgress, Alert, Button
} from '@mui/material'
import EventIcon          from '@mui/icons-material/Event'
import LocationOnIcon     from '@mui/icons-material/LocationOn'
import HowToRegIcon       from '@mui/icons-material/HowToReg'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const typeColors = {
  cultural: '#E65100',
  sports:   '#2E7D32',
  academic: '#1565C0',
  seminar:  '#6A1B9A',
  other:    '#455A64',
}

const Events = () => {
  const [events,   setEvents]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')
  const [regLoad,  setRegLoad]  = useState({})

  const fetchEvents = async () => {
    try {
      const res = await API.get('/events')
      setEvents(res.data)
    } catch (err) {
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEvents() }, [])

  const handleRegister = async (eventId) => {
    setRegLoad((prev) => ({ ...prev, [eventId]: true }))
    try {
      const res = await API.post(`/events/${eventId}/register`)
      setSuccess(res.data.message)
      fetchEvents()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed')
    } finally {
      setRegLoad((prev) => ({ ...prev, [eventId]: false }))
    }
  }

  const getDaysLeft = (date) => {
    const diff = new Date(date) - new Date()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <Layout role="student">
      <Typography variant="h5" fontWeight={700} mb={3}>Events & Activities</Typography>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : events.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <EventIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">No upcoming events</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => {
            const daysLeft  = getDaysLeft(event.date)
            const isPast    = daysLeft < 0
            const isUrgent  = daysLeft >= 0 && daysLeft <= 3

            return (
              <Grid item xs={12} sm={6} md={4} key={event._id}>
                <Card sx={{
                  height: '100%',
                  borderTop: `4px solid ${typeColors[event.type] || '#455A64'}`,
                  opacity: isPast ? 0.7 : 1,
                  '&:hover': { boxShadow: 6, transform: 'translateY(-2px)', transition: '0.2s' },
                }}>
                  {event.image && (
                    <Box
                      component="img"
                      src={event.image}
                      alt={event.title}
                      sx={{ width: '100%', height: 160, objectFit: 'cover' }}
                    />
                  )}
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip
                        label={event.type}
                        size="small"
                        sx={{
                          bgcolor: (typeColors[event.type] || '#455A64') + '20',
                          color:   typeColors[event.type] || '#455A64',
                          fontWeight: 600,
                        }}
                      />
                      {isPast ? (
                        <Chip label="Ended" size="small" />
                      ) : isUrgent ? (
                        <Chip label={`${daysLeft}d left!`} size="small" color="error" />
                      ) : (
                        <Chip label={`${daysLeft} days`} size="small" color="success" />
                      )}
                    </Box>

                    <Typography variant="subtitle1" fontWeight={700} mb={1}>
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {event.description}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EventIcon fontSize="small" color="action" />
                        <Typography variant="caption">
                          {new Date(event.date).toLocaleDateString('en-NP', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })}
                          {event.endDate && ` — ${new Date(event.endDate).toLocaleDateString()}`}
                        </Typography>
                      </Box>
                      {event.location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOnIcon fontSize="small" color="action" />
                          <Typography variant="caption">{event.location}</Typography>
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HowToRegIcon fontSize="small" color="action" />
                        <Typography variant="caption">
                          {event.registrations?.length || 0} registered
                        </Typography>
                      </Box>
                    </Box>

                    {!isPast && (
                      <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        onClick={() => handleRegister(event._id)}
                        disabled={regLoad[event._id]}
                        sx={{ bgcolor: typeColors[event.type] || '#1565C0' }}
                      >
                        {regLoad[event._id] ? 'Processing...' : 'Register for Event'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}
    </Layout>
  )
}

export default Events