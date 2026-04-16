import { useEffect } from 'react'
import { RiCloseLine } from 'react-icons/ri'

function HelpModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto relative"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          onClick={onClose}
          aria-label="Close help modal"
        >
          <RiCloseLine size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-5">How to Use</h2>

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-4">Sorting</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Items are sorted by expiry date by default with the nearest expiry shown first. Use the sort
          controls to switch to alphabetical or quantity order.
        </p>

        <hr className="border-gray-100 mt-4" />

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-4">
          Color Guide
        </h3>
        <div className="flex items-center gap-3 mb-2">
          <span className="w-4 h-4 rounded shrink-0 bg-safe" />
          <span className="text-sm text-gray-600">More than 7 days remaining</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="w-4 h-4 rounded shrink-0 bg-warning" />
          <span className="text-sm text-gray-600">Expiring within 7 days</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="w-4 h-4 rounded shrink-0 bg-danger" />
          <span className="text-sm text-gray-600">Expiring within 3 days or already expired</span>
        </div>

        <hr className="border-gray-100 mt-4" />

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-4">
          Adding an Item
        </h3>
        <ol className="list-decimal list-inside space-y-1">
          <li className="text-sm text-gray-600">Enter the item name, quantity, and expiry date</li>
          <li className="text-sm text-gray-600">Expiry date must be today or a future date</li>
          <li className="text-sm text-gray-600">Click Add Item to save to your pantry</li>
        </ol>

        <hr className="border-gray-100 mt-4" />

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-4">
          Deleting an Item
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Click the delete button on any item card. A confirmation prompt will appear before the item is
          permanently removed.
        </p>
      </div>
    </div>
  )
}

export default HelpModal
