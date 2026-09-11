import { Outlet } from 'react-router-dom'
import { LayoutDashboard, Pill, CheckCircle2, History, BarChart3, Bell, User } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'

const navItems = [
  { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/patient/medications', label: 'My Medications', icon: Pill },
  { to: '/patient/doses', label: "Today's Doses", icon: CheckCircle2 },
  { to: '/patient/history', label: 'History', icon: History },
  { to: '/patient/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/patient/notifications', label: 'Notifications', icon: Bell },
  { to: '/patient/profile', label: 'Profile', icon: User },
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

