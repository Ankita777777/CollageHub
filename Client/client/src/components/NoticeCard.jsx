import { Box, Typography, Chip } from '@mui/material'
import AnnouncementIcon from '@mui/icons-material/Announcement'

const categoryColors = {
  exam:    'error',
  event:   'primary',
  holiday: 'success',
  general: 'default',
}

const categoryBorderColors = {
  exam:    '#C62828',
  event:   '#1565C0',
  holiday: '#2E7D32',
  general: '#78909C',
}

const NoticeCard = ({ notice }) => {
  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        mb: 1.5,
        borderRadius: 2,
        bgcolor: 'white',
        border: '1px solid #eee',
        borderLeft: '4px solid',
        borderLeftColor: categoryBorderColors[notice.category] || '#78909C',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5, gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <AnnouncementIcon
            sx={{ fontSize: 16, color: categoryBorderColors[notice.category] }}
          />
          <Typography variant="subtitle2" fontWeight={700}>
            {notice.title}
          </Typography>
        </Box>
        <Chip
          label={notice.category}
          color={categoryColors[notice.category] || 'default'}
          size="small"
          sx={{ flexShrink: 0, textTransform: 'capitalize' }}
        />
      </Box>
      <Typography variant="body2" color="text.secondary" mb={0.5}>
        {notice.content}
      </Typography>
      <Typography variant="caption" color="text.disabled">
        {notice.postedBy?.name} • {new Date(notice.createdAt).toLocaleDateString()}
      </Typography>
    </Box>
  )
}

export default NoticeCard