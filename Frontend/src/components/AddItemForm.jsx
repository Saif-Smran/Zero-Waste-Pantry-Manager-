import { useState } from 'react'
import api from '../services/api'

function AddItemForm({ onItemCreated }) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [expiryDate, setExpiryDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await api.post('/api/items/', {
        name: name.trim(),
        quantity: Number(quantity),
        expiry_date: expiryDate,
      })

      setName('')
      setQuantity(1)
      setExpiryDate('')
      await onItemCreated()
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to add item. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Add New Item</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div className="md:col-span-2">
          <label htmlFor="item-name" className="block text-sm text-gray-600 mb-1">
            Item Name
          </label>
          <input
            id="item-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            required
          />
        </div>

        <div>
          <label htmlFor="item-quantity" className="block text-sm text-gray-600 mb-1">
            Quantity
          </label>
          <input
            id="item-quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            required
          />
        </div>

        <div>
          <label htmlFor="item-expiry" className="block text-sm text-gray-600 mb-1">
            Expiry Date
          </label>
          <input
            id="item-expiry"
            type="date"
            value={expiryDate}
            onChange={(event) => setExpiryDate(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            required
          />
        </div>

        <div className="md:col-span-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60"
          >
            {submitting ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </form>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  )
}

export default AddItemForm
