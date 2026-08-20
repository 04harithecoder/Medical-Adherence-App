import Card from '../common/Card'
import Badge from '../common/Badge'
import Button from '../common/Button'

export default function UpcomingDoseCard({ dose, onMarkTaken, onMarkMissed }) {
  const { medicineName, dosage, time, status = 'scheduled' } = dose

  return (
    <Card className="flex items-center justify-between gap-4">
      <div>
        <p className="font-semibold text-primary">{medicineName}</p>
        <p className="text-sm text-primary/60">{dosage} · {time}</p>
      </div>

      {status === 'scheduled' ? (
        <div className="flex gap-2">
          <Button variant="primary" className="px-3 py-1.5 text-xs" onClick={() => onMarkTaken?.(dose)}>
            Taken
          </Button>
          <Button variant="outline" className="px-3 py-1.5 text-xs" onClick={() => onMarkMissed?.(dose)}>
            Missed
          </Button>
        </div>
      ) : (
        <Badge variant={status}>{status}</Badge>
      )}
    </Card>
  )
}
