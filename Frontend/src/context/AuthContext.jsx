import { useCallback, useEffect, useMemo, useState } from 'react'
import { authApi } from '../services/api'
import AuthContext from './authContextObject'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    try {
      const response = await authApi.session()
      setUser(response.data.user)
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
    return response.data.user
  }, [])

  const register = useCallback(async (username, password) => {
    const response = await authApi.register({ username, password })
    setUser(response.data.user)
    return response.data.user
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
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

