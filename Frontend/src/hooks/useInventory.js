import { useCallback, useEffect, useState } from 'react'
import api from '../services/api'

function useInventory(sortParam) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/api/items/', {
        params: { sort: sortParam },
      })
      setItems(response.data)
    } catch (err) {
      const statusCode = err?.response?.status
      if (statusCode === 401 || statusCode === 403) {
        setError('Your session has expired. Please log in to view inventory items.')
        return
      }

      const message =
        err?.response?.data?.error || 'Failed to load inventory items. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [sortParam])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
  }
}

export default useInventory