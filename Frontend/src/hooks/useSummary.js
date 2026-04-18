import { useEffect, useState } from 'react'
import useAuth from './useAuth'
import api, { isAuthExpiredError } from '../services/api'

const DEFAULT_SUMMARY = {
  total_items: 0,
  near_expiry_count: 0,
  expired_count: 0,
}

function useSummary(refreshKey = 0) {
  const { isAuthenticated } = useAuth()
  const [summary, setSummary] = useState(DEFAULT_SUMMARY)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      if (!isAuthenticated) {
        setSummary(DEFAULT_SUMMARY)
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        const response = await api.get('/api/items/summary/')
        setSummary(response.data)
      } catch (err) {
        const statusCode = err?.response?.status
        const authError = isAuthExpiredError(err) || err?.isAuthExpired || statusCode === 401 || statusCode === 403

        if (authError) {
          setSummary(DEFAULT_SUMMARY)
          return
        }

        setSummary(DEFAULT_SUMMARY)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [isAuthenticated, refreshKey])

  return {
    summary,
    loading,
  }
}

export default useSummary