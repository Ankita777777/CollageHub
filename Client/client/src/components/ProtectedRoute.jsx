import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({ role }) => {
  const { user } = useSelector((state) => state.auth)

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Role check — if role required and user doesn't match
  if (role && user.role !== role) {
    // Redirect to their correct dashboard
    if (user.role === 'admin')   return <Navigate to="/admin/dashboard"   replace />
    if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />
    if (user.role === 'student') return <Navigate to="/student/dashboard" replace />
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute