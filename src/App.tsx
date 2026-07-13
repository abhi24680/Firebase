import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/lib/auth-context'
import { Toaster } from '@/components/ui/toaster'
import LandingPage from '@/app/page'
import LoginPage from '@/app/auth/login/page'
import RegisterPage from '@/app/auth/register/page'
import ForgotPasswordPage from '@/app/auth/forgot-password/page'
import ResetPasswordPage from '@/app/auth/reset-password/page'
import DashboardPage from '@/app/dashboard/page'
import DashboardLayout from '@/app/dashboard/layout'
import AdminDashboard from '@/app/dashboard/admin/page'
import HodDashboard from '@/app/dashboard/hod/page'
import FacultyDashboard from '@/app/dashboard/faculty/page'
import AdvisorDashboard from '@/app/dashboard/advisor/page'
import StudentDashboard from '@/app/dashboard/student/page'
import AdminCamera from '@/app/dashboard/admin/camera/page'
import AdminDepartments from '@/app/dashboard/admin/departments/page'
import AdminHods from '@/app/dashboard/admin/hods/page'
import AdminRegister from '@/app/dashboard/admin/register/page'
import AdminSettings from '@/app/dashboard/admin/settings/page'
import AdminStudents from '@/app/dashboard/admin/students/page'
import HodApprovals from '@/app/dashboard/hod/approvals/page'
import HodAttendance from '@/app/dashboard/hod/attendance/page'
import HodFaculty from '@/app/dashboard/hod/faculty/page'
import HodMapping from '@/app/dashboard/hod/mapping/page'
import HodStudents from '@/app/dashboard/hod/students/page'
import HodTimetable from '@/app/dashboard/hod/timetable/page'
import FacultyAttendance from '@/app/dashboard/faculty/attendance/page'
import FacultyHistory from '@/app/dashboard/faculty/history/page'
import FacultyReports from '@/app/dashboard/faculty/reports/page'
import FacultyTimetable from '@/app/dashboard/faculty/timetable/page'
import AdvisorAttendance from '@/app/dashboard/advisor/attendance/page'
import AdvisorLeaves from '@/app/dashboard/advisor/leaves/page'
import AdvisorStudents from '@/app/dashboard/advisor/students/page'
import AdvisorTimetable from '@/app/dashboard/advisor/timetable/page'
import StudentAttendance from '@/app/dashboard/student/attendance/page'
import StudentEnergy from '@/app/dashboard/student/energy/page'
import StudentLeave from '@/app/dashboard/student/leave/page'
import StudentNotifications from '@/app/dashboard/student/notifications/page'
import StudentRfid from '@/app/dashboard/student/rfid/page'
import StudentSurvey from '@/app/dashboard/student/survey/page'
import StudentTimetable from '@/app/dashboard/student/timetable/page'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/camera" element={<AdminCamera />} />
          <Route path="admin/departments" element={<AdminDepartments />} />
          <Route path="admin/hods" element={<AdminHods />} />
          <Route path="admin/register" element={<AdminRegister />} />
          <Route path="admin/settings" element={<AdminSettings />} />
          <Route path="admin/students" element={<AdminStudents />} />
          <Route path="hod" element={<HodDashboard />} />
          <Route path="hod/approvals" element={<HodApprovals />} />
          <Route path="hod/attendance" element={<HodAttendance />} />
          <Route path="hod/faculty" element={<HodFaculty />} />
          <Route path="hod/mapping" element={<HodMapping />} />
          <Route path="hod/students" element={<HodStudents />} />
          <Route path="hod/timetable" element={<HodTimetable />} />
          <Route path="faculty" element={<FacultyDashboard />} />
          <Route path="faculty/attendance" element={<FacultyAttendance />} />
          <Route path="faculty/history" element={<FacultyHistory />} />
          <Route path="faculty/reports" element={<FacultyReports />} />
          <Route path="faculty/timetable" element={<FacultyTimetable />} />
          <Route path="advisor" element={<AdvisorDashboard />} />
          <Route path="advisor/attendance" element={<AdvisorAttendance />} />
          <Route path="advisor/leaves" element={<AdvisorLeaves />} />
          <Route path="advisor/students" element={<AdvisorStudents />} />
          <Route path="advisor/timetable" element={<AdvisorTimetable />} />
          <Route path="student" element={<StudentDashboard />} />
          <Route path="student/attendance" element={<StudentAttendance />} />
          <Route path="student/energy" element={<StudentEnergy />} />
          <Route path="student/leave" element={<StudentLeave />} />
          <Route path="student/notifications" element={<StudentNotifications />} />
          <Route path="student/rfid" element={<StudentRfid />} />
          <Route path="student/survey" element={<StudentSurvey />} />
          <Route path="student/timetable" element={<StudentTimetable />} />
        </Route>
      </Routes>
      <Toaster />
    </AuthProvider>
  )
}
