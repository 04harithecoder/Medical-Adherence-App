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
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <h2
        className="font-display text-2xl font-bold text-primary"
        style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.9)' }}
      >
        Your linked patients
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <StatCard label="Linked patients" value={linkedPatients.length} />
        <StatCard label="Average adherence" value={`${avgAdherence}%`} />
        <StatCard
          label="Patients needing attention"
          value={linkedPatients.filter((p) => p.risk === 'high').length}
        />
      </div>

      <div className="flex flex-col gap-3">
        {linkedPatients.map((p) => (
          <Card key={p.id} className="flex items-center justify-between gap-4 transition-transform hover:-translate-y-0.5">
            <div className="flex items-center gap-3.5">
              <div className="skeuo-well flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-base font-bold text-primary shadow-inner">
                {p.name.charAt(0)}
              </div>
              <div>
                <p
                  className="font-display text-base font-bold text-primary"
                  style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.8)' }}
                >
                  {p.name}
                </p>
                <p className="text-xs font-semibold text-primary/65">
                  <span className="font-bold text-primary/90">{p.adherence}%</span> adherence (14-day)
                </p>
              </div>
            </div>
            <Badge variant={p.risk}>{p.risk} risk</Badge>
          </Card>
        ))}
      </div>
    </div>
  )
}

