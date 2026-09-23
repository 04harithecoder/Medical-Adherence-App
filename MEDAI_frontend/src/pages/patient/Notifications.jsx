import { useEffect, useState } from 'react'
import { notificationService } from '../../services/notificationService'
import NotificationItem from '../../components/common/NotificationItem'
import Spinner from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    notificationService
      .list()
      .then(setNotifications)
      .catch(() => setError('Could not load notifications.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const markRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
    try {
      await notificationService.markRead(id)
    } catch {
      load()
    }
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner label="Loading notifications…" /></div>
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-2xl text-primary">Notifications</h2>
      {error && <p className="text-sm font-semibold text-accent">{error}</p>}
      {notifications.length === 0 ? (
        <EmptyState title="You're all caught up" description="New reminders and alerts will show up here." />
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onMarkRead={markRead} />
          ))}
        </div>
      )}
    </div>
  )
}
