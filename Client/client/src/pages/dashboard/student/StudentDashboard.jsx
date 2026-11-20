import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProfile, fetchAttendance,
  fetchResults, fetchFeeStatus
} from '../../features/student/studentSlice'
import { fetchNotices } from '../../features/notice/noticeSlice'
import { useNavigate } from 'react-router-dom'
import {
  Box, Grid, Card, CardContent, Typography,
  LinearProgress, Table, TableHead, TableRow,
  TableCell, TableBody, Chip, Button,
  CircularProgress, Alert
} from '@mui/material'
import EventNoteIcon      from '@mui/icons-material/EventNote'
import AssignmentIcon     from '@mui/icons-material/Assignment'
import PaymentIcon        from '@mui/icons-material/Payment'
import PersonIcon         from '@mui/icons-material/Person'
import MenuBookIcon       from '@mui/icons-material/MenuBook'
import EmojiEventsIcon    from '@mui/icons-material/EmojiEvents'
import SchoolIcon         from '@mui/icons-material/School'
import FeedbackIcon       from '@mui/icons-material/Feedback'
import ReportProblemIcon  from '@mui/icons-material/ReportProblem'
import CalendarMonthIcon  from '@mui/icons-material/CalendarMonth'
import Layout      from '../../components/Layout'
import NoticeCard  from '../../components/NoticeCard'

const StudentDashboard = () => {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { user }  = useSelector((state) => state.auth)
  const { profile, attendance, results, fee, loading } = useSelector((state) => state.student)
  const { notices } = useSelector((state) => state.notice)

  useEffect(() => {
    dispatch(fetchProfile())
    dispatch(fetchAttendance())
    dispatch(fetchResults())
    dispatch(fetchFeeStatus())
    dispatch(fetchNotices({}))
  }, [dispatch])

  const statCards = [
    { label: 'Program',    value: profile?.program   || '—', icon: <PersonIcon />,      color: '#1565C0' },
    { label: 'Semester',   value: `Sem ${profile?.semester || 1}`, icon: <AssignmentIcon />, color: '#2E7D32' },
    { label: 'Fee Status', value: fee?.feeStatus     || '—', icon: <PaymentIcon />,     color: '#E65100' },
    { label: 'Roll No',    value: profile?.rollNo    || '—', icon: <EventNoteIcon />,   color: '#6A1B9A' },
  ]

  const quickActions = [
    { label: 'Attendance',     path: '/student/attendance',    icon: <EventNoteIcon />,      color: 'primary'   },
    { label: 'Results',        path: '/student/results',       icon: <AssignmentIcon />,     color: 'success'   },
    { label: 'Assignments',    path: '/student/assignments',   icon: <MenuBookIcon />,       color: 'warning'   },
    { label: 'Timetable',      path: '/student/timetable',     icon: <CalendarMonthIcon />,  color: 'info'      },
    { label: 'Study Materials',path: '/student/materials',     icon: <MenuBookIcon />,       color: 'secondary' },
    { label: 'Library',        path: '/student/library',       icon: <SchoolIcon />,         color: 'primary'   },
    { label: 'Events',         path: '/student/events',        icon: <EmojiEventsIcon />,    color: 'warning'   },
    { label: 'Scholarships',   path: '/student/scholarships',  icon: <SchoolIcon />,         color: 'success'   },
    { label: 'Complaints',     path: '/student/complaints',    icon: <ReportProblemIcon />,  color: 'error'     },
    { label: 'Feedback',       path: '/student/feedback',      icon: <FeedbackIcon />,       color: 'info'      },
    { label: 'Leave',          path: '/student/leave',         icon: <EventNoteIcon />,      color: 'warning'   },
    { label: 'My Profile',     path: '/student/profile',       icon: <PersonIcon />,         color: 'default'   },
  ]

  return (
    <Layout role="student">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Welcome, {profile?.user?.name || user?.name} 👋
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date().toDateString()} — Student Portal
        </Typography>
      </Box>

      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : (
        <>
          {/* Stats */}
          <Grid container spacing={3} mb={4}>
            {statCards.map((s) => (
              <Grid item xs={12} sm={6} md={3} key={s.label}>
                <Card>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ bgcolor: s.color + '20', p: 1.5, borderRadius: 2, color: s.color }}>
                      {s.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>{s.value}</Typography>
                      <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            {/* Attendance Summary */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>Attendance</Typography>
                    <Button size="small" onClick={() => navigate('/student/attendance')}>
                      View All
                    </Button>
                  </Box>
                  {attendance.summary?.length === 0 ? (
                    <Typography color="text.secondary" textAlign="center" py={2}>
                      No attendance records yet
                    </Typography>
                  ) : (
                    attendance.summary?.slice(0, 4).map((s) => (
                      <Box key={s.course._id} mb={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" fontWeight={500}>
                            {s.course.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{ color: Number(s.percentage) < 75 ? 'error.main' : 'success.main' }}
                          >
                            {s.percentage}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Number(s.percentage)}
                          color={Number(s.percentage) < 75 ? 'error' : 'success'}
                          sx={{ borderRadius: 2, height: 6 }}
                        />
                        {Number(s.percentage) < 75 && (
                          <Typography variant="caption" color="error.main">
                            ⚠️ Below 75% threshold
                          </Typography>
                        )}
                      </Box>
                    ))
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Results */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>Recent Results</Typography>
                    <Button size="small" onClick={() => navigate('/student/results')}>
                      View All
                    </Button>
                  </Box>
                  {results.length === 0 ? (
                    <Typography color="text.secondary" textAlign="center" py={2}>
                      No results published yet
                    </Typography>
                  ) : (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Subject</strong></TableCell>
                          <TableCell><strong>Marks</strong></TableCell>
                          <TableCell><strong>Grade</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {results.slice(0, 4).map((r) => (
                          <TableRow key={r._id}>
                            <TableCell>{r.course?.name}</TableCell>
                            <TableCell><strong>{r.marks}</strong></TableCell>
                            <TableCell>
                              <Chip
                                label={r.grade}
                                size="small"
                                color={
                                  ['A+', 'A'].includes(r.grade) ? 'success' :
                                  ['B+', 'B'].includes(r.grade) ? 'primary' :
                                  r.status === 'fail' ? 'error' : 'warning'
                                }
                              />
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
                  <Grid container spacing={1.5}>
                    {quickActions.map((a) => (
                      <Grid item xs={6} sm={4} key={a.label}>
                        <Button
                          variant="outlined"
                          color={a.color}
                          fullWidth
                          size="small"
                          onClick={() => navigate(a.path)}
                          sx={{ py: 1, fontSize: 12, fontWeight: 600 }}
                        >
                          {a.label}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Notices */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>Latest Notices</Typography>
                    <Button size="small" onClick={() => navigate('/notices')}>
                      View All
                    </Button>
                  </Box>
                  {notices.slice(0, 3).map((n) => (
                    <NoticeCard key={n._id} notice={n} />
                  ))}
                  {notices.length === 0 && (
                    <Typography color="text.secondary" textAlign="center" py={2}>
                      No notices yet
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Layout>
  )
}

export default StudentDashboard