import Card from '../common/Card'

export default function StatCard({ label, value, hint }) {
  return (
    <Card className="flex flex-col justify-between gap-3 overflow-hidden">
      <div>
        <p
          className="text-xs font-bold uppercase tracking-wider text-primary/70"
          style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.8)' }}
        >
          {label}
        </p>
      </div>

      <div className="skeuo-well rounded-xl px-4 py-3">
        <p
          className="font-display text-3xl font-bold tracking-tight text-primary"
          style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.9)' }}
        >
          {value}
        </p>
      </div>

      {hint && (
        <p className="text-xs font-medium text-primary/50" style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.7)' }}>
          {hint}
        </p>
      )}
    </Card>
  )
}

