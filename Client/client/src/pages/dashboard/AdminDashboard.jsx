import { useEffect, useState } from 'react'
import {
  Box, Grid, Card, CardContent, Typography,
  CircularProgress, Alert, LinearProgress,
  Table, TableHead, TableRow, TableCell, TableBody,
  Chip, Button
} from '@mui/material'
import PeopleIcon     from '@mui/icons-material/People'
import SchoolIcon     from '@mui/icons-material/School'
import MenuBookIcon   from '@mui/icons-material/MenuBook'
import PaymentIcon    from '@mui/icons-material/Payment'
import { useSelector } from 'react-redux'
import { useNavigate }  from 'react-router-dom'
import Layout from '../../components/Layout'
import API    from '../../api/axios'

const AdminDashboard = () => {
  const navigate       = useNavigate()
  const { user }       = useSelector((state) => state.auth)
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    API.get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch(() => setError('Failed to load stats'))
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats ? [
    { label: 'Total Students', value: stats.totalStudents, icon: <PeopleIcon />,   color: '#1565C0', path: '/admin/students' },
    { label: 'Total Teachers', value: stats.totalTeachers, icon: <SchoolIcon />,   color: '#2E7D32', path: '/admin/teachers' },
    { label: 'Total Courses',  value: stats.totalCourses,  icon: <MenuBookIcon />, color: '#E65100', path: '/admin/courses' },
    { label: 'Total Revenue',  value: `Rs.${stats.totalRevenue}`, icon: <PaymentIcon />, color: '#6A1B9A', path: '/admin/payments' },
  ] : []

  return (
    <Layout role="admin">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Welcome, {user?.name} 👋
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date().toDateString()} — Admin Panel
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : (
        <>
          {/* Stat Cards */}
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
            {/* Students by Program */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>Students by Program</Typography>
                    <Button size="small" onClick={() => navigate('/admin/students')}>
                      View All
                    </Button>
                  </Box>
                  {stats?.studentsByProgram?.length === 0 ? (
                    <Typography color="text.secondary" textAlign="center" py={2}>
                      No students enrolled yet
                    </Typography>
                  ) : (
                    stats?.studentsByProgram?.map((p) => (
                      <Box key={p._id} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {p._id || 'Unknown'}
                          </Typography>
                          <Chip label={p.count} size="small" color="primary" />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(p.count / stats.totalStudents) * 100}
                          sx={{ borderRadius: 2, height: 8 }}
                        />
                      </Box>
                    ))
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Students by Semester */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>Students by Semester</Typography>
                  </Box>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Semester</strong></TableCell>
                        <TableCell><strong>Students</strong></TableCell>
                        <TableCell><strong>Progress</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats?.studentsBySemester?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} align="center" sx={{ color: 'text.secondary' }}>
                            No data
                          </TableCell>
                        </TableRow>
                      ) : (
                        stats?.studentsBySemester?.map((s) => (
                          <TableRow key={s._id}>
                            <TableCell>Semester {s._id}</TableCell>
                            <TableCell><strong>{s.count}</strong></TableCell>
                            <TableCell sx={{ width: 120 }}>
                              <LinearProgress
                                variant="determinate"
                                value={(s.count / stats.totalStudents) * 100}
                                sx={{ borderRadius: 2, height: 6 }}
                                color="success"
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>

            {/* Teachers by Department */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>Teachers by Department</Typography>
                    <Button size="small" onClick={() => navigate('/admin/teachers')}>
                      View All
                    </Button>
                  </Box>
                  {stats?.teachersByDept?.length === 0 ? (
                    <Typography color="text.secondary" textAlign="center" py={2}>
                      No teachers yet
                    </Typography>
                  ) : (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Department</strong></TableCell>
                          <TableCell><strong>Teachers</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stats?.teachersByDept?.map((t) => (
                          <TableRow key={t._id}>
                            <TableCell>{t._id || 'General'}</TableCell>
                            <TableCell>
                              <Chip label={t.count} size="small" color="success" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
                      { label: 'Post Notice',       path: '/admin/notices',    color: 'primary'   },
                      { label: 'Add Course',         path: '/admin/courses',    color: 'success'   },
                      { label: 'Mark Attendance',    path: '/admin/attendance', color: 'warning'   },
                      { label: 'Add Result',         path: '/admin/results',    color: 'secondary' },
                      { label: 'View Applications',  path: '/admin/admissions', color: 'info'      },
                      { label: 'View Messages',      path: '/admin/messages',   color: 'error'     },
                    ].map((a) => (
                      <Grid item xs={6} key={a.label}>
                        <Button
                          variant="outlined"
                          color={a.color}
                          fullWidth
                          onClick={() => navigate(a.path)}
                          sx={{ py: 1.5, fontWeight: 600 }}
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

export default AdminDashboard