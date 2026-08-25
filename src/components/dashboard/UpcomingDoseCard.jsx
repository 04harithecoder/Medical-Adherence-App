import Card from '../common/Card'
import Badge from '../common/Badge'
import Button from '../common/Button'

export default function UpcomingDoseCard({ dose, onMarkTaken, onMarkMissed }) {
  const { medicineName, dosage, time, status = 'scheduled' } = dose

  return (
    <Card className="flex items-center justify-between gap-4 transition-transform hover:-translate-y-0.5">
      <div className="flex items-center gap-3.5">
        <div className="skeuo-well flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg shadow-inner">
          💊
        </div>
        <div>
          <p
            className="font-display text-base font-bold text-primary"
            style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.8)' }}
          >
            {medicineName}
          </p>
          <p className="text-xs font-semibold text-primary/60" style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.6)' }}>
            {dosage} · <span className="font-bold text-primary/80">{time}</span>
          </p>
        </div>
      </div>

      {status === 'scheduled' ? (
        <div className="flex gap-2">
          <Button variant="primary" className="px-3.5 py-1.5 text-xs font-bold" onClick={() => onMarkTaken?.(dose)}>
            ✓ Taken
          </Button>
          <Button variant="outline" className="px-3 py-1.5 text-xs font-semibold" onClick={() => onMarkMissed?.(dose)}>
            Missed
          </Button>
        </div>
      ) : (
        <Badge variant={status}>{status}</Badge>
      )}
    </Card>
  )
}

