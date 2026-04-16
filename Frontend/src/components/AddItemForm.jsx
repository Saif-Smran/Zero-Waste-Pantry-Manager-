import { useState } from 'react'
import { toast } from 'react-hot-toast'
import api from '../services/api'

const INITIAL_FORM = {
  name: '',
  quantity: '1',
  expiry_date: '',
}

const INITIAL_ERRORS = {
  name: '',
  quantity: '',
  expiry_date: '',
}

function AddItemForm({ onSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [fieldErrors, setFieldErrors] = useState(INITIAL_ERRORS)
  const [submitting, setSubmitting] = useState(false)

  const setFieldValue = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))

    setFieldErrors((prev) => ({
      ...prev,
      [field]: '',
    }))
  }

  const validateForm = () => {
    const nextErrors = { ...INITIAL_ERRORS }
    const trimmedName = form.name.trim()

    if (!trimmedName) {
      nextErrors.name = 'Item name is required'
    }

    const quantityNumber = Number(form.quantity)
    const isIntegerQuantity = Number.isInteger(quantityNumber)
    if (!form.quantity || !isIntegerQuantity || quantityNumber <= 0) {
      nextErrors.quantity = 'Must be a positive number'
    }

    const today = new Date()
    const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const selectedDate = form.expiry_date ? new Date(`${form.expiry_date}T00:00:00`) : null
    if (!form.expiry_date || !selectedDate || selectedDate < currentDate) {
      nextErrors.expiry_date = 'Expiry date cannot be in the past'
    }

    setFieldErrors(nextErrors)
    return { nextErrors, trimmedName, quantityNumber }
  }

  const mapServerErrors = (errorPayload) => {
    const nextErrors = { ...INITIAL_ERRORS }

    if (!errorPayload || typeof errorPayload !== 'object') {
      return nextErrors
    }

    if (errorPayload.field && typeof errorPayload.error === 'string' && nextErrors[errorPayload.field] !== undefined) {
      nextErrors[errorPayload.field] = errorPayload.error
      return nextErrors
    }

    Object.keys(nextErrors).forEach((field) => {
      const value = errorPayload[field]
      if (Array.isArray(value) && value.length > 0) {
        nextErrors[field] = String(value[0])
      } else if (typeof value === 'string') {
        nextErrors[field] = value
      }
    })

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const { nextErrors, trimmedName, quantityNumber } = validateForm()
    const hasClientErrors = Object.values(nextErrors).some(Boolean)
    if (hasClientErrors) {
      toast.error('Please fix the highlighted fields.')
      return
    }

    setSubmitting(true)

    try {
      const response = await api.post('/api/items/', {
        name: trimmedName,
        quantity: quantityNumber,
        expiry_date: form.expiry_date,
      })

      if (response.status === 201) {
        setForm(INITIAL_FORM)
        setFieldErrors(INITIAL_ERRORS)
        if (typeof onSuccess === 'function') {
          await onSuccess()
        }
        toast.success('Item added successfully.')
      }
    } catch (err) {
      if (err?.response?.status === 400) {
        const mappedErrors = mapServerErrors(err?.response?.data)
        setFieldErrors(mappedErrors)
        const hasFieldErrors = Object.values(mappedErrors).some(Boolean)
        if (!hasFieldErrors) {
          toast.error(err?.response?.data?.error || 'Please review your input and try again.')
        }
      } else {
        toast.error(err?.response?.data?.error || 'Failed to add item. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleClear = () => {
    setForm(INITIAL_FORM)
    setFieldErrors(INITIAL_ERRORS)
  }

  const inputClassName = (field) => (
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
      fieldErrors[field]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:ring-gray-800'
    }`
  )

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Item</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="item-name" className="block text-sm font-medium text-gray-700 mb-1">
            Item Name
            </label>
            <input
              id="item-name"
              type="text"
              value={form.name}
              onChange={(event) => setFieldValue('name', event.target.value)}
              className={inputClassName('name')}
            />
            {fieldErrors.name && <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="item-quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              id="item-quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={(event) => setFieldValue('quantity', event.target.value)}
              className={inputClassName('quantity')}
            />
            {fieldErrors.quantity && <p className="text-xs text-red-600 mt-1">{fieldErrors.quantity}</p>}
          </div>

          <div>
            <label htmlFor="item-expiry" className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              id="item-expiry"
              type="date"
              value={form.expiry_date}
              onChange={(event) => setFieldValue('expiry_date', event.target.value)}
              className={inputClassName('expiry_date')}
            />
            {fieldErrors.expiry_date && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.expiry_date}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={handleClear}
            disabled={submitting}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 disabled:opacity-50"
          >
            {submitting ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddItemForm
