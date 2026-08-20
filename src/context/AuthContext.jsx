import { createContext, useEffect, useState, useCallback } from 'react'
import { authService } from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On first load, if a token is already stored, try to restore the session.
  useEffect(() => {
    const token = localStorage.getItem('medai_token')
    const cachedUser = localStorage.getItem('medai_user')

    if (!token) {
      setLoading(false)
      return
    }

    if (cachedUser) {
      setUser(JSON.parse(cachedUser))
    }

    authService
      .fetchCurrentUser()
      .then((freshUser) => {
        setUser(freshUser)
        localStorage.setItem('medai_user', JSON.stringify(freshUser))
      })
      .catch(() => {
        localStorage.removeItem('medai_token')
        localStorage.removeItem('medai_user')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const { user: loggedInUser, access_token } = await authService.login(email, password)
    localStorage.setItem('medai_token', access_token)
    localStorage.setItem('medai_user', JSON.stringify(loggedInUser))
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  const register = useCallback(async (payload) => {
    const { user: newUser, access_token } = await authService.register(payload)
    localStorage.setItem('medai_token', access_token)
    localStorage.setItem('medai_user', JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('medai_token')
    localStorage.removeItem('medai_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
