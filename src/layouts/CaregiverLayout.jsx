import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'

const navItems = [
  { to: '/caregiver/dashboard', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/caregiver/patients', label: 'Linked Patients', icon: '🧑‍🤝‍🧑' },
  { to: '/caregiver/alerts', label: 'Alerts', icon: '⚠️' },
  { to: '/caregiver/notifications', label: 'Notifications', icon: '🔔' },
]

export default function CaregiverLayout() {
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
