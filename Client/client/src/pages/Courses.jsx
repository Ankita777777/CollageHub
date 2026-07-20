import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Button, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, List, ListItem, ListItemIcon,
  ListItemText, Divider, Tabs, Tab, Table,
  TableHead, TableRow, TableCell, TableBody, Accordion,
  AccordionSummary, AccordionDetails
} from '@mui/material'
import MenuBookIcon      from '@mui/icons-material/MenuBook'
import AccessTimeIcon    from '@mui/icons-material/AccessTime'
import GroupsIcon        from '@mui/icons-material/Groups'
import CheckCircleIcon   from '@mui/icons-material/CheckCircle'
import ExpandMoreIcon    from '@mui/icons-material/ExpandMore'
import SchoolIcon        from '@mui/icons-material/School'
import WorkIcon          from '@mui/icons-material/Work'
import Navbar  from '../components/Navbar'
import Footer  from '../components/Footer'

const courses = [
  {
    name:        'BCA',
    full:        'Bachelor of Computer Applications',
    duration:    '4 Years',
    seats:       60,
    semester:    8,
    color:       '#2E7D32',
    affiliation: 'Tribhuvan University (TU)',
    eligibility: 'Passed 10+2 with Mathematics, minimum 45%',
    fee:         'Rs. 60,000/year',
    career:      ['Software Developer', 'Web Developer', 'System Analyst', 'IT Manager', 'Database Admin', 'Network Engineer'],
    syllabus: [
      {
        sem: 1,
        subjects: [
          { code: 'CACS101', name: 'Computer Fundamentals & Applications', credit: 3 },
          { code: 'CACS102', name: 'Society & Technology',                  credit: 3 },
          { code: 'CACS103', name: 'English I',                             credit: 3 },
          { code: 'CACS104', name: 'Mathematics I',                         credit: 3 },
          { code: 'CACS105', name: 'Digital Logic',                         credit: 3 },
          { code: 'CACSLAB1','name': 'Computer Lab I',                      credit: 1 },
        ],
      },
      {
        sem: 2,
        subjects: [
          { code: 'CACS151', name: 'C Programming',                         credit: 3 },
          { code: 'CACS152', name: 'Financial Accounting',                  credit: 3 },
          { code: 'CACS153', name: 'English II',                            credit: 3 },
          { code: 'CACS154', name: 'Mathematics II',                        credit: 3 },
          { code: 'CACS155', name: 'Microprocessor & Computer Organization', credit: 3 },
          { code: 'CACSLAB2','name': 'Computer Lab II',                     credit: 1 },
        ],
      },
      {
        sem: 3,
        subjects: [
          { code: 'CACS201', name: 'Data Structures & Algorithms',          credit: 3 },
          { code: 'CACS202', name: 'System Analysis & Design',              credit: 3 },
          { code: 'CACS203', name: 'OOP in Java',                           credit: 3 },
          { code: 'CACS204', name: 'Statistics I',                          credit: 3 },
          { code: 'CACS205', name: 'Operating System',                      credit: 3 },
          { code: 'CACSLAB3','name': 'Computer Lab III',                    credit: 1 },
        ],
      },
      {
        sem: 4,
        subjects: [
          { code: 'CACS251', name: 'Computer Graphics & Animation',         credit: 3 },
          { code: 'CACS252', name: 'Database Management System',            credit: 3 },
          { code: 'CACS253', name: 'Web Technology',                        credit: 3 },
          { code: 'CACS254', name: 'Statistics II',                         credit: 3 },
          { code: 'CACS255', name: 'Software Engineering',                  credit: 3 },
          { code: 'CACSLAB4','name': 'Computer Lab IV',                     credit: 1 },
        ],
      },
      {
        sem: 5,
        subjects: [
          { code: 'CACS301', name: 'MIS & E-Business',                      credit: 3 },
          { code: 'CACS302', name: 'DotNet Technology',                     credit: 3 },
          { code: 'CACS303', name: 'Computer Networks',                     credit: 3 },
          { code: 'CACS304', name: 'Numerical Methods',                     credit: 3 },
          { code: 'CACS305', name: 'Advanced Java',                         credit: 3 },
          { code: 'CACSLAB5','name': 'Computer Lab V',                      credit: 1 },
        ],
      },
      {
        sem: 6,
        subjects: [
          { code: 'CACS351', name: 'Mobile Programming',                    credit: 3 },
          { code: 'CACS352', name: 'Network Security',                      credit: 3 },
          { code: 'CACS353', name: 'Cloud Computing',                       credit: 3 },
          { code: 'CACS354', name: 'Artificial Intelligence',               credit: 3 },
          { code: 'CACS355', name: 'Project I',                             credit: 3 },
          { code: 'CACSLAB6','name': 'Computer Lab VI',                     credit: 1 },
        ],
      },
      {
        sem: 7,
        subjects: [
          { code: 'CACS401', name: 'Advanced Database',                     credit: 3 },
          { code: 'CACS402', name: 'Data Mining',                           credit: 3 },
          { code: 'CACS403', name: 'Internship',                            credit: 3 },
          { code: 'CACS404', name: 'Elective I',                            credit: 3 },
          { code: 'CACS405', name: 'Project II',                            credit: 3 },
        ],
      },
      {
        sem: 8,
        subjects: [
          { code: 'CACS451', name: 'E-Governance',                          credit: 3 },
          { code: 'CACS452', name: 'Elective II',                           credit: 3 },
          { code: 'CACS453', name: 'Research Methodology',                  credit: 3 },
          { code: 'CACS454', name: 'Major Project',                         credit: 6 },
        ],
      },
    ],
  },
  {
    name:        'BBA',
    full:        'Bachelor of Business Administration',
    duration:    '4 Years',
    seats:       60,
    semester:    8,
    color:       '#1565C0',
    affiliation: 'Pokhara University (PU)',
    eligibility: 'Passed 10+2 in any stream, minimum 45%',
    fee:         'Rs. 65,000/year',
    career:      ['Business Manager', 'Entrepreneur', 'HR Manager', 'Marketing Executive', 'Financial Analyst', 'Operations Manager'],
    syllabus: [
      {
        sem: 1,
        subjects: [
          { code: 'BBA101', name: 'Principles of Management',               credit: 3 },
          { code: 'BBA102', name: 'Financial Accounting',                   credit: 3 },
          { code: 'BBA103', name: 'Business Mathematics',                   credit: 3 },
          { code: 'BBA104', name: 'Business English',                       credit: 3 },
          { code: 'BBA105', name: 'Microeconomics',                         credit: 3 },
        ],
      },
      {
        sem: 2,
        subjects: [
          { code: 'BBA151', name: 'Organizational Behavior',                credit: 3 },
          { code: 'BBA152', name: 'Cost & Management Accounting',           credit: 3 },
          { code: 'BBA153', name: 'Business Statistics',                    credit: 3 },
          { code: 'BBA154', name: 'Business Communication',                 credit: 3 },
          { code: 'BBA155', name: 'Macroeconomics',                         credit: 3 },
        ],
      },
      {
        sem: 3,
        subjects: [
          { code: 'BBA201', name: 'Marketing Management',                   credit: 3 },
          { code: 'BBA202', name: 'Human Resource Management',              credit: 3 },
          { code: 'BBA203', name: 'Business Law',                           credit: 3 },
          { code: 'BBA204', name: 'Corporate Finance',                      credit: 3 },
          { code: 'BBA205', name: 'Entrepreneurship',                       credit: 3 },
        ],
      },
      {
        sem: 4,
        subjects: [
          { code: 'BBA251', name: 'Operations Management',                  credit: 3 },
          { code: 'BBA252', name: 'Financial Management',                   credit: 3 },
          { code: 'BBA253', name: 'Consumer Behavior',                      credit: 3 },
          { code: 'BBA254', name: 'Research Methodology',                   credit: 3 },
          { code: 'BBA255', name: 'Management Information System',          credit: 3 },
        ],
      },
      {
        sem: 5,
        subjects: [
          { code: 'BBA301', name: 'Strategic Management',                   credit: 3 },
          { code: 'BBA302', name: 'International Business',                 credit: 3 },
          { code: 'BBA303', name: 'Taxation',                               credit: 3 },
          { code: 'BBA304', name: 'Project Management',                     credit: 3 },
          { code: 'BBA305', name: 'Elective I',                             credit: 3 },
        ],
      },
      {
        sem: 6,
        subjects: [
          { code: 'BBA351', name: 'E-Commerce',                             credit: 3 },
          { code: 'BBA352', name: 'Supply Chain Management',                credit: 3 },
          { code: 'BBA353', name: 'Investment Management',                  credit: 3 },
          { code: 'BBA354', name: 'Elective II',                            credit: 3 },
          { code: 'BBA355', name: 'Internship Report',                      credit: 3 },
        ],
      },
      {
        sem: 7,
        subjects: [
          { code: 'BBA401', name: 'Business Ethics & CSR',                  credit: 3 },
          { code: 'BBA402', name: 'Leadership & Change Management',         credit: 3 },
          { code: 'BBA403', name: 'Elective III',                           credit: 3 },
          { code: 'BBA404', name: 'Major Project I',                        credit: 3 },
        ],
      },
      {
        sem: 8,
        subjects: [
          { code: 'BBA451', name: 'Corporate Governance',                   credit: 3 },
          { code: 'BBA452', name: 'Elective IV',                            credit: 3 },
          { code: 'BBA453', name: 'Major Project II',                       credit: 6 },
        ],
      },
    ],
  },
  {
    name:        'BBS',
    full:        'Bachelor of Business Studies',
    duration:    '4 Years',
    seats:       80,
    semester:    8,
    color:       '#E65100',
    affiliation: 'Tribhuvan University (TU)',
    eligibility: 'Passed 10+2 in any stream',
    fee:         'Rs. 30,000/year',
    career:      ['Accountant', 'Business Analyst', 'Finance Officer', 'Bank Officer', 'Tax Consultant'],
    syllabus: [
      { sem: 1, subjects: [
        { code: 'MGT101', name: 'Principles of Management',   credit: 3 },
        { code: 'ECO101', name: 'Microeconomics',             credit: 3 },
        { code: 'ACC101', name: 'Financial Accounting',       credit: 3 },
        { code: 'ENG101', name: 'Business English',           credit: 3 },
        { code: 'MTH101', name: 'Business Mathematics',       credit: 3 },
      ]},
      { sem: 2, subjects: [
        { code: 'MGT102', name: 'Business Organization',      credit: 3 },
        { code: 'ECO102', name: 'Macroeconomics',             credit: 3 },
        { code: 'ACC102', name: 'Cost Accounting',            credit: 3 },
        { code: 'ENG102', name: 'Business Communication',     credit: 3 },
        { code: 'STA102', name: 'Business Statistics',        credit: 3 },
      ]},
      { sem: 3, subjects: [
        { code: 'FIN201', name: 'Financial Management',       credit: 3 },
        { code: 'MKT201', name: 'Marketing Management',       credit: 3 },
        { code: 'HRM201', name: 'Human Resource Management',  credit: 3 },
        { code: 'LAW201', name: 'Business Law',               credit: 3 },
        { code: 'ENT201', name: 'Entrepreneurship',           credit: 3 },
      ]},
      { sem: 4, subjects: [
        { code: 'FIN251', name: 'Corporate Finance',          credit: 3 },
        { code: 'MKT251', name: 'Consumer Behavior',          credit: 3 },
        { code: 'MGT251', name: 'Operations Management',      credit: 3 },
        { code: 'RES251', name: 'Research Methodology',       credit: 3 },
        { code: 'MIS251', name: 'MIS',                        credit: 3 },
      ]},
    ],
  },
  {
    name:        'MBA',
    full:        'Master of Business Administration',
    duration:    '2 Years',
    seats:       40,
    semester:    4,
    color:       '#C62828',
    affiliation: 'Pokhara University (PU)',
    eligibility: "Bachelor's degree with minimum 50%",
    fee:         'Rs. 1,20,000/year',
    career:      ['CEO', 'Business Consultant', 'Operations Director', 'Finance Director', 'Marketing Director'],
    syllabus: [
      { sem: 1, subjects: [
        { code: 'MBA501', name: 'Management Concepts & OB',   credit: 3 },
        { code: 'MBA502', name: 'Managerial Economics',       credit: 3 },
        { code: 'MBA503', name: 'Financial Reporting',        credit: 3 },
        { code: 'MBA504', name: 'Quantitative Techniques',    credit: 3 },
        { code: 'MBA505', name: 'Marketing Management',       credit: 3 },
      ]},
      { sem: 2, subjects: [
        { code: 'MBA551', name: 'Strategic Management',       credit: 3 },
        { code: 'MBA552', name: 'Corporate Finance',          credit: 3 },
        { code: 'MBA553', name: 'HRM & Industrial Relations', credit: 3 },
        { code: 'MBA554', name: 'Research Methods',           credit: 3 },
        { code: 'MBA555', name: 'IT for Managers',            credit: 3 },
      ]},
      { sem: 3, subjects: [
        { code: 'MBA601', name: 'International Business',     credit: 3 },
        { code: 'MBA602', name: 'Project Management',         credit: 3 },
        { code: 'MBA603', name: 'Leadership Development',     credit: 3 },
        { code: 'MBA604', name: 'Elective Specialization',    credit: 6 },
      ]},
      { sem: 4, subjects: [
        { code: 'MBA651', name: 'Corporate Governance',       credit: 3 },
        { code: 'MBA652', name: 'Business Ethics & CSR',      credit: 3 },
        { code: 'MBA653', name: 'Thesis / Major Project',     credit: 9 },
      ]},
    ],
  },
]

const CourseDetail = ({ course, onClose, onApply }) => {
  const [tab, setTab] = useState(0)

  const totalCredits = course.syllabus.reduce(
    (sum, sem) => sum + sem.subjects.reduce((s, sub) => s + sub.credit, 0), 0
  )

  return (
    <>
      <DialogTitle sx={{ bgcolor: course.color, color: 'white', pb: 2 }}>
        <Typography variant="h5" fontWeight={700}>{course.name}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>{course.full}</Typography>
        <Chip
          label={course.affiliation}
          size="small"
          sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
        />
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Quick Info */}
        <Box sx={{ bgcolor: '#f5f7fa', p: 2 }}>
          <Grid container spacing={2}>
            {[
              { label: 'Duration',       value: course.duration },
              { label: 'Semesters',      value: course.semester },
              { label: 'Total Seats',    value: course.seats },
              { label: 'Total Credits',  value: totalCredits },
              { label: 'Annual Fee',     value: course.fee },
            ].map((info) => (
              <Grid item xs={6} sm={4} md={2.4} key={info.label}>
                <Box sx={{ textAlign: 'center', bgcolor: 'white', p: 1.5, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: course.color }}>
                    {info.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{info.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab label="Syllabus" />
          <Tab label="Eligibility" />
          <Tab label="Career" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Syllabus Tab */}
          {tab === 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Complete {course.semester}-semester syllabus as per {course.affiliation}
              </Typography>
              {course.syllabus.map((sem) => (
                <Accordion key={sem.sem} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={`Semester ${sem.sem}`}
                        size="small"
                        sx={{ bgcolor: course.color, color: 'white' }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {sem.subjects.length} subjects —{' '}
                        {sem.subjects.reduce((s, sub) => s + sub.credit, 0)} credits
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                          <TableCell><strong>Code</strong></TableCell>
                          <TableCell><strong>Subject</strong></TableCell>
                          <TableCell align="center"><strong>Credits</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sem.subjects.map((sub) => (
                          <TableRow key={sub.code} hover>
                            <TableCell>
                              <Chip label={sub.code} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell>{sub.name}</TableCell>
                            <TableCell align="center">
                              <Chip label={sub.credit} size="small" color="primary" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}

          {/* Eligibility Tab */}
          {tab === 1 && (
            <Box>
              <Card sx={{ bgcolor: '#f0f7f0', border: '1px solid #c8e6c9', mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <SchoolIcon color="success" />
                    <Typography variant="h6" fontWeight={700} color="success.main">
                      Eligibility Criteria
                    </Typography>
                  </Box>
                  <Typography variant="body1">{course.eligibility}</Typography>
                </CardContent>
              </Card>

              <Typography variant="h6" fontWeight={700} mb={2}>Required Documents</Typography>
              {[
                'SLC / SEE Marksheet & Certificate',
                '+2 / Intermediate Marksheet & Certificate',
                'Character Certificate from last school',
                'Citizenship Certificate or Birth Certificate',
                'Recent Passport Size Photos (4 copies)',
                'Migration Certificate (if from outside Gandaki)',
                'Equivalence Certificate (if foreign board)',
              ].map((doc) => (
                <Box key={doc} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography variant="body2">{doc}</Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" fontWeight={700} mb={1}>Fee Structure</Typography>
              <Box sx={{ bgcolor: '#f5f7fa', p: 2, borderRadius: 2 }}>
                <Typography variant="body1">
                  Annual Fee: <strong>{course.fee}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  * Scholarship available for meritorious students
                </Typography>
              </Box>
            </Box>
          )}

          {/* Career Tab */}
          {tab === 2 && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={2}>
                <WorkIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Career Opportunities
              </Typography>
              <Grid container spacing={2} mb={3}>
                {course.career.map((c) => (
                  <Grid item xs={12} sm={6} key={c}>
                    <Box sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5,
                      p: 1.5, bgcolor: '#f5f7fa', borderRadius: 2,
                    }}>
                      <CheckCircleIcon sx={{ color: course.color }} fontSize="small" />
                      <Typography variant="body2" fontWeight={600}>{c}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" fontWeight={700} mb={2}>
                What You Will Learn
              </Typography>
              {[
                'Strong theoretical foundation in core subjects',
                'Practical hands-on laboratory and project work',
                'Industry-relevant skills for the job market',
                'Research and analytical thinking capabilities',
                'Teamwork, leadership, and communication skills',
                'Internship and real-world exposure',
              ].map((item) => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                  <CheckCircleIcon sx={{ color: course.color, mt: 0.2 }} fontSize="small" />
                  <Typography variant="body2">{item}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" size="large">Close</Button>
        <Button
          variant="contained"
          size="large"
          onClick={onApply}
          sx={{ bgcolor: course.color }}
        >
          Apply for {course.name}
        </Button>
      </DialogActions>
    </>
  )
}

const Courses = () => {
  const navigate   = useNavigate()
  const [selected, setSelected] = useState(null)

  return (
    <>
      <Navbar />

      {/* Hero */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0D47A1, #1E88E5)',
        color: 'white', py: 8, textAlign: 'center',
      }}>
        <Typography variant="h3" fontWeight={800} mb={1}>Our Programs</Typography>
        <Typography variant="h6" sx={{ opacity: 0.8 }}>
          TU & PU Affiliated — Quality Education for Your Future
        </Typography>
      </Box>

      <Container sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {courses.map((c) => (
            <Grid item xs={12} sm={6} md={4} key={c.name}>
              <Card sx={{
                height: '100%',
                borderTop: `4px solid ${c.color}`,
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ bgcolor: c.color + '15', p: 1.5, borderRadius: 2, color: c.color }}>
                      <MenuBookIcon sx={{ fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight={800} sx={{ color: c.color }}>
                        {c.name}
                      </Typography>
                      <Chip
                        label={c.duration}
                        size="small"
                        sx={{ bgcolor: c.color + '15', color: c.color, fontWeight: 600 }}
                      />
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" fontWeight={500} mb={1}>
                    {c.full}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" display="block" mb={2}>
                    {c.affiliation}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="caption">{c.semester} Semesters</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <GroupsIcon fontSize="small" color="action" />
                      <Typography variant="caption">{c.seats} Seats</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="small"
                      onClick={() => setSelected(c)}
                      sx={{ borderColor: c.color, color: c.color }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      size="small"
                      onClick={() => navigate('/admissions')}
                      sx={{ bgcolor: c.color, '&:hover': { bgcolor: c.color } }}
                    >
                      Apply Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Course Detail Dialog */}
      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        {selected && (
          <CourseDetail
            course={selected}
            onClose={() => setSelected(null)}
            onApply={() => { setSelected(null); navigate('/admissions') }}
          />
        )}
      </Dialog>

      <Footer />
    </>
  )
}

export default Courses