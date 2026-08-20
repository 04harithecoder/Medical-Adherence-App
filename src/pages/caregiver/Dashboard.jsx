import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import StatCard from '../../components/dashboard/StatCard'

// Mock data — Phase 5/6 replaces this with GET /caregiver/patients.
const linkedPatients = [
  { id: 1, name: 'Kavitha R.', adherence: 92, risk: 'low' },
  { id: 2, name: 'Suresh M.', adherence: 61, risk: 'high' },
]

export default function CaregiverDashboard() {
  const avgAdherence = Math.round(
    linkedPatients.reduce((sum, p) => sum + p.adherence, 0) / linkedPatients.length
  )

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-2xl text-primary">Your linked patients</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Linked patients" value={linkedPatients.length} />
        <StatCard label="Average adherence" value={`${avgAdherence}%`} />
        <StatCard
          label="Patients needing attention"
          value={linkedPatients.filter((p) => p.risk === 'high').length}
        />
      </div>

      <div className="flex flex-col gap-3">
        {linkedPatients.map((p) => (
          <Card key={p.id} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-primary">{p.name}</p>
              <p className="text-sm text-primary/60">{p.adherence}% adherence (14-day)</p>
            </div>
            <Badge variant={p.risk}>{p.risk} risk</Badge>
          </Card>
        ))}
      </div>
    </div>
  )
}
