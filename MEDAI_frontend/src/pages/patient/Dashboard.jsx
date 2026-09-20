import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { doseService } from '../../services/doseService'
import { adherenceService } from '../../services/adherenceService'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Spinner from '../../components/common/Spinner'
import StatCard from '../../components/dashboard/StatCard'
import AdherenceRing from '../../components/dashboard/AdherenceRing'
import UpcomingDoseCard from '../../components/dashboard/UpcomingDoseCard'

export default function PatientDashboard() {
  const [doses, setDoses] = useState([])
  const [risk, setRisk] = useState(null)
  const [patterns, setPatterns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actingId, setActingId] = useState(null)

  const load = () => {
    setLoading(true)
    Promise.all([doseService.today(), adherenceService.risk(), adherenceService.patterns()])
      .then(([doseData, riskData, patternData]) => {
        setDoses(doseData)
        setRisk(riskData)
        setPatterns(patternData)
      })
      .catch(() => setError('Could not load your dashboard.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const act = async (dose, action) => {
    setActingId(dose.id)
    try {
      const updated = action === 'taken' ? await doseService.markTaken(dose.id) : await doseService.markMissed(dose.id)
      setDoses((prev) => prev.map((d) => (d.id === dose.id ? updated : d)))
      // A dose change can shift the risk level / detected patterns too.
      adherenceService.risk().then(setRisk).catch(() => {})
      adherenceService.patterns().then(setPatterns).catch(() => {})
    } catch {
      setError('Could not update that dose.')
    } finally {
      setActingId(null)
    }
  }

  const taken = doses.filter((d) => d.status === 'taken').length
  const missed = doses.filter((d) => d.status === 'missed').length
  const adherence = doses.length > 0 ? Math.round((taken / doses.length) * 100) : 0

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
              <p className="text-sm font-medium text-primary/60">Adherence Pattern Risk</p>
              {risk && (
                <>
                  <Badge variant={risk.risk_level} className="self-start text-sm">{risk.risk_level} risk</Badge>
                  <p className="text-xs text-primary/50">Based on the last {risk.period_days} days</p>
                </>
              )}
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col gap-3 md:col-span-2">
              <h3 className="font-display text-lg text-primary">Today's medications</h3>
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

            <div className="flex flex-col gap-3">
              <h3 className="font-display text-lg text-primary">Recent alerts</h3>
              {patterns.length === 0 ? (
                <Card className="text-sm text-primary/50">No alerts right now.</Card>
              ) : (
                patterns.slice(0, 3).map((p, i) => (
                  <Card key={i} className="flex items-start gap-2">
                    <Badge variant="moderate">Pattern</Badge>
                    <p className="text-sm text-primary/70">{p.message}</p>
                  </Card>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
