import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

const roles = [
  { value: 'patient', label: 'Patient', hint: 'Track your own medications' },
  { value: 'caregiver', label: 'Caregiver', hint: 'Support a linked patient' },
]

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: 'patient' } })

  const selectedRole = watch('role')
  const password = watch('password')

  const onSubmit = async (values) => {
    setServerError('')
    try {
      const user = await registerUser(values)
      navigate(`/${user.role}/dashboard`, { replace: true })
    } catch (err) {
      setServerError(
        err.response?.data?.error?.message ?? 'Could not create your account. Please try again.'
      )
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <Card className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg
            bg-primary font-display text-base font-semibold text-accent">M</span>
          <h1 className="mt-4 font-display text-2xl text-primary">Create your account</h1>
          <p className="mt-1 text-sm text-primary/60">Join MEDAI in a couple of minutes</p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2">
          {roles.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setValue('role', r.value)}
              className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                selectedRole === r.value
                  ? 'border-accent bg-accent/10 text-primary'
                  : 'border-primary/15 text-primary/60 hover:border-primary/30'
              }`}
            >
              <span className="block font-semibold">{r.label}</span>
              <span className="block text-xs text-primary/50">{r.hint}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input
            id="full_name"
            label="Full name"
            autoComplete="name"
            error={errors.full_name?.message}
            {...register('full_name', { required: 'Full name is required' })}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Use at least 8 characters' },
            })}
          />
          <Input
            id="confirm_password"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            error={errors.confirm_password?.message}
            {...register('confirm_password', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
          />

          {serverError && <p className="text-sm font-medium text-accent">{serverError}</p>}

          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-primary/60">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-accent">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  )
}
