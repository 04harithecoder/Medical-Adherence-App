import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { profileService } from '../../services/profileService'
import { linkingService } from '../../services/linkingService'
import { useAuth } from '../../hooks/useAuth'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Spinner from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'

export default function Profile() {
  const { logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [error, setError] = useState('')

  const [requests, setRequests] = useState([])
  const [requestsLoading, setRequestsLoading] = useState(true)
  const [actingId, setActingId] = useState(null)

  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    profileService
      .get()
      .then((profile) => {
        reset({
          full_name: profile.full_name,
          phone: profile.phone || '',
          date_of_birth: profile.date_of_birth || '',
          gender: profile.gender || 'unspecified',
        })
      })
      .catch(() => setError('Could not load your profile.'))
      .finally(() => setLoading(false))

    linkingService
      .pendingRequests()
      .then(setRequests)
      .catch(() => {})
      .finally(() => setRequestsLoading(false))
  }, [reset])

  const onSubmit = async (values) => {
    setSaving(true)
    setSaveMessage('')
    const payload = { ...values, date_of_birth: values.date_of_birth || null }
    try {
      await profileService.update(payload)
      setSaveMessage('Profile updated.')
    } catch {
      setError('Could not save your changes.')
    } finally {
      setSaving(false)
    }
  }

  const respond = async (linkId, action) => {
    setActingId(linkId)
    try {
      if (action === 'approve') await linkingService.approve(linkId)
      else await linkingService.reject(linkId)
      setRequests((prev) => prev.filter((r) => r.link_id !== linkId))
    } finally {
      setActingId(null)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner label="Loading your profile…" /></div>
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <h2 className="font-display text-2xl text-primary">Profile</h2>

      {error && <p className="text-sm font-semibold text-accent">{error}</p>}

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input id="full_name" label="Full name" {...register('full_name', { required: true })} />
          <Input id="phone" label="Phone" {...register('phone')} />
          <Input id="date_of_birth" label="Date of birth" type="date" {...register('date_of_birth')} />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="gender" className="text-sm font-medium text-primary/80">Gender</label>
            <select
              id="gender"
              {...register('gender')}
              className="rounded-lg border border-primary/15 bg-white/60 px-3.5 py-2.5 text-sm text-primary
                focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/25"
            >
              <option value="unspecified">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {saveMessage && <p className="text-sm font-medium text-primary">{saveMessage}</p>}

          <div className="flex items-center justify-between pt-2">
            <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
            <Button type="button" variant="outline" onClick={logout}>Log out</Button>
          </div>
        </form>
      </Card>

      <div>
        <h3 className="mb-3 font-display text-lg text-primary">Caregiver requests</h3>
        {requestsLoading ? (
          <Spinner label="Checking for requests…" />
        ) : requests.length === 0 ? (
          <EmptyState title="No pending requests" description="When a caregiver asks to follow your adherence, it'll show up here." />
        ) : (
          <div className="flex flex-col gap-3">
            {requests.map((r) => (
              <Card key={r.link_id} className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-primary">{r.caregiver_name}</p>
                  <p className="text-sm text-primary/60">{r.caregiver_email}{r.relationship_type ? ` · ${r.relationship_type}` : ''}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="px-3 py-1.5 text-xs"
                    disabled={actingId === r.link_id}
                    onClick={() => respond(r.link_id, 'approve')}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="px-3 py-1.5 text-xs"
                    disabled={actingId === r.link_id}
                    onClick={() => respond(r.link_id, 'reject')}
                  >
                    Reject
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
