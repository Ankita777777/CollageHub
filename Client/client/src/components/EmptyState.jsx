import { Box, Typography, Button } from '@mui/material'

const EmptyState = ({ icon, title, description, actionLabel, onAction }) => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: { xs: 5, md: 8 },
        px: 2,
      }}
    >
      <Box sx={{ fontSize: 64, mb: 2, opacity: 0.3 }}>{icon}</Box>
      <Typography variant="h6" fontWeight={700} mb={1} color="text.secondary">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.disabled" mb={3} maxWidth={400} mx="auto">
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}

export default EmptyState