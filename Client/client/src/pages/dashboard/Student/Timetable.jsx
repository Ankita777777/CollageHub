import { useState, useEffect } from 'react'
import {
  Box, Card, CardContent, Typography,
  CircularProgress, Alert, Chip, Grid
} from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const dayColors = {
  Sunday:    '#E3F2FD',
  Monday:    '#E8F5E9',
  Tuesday:   '#FFF3E0',
  Wednesday: '#F3E5F5',
  Thursday:  '#E0F2F1',
  Friday:    '#FCE4EC',
}

const Timetable = () => {
  const [timetables, setTimetables] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  useEffect(() => {
    API.get('/timetable/my')
      .then((res) => setTimetables(res.data))
      .catch(() => setError('Failed to load timetable. Contact admin.'))
      .finally(() => setLoading(false))
  }, [])

  // Sort by day order
  const sorted = [...timetables].sort(
    (a, b) => days.indexOf(a.day) - days.indexOf(b.day)
  )

  return (
    <Layout role="student">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <CalendarMonthIcon color="primary" />
        <Typography variant="h5" fontWeight={700}>My Timetable</Typography>
        <Chip label={`Today: ${today}`} size="small" color="primary" sx={{ ml: 1 }} />
      </Box>

      {error && <Alert severity="info" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : timetables.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <CalendarMonthIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">
              No timetable available yet. Admin will set it up.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {sorted.map((tt) => (
            <Grid item xs={12} md={6} key={tt._id}>
              <Card sx={{
                bgcolor: dayColors[tt.day] || '#f5f5f5',
                borderTop: tt.day === today ? '4px solid #1565C0' : '4px solid transparent',
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="h6" fontWeight={700}>{tt.day}</Typography>
                    {tt.day === today && (
                      <Chip label="Today" size="small" color="primary" />
                    )}
                  </Box>

                  {tt.periods?.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No classes
                    </Typography>
                  ) : (
                    tt.periods?.sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((p, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: 'flex', alignItems: 'center',
                          gap: 2, p: 1.5, mb: 1,
                          bgcolor: 'white', borderRadius: 2,
                          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                        }}
                      >
                        <Box sx={{
                          minWidth: 80, textAlign: 'center',
                          bgcolor: '#1565C020', borderRadius: 1, p: 0.5,
                        }}>
                          <Typography variant="caption" color="primary.main" fontWeight={700}>
                            {p.startTime}
                          </Typography>
                          <br />
                          <Typography variant="caption" color="text.secondary">
                            {p.endTime}
                          </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" fontWeight={700}>
                            {p.course?.name || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {p.teacher?.user?.name || 'TBA'}
                            {p.room && ` — Room ${p.room}`}
                          </Typography>
                        </Box>
                        <Chip
                          label={p.course?.code || 'N/A'}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </Box>
                    ))
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Layout>
  )
}

export default Timetable