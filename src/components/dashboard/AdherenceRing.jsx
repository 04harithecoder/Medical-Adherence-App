export default function AdherenceRing({ percentage = 0, label = "Today's Adherence" }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(100, Math.max(0, percentage))
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="140" height="140" viewBox="0 0 140 140" role="img" aria-label={`${label}: ${clamped}%`}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--color-primary)" strokeOpacity="0.1" strokeWidth="12" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <text
          x="70"
          y="76"
          textAnchor="middle"
          fontSize="28"
          fontFamily="Fraunces, serif"
          fill="var(--color-primary)"
        >
          {clamped}%
        </text>
      </svg>
      <p className="text-sm font-medium text-primary/60">{label}</p>
    </div>
  )
}
