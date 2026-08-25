import { NavLink } from 'react-router-dom'

export default function Sidebar({ items, footer }) {
  return (
    <aside
      className="hidden w-64 shrink-0 flex-col bg-gradient-to-b from-[#faf6ee] to-[#f0e7cf] px-4 py-6 md:flex relative"
      style={{
        borderRight: '1px solid rgba(52, 79, 31, 0.14)',
        boxShadow: 'inset -1px 0 0 rgba(255, 255, 255, 0.8), 2px 0 12px rgba(52, 79, 31, 0.04)',
      }}
    >
      <div className="mb-8 flex items-center gap-3 px-2">
        <span className="skeuo-medallion flex h-9 w-9 items-center justify-center rounded-xl font-display text-base font-bold text-accent">
          M
        </span>
        <div>
          <p
            className="font-display text-lg font-bold leading-none text-primary"
            style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.9)' }}
          >
            MEDAI
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary/60 mt-0.5">
            Adherence Monitor
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all select-none
              ${
                isActive
                  ? 'skeuo-btn-secondary !text-white font-bold'
                  : 'text-primary/75 hover:bg-white/60 hover:text-primary hover:shadow-xs active:translate-y-0.5'
              }`
            }
          >
            <span aria-hidden="true" className="text-base leading-none drop-shadow-xs">
              {item.icon}
            </span>
            <span style={{ textShadow: 'inherit' }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {footer && (
        <div className="mt-4 pt-4">
          <div className="skeuo-groove-h mb-4" />
          {footer}
        </div>
      )}
    </aside>
  )
}

