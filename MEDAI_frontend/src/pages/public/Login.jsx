import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import ThemeSwitch from '../../components/common/ThemeSwitch'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async ({ email, password }) => {
    setServerError('')
    try {
      const user = await login(email, password)
      const redirectTo = location.state?.from?.pathname ?? `/${user.role}/dashboard`
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setServerError(
        err.response?.data?.error?.message ?? 'Could not log in. Check your details and try again.'
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
            Welcome back
          </h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary/60" style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.7)' }}>
            Log in to your MEDAI account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password', { required: 'Password is required' })}
          />

          {serverError && (
            <p className="text-xs font-bold text-accent" style={{ textShadow: '0 1px 0 rgba(255, 255, 255, 0.7)' }}>
              {serverError}
            </p>
          )}

          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full font-bold">
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs font-semibold text-primary/70">
          New to MEDAI?{' '}
          <Link to="/register" className="font-bold text-accent hover:underline">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  )
}

