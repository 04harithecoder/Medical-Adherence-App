import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'

const navItems = [
  { to: '/patient/dashboard', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/patient/medications', label: 'My Medications', icon: '💊' },
  { to: '/patient/doses', label: "Today's Doses", icon: '✅' },
  { to: '/patient/history', label: 'History', icon: '📜' },
  { to: '/patient/analytics', label: 'Analytics', icon: '📊' },
  { to: '/patient/notifications', label: 'Notifications', icon: '🔔' },
  { to: '/patient/profile', label: 'Profile', icon: '👤' },
]

export default function PatientLayout() {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar items={navItems} />
      <div className="flex flex-1 flex-col">
        <Topbar navItems={navItems} />
        <main className="flex-1 px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
