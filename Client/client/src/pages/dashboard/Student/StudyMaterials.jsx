import { useState, useEffect } from 'react'
import {
  Box, Card, CardContent, Typography, Grid, Chip,
  CircularProgress, Alert, Button, TextField,
  InputAdornment, MenuItem, Select, FormControl, InputLabel
} from '@mui/material'
import DownloadIcon   from '@mui/icons-material/Download'
import LinkIcon       from '@mui/icons-material/Link'
import ArticleIcon    from '@mui/icons-material/Article'
import SlideshowIcon  from '@mui/icons-material/Slideshow'
import VideoLibIcon   from '@mui/icons-material/VideoLibrary'
import SearchIcon     from '@mui/icons-material/Search'
import API    from '../../../api/axios'
import Layout from '../../../components/Layout'

const typeIcons = {
  note:   <ArticleIcon />,
  slides: <SlideshowIcon />,
  video:  <VideoLibIcon />,
  link:   <LinkIcon />,
  other:  <ArticleIcon />,
}

const typeColors = {
  note:   '#1565C0',
  slides: '#2E7D32',
  video:  '#C62828',
  link:   '#6A1B9A',
  other:  '#E65100',
}

const StudyMaterials = () => {
  const [materials, setMaterials] = useState([])
  const [filtered,  setFiltered]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [search,    setSearch]    = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    API.get('/study-materials/my')
      .then((res) => { setMaterials(res.data); setFiltered(res.data) })
      .catch(() => setError('Failed to load study materials'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = materials
    if (typeFilter !== 'all') {
      result = result.filter((m) => m.type === typeFilter)
    }
    if (search) {
      result = result.filter((m) =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.course?.name?.toLowerCase().includes(search.toLowerCase())
      )
    }
    setFiltered(result)
  }, [search, typeFilter, materials])

  return (
    <Layout role="student">
      <Typography variant="h5" fontWeight={700} mb={3}>Study Materials</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search materials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="note">Notes</MenuItem>
            <MenuItem value="slides">Slides</MenuItem>
            <MenuItem value="video">Videos</MenuItem>
            <MenuItem value="link">Links</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box textAlign="center" py={6}><CircularProgress /></Box>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <ArticleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">
              No study materials available yet
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((m) => (
            <Grid item xs={12} sm={6} md={4} key={m._id}>
              <Card sx={{
                height: '100%',
                borderLeft: `4px solid ${typeColors[m.type] || '#1565C0'}`,
                '&:hover': { boxShadow: 6, transform: 'translateY(-2px)', transition: '0.2s' },
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                    <Box sx={{
                      bgcolor: (typeColors[m.type] || '#1565C0') + '15',
                      color:   typeColors[m.type] || '#1565C0',
                      p: 1, borderRadius: 1,
                    }}>
                      {typeIcons[m.type] || <ArticleIcon />}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
                        {m.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={m.course?.name} size="small" color="primary" />
                        <Chip
                          label={m.type}
                          size="small"
                          sx={{
                            bgcolor: (typeColors[m.type] || '#1565C0') + '15',
                            color:   typeColors[m.type] || '#1565C0',
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {m.description && (
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {m.description}
                    </Typography>
                  )}

                  <Typography variant="caption" color="text.disabled" display="block" mb={2}>
                    By {m.teacher?.user?.name} |{' '}
                    {new Date(m.createdAt).toLocaleDateString()}
                  </Typography>

                  {m.file && (
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      startIcon={<DownloadIcon />}
                      href={m.file}
                      target="_blank"
                      sx={{ mb: 1 }}
                    >
                      Download
                    </Button>
                  )}
                  {m.link && (
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      startIcon={<LinkIcon />}
                      href={m.link}
                      target="_blank"
                    >
                      Open Link
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Layout>
  )
}

export default StudyMaterials