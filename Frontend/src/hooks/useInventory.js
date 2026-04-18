import { useCallback, useEffect, useState } from 'react'
import useAuth from './useAuth'
import api, { isAuthExpiredError } from '../services/api'

function useInventory(sortParam) {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchItems = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([])
      setError('')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    const requestItems = () =>
      api.get('/api/items/', {
        params: { sort: sortParam },
      })

    try {
      const response = await requestItems()
      setItems(response.data)
    } catch (err) {
      const statusCode = err?.response?.status
      const authError = isAuthExpiredError(err) || err?.isAuthExpired || statusCode === 401 || statusCode === 403

      if (authError) {
        setItems([])
        setError('')
        return
      }

      const message =
        err?.response?.data?.error || 'Failed to load inventory items. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, sortParam])

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