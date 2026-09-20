import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { linkingService } from '../../services/linkingService'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Spinner from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'

export default function LinkedPatients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [formError, setFormError] = useState('')
  const [formMessage, setFormMessage] = useState('')

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

  const load = () => {
    setLoading(true)
    linkingService.linkedPatients().then(setPatients).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const onSubmit = async ({ patient_email }) => {
    setFormError('')
    setFormMessage('')
    try {
      const res = await linkingService.sendLinkRequest(patient_email)
      setFormMessage(res.message || 'Link request sent.')
      reset()
    } catch (err) {
      setFormError(err.response?.data?.error?.message || 'Could not send that link request.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-2xl text-primary">Linked Patients</h2>

      <Card>
        <h3 className="mb-3 font-display text-base text-primary">Link a new patient</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              id="patient_email"
              label="Patient's email"
              type="email"
              placeholder="patient@example.com"
              {...register('patient_email', { required: true })}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Send request'}
          </Button>
        </form>
        {formMessage && <p className="mt-2 text-sm font-medium text-primary">{formMessage}</p>}
        {formError && <p className="mt-2 text-sm font-medium text-accent">{formError}</p>}
        <p className="mt-2 text-xs text-primary/50">
          The patient has to approve this from their Profile page before you can see their data.
        </p>
      </Card>

      {loading ? (
        <div className="flex justify-center py-10"><Spinner label="Loading…" /></div>
      ) : patients.length === 0 ? (
        <EmptyState title="No linked patients yet" description="Send a request above to get started." />
      ) : (
        <div className="flex flex-col gap-3">
          {patients.map((p) => (
            <Card key={p.link_id} className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-primary">{p.full_name}</p>
                <p className="text-sm text-primary/60">{p.email} · {p.adherence_percentage}% adherence (14-day)</p>
              </div>
              <Badge variant={p.risk_level}>{p.risk_level} risk</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
