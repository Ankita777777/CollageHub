import { Card, CardContent, Typography, Chip, Box } from '@mui/material'
import AnnouncementIcon from '@mui/icons-material/Announcement'

const categoryColors = {
  exam:     'error',
  event:    'primary',
  holiday:  'success',
  general:  'default',
}

const NoticeCard = ({ notice }) => {
  return (
    <Card sx={{ mb: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AnnouncementIcon color="primary" fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>{notice.title}</Typography>
          </Box>
          <Chip
            label={notice.category}
            color={categoryColors[notice.category] || 'default'}
            size="small"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {notice.content}
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Posted by {notice.postedBy?.name} • {new Date(notice.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default NoticeCard