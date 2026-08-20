import { Routes, Route, Navigate } from 'react-router-dom'
import { RequireRole } from './utils/roleGuards'

import Landing from './pages/public/Landing'
import Login from './pages/public/Login'
import Register from './pages/public/Register'

import PatientLayout from './layouts/PatientLayout'
import PatientDashboard from './pages/patient/Dashboard'
import Medications from './pages/patient/Medications'
import TodayDoses from './pages/patient/TodayDoses'
import History from './pages/patient/History'
import Analytics from './pages/patient/Analytics'
import PatientNotifications from './pages/patient/Notifications'
import Profile from './pages/patient/Profile'

import CaregiverLayout from './layouts/CaregiverLayout'
import CaregiverDashboard from './pages/caregiver/Dashboard'
import LinkedPatients from './pages/caregiver/LinkedPatients'
import Alerts from './pages/caregiver/Alerts'
import CaregiverNotifications from './pages/caregiver/Notifications'

import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import UserManagement from './pages/admin/UserManagement'
import SystemAnalytics from './pages/admin/SystemAnalytics'

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Patient */}
      <Route element={<RequireRole allow={['patient']} />}>
        <Route path="/patient" element={<PatientLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="medications" element={<Medications />} />
          <Route path="doses" element={<TodayDoses />} />
          <Route path="history" element={<History />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notifications" element={<PatientNotifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Caregiver */}
      <Route element={<RequireRole allow={['caregiver']} />}>
        <Route path="/caregiver" element={<CaregiverLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CaregiverDashboard />} />
          <Route path="patients" element={<LinkedPatients />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="notifications" element={<CaregiverNotifications />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<RequireRole allow={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="analytics" element={<SystemAnalytics />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
