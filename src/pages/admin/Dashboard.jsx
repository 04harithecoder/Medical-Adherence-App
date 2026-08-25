import StatCard from '../../components/dashboard/StatCard'

// Mock data — Phase 5/6 replaces this with GET /admin/stats.
const stats = [
  { label: 'Total patients', value: 128 },
  { label: 'Total caregivers', value: 54 },
  { label: 'Active alerts', value: 7 },
  { label: 'Avg. adherence (system)', value: '81%' },
]

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <h2
        className="font-display text-2xl font-bold text-primary"
        style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.9)' }}
      >
        System overview
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
    </div>
  )
}

