import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { doseService } from '../../services/doseService'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Spinner from '../../components/common/Spinner'
import StatCard from '../../components/dashboard/StatCard'
import AdherenceRing from '../../components/dashboard/AdherenceRing'
import UpcomingDoseCard from '../../components/dashboard/UpcomingDoseCard'

export default function PatientDashboard() {
  const [doses, setDoses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actingId, setActingId] = useState(null)

  const load = () => {
    setLoading(true)
    doseService
      .today()
      .then(setDoses)
      .catch(() => setError('Could not load today’s doses.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const act = async (dose, action) => {
    setActingId(dose.id)
    try {
      const updated = action === 'taken' ? await doseService.markTaken(dose.id) : await doseService.markMissed(dose.id)
      setDoses((prev) => prev.map((d) => (d.id === dose.id ? updated : d)))
    } catch {
      setError('Could not update that dose.')
    } finally {
      setActingId(null)
    }
  }

  const taken = doses.filter((d) => d.status === 'taken').length
  const missed = doses.filter((d) => d.status === 'missed').length
  const adherence = doses.length > 0 ? Math.round((taken / doses.length) * 100) : 0
  const riskLabel = missed >= 2 ? 'High risk' : missed === 1 ? 'Moderate risk' : 'Low risk'
  const riskVariant = missed >= 2 ? 'high' : missed === 1 ? 'moderate' : 'low'

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner label="Loading your dashboard…" /></div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-primary">Your day at a glance</h2>
        <Button as={Link} to="/patient/medications"><Plus className="h-4 w-4" /> Add medication</Button>
      </div>

      {error && <p className="text-sm font-semibold text-accent">{error}</p>}

      {doses.length === 0 ? (
        <Card className="text-center text-sm text-primary/60">
          No medications scheduled yet.{' '}
          <Link to="/patient/medications" className="font-semibold text-accent">Add one</Link> to get started.
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="flex items-center justify-center md:col-span-1">
              <AdherenceRing percentage={adherence} />
            </Card>
            <StatCard label="Doses taken today" value={taken} hint={`of ${doses.length} scheduled`} />
            <StatCard label="Doses missed today" value={missed} hint="Keep it at zero" />
            <Card className="flex flex-col gap-1">
              <p className="text-sm font-medium text-primary/60">Adherence status</p>
              <Badge variant={riskVariant} className="self-start text-sm">{riskLabel}</Badge>
              <p className="text-xs text-primary/50">Based on today's doses</p>
            </Card>
          </div>

          <div>
            <h3 className="mb-3 font-display text-lg text-primary">Today's medications</h3>
            <div className="flex flex-col gap-3">
              {doses.map((dose) => (
                <UpcomingDoseCard
                  key={dose.id}
                  dose={{
                    id: dose.id,
                    medicineName: dose.medicine_name,
                    dosage: dose.dosage_description,
                    time: dose.scheduled_time.slice(0, 5),
                    status: dose.status,
                  }}
                  onMarkTaken={() => act(dose, 'taken')}
                  onMarkMissed={() => act(dose, 'missed')}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
