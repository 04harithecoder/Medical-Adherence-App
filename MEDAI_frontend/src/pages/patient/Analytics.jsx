import { useEffect, useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { adherenceService } from '../../services/adherenceService'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Spinner from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'

// Chart colors are strictly the brand's 4 tokens (or tints of them) —
// no new hues, matching the rest of the product.
const CHART_ACCENT = '#F4991A'
const CHART_PRIMARY = '#344F1F'

const riskCopy = {
  low: 'Few or no recent missed doses.',
  moderate: 'Missed-dose frequency is increasing — worth a closer look.',
  high: 'Repeated missed doses within the last week.',
}

export default function Analytics() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [trend, setTrend] = useState([])
  const [byMedication, setByMedication] = useState([])
  const [patterns, setPatterns] = useState([])
  const [risk, setRisk] = useState(null)

  useEffect(() => {
    Promise.all([
      adherenceService.trends('weekly'),
      adherenceService.medicationWise(),
      adherenceService.patterns(),
      adherenceService.risk(),
    ])
      .then(([trendData, medData, patternData, riskData]) => {
        setTrend(trendData)
        setByMedication(medData)
        setPatterns(patternData)
        setRisk(riskData)
      })
      .catch(() => setError('Could not load your adherence analytics.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner label="Crunching your adherence data…" /></div>
  }

  if (error) {
    return <EmptyState title="Something went wrong" description={error} />
  }

  const takenVsMissed = trend.map((point) => ({
    label: new Date(point.date).toLocaleDateString(undefined, { weekday: 'short' }),
    Taken: point.taken,
    Missed: point.missed,
  }))

  const lineData = trend.map((point) => ({
    label: new Date(point.date).toLocaleDateString(undefined, { weekday: 'short' }),
    Adherence: point.adherence_percentage,
  }))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-primary">Adherence Analytics</h2>
        {risk && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-primary/50">Adherence Pattern Risk</span>
            <Badge variant={risk.risk_level}>{risk.risk_level}</Badge>
          </div>
        )}
      </div>

      {risk && (
        <Card className="text-sm text-primary/70">
          {riskCopy[risk.risk_level]} ({risk.missed_count} missed dose{risk.missed_count === 1 ? '' : 's'} in the last {risk.period_days} days)
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-display text-base text-primary">Weekly adherence trend</h3>
          {lineData.every((d) => d.Adherence === 0) ? (
            <EmptyState title="No data yet" description="Mark some doses as taken or missed to see your trend." />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke={`${CHART_PRIMARY}1A`} />
                <XAxis dataKey="label" stroke={CHART_PRIMARY} fontSize={12} />
                <YAxis stroke={CHART_PRIMARY} fontSize={12} domain={[0, 100]} unit="%" />
                <Tooltip contentStyle={{ borderColor: CHART_PRIMARY, fontSize: 12 }} />
                <Line type="monotone" dataKey="Adherence" stroke={CHART_ACCENT} strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 font-display text-base text-primary">Taken vs missed (this week)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={takenVsMissed}>
              <CartesianGrid strokeDasharray="3 3" stroke={`${CHART_PRIMARY}1A`} />
              <XAxis dataKey="label" stroke={CHART_PRIMARY} fontSize={12} />
              <YAxis stroke={CHART_PRIMARY} fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ borderColor: CHART_PRIMARY, fontSize: 12 }} />
              <Bar dataKey="Taken" fill={CHART_PRIMARY} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Missed" fill={CHART_ACCENT} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 font-display text-base text-primary">Medication-wise adherence (last 30 days)</h3>
        {byMedication.length === 0 ? (
          <EmptyState title="No medications yet" description="Add a medication to start tracking adherence per drug." />
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(160, byMedication.length * 60)}>
            <BarChart data={byMedication} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={`${CHART_PRIMARY}1A`} />
              <XAxis type="number" domain={[0, 100]} unit="%" stroke={CHART_PRIMARY} fontSize={12} />
              <YAxis type="category" dataKey="medicine_name" stroke={CHART_PRIMARY} fontSize={12} width={100} />
              <Tooltip contentStyle={{ borderColor: CHART_PRIMARY, fontSize: 12 }} />
              <Bar dataKey="adherence_percentage" name="Adherence %" fill={CHART_ACCENT} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card>
        <h3 className="mb-4 font-display text-base text-primary">Detected patterns</h3>
        {patterns.length === 0 ? (
          <p className="text-sm text-primary/50">No concerning patterns detected in the last two weeks.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {patterns.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-primary/70">
                <Badge variant="moderate">Pattern</Badge>
                <span>{p.message}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
