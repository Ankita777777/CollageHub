import { Box, Typography, Grid, Link, Divider } from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#0D47A1', color: 'white', pt: 6, pb: 3, mt: 'auto' }}>
      <Grid container spacing={4} sx={{ px: { xs: 3, md: 8 } }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <SchoolIcon />
            <Typography variant="h6" fontWeight={700}>PMC College</Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.8 }}>
            Pokhara Management College — Committed to excellence in education
            and shaping future leaders.
          </Typography>
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>Quick Links</Typography>
          {['Home', 'About', 'Courses', 'Admissions', 'Contact'].map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`}
              sx={{ display: 'block', color: 'rgba(255,255,255,0.75)', mb: 1,
                textDecoration: 'none', '&:hover': { color: 'white' } }}>
              {item}
            </Link>
          ))}
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>Programs</Typography>
          {['BBA', 'BCA', 'BBS', 'MBA', 'MBS'].map((p) => (
            <Typography key={p} variant="body2" sx={{ opacity: 0.75, mb: 1 }}>{p}</Typography>
          ))}
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>Contact</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 1.5, opacity: 0.8 }}>
            <LocationOnIcon fontSize="small" />
            <Typography variant="body2">Pokhara, Gandaki Province, Nepal</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 1.5, opacity: 0.8 }}>
            <PhoneIcon fontSize="small" />
            <Typography variant="body2">+977-61-XXXXXX</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, opacity: 0.8 }}>
            <EmailIcon fontSize="small" />
            <Typography variant="body2">info@pmccollege.edu.np</Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />
      <Typography variant="body2" textAlign="center" sx={{ opacity: 0.6 }}>
        © {new Date().getFullYear()} PMC College. All rights reserved.
      </Typography>
    </Box>
  )
}

export default Footer