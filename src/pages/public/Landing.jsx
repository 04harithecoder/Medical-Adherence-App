import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

const days = [
  { label: 'M', status: 'taken' },
  { label: 'T', status: 'taken' },
  { label: 'W', status: 'taken' },
  { label: 'T', status: 'missed' },
  { label: 'F', status: 'taken' },
  { label: 'S', status: 'taken' },
  { label: 'S', status: 'upcoming' },
]

const dayStyles = {
  taken: 'bg-primary text-white border-primary',
  missed: 'border-2 border-accent text-accent bg-transparent',
  upcoming: 'border border-dashed border-primary/25 text-primary/40 bg-transparent',
}

const capabilities = [
  {
    icon: '💊',
    title: 'Track',
    body: 'Log every prescribed medication with dosage, timing and instructions in one place.',
  },
  {
    icon: '🔍',
    title: 'Detect',
    body: 'Spot repeated missed-dose patterns before they become a habit — evenings, weekends, specific meds.',
  },
  {
    icon: '📣',
    title: 'Alert',
    body: 'Notify a linked caregiver automatically when adherence needs a supportive nudge.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary
            font-display text-sm font-semibold text-accent">M</span>
          <span className="font-display text-xl text-primary">MEDAI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-primary/70 hover:text-primary">
            Log in
          </Link>
          <Button as={Link} to="/register" className="text-sm">
            Get started
          </Button>
        </div>
      </header>

      <section className="grid gap-12 px-6 py-12 md:grid-cols-2 md:items-center md:px-12 md:py-20">
        <div>
          <p className="mb-4 inline-block rounded-full bg-accent/15 px-3 py-1 text-xs
            font-semibold uppercase tracking-wide text-accent">
            Medication Adherence Monitoring
          </p>
          <h1 className="font-display text-4xl leading-tight text-primary md:text-5xl">
            Every missed dose tells a story. MEDAI listens for it.
          </h1>
          <p className="mt-5 max-w-md text-base text-primary/65">
            MEDAI helps patients keep up with their medication schedule, spots
            adherence patterns as they form, and quietly loops in a caregiver
            when support is actually needed — nothing more, nothing less.
          </p>
          <div className="mt-8 flex gap-3">
            <Button as={Link} to="/register">Create your account</Button>
            <Button as={Link} to="/login" variant="outline">I already have one</Button>
          </div>
        </div>

        <Card className="mx-auto w-full max-w-sm">
          <p className="mb-4 text-sm font-medium text-primary/60">This week</p>
          <div className="flex justify-between gap-2">
            {days.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-xs text-primary/40">{day.label}</span>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs
                    font-semibold ${dayStyles[day.status]}`}
                  aria-label={day.status}
                >
                  {day.status === 'taken' ? '✓' : day.status === 'missed' ? '!' : ''}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-primary/10 pt-4">
            <div>
              <p className="font-display text-2xl text-primary">86%</p>
              <p className="text-xs text-primary/50">Adherence this week</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Low risk
            </span>
          </div>
        </Card>
      </section>

      <section className="border-t border-primary/10 bg-surface/60 px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {capabilities.map((c) => (
            <div key={c.title}>
              <span className="text-2xl">{c.icon}</span>
              <h3 className="mt-3 font-display text-lg text-primary">{c.title}</h3>
              <p className="mt-1.5 text-sm text-primary/60">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-xs text-primary/40 md:px-12">
        MEDAI supports scheduling and adherence tracking only — it does not
        diagnose, prescribe, or recommend medication changes.
      </footer>
    </div>
  )
}
