import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotices } from '../features/notice/noticeSlice'
import {
  Container, Typography, Box, TextField, MenuItem,
  CircularProgress, Grid
} from '@mui/material'
import Navbar      from '../components/Navbar'
import Footer      from '../components/Footer'
import NoticeCard  from '../components/NoticeCard'

const categories = ['all', 'exam', 'event', 'holiday', 'general']

const Notices = () => {
  const dispatch = useDispatch()
  const { notices, loading } = useSelector((state) => state.notice)
  const [category, setCategory] = useState('all')
  const [search,   setSearch]   = useState('')

  useEffect(() => {
    dispatch(fetchNotices(category !== 'all' ? { category } : {}))
  }, [dispatch, category])

  const filtered = notices.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight={700}>Notice Board</Typography>
        <Typography sx={{ opacity: 0.8, mt: 1 }}>
          Stay updated with college announcements
        </Typography>
      </Box>

      <Container maxWidth="md" sx={{ py: 5 }}>
        {/* Filters */}
        <Grid container spacing={2} mb={4}>
          <Grid item xs={12} sm={8}>
            <TextField
              label="Search notices..." fullWidth size="small"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Category" select fullWidth size="small"
              value={category} onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <MenuItem key={c} value={c} sx={{ textTransform: 'capitalize' }}>{c}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {loading ? (
          <Box textAlign="center" py={6}>
            <CircularProgress />
          </Box>
        ) : filtered.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" py={6}>
            No notices found.
          </Typography>
        ) : (
          filtered.map((notice) => (
            <NoticeCard key={notice._id} notice={notice} />
          ))
        )}
      </Container>
      <Footer />
    </>
  )
}

export default Notices