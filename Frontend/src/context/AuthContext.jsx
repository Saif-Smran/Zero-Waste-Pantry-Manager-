import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { authApi } from '../services/api'
import AuthContext from './authContextObject'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    try {
      const response = await authApi.session()
      setUser(response.data.user || null)
      return response.data.user
    } catch {
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await refreshSession()
      setLoading(false)
    }

    init()
  }, [refreshSession])

  const login = useCallback(async (username, password) => {
    const response = await authApi.login({ username, password })
    setUser(response.data.user)

    try {
      const sessionResponse = await authApi.session()
      if (sessionResponse.data.user) {
        setUser(sessionResponse.data.user)
      }
    } catch {
      // Keep login successful even if session probe cannot confirm immediately.
    }

    toast.success(`Welcome back, ${response.data.user.username}!`)
    return response.data.user
  }, [])

  const register = useCallback(async (username, password) => {
    const response = await authApi.register({ username, password })
    setUser(response.data.user)

    try {
      const sessionResponse = await authApi.session()
      if (sessionResponse.data.user) {
        setUser(sessionResponse.data.user)
      }
    } catch {
      // Keep register successful even if session probe cannot confirm immediately.
    }

    return response.data.user
  }, [])

  const logout = useCallback(async () => {
    let requestFailed = false

    try {
      await authApi.logout()
    } catch {
      requestFailed = true
    } finally {
      setUser(null)
    }

    if (requestFailed) {
      toast.error('Server logout failed. Session cleared on this device.')
      return
    }

    toast.success('Logged out successfully.')
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      register,
      logout,
      refreshSession,
    }),
    [user, loading, login, register, logout, refreshSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

