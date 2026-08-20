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
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-2xl text-primary">System overview</h2>
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
    </div>
  )
}
