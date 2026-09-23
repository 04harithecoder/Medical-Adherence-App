import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { notificationService } from '../../services/notificationService'
import Button from '../common/Button'
import ThemeSwitch from '../common/ThemeSwitch'
import { Bell, Menu, X } from 'lucide-react'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Topbar({ navItems = [] }) {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const firstName = user?.full_name?.split(' ')[0]

  useEffect(() => {
    notificationService
      .list()
      .then((notifications) => setUnreadCount(notifications.filter((n) => !n.is_read).length))
      .catch(() => {})
  }, [])

  const notificationsPath = navItems.find((item) => item.label === 'Notifications')?.to

  return (
    <header
      className="bg-surface sticky top-0 z-20 transition-colors duration-200"
      style={{
        borderBottom: '1px solid rgba(52, 79, 31, 0.12)',
        boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.05), inset 0 -1px 0 rgba(255, 255, 255, 0.3)',
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        <div>
          <p
            className="text-xs font-bold uppercase tracking-wider text-primary/60"
            style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.5)' }}
          >
            {greeting()}
          </p>
          <h1
            className="font-display text-xl font-bold text-primary"
            style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.6)' }}
          >
            {firstName ?? 'Welcome'}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitch />
          
          {notificationsPath ? (
            <Link
              to={notificationsPath}
              aria-label="Notifications"
              className="skeuo-btn-outline relative flex h-9 w-9 items-center justify-center rounded-full text-primary/80 hover:text-primary"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          ) : (
            <span
              aria-label="Notifications"
              className="skeuo-btn-outline flex h-9 w-9 items-center justify-center rounded-full text-primary/40"
            >
              <Bell className="h-4 w-4" />
            </span>
          )}
          <Button variant="outline" onClick={logout} className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-bold">
            Log out
          </Button>
          <button
            type="button"
            className="skeuo-btn-outline flex h-9 w-9 items-center justify-center rounded-xl text-primary md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>


      {mobileOpen && (
        <nav className="skeuo-card flex flex-col gap-1.5 rounded-none border-x-0 border-t border-b border-primary/10 px-4 py-3 md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                    isActive ? 'skeuo-btn-secondary !text-white' : 'text-primary/75 hover:bg-white/50'
                  }`
                }
              >
                {Icon && (
                  <span className="flex h-4 w-4 items-center justify-center shrink-0">
                    {typeof Icon === 'function' || typeof Icon === 'object' ? <Icon className="h-4 w-4" /> : Icon}
                  </span>
                )}
                <span>{item.label}</span>
              </NavLink>
            )
          })}
          <div className="skeuo-groove-h my-1" />
          <button
            type="button"
            onClick={logout}
            className="skeuo-btn-primary rounded-xl px-3 py-2 text-left text-sm font-bold"
          >
            Log out
          </button>
        </nav>
      )}
    </header>
  )
}


