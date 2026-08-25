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
    <header
      className="bg-gradient-to-b from-[#faf6ee] to-[#f4eee0] sticky top-0 z-20"
      style={{
        borderBottom: '1px solid rgba(52, 79, 31, 0.12)',
        boxShadow: '0 4px 12px -2px rgba(52, 79, 31, 0.05), inset 0 -1px 0 rgba(255, 255, 255, 0.8)',
      }}
    >
      <div className="flex items-center justify-between px-4 py-3.5 md:px-8">
        <div>
          <p
            className="text-xs font-bold uppercase tracking-wider text-primary/60"
            style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.8)' }}
          >
            {greeting()}
          </p>
          <h1
            className="font-display text-xl font-bold text-primary"
            style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.9)' }}
          >
            {firstName ?? 'Welcome'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="skeuo-btn-outline flex h-9 w-9 items-center justify-center rounded-full text-base"
          >
            🔔
          </button>
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
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="skeuo-card flex flex-col gap-1.5 rounded-none border-x-0 border-t border-b border-primary/10 px-4 py-3 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                  isActive ? 'skeuo-btn-secondary !text-white' : 'text-primary/75 hover:bg-white/50'
                }`
              }
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
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

