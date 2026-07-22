import { useState } from 'react'
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, IconButton, Tooltip, Avatar,
  Badge, useMediaQuery, useTheme
} from '@mui/material'
import DashboardIcon          from '@mui/icons-material/Dashboard'
import EventNoteIcon          from '@mui/icons-material/EventNote'
import AssignmentIcon         from '@mui/icons-material/Assignment'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import NotificationsIcon      from '@mui/icons-material/Notifications'
import PaymentIcon            from '@mui/icons-material/Payment'
import BeachAccessIcon        from '@mui/icons-material/BeachAccess'
import PeopleIcon             from '@mui/icons-material/People'
import SchoolIcon             from '@mui/icons-material/School'
import MenuBookIcon           from '@mui/icons-material/MenuBook'
import GradingIcon            from '@mui/icons-material/Grading'
import LogoutIcon             from '@mui/icons-material/Logout'
import ChevronLeftIcon        from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon       from '@mui/icons-material/ChevronRight'
import SettingsIcon           from '@mui/icons-material/Settings'
import EmailIcon              from '@mui/icons-material/Email'
import CalendarMonthIcon      from '@mui/icons-material/CalendarMonth'
import LocalLibraryIcon       from '@mui/icons-material/LocalLibrary'
import EmojiEventsIcon        from '@mui/icons-material/EmojiEvents'
import ReportProblemIcon      from '@mui/icons-material/ReportProblem'
import FeedbackIcon           from '@mui/icons-material/Feedback'
import PersonIcon             from '@mui/icons-material/Person'
import BadgeIcon              from '@mui/icons-material/Badge'
import AnnouncementIcon       from '@mui/icons-material/Announcement'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { toast } from 'react-toastify'

const menuConfig = {
  student: [
    { label: 'Dashboard',       icon: <DashboardIcon />,          path: '/student/dashboard'    },
    { label: 'Attendance',      icon: <EventNoteIcon />,           path: '/student/attendance'   },
    { label: 'Results',         icon: <AssignmentIcon />,          path: '/student/results'      },
    { label: 'Assignments',     icon: <AssignmentTurnedInIcon />,  path: '/student/assignments'  },
    { label: 'Study Materials', icon: <MenuBookIcon />,            path: '/student/materials'    },
    { label: 'Timetable',       icon: <CalendarMonthIcon />,       path: '/student/timetable'    },
    { label: 'Library',         icon: <LocalLibraryIcon />,        path: '/student/library'      },
    { label: 'Events',          icon: <EmojiEventsIcon />,         path: '/student/events'       },
    { label: 'Scholarships',    icon: <SchoolIcon />,              path: '/student/scholarships' },
    { label: 'Fee',             icon: <PaymentIcon />,             path: '/student/fee'          },
    { label: 'Leave',           icon: <BeachAccessIcon />,         path: '/student/leave'        },
    { label: 'Complaints',      icon: <ReportProblemIcon />,       path: '/student/complaints'   },
    { label: 'Feedback',        icon: <FeedbackIcon />,            path: '/student/feedback'     },
    { label: 'ID Card',         icon: <BadgeIcon />,               path: '/student/idcard'       },
    { label: 'My Profile',      icon: <PersonIcon />,              path: '/student/profile'      },
    { label: 'Notices',         icon: <NotificationsIcon />,       path: '/notices'              },
  ],
  teacher: [
    { label: 'Dashboard',      icon: <DashboardIcon />,   path: '/teacher/dashboard'  },
    { label: 'My Courses',     icon: <MenuBookIcon />,     path: '/teacher/courses'    },
    { label: 'My Students',    icon: <PeopleIcon />,       path: '/teacher/students'   },
    { label: 'Attendance',     icon: <EventNoteIcon />,    path: '/teacher/attendance' },
    { label: 'Enter Marks',    icon: <GradingIcon />,      path: '/teacher/results'    },
    { label: 'Leave Requests', icon: <BeachAccessIcon />,  path: '/teacher/leaves'     },
    { label: 'Post Notice',    icon: <AnnouncementIcon />, path: '/teacher/notice'     },
    { label: 'Settings',       icon: <SettingsIcon />,     path: '/teacher/settings'   },
  ],
  admin: [
    { label: 'Dashboard',   icon: <DashboardIcon />,     path: '/admin/dashboard'   },
    { label: 'Admissions',  icon: <AssignmentIcon />,    path: '/admin/admissions'  },
    { label: 'Students',    icon: <PeopleIcon />,         path: '/admin/students'    },
    { label: 'Teachers',    icon: <SchoolIcon />,         path: '/admin/teachers'    },
    { label: 'Courses',     icon: <MenuBookIcon />,       path: '/admin/courses'     },
    { label: 'Attendance',  icon: <EventNoteIcon />,      path: '/admin/attendance'  },
    { label: 'Results',     icon: <GradingIcon />,        path: '/admin/results'     },
    { label: 'Notices',     icon: <AnnouncementIcon />,   path: '/admin/notices'     },
    { label: 'Messages',    icon: <EmailIcon />,          path: '/admin/messages'    },
    { label: 'Settings',    icon: <SettingsIcon />,       path: '/admin/settings'    },
  ],
}

const Sidebar = ({ role, onClose }) => {
  const navigate   = useNavigate()
  const location   = useLocation()
  const dispatch   = useDispatch()
  const { user }   = useSelector((state) => state.auth)
  const theme      = useTheme()
  const isMobile   = useMediaQuery(theme.breakpoints.down('md'))
  const [collapsed, setCollapsed] = useState(false)

  const links  = menuConfig[role] || []
  const width  = isMobile ? '100%' : (collapsed ? 70 : 240)

  const handleNav = (path) => {
    navigate(path)
    if (onClose) onClose()
  }

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const getRoleColor = () => {
    if (role === 'admin')   return '#0D47A1'
    if (role === 'teacher') return '#1B5E20'
    return '#1565C0'
  }

  return (
    <Box
      sx={{
        width,
        bgcolor:       getRoleColor(),
        color:         'white',
        display:       'flex',
        flexDirection: 'column',
        minHeight:     '100vh',
        transition:    'width 0.3s ease',
        position:      isMobile ? 'relative' : 'sticky',
        top:           0,
        flexShrink:    0,
        overflowX:     'hidden',
        overflowY:     'auto',
        '&::-webkit-scrollbar': { width: 0 },
      }}
    >
      {/* Header */}
      <Box sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        minHeight: 64,
        bgcolor: 'rgba(0,0,0,0.15)',
      }}>
        {!collapsed && (
          <Typography variant="h6" fontWeight={800} noWrap sx={{ fontSize: 16 }}>
            PMC College
          </Typography>
        )}
        {!isMobile && (
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            sx={{ color: 'white', ml: collapsed ? 0 : 'auto' }}
            size="small"
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
      </Box>

      {/* User Info */}
      {!collapsed && (
        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src={user?.photo}
            sx={{ width: 38, height: 38, bgcolor: 'rgba(255,255,255,0.2)', fontSize: 15 }}
          >
            {user?.name?.charAt(0)}
          </Avatar>
          <Box sx={{ overflow: 'hidden', flex: 1 }}>
            <Typography variant="body2" fontWeight={700} noWrap sx={{ fontSize: 13 }}>
              {user?.name}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7, textTransform: 'capitalize' }}>
              {user?.role}
            </Typography>
          </Box>
        </Box>
      )}

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />

      {/* Navigation Links */}
      <List sx={{ flexGrow: 1, py: 1, px: collapsed ? 0.5 : 1 }}>
        {links.map((link) => {
          const isActive = location.pathname === link.path

          return (
            <Tooltip
              key={link.label}
              title={collapsed ? link.label : ''}
              placement="right"
            >
              <ListItemButton
                onClick={() => handleNav(link.path)}
                sx={{
                  borderRadius:   2,
                  mb:             0.3,
                  px:             collapsed ? 1.5 : 1.5,
                  py:             0.8,
                  color:          'white',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  bgcolor:        isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.12)',
                  },
                  transition: 'all 0.15s ease',
                }}
              >
                <ListItemIcon
                  sx={{
                    color:    'white',
                    minWidth: collapsed ? 0 : 36,
                    '& .MuiSvgIcon-root': { fontSize: 20 },
                  }}
                >
                  {link.badge ? (
                    <Badge badgeContent={link.badge} color="error">
                      {link.icon}
                    </Badge>
                  ) : link.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{ fontSize: 13, fontWeight: isActive ? 700 : 500 }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          )
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />

      {/* Logout */}
      <Box sx={{ p: collapsed ? 0.5 : 1, pb: 2 }}>
        <Tooltip title={collapsed ? 'Logout' : ''} placement="right">
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius:   2,
              color:          'white',
              justifyContent: collapsed ? 'center' : 'flex-start',
              px:             collapsed ? 1.5 : 1.5,
              py:             0.8,
              '&:hover': { bgcolor: 'rgba(255,0,0,0.2)' },
            }}
          >
            <ListItemIcon
              sx={{
                color:    'white',
                minWidth: collapsed ? 0 : 36,
                '& .MuiSvgIcon-root': { fontSize: 20 },
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default Sidebar