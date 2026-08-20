import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Spinner from '../components/common/Spinner'

/**
 * Wraps a set of routes and only renders them if the logged-in user's
 * role is included in `allow`. Unauthenticated users are sent to /login
 * (remembering where they were headed); wrong-role users are sent to
 * their own dashboard rather than an error page.
 */
export function RequireRole({ allow }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <Spinner label="Checking your session..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!allow.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />
  }

  return <Outlet />
}
