import { useEffect, useState } from 'react'
import {
  Box, Card, CardContent, Typography, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, Button,
  MenuItem, TextField, Alert, CircularProgress,
  Grid, Checkbox
} from '@mui/material'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const ManageAttendance = () => {
  const [courses,    setCourses]    = useState([])
  const [students,   setStudents]   = useState([])
  const [attendance, setAttendance] = useState({})
  const [loading,    setLoading]    = useState(false)
  const [success,    setSuccess]    = useState('')
  const [error,      setError]      = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    API.get('/admin/courses').then((res) => setCourses(res.data))
  }, [])

  useEffect(() => {
    if (!selectedCourse) return
    setLoading(true)
    const course = courses.find((c) => c._id === selectedCourse)
    API.get('/admin/students', {
      params: {
        program:  course?.program,
        semester: course?.semester,
      }
    }).then((res) => {
      setStudents(res.data)
      const init = {}
      res.data.forEach((s) => (init[s._id] = 'present'))
      setAttendance(init)
    }).finally(() => setLoading(false))
  }, [selectedCourse])

  const handleMark = async () => {
    setError('')
    if (!selectedCourse || !date) {
      return setError('Please select course and date')
    }
    if (!students.length) {
      return setError('No students found for this course')
    }
    try {
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        studentId, status
      }))
      await API.post('/teachers/attendance', {
        courseId: selectedCourse,
        date,
        records,
      })
      setSuccess(`Attendance marked for ${students.length} students!`)
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance')
    }
  }

  const toggleAll = (status) => {
    const updated = {}
    students.forEach((s) => (updated[s._id] = status))
    setAttendance(updated)
  }

  return (
    <Layout role="admin">
      <Typography variant="h5" fontWeight={700} mb={3}>Mark Attendance</Typography>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField
                label="Select Course" select fullWidth
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courses.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name} — {c.program} Sem {c.semester}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Date" type="date" fullWidth
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained" fullWidth size="large"
                onClick={handleMark}
                disabled={!selectedCourse || !students.length}
              >
                Submit Attendance
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Student List */}
      {selectedCourse && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Students ({students.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" color="success" variant="outlined"
                  onClick={() => toggleAll('present')}>
                  All Present
                </Button>
                <Button size="small" color="error" variant="outlined"
                  onClick={() => toggleAll('absent')}>
                  All Absent
                </Button>
              </Box>
            </Box>

            {loading ? (
              <Box textAlign="center" py={4}><CircularProgress /></Box>
            ) : students.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" py={4}>
                No students found for this course's program and semester.
              </Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                    <TableCell><strong>Roll No</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Present</strong></TableCell>
                    <TableCell><strong>Absent</strong></TableCell>
                    <TableCell><strong>Leave</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s._id}
                      sx={{ bgcolor: attendance[s._id] === 'absent' ? '#fff3f3' : 'inherit' }}
                    >
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
                      <TableCell>
                        <Checkbox
                          checked={attendance[s._id] === 'leave'}
                          onChange={() => setAttendance({ ...attendance, [s._id]: 'leave' })}
                          color="warning"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={attendance[s._id]}
                          size="small"
                          color={
                            attendance[s._id] === 'present' ? 'success' :
                            attendance[s._id] === 'absent'  ? 'error'   : 'warning'
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
      )}
    </Layout>
  )
}

export default ManageAttendance