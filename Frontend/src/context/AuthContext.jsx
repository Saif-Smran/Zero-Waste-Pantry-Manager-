import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { authApi, clearCsrfToken, ensureCsrfCookie } from '../services/api'
import AuthContext from './authContextObject'

const sleep = (delayMs) =>
  new Promise((resolve) => {
    setTimeout(resolve, delayMs)
  })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const inFlightSessionRequest = useRef(null)
  const latestSessionRequestId = useRef(0)
  const lastSessionRequestFailed = useRef(false)

  const refreshSession = useCallback(async ({ force = false } = {}) => {
    if (!force && inFlightSessionRequest.current) {
      return inFlightSessionRequest.current
    }

    const requestId = latestSessionRequestId.current + 1
    latestSessionRequestId.current = requestId

    const sessionPromise = authApi
      .session()
      .then((response) => {
        lastSessionRequestFailed.current = false
        const sessionUser = response?.data?.user || null
        if (latestSessionRequestId.current === requestId) {
          setUser(sessionUser)
        }
        return sessionUser
      })
      .catch((error) => {
        lastSessionRequestFailed.current = true
        const statusCode = error?.response?.status
        const shouldClearUser = statusCode === 401 || statusCode === 403

        if (latestSessionRequestId.current === requestId && shouldClearUser) {
          setUser(null)
        }
        return null
      })
      .finally(() => {
        if (inFlightSessionRequest.current === sessionPromise) {
          inFlightSessionRequest.current = null
        }
      })

    inFlightSessionRequest.current = sessionPromise

    return inFlightSessionRequest.current
  }, [])

  const waitForSessionUser = useCallback(async () => {
    const retryDelays = [0, 150, 350, 600]

    for (const delay of retryDelays) {
      if (delay > 0) {
        await new Promise((resolve) => {
          setTimeout(resolve, delay)
        })
      }

      const sessionUser = await refreshSession({ force: true })
      if (sessionUser) {
        return sessionUser
      }
    }

    return null
  }, [refreshSession])

  useEffect(() => {
    let mounted = true

    const init = async () => {
      setLoading(true)

      try {
        await ensureCsrfCookie()
      } catch {
        // Session probe below can still recover token on subsequent requests.
      }

      const retryDelays = [0, 200, 500]
      for (const delay of retryDelays) {
        if (delay > 0) {
          await sleep(delay)
        }

        await refreshSession({ force: true })
        if (!lastSessionRequestFailed.current) {
          break
        }
      }

      if (mounted) {
        setLoading(false)
      }
    }

    init()

    return () => {
      mounted = false
    }
  }, [refreshSession])

  useEffect(() => {
    const handleAuthExpired = () => {
      clearCsrfToken()
      setUser(null)
    }

    window.addEventListener('auth:expired', handleAuthExpired)

    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired)
    }
  }, [])

  const login = useCallback(async (username, password) => {
    const response = await authApi.login({ username, password })
    const responseUser = response?.data?.user || null
    const fallbackUsername = responseUser?.username || username

    if (responseUser) {
      setUser(responseUser)
    }

    const sessionUser = await waitForSessionUser()
    if (sessionUser) {
      toast.success(`Welcome back, ${fallbackUsername}!`)
      return sessionUser
    }

    if (responseUser) {
      // Re-apply response user after session probes may have reset state.
      setUser(responseUser)
      toast.success(`Welcome back, ${fallbackUsername}!`)
      return responseUser
    }

    throw new Error('Login failed. Please try again.')
  }, [waitForSessionUser])

  const register = useCallback(async (username, password) => {
    const response = await authApi.register({ username, password })
    const responseUser = response?.data?.user || null

    if (responseUser) {
      setUser(responseUser)
    }

    const sessionUser = await waitForSessionUser()
    if (sessionUser) {
      return sessionUser
    }

    if (responseUser) {
      // Re-apply response user after session probes may have reset state.
      setUser(responseUser)
      return responseUser
    }

    throw new Error('Registration failed. Please try again.')
  }, [waitForSessionUser])

  const logout = useCallback(async () => {
    let requestFailed = false

    try {
      await authApi.logout()
    } catch {
      requestFailed = true
    } finally {
      clearCsrfToken()
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

