import { useEffect, useState } from 'react'
import {
  Box, Grid, Card, CardContent, Typography,
  CircularProgress, Alert, Chip, Avatar,
  List, ListItem, ListItemText, ListItemAvatar,
  Button, Divider
} from '@mui/material'
import PeopleIcon      from '@mui/icons-material/People'
import MenuBookIcon    from '@mui/icons-material/MenuBook'
import EventNoteIcon   from '@mui/icons-material/EventNote'
import GradingIcon     from '@mui/icons-material/Grading'
import BeachAccessIcon from '@mui/icons-material/BeachAccess'
import { useSelector } from 'react-redux'
import { useNavigate }  from 'react-router-dom'
import Layout from '../../components/Layout'
import API    from '../../api/axios'

const TeacherDashboard = () => {
  const navigate     = useNavigate()
  const { user }     = useSelector((state) => state.auth)
  const [stats,    setStats]    = useState(null)
  const [courses,  setCourses]  = useState([])
  const [students, setStudents] = useState([])
  const [leaves,   setLeaves]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sRes, cRes, stRes, lRes] = await Promise.all([
          API.get('/teachers/stats'),
          API.get('/teachers/my-courses'),
          API.get('/teachers/my-students'),
          API.get('/teachers/leaves'),
        ])
        setStats(sRes.data)
        setCourses(cRes.data)
        setStudents(stRes.data)
        setLeaves(lRes.data)
      } catch (err) {
        setError('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const statCards = stats ? [
    { label: 'My Courses',       value: stats.totalCourses,    icon: <MenuBookIcon />,    color: '#1565C0', path: '/teacher/courses' },
    { label: 'My Students',      value: stats.totalStudents,   icon: <PeopleIcon />,      color: '#2E7D32', path: '/teacher/students' },
    { label: 'Attendance Marked',value: stats.attendanceMarked,icon: <EventNoteIcon />,   color: '#E65100', path: '/teacher/attendance' },
    { label: 'Pending Leaves',   value: stats.pendingLeaves,   icon: <BeachAccessIcon />, color: '#C62828', path: '/teacher/leaves' },
  ] : []

  return (
    <Layout role="teacher">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Welcome, {user?.name} 👋
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date().toDateString()} — Teacher Portal
        </Typography>
      </Box>

      {error   && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : (
        <>
          {/* Stats */}
          <Grid container spacing={3} mb={4}>
            {statCards.map((s) => (
              <Grid item xs={12} sm={6} md={3} key={s.label}>
                <Card
                  sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 }, transition: '0.2s' }}
                  onClick={() => navigate(s.path)}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ bgcolor: s.color + '20', p: 1.5, borderRadius: 2, color: s.color }}>
                      {s.icon}
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight={700}>{s.value}</Typography>
                      <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            {/* My Courses */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>My Courses</Typography>
                    <Button size="small" onClick={() => navigate('/teacher/courses')}>
                      View All
                    </Button>
                  </Box>
                  {courses.length === 0 ? (
                    <Typography color="text.secondary" textAlign="center" py={2}>
                      No courses assigned yet
                    </Typography>
                  ) : (
                    courses.slice(0, 5).map((c) => (
                      <Box
                        key={c._id}
                        sx={{
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 1.5, mb: 1,
                          bgcolor: '#f5f7fa', borderRadius: 2,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ bgcolor: 'primary.main', p: 1, borderRadius: 1, color: 'white' }}>
                            <MenuBookIcon fontSize="small" />
                          </Box>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>{c.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {c.code} — {c.program} Sem {c.semester}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip label={`${c.creditHours} cr`} size="small" color="primary" />
                      </Box>
                    ))
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* My Students */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>My Students</Typography>
                    <Button size="small" onClick={() => navigate('/teacher/students')}>
                      View All
                    </Button>
                  </Box>
                  {students.length === 0 ? (
                    <Typography color="text.secondary" textAlign="center" py={2}>
                      No students found
                    </Typography>
                  ) : (
                    <List dense>
                      {students.slice(0, 5).map((s) => (
                        <ListItem key={s._id} sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'success.main', width: 36, height: 36, fontSize: 14 }}>
                              {s.user?.name?.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={s.user?.name}
                            secondary={`${s.rollNo || 'No Roll'} — ${s.program} Sem ${s.semester}`}
                          />
                        </ListItem>
                      ))}
                      {students.length > 5 && (
                        <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
                          +{students.length - 5} more students
                        </Typography>
                      )}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Pending Leaves */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Pending Leave Requests
                      {leaves.length > 0 && (
                        <Chip label={leaves.length} size="small" color="error" sx={{ ml: 1 }} />
                      )}
                    </Typography>
                    <Button size="small" onClick={() => navigate('/teacher/leaves')}>
                      Manage
                    </Button>
                  </Box>
                  {leaves.length === 0 ? (
                    <Typography color="text.secondary" textAlign="center" py={2}>
                      No pending leaves
                    </Typography>
                  ) : (
                    leaves.slice(0, 4).map((l) => (
                      <Box
                        key={l._id}
                        sx={{
                          p: 1.5, mb: 1,
                          bgcolor: '#fff8e1',
                          border: '1px solid #ffe082',
                          borderRadius: 2,
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {l.student?.user?.name}
                          </Typography>
                          <Chip label="Pending" size="small" color="warning" />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(l.fromDate).toLocaleDateString()} →{' '}
                          {new Date(l.toDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          Reason: {l.reason}
                        </Typography>
                      </Box>
                    ))
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>Quick Actions</Typography>
                  <Grid container spacing={2}>
                    {[
                      { label: 'Mark Attendance', path: '/teacher/attendance', color: 'primary'   },
                      { label: 'Enter Marks',     path: '/teacher/results',    color: 'success'   },
                      { label: 'View Students',   path: '/teacher/students',   color: 'info'      },
                      { label: 'Leave Requests',  path: '/teacher/leaves',     color: 'warning'   },
                      { label: 'My Courses',      path: '/teacher/courses',    color: 'secondary' },
                      { label: 'Post Notice',     path: '/teacher/notice',     color: 'error'     },
                    ].map((a) => (
                      <Grid item xs={6} key={a.label}>
                        <Button
                          variant="outlined"
                          color={a.color}
                          fullWidth
                          onClick={() => navigate(a.path)}
                          sx={{ py: 1.2, fontWeight: 600 }}
                        >
                          {a.label}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Layout>
  )
}

export default TeacherDashboard