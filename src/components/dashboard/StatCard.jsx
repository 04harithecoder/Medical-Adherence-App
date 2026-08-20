import Card from '../common/Card'

export default function StatCard({ label, value, hint }) {
  return (
    <Card className="flex flex-col gap-1">
      <p className="text-sm font-medium text-primary/60">{label}</p>
      <p className="font-display text-3xl text-primary">{value}</p>
      {hint && <p className="text-xs text-primary/50">{hint}</p>}
    </Card>
  )
}
