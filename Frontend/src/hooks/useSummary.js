import { useEffect, useState } from 'react'
import api from '../services/api'

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
        const response = await api.get('/api/items/summary/')
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