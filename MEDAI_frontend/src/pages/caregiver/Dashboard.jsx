import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { linkingService } from '../../services/linkingService'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import StatCard from '../../components/dashboard/StatCard'

export default function CaregiverDashboard() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    linkingService
      .linkedPatients()
      .then(setPatients)
      .catch(() => setError('Could not load your linked patients.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner label="Loading your linked patients…" /></div>
  }

  const avgAdherence = patients.length
    ? Math.round(patients.reduce((sum, p) => sum + p.adherence_percentage, 0) / patients.length)
    : 0

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <h2
        className="font-display text-2xl font-bold text-primary"
        style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.9)' }}
      >
        Your linked patients
      </h2>

      {error && <p className="text-sm font-semibold text-accent">{error}</p>}

      {patients.length === 0 ? (
        <EmptyState
          title="No linked patients yet"
          description="Send a link request to a patient by their email from the Linked Patients page."
          action={<Button as={Link} to="/caregiver/patients">Go to Linked Patients</Button>}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <StatCard label="Linked patients" value={patients.length} />
            <StatCard label="Average adherence" value={`${avgAdherence}%`} />
            <StatCard
              label="Patients needing attention"
              value={patients.filter((p) => p.risk_level === 'high').length}
            />
          </div>

          <div className="flex flex-col gap-3">
            {patients.map((p) => (
              <Card key={p.link_id} className="flex items-center justify-between gap-4 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center gap-3.5">
                  <div className="skeuo-well flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-base font-bold text-primary shadow-inner">
                    {p.full_name.charAt(0)}
                  </div>
                  <div>
                    <p
                      className="font-display text-base font-bold text-primary"
                      style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.8)' }}
                    >
                      {p.full_name}
                    </p>
                    <p className="text-xs font-semibold text-primary/65">
                      <span className="font-bold text-primary/90">{p.adherence_percentage}%</span> adherence (14-day)
                    </p>
                  </div>
                </div>
                <Badge variant={p.risk_level}>{p.risk_level} risk</Badge>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
