import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import ThemeSwitch from '../../components/common/ThemeSwitch'

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
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10 relative transition-colors duration-200">
      <div className="absolute top-5 right-5">
        <ThemeSwitch />
      </div>
      <Card className="w-full max-w-sm p-7">

        <div className="mb-6 text-center">
          <span className="skeuo-medallion mx-auto flex h-12 w-12 items-center justify-center rounded-2xl font-display text-lg font-bold text-accent">
            M
          </span>
          <h1
            className="mt-4 font-display text-2xl font-bold text-primary"
            style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.9)' }}
          >
            Create your account
          </h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary/60" style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.7)' }}>
            Join MEDAI in a couple of minutes
          </p>
        </div>

        {/* Tactile Rocker Switch / Segmented Control */}
        <div className="skeuo-well mb-5 grid grid-cols-2 gap-1.5 rounded-2xl p-1.5 shadow-inner">
          {roles.map((r) => {
            const isSelected = selectedRole === r.value
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => setValue('role', r.value)}
                className={`rounded-xl px-3 py-2.5 text-left transition-all select-none cursor-pointer ${
                  isSelected
                    ? 'skeuo-btn-outline !border-accent/60 !shadow-md font-bold'
                    : 'text-primary/60 hover:text-primary active:translate-y-0.5'
                }`}
              >
                <span
                  className={`block text-xs font-bold ${isSelected ? 'text-primary' : 'text-primary/70'}`}
                  style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.8)' }}
                >
                  {r.label}
                </span>
                <span className="block text-[10px] font-medium text-primary/50">{r.hint}</span>
              </button>
            )
          })}
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

          {serverError && (
            <p className="text-xs font-bold text-accent" style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.7)' }}>
              {serverError}
            </p>
          )}

          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full font-bold">
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs font-semibold text-primary/70">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-accent hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  )
}

