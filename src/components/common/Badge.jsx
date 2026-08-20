// Every variant here is a tint of --color-primary or --color-accent —
// no new hues are introduced, per MEDAI's strict 4-color palette.
const variants = {
  taken: 'bg-primary/10 text-primary',
  missed: 'bg-accent/15 text-accent',
  scheduled: 'bg-primary/5 text-primary/70',
  skipped: 'bg-primary/5 text-primary/50',
  low: 'bg-primary/10 text-primary',
  moderate: 'bg-accent/15 text-accent',
  high: 'bg-accent text-white',
  neutral: 'bg-primary/5 text-primary/70',
}

export default function Badge({ variant = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold
        capitalize ${variants[variant] ?? variants.neutral} ${className}`}
    >
      {children}
    </span>
  )
}
