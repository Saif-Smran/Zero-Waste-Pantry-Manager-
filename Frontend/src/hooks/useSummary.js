import { useEffect, useState } from 'react'
import api, { authApi, isAuthExpiredError } from '../services/api'

const DEFAULT_SUMMARY = {
  total_items: 0,
  near_expiry_count: 0,
  expired_count: 0,
}

function useSummary(refreshKey = 0) {
  const [summary, setSummary] = useState(DEFAULT_SUMMARY)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true)

      try {
        let response

        try {
          response = await api.get('/api/items/summary/')
        } catch (err) {
          const statusCode = err?.response?.status
          const authError = isAuthExpiredError(err) || statusCode === 401 || statusCode === 403

          if (!authError) {
            throw err
          }

          await new Promise((resolve) => {
            setTimeout(resolve, 200)
          })

          const sessionResponse = await authApi.session()
          if (!sessionResponse?.data?.user) {
            throw err
          }

          response = await api.get('/api/items/summary/')
        }

        setSummary(response.data)
      } catch {
        setSummary(DEFAULT_SUMMARY)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [refreshKey])

  return {
    summary,
    loading,
  }
}

export default useSummary