import { useState } from 'react'
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, IconButton, Tooltip, Avatar
} from '@mui/material'
import BadgeIcon from '@mui/icons-material/Badge'
import DashboardIcon      from '@mui/icons-material/Dashboard'
import EventNoteIcon      from '@mui/icons-material/EventNote'
import AssignmentIcon     from '@mui/icons-material/Assignment'
import NotificationsIcon  from '@mui/icons-material/Notifications'
import PaymentIcon        from '@mui/icons-material/Payment'
import BeachAccessIcon    from '@mui/icons-material/BeachAccess'
import PeopleIcon         from '@mui/icons-material/People'
import SchoolIcon         from '@mui/icons-material/School'
import MenuBookIcon       from '@mui/icons-material/MenuBook'
import GradingIcon        from '@mui/icons-material/Grading'
import LogoutIcon         from '@mui/icons-material/Logout'
import ChevronLeftIcon    from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon   from '@mui/icons-material/ChevronRight'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import SettingsIcon from '@mui/icons-material/Settings'
import EmailIcon    from '@mui/icons-material/Email'
const menuItems = {
  student: [
    { label: 'Dashboard',   icon: <DashboardIcon />,     path: '/student/dashboard' },
    { label: 'Attendance',  icon: <EventNoteIcon />,      path: '/student/attendance' },
    { label: 'Results',     icon: <AssignmentIcon />,     path: '/student/results' },
    { label: 'Fee',         icon: <PaymentIcon />,        path: '/student/fee' },
    { label: 'Leave',       icon: <BeachAccessIcon />,    path: '/student/leave' },
    { label: 'ID Card',     icon: <BadgeIcon />,          path: '/student/idcard' },  // NEW
    { label: 'Notices',     icon: <NotificationsIcon />,  path: '/notices' },
  ],
  teacher: [
    { label: 'Dashboard',    icon: <DashboardIcon />,    path: '/teacher/dashboard' },
    { label: 'Attendance',   icon: <EventNoteIcon />,     path: '/teacher/dashboard' },
    { label: 'Enter Marks',  icon: <GradingIcon />,       path: '/teacher/results' },
    { label: 'Leave Requests',icon: <BeachAccessIcon />,  path: '/teacher/leaves' },
    { label: 'Notices',      icon: <NotificationsIcon />, path: '/notices' },
  ],
  admin: [
     { label: 'Dashboard',   icon: <DashboardIcon />,     path: '/admin/dashboard' },
  { label: 'Admissions',  icon: <AssignmentIcon />,    path: '/admin/admissions' },
  { label: 'Students',    icon: <PeopleIcon />,         path: '/admin/students' },
  { label: 'Teachers',    icon: <SchoolIcon />,         path: '/admin/teachers' },
  { label: 'Courses',     icon: <MenuBookIcon />,       path: '/admin/courses' },
  { label: 'Attendance',  icon: <EventNoteIcon />,      path: '/admin/attendance' },
  { label: 'Results',     icon: <GradingIcon />,        path: '/admin/results' },
  { label: 'Notices',     icon: <NotificationsIcon />,  path: '/admin/notices' },
  { label: 'Messages',    icon: <EmailIcon />,          path: '/admin/messages' },
  { label: 'Settings',    icon: <SettingsIcon />,       path: '/admin/settings' },
 ],
}

const Sidebar = ({ role }) => {
  const navigate  = useNavigate()
  const location  = useLocation()
  const dispatch  = useDispatch()
  const { user }  = useSelector((state) => state.auth)
  const [collapsed, setCollapsed] = useState(false)

  const links = menuItems[role] || []

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <Box
      sx={{
        width: collapsed ? 70 : 240,
        bgcolor: 'primary.dark',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s',
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {!collapsed && (
          <Typography variant="h6" fontWeight={700} noWrap>
            PMC College
          </Typography>
        )}
        <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: 'white', ml: collapsed ? 'auto' : 0 }}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* User Info */}
      {!collapsed && (
        <Box sx={{ px: 2, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
            {user?.name?.charAt(0)}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" fontWeight={600} noWrap>{user?.name}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7, textTransform: 'capitalize' }}>
              {user?.role}
            </Typography>
          </Box>
        </Box>
      )}

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />

      {/* Nav Links */}
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {links.map((link) => {
          const isActive = location.pathname === link.path
          return (
            <Tooltip key={link.label} title={collapsed ? link.label : ''} placement="right">
              <ListItemButton
                onClick={() => navigate(link.path)}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  color: 'white',
                  bgcolor: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  px: collapsed ? 1 : 2,
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: collapsed ? 0 : 36 }}>
                  {link.icon}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={link.label} />}
              </ListItemButton>
            </Tooltip>
          )
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />

      {/* Logout */}
      <Tooltip title={collapsed ? 'Logout' : ''} placement="right">
        <ListItemButton
          onClick={handleLogout}
          sx={{
            mx: 1, my: 1, borderRadius: 2, color: 'white',
            '&:hover': { bgcolor: 'rgba(255,0,0,0.2)' },
            justifyContent: collapsed ? 'center' : 'flex-start',
            px: collapsed ? 1 : 2,
          }}
        >
          <ListItemIcon sx={{ color: 'white', minWidth: collapsed ? 0 : 36 }}>
            <LogoutIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Logout" />}
        </ListItemButton>
      </Tooltip>
    </Box>
  )
}

export default Sidebar