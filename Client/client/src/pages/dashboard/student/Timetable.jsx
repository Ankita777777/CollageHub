import { useState, useEffect } from 'react'
import {
  Box, Card, CardContent, Typography,
  CircularProgress, Alert, Chip, Grid
} from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AccessTimeIcon    from '@mui/icons-material/AccessTime'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const dayColors = {
  Sunday:    { bg: '#E3F2FD', border: '#1565C0' },
  Monday:    { bg: '#E8F5E9', border: '#2E7D32' },
  Tuesday:   { bg: '#FFF3E0', border: '#E65100' },
  Wednesday: { bg: '#F3E5F5', border: '#6A1B9A' },
  Thursday:  { bg: '#E0F2F1', border: '#00695C' },
  Friday:    { bg: '#FCE4EC', border: '#C62828' },
}

const Timetable = () => {
  const [timetables, setTimetables] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  useEffect(() => {
    API.get('/timetable/my')
      .then((res) => {
        setTimetables(res.data)
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Failed to load timetable'
        setError(msg)
        console.error('Timetable error:', msg)
      })
      .finally(() => setLoading(false))
  }, [])

  // Sort timetables by day order
  const sorted = [...timetables].sort(
    (a, b) => days.indexOf(a.day) - days.indexOf(b.day)
  )

  return (
    <Layout role="student">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <CalendarMonthIcon color="primary" sx={{ fontSize: 28 }} />
        <Typography variant="h5" fontWeight={700}>My Timetable</Typography>
        <Chip
          label={`Today: ${today}`}
          size="small"
          color="primary"
          sx={{ ml: 1 }}
        />
      </Box>

      {error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {error} — Ask admin to set up your timetable.
        </Alert>
      )}

      {loading ? (
        <Box textAlign="center" py={6}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" mt={2}>
            Loading timetable...
          </Typography>
        </Box>
      ) : timetables.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <CalendarMonthIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" mb={1}>
              No Timetable Available
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Your timetable has not been set up yet.
              Please contact admin or wait for it to be configured.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {sorted.map((tt) => {
            const isToday   = tt.day === today
            const colors    = dayColors[tt.day] || { bg: '#f5f5f5', border: '#999' }
            const sortedPeriods = [...(tt.periods || [])].sort(
              (a, b) => a.startTime?.localeCompare(b.startTime)
            )

            return (
              <Grid item xs={12} md={6} key={tt._id}>
                <Card sx={{
                  bgcolor:   isToday ? colors.bg : 'white',
                  borderTop: `4px solid ${isToday ? colors.border : '#e0e0e0'}`,
                  boxShadow: isToday ? 4 : 1,
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Typography variant="h6" fontWeight={700}>
                        {tt.day}
                      </Typography>
                      {isToday && (
                        <Chip label="Today" size="small" color="primary" />
                      )}
                      <Chip
                        label={`${sortedPeriods.length} periods`}
                        size="small"
                        variant="outlined"
                        sx={{ ml: 'auto' }}
                      />
                    </Box>

                    {sortedPeriods.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No classes scheduled
                      </Typography>
                    ) : (
                      sortedPeriods.map((period, i) => (
                        <Box
                          key={i}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 1.5,
                            mb: 1,
                            bgcolor: 'white',
                            borderRadius: 2,
                            border: '1px solid #f0f0f0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          }}
                        >
                          {/* Time */}
                          <Box sx={{
                            minWidth: 90,
                            textAlign: 'center',
                            bgcolor:  colors.bg,
                            borderRadius: 1,
                            p: 0.8,
                          }}>
                            <AccessTimeIcon
                              sx={{ fontSize: 14, color: colors.border, display: 'block', mx: 'auto' }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: colors.border, fontWeight: 700 }}
                            >
                              {period.startTime}
                            </Typography>
                            <Typography variant="caption" color="text.disabled" display="block">
                              {period.endTime}
                            </Typography>
                          </Box>

                          {/* Subject Info */}
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={700} noWrap>
                              {period.course?.name || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              👨‍🏫 {period.teacher?.user?.name || 'TBA'}
                              {period.room && ` | 🏫 Room ${period.room}`}
                            </Typography>
                          </Box>

                          {/* Course code */}
                          {period.course?.code && (
                            <Chip
                              label={period.course.code}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: colors.border,
                                color:       colors.border,
                                fontWeight:  600,
                                flexShrink:  0,
                              }}
                            />
                          )}
                        </Box>
                      ))
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

export default Timetable