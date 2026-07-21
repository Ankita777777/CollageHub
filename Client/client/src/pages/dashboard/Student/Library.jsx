import { useState, useEffect } from 'react'
import {
  Box, Card, CardContent, Typography, Grid, Chip,
  CircularProgress, Alert, TextField, InputAdornment,
  Button, Table, TableHead, TableRow, TableCell, TableBody,
  Tabs, Tab, Avatar
} from '@mui/material'
import SearchIcon    from '@mui/icons-material/Search'
import MenuBookIcon  from '@mui/icons-material/MenuBook'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const Library = () => {
  const [books,    setBooks]    = useState([])
  const [myBooks,  setMyBooks]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [search,   setSearch]   = useState('')
  const [tab,      setTab]      = useState(0)

  const fetchBooks = async () => {
    try {
      const [bRes, mRes] = await Promise.all([
        API.get('/library'),
        API.get('/library/my'),
      ])
      setBooks(bRes.data)
      setMyBooks(mRes.data)
    } catch (err) {
      setError('Failed to load library')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBooks() }, [])

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout role="student">
      <Typography variant="h5" fontWeight={700} mb={3}>Library</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label={`All Books (${books.length})`} />
        <Tab label={`My Issued Books (${myBooks.length})`} />
      </Tabs>

      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : tab === 0 ? (
        <>
          <TextField
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ mb: 3, width: 320 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Grid container spacing={3}>
            {filtered.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book._id}>
                <Card sx={{ height: '100%', '&:hover': { boxShadow: 6 }, transition: '0.2s' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      {book.cover ? (
                        <Box
                          component="img"
                          src={book.cover}
                          alt={book.title}
                          sx={{ width: 60, height: 80, objectFit: 'cover', borderRadius: 1 }}
                        />
                      ) : (
                        <Box sx={{
                          width: 60, height: 80,
                          bgcolor: 'primary.main',
                          borderRadius: 1,
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: 'white',
                        }}>
                          <MenuBookIcon />
                        </Box>
                      )}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
                          {book.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {book.author}
                        </Typography>
                        {book.isbn && (
                          <Typography variant="caption" color="text.disabled">
                            ISBN: {book.isbn}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      {book.category && (
                        <Chip label={book.category} size="small" />
                      )}
                      {book.program && (
                        <Chip label={book.program} size="small" color="primary" />
                      )}
                    </Box>

                    <Box sx={{
                      display: 'flex', justifyContent: 'space-between',
                      mt: 1, p: 1, bgcolor: '#f5f7fa', borderRadius: 1,
                    }}>
                      <Typography variant="caption">
                        Total: <strong>{book.totalCopies}</strong>
                      </Typography>
                      <Typography variant="caption"
                        sx={{ color: book.available > 0 ? 'success.main' : 'error.main', fontWeight: 700 }}>
                        Available: {book.available}
                      </Typography>
                    </Box>

                    {book.available === 0 && (
                      <Chip label="Not Available" color="error" size="small" sx={{ mt: 1, width: '100%' }} />
                    )}
                    {book.available > 0 && (
                      <Chip label="Available" color="success" size="small" sx={{ mt: 1, width: '100%' }} />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {filtered.length === 0 && (
              <Grid item xs={12}>
                <Typography textAlign="center" color="text.secondary" py={4}>
                  No books found
                </Typography>
              </Grid>
            )}
          </Grid>
        </>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={2}>My Issued Books</Typography>
            {myBooks.length === 0 ? (
              <Typography textAlign="center" color="text.secondary" py={4}>
                No books issued to you
              </Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                    <TableCell><strong>Book</strong></TableCell>
                    <TableCell><strong>Issue Date</strong></TableCell>
                    <TableCell><strong>Due Date</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Fine</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myBooks.map((item, i) => (
                    <TableRow key={i}
                      sx={{ bgcolor: item.isOverdue ? '#fff3f3' : 'inherit' }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{item.book?.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{item.book?.author}</Typography>
                      </TableCell>
                      <TableCell>{new Date(item.issue?.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ color: item.isOverdue ? 'error.main' : 'inherit', fontWeight: item.isOverdue ? 700 : 400 }}
                        >
                          {new Date(item.issue?.dueDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.isOverdue ? 'Overdue' : 'Issued'}
                          size="small"
                          color={item.isOverdue ? 'error' : 'success'}
                        />
                      </TableCell>
                      <TableCell>
                        {item.isOverdue ? (
                          <Typography variant="body2" color="error.main" fontWeight={700}>
                            Rs. {item.issue?.fine || 'Calculating...'}
                          </Typography>
                        ) : '—'}
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

export default Library