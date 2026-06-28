import { useEffect, useState } from 'react'
import {
  Box, Grid, Card, CardContent, Typography, Button,
  Table, TableHead, TableRow, TableCell, TableBody,
  Checkbox, MenuItem, TextField, Alert
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import AssignmentIcon from '@mui/icons-material/Assignment'
import Sidebar from '../../components/Sidebar'
import API from '../../api/axios'

const TeacherDashboard = () => {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [selectedCourse, setSelectedCourse] = useState('')
  const [courses, setCourses] = useState([])
  const [success, setSuccess] = useState('')

  useEffect(() => {
    API.get('/admin/courses').then((res) => setCourses(res.data))
  }, [])

  useEffect(() => {
    if (selectedCourse) {
      API.get(`/teachers/students/${selectedCourse}`).then((res) => {
        setStudents(res.data)
        const init = {}
        res.data.forEach((s) => (init[s._id] = 'present'))
        setAttendance(init)
      })
    }
  }, [selectedCourse])

  const handleMarkAttendance = async () => {
    const records = Object.entries(attendance).map(([studentId, status]) => ({ studentId, status }))
    await API.post('/teachers/attendance', {
      courseId: selectedCourse,
      date: new Date().toISOString(),
      records,
    })
    setSuccess('Attendance marked successfully!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const stats = [
    { label: 'My Courses',  value: courses.length, icon: <MenuBookIcon /> },
    { label: 'Students',    value: students.length, icon: <PeopleIcon /> },
    { label: 'Assignments', value: 0,               icon: <AssignmentIcon /> },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar role="teacher" />
      <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Typography variant="h5" fontWeight={700} mb={3}>Teacher Dashboard</Typography>

        <Grid container spacing={3} mb={4}>
          {stats.map((s) => (
            <Grid item xs={12} sm={4} key={s.label}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ bgcolor: 'primary.light', p: 1.5, borderRadius: 2, color: 'white' }}>
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

        {/* Mark Attendance */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>Mark Attendance</Typography>
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <TextField select label="Select Course" value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)} sx={{ mb: 3, minWidth: 250 }}>
              {courses.map((c) => (
                <MenuItem key={c._id} value={c._id}>{c.name} ({c.code})</MenuItem>
              ))}
            </TextField>

            {students.length > 0 && (
              <>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Roll No</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Present</TableCell>
                      <TableCell>Absent</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((s) => (
                      <TableRow key={s._id}>
                        <TableCell>{s.rollNo}</TableCell>
                        <TableCell>{s.user?.name}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={attendance[s._id] === 'present'}
                            onChange={() => setAttendance({ ...attendance, [s._id]: 'present' })}
                            color="success"
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={attendance[s._id] === 'absent'}
                            onChange={() => setAttendance({ ...attendance, [s._id]: 'absent' })}
                            color="error"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button variant="contained" sx={{ mt: 2 }} onClick={handleMarkAttendance}>
                  Submit Attendance
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default TeacherDashboard