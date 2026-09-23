import { useEffect, useState } from 'react'
import { alertService } from '../../services/alertService'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [resolvingId, setResolvingId] = useState(null)

  const load = () => {
    setLoading(true)
    alertService
      .list()
      .then(setAlerts)
      .catch(() => setError('Could not load alerts.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const resolve = async (id) => {
    setResolvingId(id)
    try {
      await alertService.resolve(id)
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, is_resolved: true } : a)))
    } catch {
      setError('Could not resolve that alert.')
    } finally {
      setResolvingId(null)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner label="Loading alerts…" /></div>
  }

  const active = alerts.filter((a) => !a.is_resolved)
  const resolved = alerts.filter((a) => a.is_resolved)

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-2xl text-primary">Alerts</h2>
      {error && <p className="text-sm font-semibold text-accent">{error}</p>}

      {alerts.length === 0 ? (
        <EmptyState title="No alerts" description="You'll be notified here if a linked patient shows a repeated missed-dose pattern." />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {active.map((a) => (
              <Card key={a.id} className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant="moderate">Adherence Pattern Risk</Badge>
                    <span className="text-sm font-semibold text-primary">{a.patient_name}</span>
                  </div>
                  <p className="text-sm text-primary/70">{a.description}</p>
                  <p className="mt-1 text-xs text-primary/50">
                    {a.medication_name && <>Medication: {a.medication_name} · </>}
                    {a.missed_count} missed doses in the last {a.period_days} days
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="shrink-0 px-3 py-1.5 text-xs"
                  disabled={resolvingId === a.id}
                  onClick={() => resolve(a.id)}
                >
                  Mark resolved
                </Button>
              </Card>
            ))}
            {active.length === 0 && (
              <Card className="text-sm text-primary/50">No active alerts right now.</Card>
            )}
          </div>

          {resolved.length > 0 && (
            <div>
              <h3 className="mb-3 font-display text-base text-primary/60">Resolved</h3>
              <div className="flex flex-col gap-3 opacity-60">
                {resolved.map((a) => (
                  <Card key={a.id} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-primary">{a.patient_name}</p>
                      <p className="text-sm text-primary/60">{a.description}</p>
                    </div>
                    <Badge variant="low">Resolved</Badge>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
