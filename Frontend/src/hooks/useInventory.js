import { useCallback, useEffect, useState } from 'react'
import api, { authApi, isAuthExpiredError } from '../services/api'

function useInventory(sortParam) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError('')

    const requestItems = () =>
      api.get('/api/items/', {
        params: { sort: sortParam },
      })

    try {
      let response

      try {
        response = await requestItems()
      } catch (err) {
        const statusCode = err?.response?.status
        const authError = isAuthExpiredError(err) || statusCode === 401 || statusCode === 403

        if (!authError) {
          throw err
        }

        try {
          await new Promise((resolve) => {
            setTimeout(resolve, 200)
          })

          const sessionResponse = await authApi.session()
          if (sessionResponse?.data?.user) {
            response = await requestItems()
          } else {
            throw new Error('Session missing after auth retry')
          }
        } catch {
          const expiredError = new Error('Auth session expired')
          expiredError.isAuthExpired = true
          throw expiredError
        }
      }

      setItems(response.data)
    } catch (err) {
      if (isAuthExpiredError(err) || err?.isAuthExpired) {
        setItems([])
        setError('Your session has expired. Please log in again.')
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