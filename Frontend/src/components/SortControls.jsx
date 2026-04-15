const SORT_OPTIONS = [
  { key: 'expiry', label: 'By Expiry' },
  { key: 'name', label: 'By Name' },
  { key: 'quantity', label: 'By Quantity' },
]

function SortControls({ currentSort, onSortChange }) {
  return (
    <div className="flex gap-2 mb-4">
      {SORT_OPTIONS.map((option) => {
        const isActive = currentSort === option.key

        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onSortChange(option.key)}
            className={
              isActive
                ? 'bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium'
                : 'bg-white text-gray-700 border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-50'
            }
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default SortControls