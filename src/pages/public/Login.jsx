import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

// Only show preview mode when no real API URL is configured, or explicitly enabled.
const SHOW_DEV_PREVIEW = import.meta.env.DEV

export default function Login() {
  const { login, devPreviewLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState('')

  const handlePreview = (role) => {
    const previewUser = devPreviewLogin(role)
    navigate(`/${previewUser.role}/dashboard`, { replace: true })
  }

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
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <Card className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg
            bg-primary font-display text-base font-semibold text-accent">M</span>
          <h1 className="mt-4 font-display text-2xl text-primary">Welcome back</h1>
          <p className="mt-1 text-sm text-primary/60">Log in to your MEDAI account</p>
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

          {serverError && <p className="text-sm font-medium text-accent">{serverError}</p>}

          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-primary/60">
          New to MEDAI?{' '}
          <Link to="/register" className="font-semibold text-accent">
            Create an account
          </Link>
        </p>

        {SHOW_DEV_PREVIEW && (
          <div className="mt-6 border-t border-dashed border-primary/20 pt-5">
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-primary/40">
              Dev preview (no backend yet)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="px-2 py-2 text-xs" onClick={() => handlePreview('patient')}>
                Patient
              </Button>
              <Button variant="outline" className="px-2 py-2 text-xs" onClick={() => handlePreview('caregiver')}>
                Caregiver
              </Button>
              <Button variant="outline" className="px-2 py-2 text-xs" onClick={() => handlePreview('admin')}>
                Admin
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
