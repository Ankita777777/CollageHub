import { Box, CircularProgress, Typography } from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        gap: 2,
      }}
    >
      <Box sx={{
        bgcolor: 'primary.main',
        p: 2, borderRadius: 3,
        color: 'white', mb: 1,
      }}>
        <SchoolIcon sx={{ fontSize: 40 }} />
      </Box>
      <CircularProgress color="primary" size={40} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
}

export default LoadingScreen