import clsx from 'clsx'
import { RiDeleteBin6Line } from 'react-icons/ri'

function getExpiryClass(daysUntilExpiry) {
  if (daysUntilExpiry <= 3) {
    return {
      border: 'border-[#c62828]',
      text: 'text-[#c62828]',
    }
  }

  if (daysUntilExpiry <= 7) {
    return {
      border: 'border-[#e65100]',
      text: 'text-[#e65100]',
    }
  }

  return {
    border: 'border-[#2e7d32]',
    text: 'text-[#2e7d32]',
  }
}

function formatExpiryDate(dateString) {
  if (!dateString) {
    return 'N/A'
  }

  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

function ItemCard({ item, onDecrement, onDelete }) {
  const expiryClasses = getExpiryClass(item.days_until_expiry)
  const isExpired = item.days_until_expiry <= 0
  const isDecrementDisabled = item.quantity === 0

  return (
    <div className={clsx('bg-white rounded-xl shadow-sm p-4 border-l-4', expiryClasses.border)}>
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        {isExpired && (
          <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">EXPIRED</span>
        )}
      </div>

      <p className="text-sm text-gray-500 mt-1">Expiry: {formatExpiryDate(item.expiry_date)}</p>

      <p className={clsx('text-sm font-medium mt-1', expiryClasses.text)}>
        {isExpired
          ? `Expired ${Math.abs(item.days_until_expiry)} day(s) ago`
          : `${item.days_until_expiry} day(s) remaining`}
      </p>

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDecrement(item.id)}
            disabled={isDecrementDisabled}
            className={clsx(
              'flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition',
              isDecrementDisabled && 'opacity-40 cursor-not-allowed',
            )}
          >
            -
          </button>
          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            const confirmed = window.confirm(`Are you sure you want to delete ${item.name}?`)
            if (confirmed) {
              onDelete(item.id)
            }
          }}
          className="flex items-center gap-1 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm transition"
        >
          <RiDeleteBin6Line size={16} />
          Delete
        </button>
      </div>
    </div>
  )
}

export default ItemCard