import { useEffect, useState } from 'react'
import { doseService } from '../../services/doseService'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'
import Spinner from '../../components/common/Spinner'

export default function TodayDoses() {
  const [doses, setDoses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actingId, setActingId] = useState(null)

  const load = () => {
    setLoading(true)
    doseService
      .today()
      .then(setDoses)
      .catch(() => setError('Could not load today’s doses. Please try again.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const act = async (dose, action) => {
    setActingId(dose.id)
    try {
      const updated = action === 'taken' ? await doseService.markTaken(dose.id) : await doseService.markMissed(dose.id)
      setDoses((prev) => prev.map((d) => (d.id === dose.id ? updated : d)))
    } catch {
      setError('Could not update that dose. Please try again.')
    } finally {
      setActingId(null)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner label="Loading today’s doses…" /></div>
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-2xl text-primary">Today's Doses</h2>

      {error && <p className="text-sm font-semibold text-accent">{error}</p>}

      {doses.length === 0 ? (
        <EmptyState
          title="Nothing scheduled today"
          description="Add a medication with a schedule to see today's doses here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {doses.map((dose) => (
            <Card key={dose.id} className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-primary">{dose.medicine_name}</p>
                <p className="text-sm text-primary/60">{dose.dosage_description} · {dose.scheduled_time.slice(0, 5)}</p>
              </div>

              {dose.status === 'scheduled' ? (
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    className="px-3 py-1.5 text-xs"
                    disabled={actingId === dose.id}
                    onClick={() => act(dose, 'taken')}
                  >
                    Taken
                  </Button>
                  <Button
                    variant="outline"
                    className="px-3 py-1.5 text-xs"
                    disabled={actingId === dose.id}
                    onClick={() => act(dose, 'missed')}
                  >
                    Missed
                  </Button>
                </div>
              ) : (
                <Badge variant={dose.status}>{dose.status}</Badge>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
