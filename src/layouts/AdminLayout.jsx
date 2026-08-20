import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/admin/users', label: 'User Management', icon: '🗂️' },
  { to: '/admin/analytics', label: 'System Analytics', icon: '📈' },
]

export default function AdminLayout() {
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
