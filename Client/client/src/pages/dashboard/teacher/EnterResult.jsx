import { useEffect, useState } from 'react'
import {
  Box, Card, CardContent, Typography, TextField,
  MenuItem, Button, Table, TableHead, TableRow,
  TableCell, TableBody, Alert, CircularProgress, Grid
} from '@mui/material'
import API from '../../../api/axios'
import Layout from '../../../components/Layout'

const EnterResult = () => {
  const [courses,  setCourses]  = useState([])
  const [students, setStudents] = useState([])
  const [marks,    setMarks]    = useState({})
  const [selectedCourse, setSelectedCourse] = useState('')
  const [semester,       setSemester]       = useState('')
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState('')
  const [error,    setError]    = useState('')

  useEffect(() => {
    API.get('/admin/courses').then((res) => setCourses(res.data))
  }, [])

  useEffect(() => {
    if (selectedCourse) {
      const course = courses.find((c) => c._id === selectedCourse)
      setSemester(course?.semester || '')
      API.get(`/teachers/students/${selectedCourse}`).then((res) => {
        setStudents(res.data)
        const init = {}
        res.data.forEach((s) => (init[s._id] = ''))
        setMarks(init)
      })
    }
  }, [selectedCourse])

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      await Promise.all(
        students.map((s) =>
          API.post('/teachers/results', {
            studentId: s._id,
            courseId:  selectedCourse,
            semester,
            marks:     Number(marks[s._id]),
          })
        )
      )
      setSuccess('All marks saved successfully!')
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save marks')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout role="teacher">
      <Typography variant="h5" fontWeight={700} mb={3}>Enter Student Marks</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                select label="Select Course" fullWidth
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courses.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name} ({c.code})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Semester" fullWidth disabled
                value={semester ? `Semester ${semester}` : ''}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}

      {students.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Enter Marks (out of 100)
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Roll No</strong></TableCell>
                  <TableCell><strong>Student Name</strong></TableCell>
                  <TableCell><strong>Marks</strong></TableCell>
                  <TableCell><strong>Grade (Preview)</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((s) => {
                  const m = Number(marks[s._id])
                  const grade =
                    m >= 90 ? 'A+' : m >= 80 ? 'A' : m >= 70 ? 'B+' :
                    m >= 60 ? 'B'  : m >= 50 ? 'C' : m >= 40 ? 'D'  : 'F'
                  return (
                    <TableRow key={s._id}>
                      <TableCell>{s.rollNo}</TableCell>
                      <TableCell>{s.user?.name}</TableCell>
                      <TableCell>
                        <TextField
                          size="small" type="number"
                          inputProps={{ min: 0, max: 100 }}
                          value={marks[s._id]}
                          onChange={(e) => setMarks({ ...marks, [s._id]: e.target.value })}
                          sx={{ width: 90 }}
                        />
                      </TableCell>
                      <TableCell>
                        <strong style={{ color: grade === 'F' ? 'red' : 'green' }}>
                          {marks[s._id] !== '' ? grade : '-'}
                        </strong>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <Button
              variant="contained" sx={{ mt: 2 }}
              onClick={handleSubmit} disabled={loading}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Save All Marks'}
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedCourse && !students.length && (
        <Typography color="text.secondary" textAlign="center" py={4}>
          No students found for this course.
        </Typography>
      )}
    </Layout>
  )
}

export default EnterResult