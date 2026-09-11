import { Link } from 'react-router-dom'
import { Pill, Search, Megaphone, Check, AlertCircle } from 'lucide-react'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import ThemeSwitch from '../../components/common/ThemeSwitch'

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
  taken: 'skeuo-btn-secondary !shadow-sm !cursor-default !text-white font-bold',
  missed: 'skeuo-well border-2 !border-accent font-bold !text-accent',
  upcoming: 'border border-dashed border-primary/25 text-primary/40 bg-white/40',
}

const capabilities = [
  {
    icon: Pill,
    title: 'Track',
    body: 'Log every prescribed medication with dosage, timing and instructions in one place.',
  },
  {
    icon: Search,
    title: 'Detect',
    body: 'Spot repeated missed-dose patterns before they become a habit — evenings, weekends, specific meds.',
  },
  {
    icon: Megaphone,
    title: 'Alert',
    body: 'Notify a linked caregiver automatically when adherence needs a supportive nudge.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg transition-colors duration-200">
      <header className="flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-3">
          <span className="skeuo-medallion flex h-10 w-10 items-center justify-center rounded-xl font-display text-base font-bold text-accent">
            M
          </span>
          <span
            className="font-display text-2xl font-bold tracking-tight text-primary"
            style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.6)' }}
          >
            MEDAI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitch />
          <Link
            to="/login"
            className="rounded-xl px-3.5 py-2 text-sm font-bold text-primary/80 transition-colors hover:text-primary"
            style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.5)' }}
          >
            Log in
          </Link>
          <Button as={Link} to="/register" className="text-sm font-bold px-4 py-2">
            Get started
          </Button>
        </div>
      </header>


      <section className="grid gap-12 px-6 py-12 md:grid-cols-2 md:items-center md:px-12 md:py-20">
        <div>
          <p className="skeuo-badge mb-4 inline-block rounded-full bg-gradient-to-b from-[#fef4e4] to-[#fde2ba] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#bf6d06] border-accent/40">
            Medication Adherence Monitoring
          </p>
          <h1
            className="font-display text-4xl font-bold leading-tight text-primary md:text-5xl"
            style={{ textShadow: '0 1px 1px rgba(255, 255, 255, 0.9)' }}
          >
            Every missed dose tells a story. MEDAI listens for it.
          </h1>
          <p
            className="mt-5 max-w-md text-base font-medium leading-relaxed text-primary/70"
            style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.8)' }}
          >
            MEDAI helps patients keep up with their medication schedule, spots
            adherence patterns as they form, and quietly loops in a caregiver
            when support is actually needed — nothing more, nothing less.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} to="/register">Create your account</Button>
            <Button as={Link} to="/login" variant="outline">I already have one</Button>
          </div>
        </div>

        <Card className="mx-auto w-full max-w-sm">
          <div className="flex items-center justify-between mb-4">
            <p
              className="text-xs font-bold uppercase tracking-wider text-primary/70"
              style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.8)' }}
            >
              This week
            </p>
            <span className="text-[11px] font-bold text-primary/50">Daily Log</span>
          </div>

          <div className="skeuo-well rounded-2xl p-3.5 mb-5 flex justify-between gap-1.5">
            {days.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-bold text-primary/60">{day.label}</span>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs
                    ${dayStyles[day.status]}`}
                  aria-label={day.status}
                >
                  {day.status === 'taken' ? (
                    <Check className="h-4 w-4 stroke-[3]" />
                  ) : day.status === 'missed' ? (
                    <AlertCircle className="h-4 w-4 stroke-[3]" />
                  ) : ''}
                </span>
              </div>
            ))}
          </div>

          <div className="skeuo-groove-h my-4" />

          <div className="flex items-center justify-between pt-1">
            <div>
              <p
                className="font-display text-3xl font-bold text-primary"
                style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.9)' }}
              >
                86%
              </p>
              <p className="text-xs font-medium text-primary/60">Adherence this week</p>
            </div>
            <span className="skeuo-badge rounded-full bg-gradient-to-b from-[#eef5e7] to-[#dce9d0] px-3 py-1.5 text-xs font-bold text-primary border-primary/25">
              Low risk
            </span>
          </div>
        </Card>
      </section>

      <section className="relative border-t border-primary/10 bg-gradient-to-b from-[#f2ead3] to-[#ebdcb9] px-6 py-16 md:px-12 shadow-inner">
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {capabilities.map((c) => {
            const Icon = c.icon
            return (
              <Card key={c.title} className="flex flex-col gap-2">
                <div className="skeuo-well flex h-12 w-12 items-center justify-center rounded-2xl text-accent shadow-inner">
                  <Icon className="h-6 w-6 stroke-[2]" />
                </div>
                <h3
                  className="mt-2 font-display text-lg font-bold text-primary"
                  style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.9)' }}
                >
                  {c.title}
                </h3>
                <p
                  className="text-sm font-medium leading-relaxed text-primary/70"
                  style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.6)' }}
                >
                  {c.body}
                </p>
              </Card>
            )
          })}
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-xs font-medium text-primary/50 md:px-12">
        MEDAI supports scheduling and adherence tracking only — it does not
        diagnose, prescribe, or recommend medication changes.
      </footer>
    </div>
  )
}


