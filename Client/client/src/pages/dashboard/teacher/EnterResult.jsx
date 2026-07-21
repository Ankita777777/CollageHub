import { useEffect, useState } from 'react'
import {
  Box, Card, CardContent, Typography, TextField,
  MenuItem, Button, Table, TableHead, TableRow,
  TableCell, TableBody, Alert, CircularProgress,
  Grid, Chip
} from '@mui/material'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'
import { useLocation } from 'react-router-dom'

const getGrade = (marks) => {
  if (marks >= 90) return { grade: 'A+', color: 'success' }
  if (marks >= 80) return { grade: 'A',  color: 'success' }
  if (marks >= 70) return { grade: 'B+', color: 'primary' }
  if (marks >= 60) return { grade: 'B',  color: 'primary' }
  if (marks >= 50) return { grade: 'C',  color: 'warning' }
  if (marks >= 40) return { grade: 'D',  color: 'warning' }
  return { grade: 'F', color: 'error' }
}

const EnterResult = () => {
  const location = useLocation()
  const params   = new URLSearchParams(location.search)
  const defaultCourse = params.get('course') || ''

  const [courses,  setCourses]  = useState([])
  const [students, setStudents] = useState([])
  const [marks,    setMarks]    = useState({})
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState('')
  const [selectedCourse, setSelectedCourse] = useState(defaultCourse)
  const [semester,       setSemester]       = useState('')

  useEffect(() => {
    API.get('/teachers/my-courses').then((res) => setCourses(res.data))
  }, [])

  useEffect(() => {
    if (!selectedCourse) return
    const course = courses.find((c) => c._id === selectedCourse)
    if (course) {
      setSemester(course.semester)
      setLoading(true)
      API.get(`/teachers/students/${selectedCourse}`)
        .then((res) => {
          setStudents(res.data)
          const init = {}
          res.data.forEach((s) => (init[s._id] = ''))
          setMarks(init)
          setErrors({})
        })
        .finally(() => setLoading(false))
    }
  }, [selectedCourse])

  const validate = () => {
    const errs = {}
    if (!selectedCourse) { errs.course = 'Please select a course'; return errs }
    if (!students.length) { errs.students = 'No students found'; return errs }

    students.forEach((s) => {
      const m = marks[s._id]
      if (m === '' || m === undefined) {
        errs[s._id] = 'Required'
      } else if (isNaN(m) || Number(m) < 0 || Number(m) > 100) {
        errs[s._id] = 'Must be 0-100'
      }
    })
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).filter((k) => !['course', 'students'].includes(k)).length > 0) return

    setLoading(true)
    try {
      await Promise.all(
        students.map((s) =>
          API.post('/teachers/results', {
            studentId: s._id,
            courseId:  selectedCourse,
            semester:  Number(semester),
            marks:     Number(marks[s._id]),
          })
        )
      )
      setSuccess(`✅ Marks saved for ${students.length} students!`)
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to save marks' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout role="teacher">
      <Typography variant="h5" fontWeight={700} mb={3}>Enter Student Marks</Typography>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {errors.submit && <Alert severity="error" sx={{ mb: 2 }}>{errors.submit}</Alert>}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                label="Select Course" select fullWidth
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                error={Boolean(errors.course)}
                helperText={errors.course}
              >
                {courses.length === 0 ? (
                  <MenuItem disabled>No courses assigned</MenuItem>
                ) : (
                  courses.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.name} ({c.code}) — {c.program}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Semester" disabled fullWidth
                value={semester ? `Semester ${semester}` : ''}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained" fullWidth size="large"
                onClick={handleSubmit}
                disabled={loading || !students.length}
                sx={{ height: 56 }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Save All Marks'}
              </Button>
            </Grid>
          </Grid>
          {errors.students && <Alert severity="warning" sx={{ mt: 2 }}>{errors.students}</Alert>}
        </CardContent>
      </Card>

      {selectedCourse && students.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Enter Marks (out of 100)
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                  <TableCell><strong>Roll No</strong></TableCell>
                  <TableCell><strong>Student Name</strong></TableCell>
                  <TableCell><strong>Marks (0-100)</strong></TableCell>
                  <TableCell><strong>Grade</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((s) => {
                  const m     = Number(marks[s._id])
                  const info  = marks[s._id] !== '' ? getGrade(m) : null
                  return (
                    <TableRow key={s._id}>
                      <TableCell>{s.rollNo}</TableCell>
                      <TableCell>{s.user?.name}</TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          inputProps={{ min: 0, max: 100 }}
                          value={marks[s._id]}
                          onChange={(e) => {
                            setMarks({ ...marks, [s._id]: e.target.value })
                            setErrors({ ...errors, [s._id]: '' })
                          }}
                          error={Boolean(errors[s._id])}
                          helperText={errors[s._id]}
                          sx={{ width: 100 }}
                        />
                      </TableCell>
                      <TableCell>
                        {info ? (
                          <Chip label={info.grade} size="small" color={info.color} />
                        ) : '—'}
                      </TableCell>
                      <TableCell>
                        {info ? (
                          <Chip
                            label={m >= 40 ? 'Pass' : 'Fail'}
                            size="small"
                            color={m >= 40 ? 'success' : 'error'}
                          />
                        ) : '—'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </Layout>
  )
}

export default EnterResult