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

const getGradeInfo = (marks) => {
  const m = Number(marks)
  if (m >= 90) return { grade: 'A+', color: 'success' }
  if (m >= 80) return { grade: 'A',  color: 'success' }
  if (m >= 70) return { grade: 'B+', color: 'primary' }
  if (m >= 60) return { grade: 'B',  color: 'primary' }
  if (m >= 50) return { grade: 'C',  color: 'warning' }
  if (m >= 40) return { grade: 'D',  color: 'warning' }
  return { grade: 'F', color: 'error' }
}

const EnterResult = () => {
  const location      = useLocation()
  const params        = new URLSearchParams(location.search)
  const defaultCourse = params.get('course') || ''

  const [courses,        setCourses]        = useState([])
  const [students,       setStudents]       = useState([])
  const [marks,          setMarks]          = useState({})
  const [errors,         setErrors]         = useState({})
  const [loading,        setLoading]        = useState(false)
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [success,        setSuccess]        = useState('')
  const [selectedCourse, setSelectedCourse] = useState(defaultCourse)
  const [semester,       setSemester]       = useState('')

  // Load teacher's courses
  useEffect(() => {
    API.get('/teachers/my-courses')
      .then((res) => {
        setCourses(res.data)
        // Auto select if course in URL
        if (defaultCourse && res.data.length > 0) {
          const found = res.data.find((c) => c._id === defaultCourse)
          if (found) setSemester(found.semester)
        }
      })
      .catch(() => setErrors({ global: 'Failed to load courses' }))
      .finally(() => setCoursesLoading(false))
  }, [])

  // Load students when course selected
  useEffect(() => {
    if (!selectedCourse) {
      setStudents([])
      setMarks({})
      return
    }

    const course = courses.find((c) => c._id === selectedCourse)
    if (course) setSemester(course.semester)

    setLoading(true)
    setErrors({})

    // Use the correct endpoint to get students by course
    API.get(`/teachers/students/${selectedCourse}`)
      .then((res) => {
        if (res.data.length === 0) {
          setErrors({ students: 'No students found for this course. Make sure students are enrolled in the same program and semester.' })
        }
        setStudents(res.data)
        const init = {}
        res.data.forEach((s) => (init[s._id] = ''))
        setMarks(init)
      })
      .catch((err) => {
        setErrors({ global: err.response?.data?.message || 'Failed to load students' })
      })
      .finally(() => setLoading(false))
  }, [selectedCourse, courses])

  const validate = () => {
    const errs = {}
    students.forEach((s) => {
      const m = marks[s._id]
      if (m === '' || m === undefined || m === null) {
        errs[s._id] = 'Required'
      } else if (isNaN(Number(m)) || Number(m) < 0 || Number(m) > 100) {
        errs[s._id] = '0-100 only'
      }
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!selectedCourse) {
      return setErrors({ course: 'Please select a course' })
    }
    if (students.length === 0) {
      return setErrors({ students: 'No students to save marks for' })
    }
    if (!validate()) return

    setLoading(true)
    setErrors({})

    try {
      // Save marks for each student one by one
      const results = await Promise.all(
        students.map((s) =>
          API.post('/teachers/results', {
            studentId: s._id,
            courseId:  selectedCourse,
            semester:  Number(semester),
            marks:     Number(marks[s._id]),
          })
        )
      )

      setSuccess(`✅ Marks saved successfully for ${students.length} students!`)
      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      setErrors({ global: err.response?.data?.message || 'Failed to save marks. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout role="teacher">
      <Typography variant="h5" fontWeight={700} mb={3}>Enter Student Marks</Typography>

      {errors.global  && <Alert severity="error"   sx={{ mb: 2 }}>{errors.global}</Alert>}
      {errors.students && <Alert severity="warning" sx={{ mb: 2 }}>{errors.students}</Alert>}
      {success         && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Course Selector */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                label="Select Course *"
                select
                fullWidth
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value)
                  setErrors({})
                  setSuccess('')
                }}
                error={Boolean(errors.course)}
                helperText={errors.course || 'Only your assigned courses are shown'}
                disabled={coursesLoading}
              >
                {coursesLoading ? (
                  <MenuItem disabled>Loading courses...</MenuItem>
                ) : courses.length === 0 ? (
                  <MenuItem disabled>No courses assigned to you</MenuItem>
                ) : (
                  courses.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.name} ({c.code}) — {c.program} Sem {c.semester}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Semester"
                fullWidth
                disabled
                value={semester ? `Semester ${semester}` : '—'}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleSubmit}
                disabled={loading || !selectedCourse || students.length === 0}
                sx={{ height: 56 }}
              >
                {loading
                  ? <CircularProgress size={22} color="inherit" />
                  : 'Save All Marks'
                }
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Student Marks Table */}
      {selectedCourse && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Enter Marks — {courses.find((c) => c._id === selectedCourse)?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {students.length} students | Passing marks: 40/100
              </Typography>
            </Box>

            {loading ? (
              <Box textAlign="center" py={6}><CircularProgress /></Box>
            ) : students.length === 0 ? (
              <Alert severity="info">
                No students found for this course. Students must be enrolled
                in the same program and semester as this course.
              </Alert>
            ) : (
              <>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                      <TableCell><strong>#</strong></TableCell>
                      <TableCell><strong>Roll No</strong></TableCell>
                      <TableCell><strong>Student Name</strong></TableCell>
                      <TableCell><strong>Marks (0-100)</strong></TableCell>
                      <TableCell><strong>Grade</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((s, index) => {
                      const m    = marks[s._id]
                      const info = m !== '' && m !== undefined && !isNaN(Number(m))
                        ? getGradeInfo(Number(m))
                        : null
                      return (
                        <TableRow
                          key={s._id}
                          sx={{
                            bgcolor:
                              info && Number(m) < 40 ? '#fff3f3' :
                              info && Number(m) >= 40 ? '#f3fff3' : 'inherit'
                          }}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {s.rollNo || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{s.user?.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {s.user?.email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              inputProps={{ min: 0, max: 100, step: 1 }}
                              value={marks[s._id]}
                              onChange={(e) => {
                                setMarks({ ...marks, [s._id]: e.target.value })
                                setErrors((prev) => ({ ...prev, [s._id]: '' }))
                              }}
                              error={Boolean(errors[s._id])}
                              helperText={errors[s._id]}
                              sx={{ width: 110 }}
                              placeholder="0-100"
                            />
                          </TableCell>
                          <TableCell>
                            {info ? (
                              <Chip label={info.grade} size="small" color={info.color} />
                            ) : (
                              <Typography variant="caption" color="text.disabled">—</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {info ? (
                              <Chip
                                label={Number(m) >= 40 ? '✅ Pass' : '❌ Fail'}
                                size="small"
                                color={Number(m) >= 40 ? 'success' : 'error'}
                              />
                            ) : (
                              <Typography variant="caption" color="text.disabled">—</Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>

                {/* Summary */}
                {Object.values(marks).some((m) => m !== '') && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f7fa', borderRadius: 2 }}>
                    <Grid container spacing={2}>
                      {[
                        {
                          label: 'Pass',
                          value: students.filter((s) => marks[s._id] !== '' && Number(marks[s._id]) >= 40).length,
                          color: 'success.main',
                        },
                        {
                          label: 'Fail',
                          value: students.filter((s) => marks[s._id] !== '' && Number(marks[s._id]) < 40 && marks[s._id] !== '').length,
                          color: 'error.main',
                        },
                        {
                          label: 'Average',
                          value: (() => {
                            const filled = students.filter((s) => marks[s._id] !== '' && !isNaN(Number(marks[s._id])))
                            if (!filled.length) return '—'
                            const avg = filled.reduce((sum, s) => sum + Number(marks[s._id]), 0) / filled.length
                            return avg.toFixed(1)
                          })(),
                          color: 'primary.main',
                        },
                      ].map((stat) => (
                        <Grid item xs={4} key={stat.label}>
                          <Box textAlign="center">
                            <Typography variant="h6" fontWeight={700} sx={{ color: stat.color }}>
                              {stat.value}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {stat.label}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Layout>
  )
}

export default EnterResult