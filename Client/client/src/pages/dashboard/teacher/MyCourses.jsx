import { useEffect, useState } from 'react'
import {
  Box, Card, CardContent, Typography, Grid,
  Chip, CircularProgress, Alert, Button
} from '@mui/material'
import MenuBookIcon  from '@mui/icons-material/MenuBook'
import PeopleIcon    from '@mui/icons-material/People'
import { useNavigate } from 'react-router-dom'
import Layout from '../../../components/Layout'
import API    from '../../../api/axios'

const MyCourses = () => {
  const navigate      = useNavigate()
  const [courses,  setCourses]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  useEffect(() => {
    API.get('/teachers/my-courses')
      .then((res) => setCourses(res.data))
      .catch(() => setError('Failed to load courses'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout role="teacher">
      <Typography variant="h5" fontWeight={700} mb={3}>My Courses</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : courses.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <MenuBookIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">
              No courses assigned yet. Contact admin to assign courses.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {courses.map((c) => (
            <Grid item xs={12} sm={6} md={4} key={c._id}>
              <Card sx={{
                borderTop: '4px solid #1565C0',
                '&:hover': { boxShadow: 6 },
                transition: '0.2s',
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box sx={{ bgcolor: '#1565C020', p: 1.5, borderRadius: 2, color: '#1565C0' }}>
                      <MenuBookIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>{c.name}</Typography>
                      <Chip label={c.code} size="small" variant="outlined" />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip label={c.program}          size="small" color="primary" />
                    <Chip label={`Sem ${c.semester}`} size="small" color="success" />
                    <Chip label={`${c.creditHours} credits`} size="small" />
                  </Box>

                  {c.description && (
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {c.description}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      startIcon={<PeopleIcon />}
                      onClick={() => navigate(`/teacher/attendance?course=${c._id}`)}
                    >
                      Attendance
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      onClick={() => navigate(`/teacher/results?course=${c._id}`)}
                    >
                      Marks
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Layout>
  )
}

export default MyCourses