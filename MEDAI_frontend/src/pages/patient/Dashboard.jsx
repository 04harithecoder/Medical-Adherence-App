import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import StatCard from '../../components/dashboard/StatCard'
import AdherenceRing from '../../components/dashboard/AdherenceRing'
import UpcomingDoseCard from '../../components/dashboard/UpcomingDoseCard'

// Mock data — Phase 5/6 replaces this with live calls to
// GET /doses/today and GET /adherence/summary.
const todayDoses = [
  { id: 1, medicineName: 'Metformin', dosage: '1 tablet', time: '8:00 AM', status: 'taken' },
  { id: 2, medicineName: 'Amlodipine', dosage: '1 tablet', time: '2:00 PM', status: 'scheduled' },
  { id: 3, medicineName: 'Atorvastatin', dosage: '1 tablet', time: '9:00 PM', status: 'scheduled' },
]

const recentAlerts = [
  { id: 1, text: 'Repeated missed-dose pattern detected for evening medication.' },
]

export default function PatientDashboard() {
  const taken = todayDoses.filter((d) => d.status === 'taken').length
  const missed = todayDoses.filter((d) => d.status === 'missed').length
  const adherence = Math.round((taken / todayDoses.length) * 100)

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          className="font-display text-2xl font-bold text-primary"
          style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.9)' }}
        >
          Your day at a glance
        </h2>
        <Button as={Link} to="/patient/medications" className="font-bold gap-1.5">
          <Plus className="h-4 w-4 stroke-[2.5]" /> Add medication
        </Button>
      </div>


      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center justify-center p-4 lg:col-span-1">
          <AdherenceRing percentage={adherence} />
        </Card>
        <StatCard label="Doses taken today" value={taken} hint={`of ${todayDoses.length} scheduled`} />
        <StatCard label="Doses missed today" value={missed} hint="Keep it at zero" />
        <StatCard label="Adherence status" value="Low risk" hint="Based on the last 14 days" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-3 lg:col-span-2">
          <h3
            className="font-display text-lg font-bold text-primary"
            style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.9)' }}
          >
            Today's medications
          </h3>
          <div className="flex flex-col gap-3">
            {todayDoses.map((dose) => (
              <UpcomingDoseCard key={dose.id} dose={dose} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3
            className="font-display text-lg font-bold text-primary"
            style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.9)' }}
          >
            Recent alerts
          </h3>
          {recentAlerts.length === 0 ? (
            <Card className="text-sm font-medium text-primary/50">No alerts right now.</Card>
          ) : (
            recentAlerts.map((alert) => (
              <Card key={alert.id} className="flex items-start gap-3 transition-transform hover:-translate-y-0.5">
                <Badge variant="moderate" className="mt-0.5">Pattern</Badge>
                <p
                  className="text-sm font-medium leading-snug text-primary/80"
                  style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.6)' }}
                >
                  {alert.text}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

