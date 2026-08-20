import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Button from '../common/Button'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Topbar({ navItems = [] }) {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const firstName = user?.full_name?.split(' ')[0]

  return (
    <header className="border-b border-primary/10 bg-bg">
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <div>
          <p className="text-sm text-primary/50">{greeting()}</p>
          <h1 className="font-display text-xl text-primary">{firstName ?? 'Welcome'}</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="rounded-full p-2 text-primary/60 hover:bg-primary/10"
          >
            🔔
          </button>
          <Button variant="outline" onClick={logout} className="hidden sm:inline-flex">
            Log out
          </Button>
          <button
            type="button"
            className="rounded-lg p-2 text-primary md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-primary/10 bg-surface px-4 py-3 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-primary text-white' : 'text-primary/70'
                }`
              }
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={logout}
            className="mt-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-accent"
          >
            Log out
          </button>
        </nav>
      )}
    </header>
  )
}
