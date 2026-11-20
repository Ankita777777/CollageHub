import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, Grid, Card, CardContent, Button, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab,
  TextField, InputAdornment, ToggleButtonGroup, ToggleButton,
  Accordion, AccordionSummary, AccordionDetails, Table, TableHead,
  TableRow, TableCell, TableBody, Alert
} from '@mui/material'
import SearchIcon       from '@mui/icons-material/Search'
import MenuBookIcon     from '@mui/icons-material/MenuBook'
import AccessTimeIcon   from '@mui/icons-material/AccessTime'
import GroupsIcon       from '@mui/icons-material/Groups'
import CheckCircleIcon  from '@mui/icons-material/CheckCircle'
import ExpandMoreIcon   from '@mui/icons-material/ExpandMore'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { programs, levels, faculties } from '../data/programs'

const Detail = ({ program, onClose, onApply }) => {
  const [tab, setTab] = useState(0)

  return (
    <>
      <DialogTitle sx={{ bgcolor: program.color, color: 'white' }}>
        <Typography variant="h5" fontWeight={700}>{program.code}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>{program.full}</Typography>
        <Chip label={program.affiliation} size="small"
          sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ bgcolor: '#f5f7fa', p: 2 }}>
          <Grid container spacing={1.5}>
            {[
              { label: 'Duration',  value: program.duration },
              { label: 'Semesters', value: program.semesters },
              { label: 'Seats',     value: program.seats },
              { label: 'Level',     value: program.level },
            ].map((i) => (
              <Grid item xs={6} sm={3} key={i.label}>
                <Box sx={{ textAlign: 'center', bgcolor: 'white', p: 1.2, borderRadius: 2 }}>
                  <Typography fontWeight={700} sx={{ color: program.color }}>{i.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{i.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="scrollable"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tab label="Syllabus" />
          <Tab label="Eligibility & Fee" />
          <Tab label="Career" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tab === 0 && (
            program.syllabus ? (
              program.syllabus.map((sem) => (
                <Accordion key={sem.sem} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Chip label={`Semester ${sem.sem}`} size="small"
                      sx={{ bgcolor: program.color, color: 'white' }} />
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Code</strong></TableCell>
                          <TableCell><strong>Subject</strong></TableCell>
                          <TableCell align="center"><strong>Credits</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sem.subjects.map((s) => (
                          <TableRow key={s.code}>
                            <TableCell>{s.code}</TableCell>
                            <TableCell>{s.name}</TableCell>
                            <TableCell align="center">{s.credit}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <>
                <Typography variant="subtitle1" fontWeight={700} mb={1}>Key Subject Areas</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {program.subjects.map((s) => (
                    <Chip key={s} label={s} variant="outlined" />
                  ))}
                </Box>
                <Alert severity="info">
                  The semester-wise syllabus follows the official {program.affiliation} curriculum.
                  Contact the college office for the full course structure.
                </Alert>
              </>
            )
          )}

          {tab === 1 && (
            <>
              <Typography variant="subtitle1" fontWeight={700} mb={1}>Eligibility</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>{program.eligibility}</Typography>

              <Typography variant="subtitle1" fontWeight={700} mb={1}>Required Documents</Typography>
              {[
                'SEE / SLC marksheet and certificate',
                'Previous level marksheet, transcript and certificate',
                'Character certificate',
                'Citizenship or birth certificate',
                'Passport size photos',
                'Migration / equivalence certificate (if applicable)',
              ].map((d) => (
                <Box key={d} sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography variant="body2">{d}</Typography>
                </Box>
              ))}

              <Box sx={{ bgcolor: '#f5f7fa', p: 2, borderRadius: 2, mt: 2 }}>
                <Typography variant="body2">Fee: <strong>{program.fee}</strong></Typography>
              </Box>
            </>
          )}

          {tab === 2 && (
            <Grid container spacing={1.5}>
              {program.careers.map((c) => (
                <Grid item xs={12} sm={6} key={c}>
                  <Box sx={{ display: 'flex', gap: 1.5, p: 1.5, bgcolor: '#f5f7fa', borderRadius: 2 }}>
                    <CheckCircleIcon sx={{ color: program.color }} fontSize="small" />
                    <Typography variant="body2" fontWeight={600}>{c}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={onApply} sx={{ bgcolor: program.color }}>
          Apply for {program.code}
        </Button>
      </DialogActions>
    </>
  )
}

const Courses = () => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [level,    setLevel]    = useState('All')
  const [faculty,  setFaculty]  = useState('All')
  const [search,   setSearch]   = useState('')

  const filtered = useMemo(() => programs.filter((p) =>
    (level   === 'All' || p.level   === level) &&
    (faculty === 'All' || p.faculty === faculty) &&
    (`${p.code} ${p.full}`.toLowerCase().includes(search.toLowerCase()))
  ), [level, faculty, search])

  const apply = (code) => navigate(`/admissions?program=${encodeURIComponent(code)}`)

  return (
    <>
      <Navbar />

      <Box sx={{
        background: 'linear-gradient(135deg, #0D47A1, #1E88E5)',
        color: 'white', py: 8, textAlign: 'center', px: 2,
      }}>
        <Typography variant="h3" fontWeight={800} mb={1}>Our Programs</Typography>
        <Typography variant="h6" sx={{ opacity: 0.85 }}>
          {programs.length} programs across Management, IT, Science, Humanities & Social Sciences
        </Typography>
      </Box>

      <Container sx={{ py: 5 }}>
        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3, alignItems: 'center' }}>
          <TextField
            placeholder="Search programs..."
            size="small" value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: { xs: '100%', sm: 280 } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
            }}
          />
          <ToggleButtonGroup size="small" exclusive value={level}
            onChange={(e, v) => v && setLevel(v)}>
            {levels.map((l) => <ToggleButton key={l} value={l}>{l}</ToggleButton>)}
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
          {faculties.map((f) => (
            <Chip key={f} label={f} clickable
              color={faculty === f ? 'primary' : 'default'}
              variant={faculty === f ? 'filled' : 'outlined'}
              onClick={() => setFaculty(f)} />
          ))}
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Showing {filtered.length} program(s)
        </Typography>

        <Grid container spacing={3}>
          {filtered.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.code}>
              <Card sx={{
                height: '100%', borderTop: `4px solid ${p.color}`,
                display: 'flex', flexDirection: 'column',
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
              }}>
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box sx={{ bgcolor: p.color + '15', color: p.color, p: 1.2, borderRadius: 2, display: 'flex' }}>
                      <MenuBookIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={800} sx={{ color: p.color, lineHeight: 1.2 }}>
                        {p.code}
                      </Typography>
                      <Chip label={p.level} size="small" sx={{ mt: 0.5 }} />
                    </Box>
                  </Box>

                  <Typography variant="body2" fontWeight={500} mb={0.5}>{p.full}</Typography>
                  <Typography variant="caption" color="text.disabled" display="block" mb={0.5}>
                    {p.faculty}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" display="block" mb={2}>
                    {p.affiliation}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="caption">{p.duration}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <GroupsIcon fontSize="small" color="action" />
                      <Typography variant="caption">{p.seats} seats</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" size="small" fullWidth
                      onClick={() => setSelected(p)}
                      sx={{ borderColor: p.color, color: p.color }}>
                      Details
                    </Button>
                    <Button variant="contained" size="small" fullWidth
                      onClick={() => apply(p.code)}
                      sx={{ bgcolor: p.color, '&:hover': { bgcolor: p.color } }}>
                      Apply Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {filtered.length === 0 && (
            <Grid item xs={12}>
              <Typography textAlign="center" color="text.secondary" py={6}>
                No programs match your search.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)}
        maxWidth="md" fullWidth scroll="paper">
        {selected && (
          <Detail
            program={selected}
            onClose={() => setSelected(null)}
            onApply={() => { const c = selected.code; setSelected(null); apply(c) }}
          />
        )}
      </Dialog>

      <Footer />
    </>
  )
}

export default Courses