import { useEffect, useState } from 'react'
import {
  Box, Card, CardContent, Typography, Table, TableHead,
  TableRow, TableCell, TableBody, Avatar, CircularProgress,
  Alert, Chip, TextField, InputAdornment
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import Layout from '../../../components/Layout'
import API    from '../../../api/axios'

const MyStudents = () => {
  const [students, setStudents] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [search,   setSearch]   = useState('')

  useEffect(() => {
    API.get('/teachers/my-students')
      .then((res) => { setStudents(res.data); setFiltered(res.data) })
      .catch(() => setError('Failed to load students'))
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = (e) => {
    const val = e.target.value
    setSearch(val)
    setFiltered(
      students.filter((s) =>
        s.user?.name?.toLowerCase().includes(val.toLowerCase()) ||
        s.rollNo?.toLowerCase().includes(val.toLowerCase()) ||
        s.user?.email?.toLowerCase().includes(val.toLowerCase())
      )
    )
  }

  return (
    <Layout role="teacher">
      <Typography variant="h5" fontWeight={700} mb={3}>My Students</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Total: <strong>{students.length}</strong> students
        </Typography>
        <TextField
          placeholder="Search students..."
          value={search}
          onChange={handleSearch}
          size="small"
          sx={{ width: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
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
                    <TableCell><strong>Phone</strong></TableCell>
                    <TableCell><strong>Fee</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow key={s._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 13 }}>
                            {s.user?.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>{s.user?.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{s.user?.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell><strong>{s.rollNo || 'N/A'}</strong></TableCell>
                      <TableCell>
                        <Chip label={s.program || 'N/A'} size="small" color="primary" />
                      </TableCell>
                      <TableCell>Sem {s.semester}</TableCell>
                      <TableCell>{s.phone || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={s.feeStatus}
                          size="small"
                          color={s.feeStatus === 'paid' ? 'success' : s.feeStatus === 'partial' ? 'warning' : 'error'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
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

export default MyStudents