import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Public Pages
import Home       from './pages/Home'
import About      from './pages/About'
import Courses    from './pages/Courses'
import Admissions from './pages/Admissions'
import Contact    from './pages/Contact'
import Notices    from './pages/Notices'
import Login      from './pages/Login'
import Register   from './pages/Register'

// Student Pages
import StudentDashboard from './pages/dashboard/StudentDashboard'
import Attendance       from './pages/dashboard/student/Attendance'
import Results          from './pages/dashboard/student/Results'
import Fee              from './pages/dashboard/student/Fee'
import Leave            from './pages/dashboard/student/Leave'

// Teacher Pages
import TeacherDashboard from './pages/dashboard/TeacherDashboard'
import EnterResult      from './pages/dashboard/teacher/EnterResult'
import TeacherLeaves    from './pages/dashboard/teacher/Leaves'

// Admin Pages
import AdminDashboard from './pages/dashboard/AdminDashboard'

// Route Guard
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/"           element={<Home />} />
        <Route path="/about"      element={<About />} />
        <Route path="/courses"    element={<Courses />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/contact"    element={<Contact />} />
        <Route path="/notices"    element={<Notices />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />

        {/* Student Routes */}
        <Route element={<ProtectedRoute role="student" />}>
          <Route path="/student/dashboard"  element={<StudentDashboard />} />
          <Route path="/student/attendance" element={<Attendance />} />
          <Route path="/student/results"    element={<Results />} />
          <Route path="/student/fee"        element={<Fee />} />
          <Route path="/student/leave"      element={<Leave />} />
        </Route>

        {/* Teacher Routes */}
        <Route element={<ProtectedRoute role="teacher" />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/results"   element={<EnterResult />} />
          <Route path="/teacher/leaves"    element={<TeacherLeaves />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App