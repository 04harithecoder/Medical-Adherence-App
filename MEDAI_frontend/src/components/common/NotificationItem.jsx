import Card from './Card'
import Badge from './Badge'

const typeVariant = {
  reminder: 'neutral',
  missed_dose: 'missed',
  alert: 'moderate',
  system: 'neutral',
}

const typeLabel = {
  reminder: 'Reminder',
  missed_dose: 'Missed dose',
  alert: 'Alert',
  system: 'System',
}

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

export default function NotificationItem({ notification, onMarkRead }) {
  return (
    <Card className={`flex items-start justify-between gap-3 ${notification.is_read ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <Badge variant={typeVariant[notification.type] || 'neutral'}>
          {typeLabel[notification.type] || notification.type}
        </Badge>
        <div>
          <p className="font-semibold text-primary">{notification.title}</p>
          <p className="text-sm text-primary/60">{notification.message}</p>
          <p className="mt-1 text-xs text-primary/40">{timeAgo(notification.created_at)}</p>
        </div>
      </div>
      {!notification.is_read && (
        <button
          type="button"
          onClick={() => onMarkRead(notification.id)}
          className="shrink-0 text-xs font-semibold text-accent hover:underline"
        >
          Mark read
        </button>
      )}
    </Card>
  )
}
