import { NavLink } from 'react-router-dom'

export default function Sidebar({ items, footer }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-primary/10
      bg-surface px-4 py-6 md:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary
          font-display text-sm font-semibold text-accent">
          M
        </span>
        <div>
          <p className="font-display text-lg leading-none text-primary">MEDAI</p>
          <p className="text-[11px] uppercase tracking-wide text-primary/50">Adherence Monitor</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
              ${isActive
                ? 'bg-primary text-white'
                : 'text-primary/70 hover:bg-primary/10 hover:text-primary'}`
            }
          >
            <span aria-hidden="true" className="text-base leading-none">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {footer && <div className="mt-4 border-t border-primary/10 pt-4">{footer}</div>}
    </aside>
  )
}
