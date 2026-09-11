// Every variant here is a tint/shade/depth of --color-primary or --color-accent —
// no new hues are introduced, per MEDAI's strict 4-color palette.
const variants = {
  taken: 'bg-gradient-to-b from-[#eef5e7] to-[#dce9d0] text-primary border-primary/25',
  missed: 'bg-gradient-to-b from-[#fef5e7] to-[#fde5c2] text-[#bf6d06] border-accent/40',
  scheduled: 'bg-gradient-to-b from-[#faf6ed] to-[#ece2ca] text-primary/75 border-primary/15',
  skipped: 'bg-[#ece4cf] text-primary/50 border-primary/10',
  low: 'bg-gradient-to-b from-[#eef5e7] to-[#dce9d0] text-primary border-primary/25',
  moderate: 'bg-gradient-to-b from-[#fef4e4] to-[#fde2ba] text-[#bf6d06] border-accent/40',
  high: 'bg-gradient-to-b from-[#fba834] to-[#f4991a] text-white border-[#c97507] !text-shadow-sm',
  neutral: 'bg-gradient-to-b from-[#faf6ed] to-[#ece2ca] text-primary/70 border-primary/15',
}

export default function Badge({ variant = 'neutral', children, className = '' }) {
  return (
    <span
      className={`skeuo-badge inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold
        capitalize tracking-wide ${variants[variant] ?? variants.neutral} ${className}`}
    >
      {children}
    </span>
  )
}

