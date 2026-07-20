import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ManageTeachers from './pages/dashboard/admin/ManageTeachers'
import AdminSettings  from './pages/dashboard/admin/AdminSettings'

// Public Pages
import Home           from './pages/Home'
import About          from './pages/About'
import Courses        from './pages/Courses'
import Admissions     from './pages/Admissions'
import Contact        from './pages/Contact'
import Notices        from './pages/Notice'
import Login          from './pages/Login'
import Register       from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword  from './pages/ResetPassword'
import ManageCourses    from './pages/dashboard/admin/ManageCourses'
import ManageStudents   from './pages/dashboard/admin/ManageStudents'
import ManageNotices    from './pages/dashboard/admin/ManageNotices'
import ManageResults    from './pages/dashboard/admin/ManageResults'
import ManageAttendance from './pages/dashboard/admin/ManageAttendance'
import ManageMessages from './pages/dashboard/admin/ManageMessages'

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

// Guard
import ProtectedRoute from './components/ProtectedRoute'
import ManageAdmissions from './pages/dashboard/admin/ManageAdmissions'
import IDCard           from './pages/dashboard/student/IDCard'


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<ProtectedRoute role="admin" />}>
  <Route path="/admin/dashboard"   element={<AdminDashboard />} />
  <Route path="/admin/admissions"  element={<ManageAdmissions />} />
</Route>
        {/* Public */}
        <Route element={<ProtectedRoute role="student" />}>
  {/* existing routes */}
  <Route path="/student/idcard" element={<IDCard />} />
</Route>

<Route element={<ProtectedRoute role="admin" />}>
  {/* existing routes */}
  <Route path="/admin/dashboard"   element={<AdminDashboard />} />
  <Route path="/admin/admissions"  element={<ManageAdmissions />} />
  <Route path="/admin/students"    element={<ManageStudents />} />
    <Route path="/admin/teachers"    element={<ManageTeachers />} />
  <Route path="/admin/courses"     element={<ManageCourses />} />
  <Route path="/admin/attendance"  element={<ManageAttendance />} />
  <Route path="/admin/results"     element={<ManageResults />} />
  <Route path="/admin/notices"     element={<ManageNotices />} />
<Route path="/admin/messages" element={<ManageMessages />} />
  <Route path="/admin/settings"    element={<AdminSettings />} />

  <Route path="/admin/admissions" element={<ManageAdmissions />} />
</Route>
        <Route path="/"                       element={<Home />} />
        <Route path="/about"                  element={<About />} />
        <Route path="/courses"                element={<Courses />} />
        <Route path="/admissions"             element={<Admissions />} />
        <Route path="/contact"                element={<Contact />} />
        <Route path="/notice"                element={<Notices />} />
        <Route path="/login"                  element={<Login />} />
        <Route path="/register"               element={<Register />} />
        <Route path="/forgot-password"        element={<ForgotPassword />} />
        <Route path="/reset-password/:token"  element={<ResetPassword />} />

        {/* Student */}
        <Route element={<ProtectedRoute role="student" />}>
          <Route path="/student/dashboard"  element={<StudentDashboard />} />
          <Route path="/student/attendance" element={<Attendance />} />
          <Route path="/student/results"    element={<Results />} />
          <Route path="/student/fee"        element={<Fee />} />
          <Route path="/student/leave"      element={<Leave />} />
        </Route>

        {/* Teacher */}
        <Route element={<ProtectedRoute role="teacher" />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/results"   element={<EnterResult />} />
          <Route path="/teacher/leaves"    element={<TeacherLeaves />} />
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App