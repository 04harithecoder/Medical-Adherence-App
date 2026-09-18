import { useEffect, useState } from 'react'
import { doseService } from '../../services/doseService'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'
import Spinner from '../../components/common/Spinner'

export default function History() {
  const [doses, setDoses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    doseService
      .history()
      .then(setDoses)
      .catch(() => setError('Could not load your dose history. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner label="Loading history…" /></div>
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-2xl text-primary">Medication History</h2>

      {error && <p className="text-sm font-semibold text-accent">{error}</p>}

      {doses.length === 0 ? (
        <EmptyState title="No history yet" description="Doses you've taken or missed will show up here." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary/10 text-left text-xs font-bold uppercase tracking-wider text-primary/50">
                <th className="px-4 py-3">Medicine</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {doses.map((dose) => (
                <tr key={dose.id} className="border-b border-primary/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-primary">{dose.medicine_name}</td>
                  <td className="px-4 py-3 text-primary/70">{dose.scheduled_date}</td>
                  <td className="px-4 py-3 text-primary/70">{dose.scheduled_time.slice(0, 5)}</td>
                  <td className="px-4 py-3"><Badge variant={dose.status}>{dose.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
