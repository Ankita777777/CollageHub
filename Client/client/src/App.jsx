import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoadingScreen  from './components/LoadingScreen'
import ProtectedRoute from './components/ProtectedRoute'

// Lazy load all pages for better performance
const Home           = lazy(() => import('./pages/Home'))
const About          = lazy(() => import('./pages/About'))
const Courses        = lazy(() => import('./pages/Courses'))
const Admissions     = lazy(() => import('./pages/Admissions'))
const Contact        = lazy(() => import('./pages/Contact'))
const Notices        = lazy(() => import('./pages/Notices'))
const Login          = lazy(() => import('./pages/Login'))
const Register       = lazy(() => import('./pages/Register'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword  = lazy(() => import('./pages/ResetPassword'))
const ResultCheck    = lazy(() => import('./pages/ResultCheck'))

// Student
const StudentDashboard = lazy(() => import('./pages/dashboard/StudentDashboard'))
const Attendance       = lazy(() => import('./pages/dashboard/student/Attendance'))
const Results          = lazy(() => import('./pages/dashboard/student/Results'))
const Fee              = lazy(() => import('./pages/dashboard/student/Fee'))
const Leave            = lazy(() => import('./pages/dashboard/student/Leave'))
const Assignments      = lazy(() => import('./pages/dashboard/student/Assignments'))
const StudyMaterials   = lazy(() => import('./pages/dashboard/student/StudyMaterials'))
const Timetable        = lazy(() => import('./pages/dashboard/student/Timetable'))
const Library          = lazy(() => import('./pages/dashboard/student/Library'))
const Events           = lazy(() => import('./pages/dashboard/student/Events'))
const Scholarships     = lazy(() => import('./pages/dashboard/student/Scholarships'))
const Complaints       = lazy(() => import('./pages/dashboard/student/Complaints'))
const Feedback         = lazy(() => import('./pages/dashboard/student/Feedback'))
const StudentProfile   = lazy(() => import('./pages/dashboard/student/StudentProfile'))
const IDCard           = lazy(() => import('./pages/dashboard/student/IDCard'))

// Teacher
const TeacherDashboard = lazy(() => import('./pages/dashboard/TeacherDashboard'))
const MyCourses        = lazy(() => import('./pages/dashboard/teacher/MyCourses'))
const MyStudents       = lazy(() => import('./pages/dashboard/teacher/MyStudents'))
const TeacherAttendance = lazy(() => import('./pages/dashboard/teacher/TeacherAttendance'))
const EnterResult      = lazy(() => import('./pages/dashboard/teacher/EnterResult'))
const TeacherLeaves    = lazy(() => import('./pages/dashboard/teacher/TeacherLeaves'))
const TeacherNotice    = lazy(() => import('./pages/dashboard/teacher/TeacherNotice'))
const TeacherSettings  = lazy(() => import('./pages/dashboard/teacher/TeacherSettings'))

// Admin
const AdminDashboard    = lazy(() => import('./pages/dashboard/AdminDashboard'))
const ManageAdmissions  = lazy(() => import('./pages/dashboard/admin/ManageAdmissions'))
const ManageStudents    = lazy(() => import('./pages/dashboard/admin/ManageStudents'))
const ManageTeachers    = lazy(() => import('./pages/dashboard/admin/ManageTeachers'))
const ManageCourses     = lazy(() => import('./pages/dashboard/admin/ManageCourses'))
const ManageAttendance  = lazy(() => import('./pages/dashboard/admin/ManageAttendance'))
const ManageResults     = lazy(() => import('./pages/dashboard/admin/ManageResults'))
const ManageNotices     = lazy(() => import('./pages/dashboard/admin/ManageNotices'))
const ManageMessages    = lazy(() => import('./pages/dashboard/admin/ManageMessages'))
const AdminSettings     = lazy(() => import('./pages/dashboard/admin/AdminSettings'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen message="Loading page..." />}>
        <Routes>
          {/* Public */}
          <Route path="/"                       element={<Home />} />
          <Route path="/about"                  element={<About />} />
          <Route path="/courses"                element={<Courses />} />
          <Route path="/admissions"             element={<Admissions />} />
          <Route path="/contact"                element={<Contact />} />
          <Route path="/notices"                element={<Notices />} />
          <Route path="/login"                  element={<Login />} />
          <Route path="/register"               element={<Register />} />
          <Route path="/forgot-password"        element={<ForgotPassword />} />
          <Route path="/reset-password/:token"  element={<ResetPassword />} />
          <Route path="/results/check"          element={<ResultCheck />} />

          {/* Student */}
          <Route element={<ProtectedRoute role="student" />}>
            <Route path="/student/dashboard"    element={<StudentDashboard />} />
            <Route path="/student/attendance"   element={<Attendance />} />
            <Route path="/student/results"      element={<Results />} />
            <Route path="/student/fee"          element={<Fee />} />
            <Route path="/student/leave"        element={<Leave />} />
            <Route path="/student/assignments"  element={<Assignments />} />
            <Route path="/student/materials"    element={<StudyMaterials />} />
            <Route path="/student/timetable"    element={<Timetable />} />
            <Route path="/student/library"      element={<Library />} />
            <Route path="/student/events"       element={<Events />} />
            <Route path="/student/scholarships" element={<Scholarships />} />
            <Route path="/student/complaints"   element={<Complaints />} />
            <Route path="/student/feedback"     element={<Feedback />} />
            <Route path="/student/profile"      element={<StudentProfile />} />
            <Route path="/student/idcard"       element={<IDCard />} />
          </Route>

          {/* Teacher */}
          <Route element={<ProtectedRoute role="teacher" />}>
            <Route path="/teacher/dashboard"    element={<TeacherDashboard />} />
            <Route path="/teacher/courses"      element={<MyCourses />} />
            <Route path="/teacher/students"     element={<MyStudents />} />
            <Route path="/teacher/attendance"   element={<TeacherAttendance />} />
            <Route path="/teacher/results"      element={<EnterResult />} />
            <Route path="/teacher/leaves"       element={<TeacherLeaves />} />
            <Route path="/teacher/notice"       element={<TeacherNotice />} />
            <Route path="/teacher/settings"     element={<TeacherSettings />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin/dashboard"      element={<AdminDashboard />} />
            <Route path="/admin/admissions"     element={<ManageAdmissions />} />
            <Route path="/admin/students"       element={<ManageStudents />} />
            <Route path="/admin/teachers"       element={<ManageTeachers />} />
            <Route path="/admin/courses"        element={<ManageCourses />} />
            <Route path="/admin/attendance"     element={<ManageAttendance />} />
            <Route path="/admin/results"        element={<ManageResults />} />
            <Route path="/admin/notices"        element={<ManageNotices />} />
            <Route path="/admin/messages"       element={<ManageMessages />} />
            <Route path="/admin/settings"       element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App