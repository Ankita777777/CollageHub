import { useEffect, useState } from 'react'
import {
  Box, Card, CardContent, Typography, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, Button,
  TextField, Alert, CircularProgress, Avatar, InputAdornment
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const ManageStudents = () => {
  const [students, setStudents] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [success,  setSuccess]  = useState('')
  const [error,    setError]    = useState('')

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const res = await API.get('/admin/students', {
        params: search ? { search } : {}
      })
      setStudents(res.data)
    } catch (err) {
      setError('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStudents() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchStudents()
  }

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this student?')) return
    try {
      await API.delete(`/admin/students/${id}`)
      setStudents(students.filter((s) => s._id !== id))
      setSuccess('Student deactivated')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to deactivate')
    }
  }

  return (
    <Layout role="admin">
      <Typography variant="h5" fontWeight={700} mb={3}>Manage Students</Typography>

      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}

      {/* Search */}
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search by name, email or roll no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ width: 350 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" variant="contained" sx={{ ml: 1 }}>Search</Button>
        <Button sx={{ ml: 1 }} onClick={() => { setSearch(''); fetchStudents() }}>
          Clear
        </Button>
      </Box>

      <Card>
        <CardContent>
          {loading ? (
            <Box textAlign="center" py={6}><CircularProgress /></Box>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                    <TableCell><strong>Student</strong></TableCell>
                    <TableCell><strong>Roll No</strong></TableCell>
                    <TableCell><strong>Program</strong></TableCell>
                    <TableCell><strong>Semester</strong></TableCell>
                    <TableCell><strong>Batch</strong></TableCell>
                    <TableCell><strong>Phone</strong></TableCell>
                    <TableCell><strong>Fee Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: 'primary.main' }}>
                            {s.user?.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {s.user?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {s.user?.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{s.rollNo || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip label={s.program || 'N/A'} size="small" color="primary" />
                      </TableCell>
                      <TableCell>Sem {s.semester}</TableCell>
                      <TableCell>{s.batch || 'N/A'}</TableCell>
                      <TableCell>{s.phone || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={s.feeStatus}
                          size="small"
                          color={s.feeStatus === 'paid' ? 'success' : s.feeStatus === 'partial' ? 'warning' : 'error'}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small" color="error"
                          onClick={() => handleDeactivate(s._id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!students.length && (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                        No students found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>
    </Layout>
  )
}

export default ManageStudents