export default function AdherenceRing({ percentage = 0, label = "Today's Adherence" }) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(100, Math.max(0, percentage))
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Outer tactile bezel ring */}
      <div className="skeuo-gauge-bezel relative flex h-40 w-40 items-center justify-center rounded-full p-2.5">
        {/* Recessed dial face */}
        <div className="skeuo-gauge-inner relative flex h-full w-full items-center justify-center rounded-full">
          <svg width="136" height="136" viewBox="0 0 136 136" role="img" aria-label={`${label}: ${clamped}%`} className="relative z-10">
            <defs>
              <linearGradient id="gaugeAmberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fba834" />
                <stop offset="60%" stopColor="#f4991a" />
                <stop offset="100%" stopColor="#d97f08" />
              </linearGradient>
              <filter id="gaugeShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#f4991a" floodOpacity="0.45" />
              </filter>
              <filter id="trackInset" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#344f1f" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* Recessed track background */}
            <circle
              cx="68"
              cy="68"
              r={radius}
              fill="none"
              stroke="#dfd4ba"
              strokeWidth="11"
              filter="url(#trackInset)"
            />
            {/* Active gauge meter arc */}
            <circle
              cx="68"
              cy="68"
              r={radius}
              fill="none"
              stroke="url(#gaugeAmberGradient)"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 68 68)"
              filter="url(#gaugeShadow)"
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            />
            {/* Value text engraved in center */}
            <text
              x="68"
              y="74"
              textAnchor="middle"
              fontSize="27"
              fontWeight="bold"
              fontFamily="Fraunces, serif"
              fill="var(--color-primary)"
              style={{ filter: 'drop-shadow(0 1px 0 rgba(255, 255, 255, 0.9))' }}
            >
              {clamped}%
            </text>
          </svg>
        </div>
      </div>
      <p
        className="text-xs font-bold uppercase tracking-wider text-primary/70"
        style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.8)' }}
      >
        {label}
      </p>
    </div>
  )
}

