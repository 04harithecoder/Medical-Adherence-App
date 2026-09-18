import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Pill, Plus, Trash2, X } from 'lucide-react'
import { medicationService } from '../../services/medicationService'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'
import Spinner from '../../components/common/Spinner'

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

function AddMedicationForm({ onCancel, onCreated }) {
  const [serverError, setServerError] = useState('')
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      medicine_name: '',
      dosage_description: '',
      frequency: '',
      instructions: '',
      start_date: new Date().toISOString().slice(0, 10),
      end_date: '',
      schedules: [{ scheduled_time: '08:00', every_day: true, days: [] }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'schedules' })

  const toggleDay = (index, day) => {
    const current = watch(`schedules.${index}.days`) || []
    const next = current.includes(day) ? current.filter((d) => d !== day) : [...current, day]
    setValue(`schedules.${index}.days`, next)
  }

  const onSubmit = async (values) => {
    setServerError('')
    try {
      await medicationService.create({
        medicine_name: values.medicine_name,
        dosage_description: values.dosage_description,
        frequency: values.frequency,
        instructions: values.instructions || undefined,
        start_date: values.start_date,
        end_date: values.end_date || undefined,
        schedules: values.schedules.map((s) => ({
          scheduled_time: `${s.scheduled_time}:00`,
          days_of_week: s.every_day || s.days.length === 0 ? 'ALL' : s.days.join(','),
        })),
      })
      onCreated()
    } catch (err) {
      setServerError(err.response?.data?.error?.message ?? 'Could not add medication. Please try again.')
    }
  }

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-primary">Add medication</h3>
        <button type="button" onClick={onCancel} className="text-primary/50 hover:text-primary" aria-label="Cancel">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="medicine_name"
            label="Medicine name"
            error={errors.medicine_name?.message}
            {...register('medicine_name', { required: 'Required' })}
          />
          <Input
            id="dosage_description"
            label="Dosage (e.g. 1 tablet, 500mg)"
            error={errors.dosage_description?.message}
            {...register('dosage_description', { required: 'Required' })}
          />
          <Input
            id="frequency"
            label="Frequency (e.g. twice daily)"
            error={errors.frequency?.message}
            {...register('frequency', { required: 'Required' })}
          />
          <Input id="instructions" label="Instructions (optional)" {...register('instructions')} />
          <Input
            id="start_date"
            label="Start date"
            type="date"
            error={errors.start_date?.message}
            {...register('start_date', { required: 'Required' })}
          />
          <Input id="end_date" label="End date (optional)" type="date" {...register('end_date')} />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-primary/70">Schedule</p>
          {fields.map((field, index) => {
            const everyDay = watch(`schedules.${index}.every_day`)
            const days = watch(`schedules.${index}.days`) || []
            return (
              <div key={field.id} className="skeuo-well flex flex-col gap-3 rounded-xl p-3.5">
                <div className="flex items-end gap-3">
                  <Input
                    id={`schedules.${index}.scheduled_time`}
                    label="Time"
                    type="time"
                    {...register(`schedules.${index}.scheduled_time`, { required: true })}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="px-2 py-2"
                      onClick={() => remove(index)}
                      aria-label="Remove this time slot"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <label className="flex items-center gap-2 text-sm font-medium text-primary/80">
                  <input type="checkbox" {...register(`schedules.${index}.every_day`)} />
                  Every day
                </label>

                {!everyDay && (
                  <div className="flex flex-wrap gap-1.5">
                    {DAYS.map((day) => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDay(index, day)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                          days.includes(day) ? 'bg-accent text-white' : 'bg-primary/5 text-primary/60'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          <Button
            type="button"
            variant="outline"
            className="self-start text-xs"
            onClick={() => append({ scheduled_time: '08:00', every_day: true, days: [] })}
          >
            <Plus className="h-3.5 w-3.5" /> Add another time
          </Button>
        </div>

        {serverError && <p className="text-sm font-semibold text-accent">{serverError}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding…' : 'Add medication'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

function MedicationCard({ medication, onDelete }) {
  return (
    <Card className="flex items-start justify-between gap-4">
      <div className="flex gap-3">
        <span className="skeuo-well flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-accent">
          <Pill className="h-5 w-5" />
        </span>
        <div>
          <p className="font-semibold text-primary">{medication.medicine_name}</p>
          <p className="text-sm text-primary/60">{medication.dosage_description} · {medication.frequency}</p>
          {medication.instructions && (
            <p className="mt-1 text-xs text-primary/50">{medication.instructions}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {medication.schedules.map((s) => (
              <Badge key={s.id} variant="neutral">
                {s.scheduled_time.slice(0, 5)} · {s.days_of_week === 'ALL' ? 'Every day' : s.days_of_week}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!medication.is_active && <Badge variant="skipped">Inactive</Badge>}
        <button
          type="button"
          onClick={() => onDelete(medication)}
          className="text-primary/40 hover:text-accent"
          aria-label={`Delete ${medication.medicine_name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </Card>
  )
}

export default function Medications() {
  const [medications, setMedications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    medicationService
      .list()
      .then(setMedications)
      .catch(() => setError('Could not load your medications. Please try again.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (medication) => {
    if (!window.confirm(`Remove ${medication.medicine_name}? This also removes its dose history.`)) return
    await medicationService.remove(medication.id)
    load()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-primary">My Medications</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" /> Add medication
          </Button>
        )}
      </div>

      {showForm && (
        <AddMedicationForm
          onCancel={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false)
            load()
          }}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Spinner label="Loading your medications…" /></div>
      ) : error ? (
        <EmptyState title="Something went wrong" description={error} />
      ) : medications.length === 0 ? (
        <EmptyState
          title="No medications yet"
          description="Add your first medication to start tracking doses."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {medications.map((m) => (
            <MedicationCard key={m.id} medication={m} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
