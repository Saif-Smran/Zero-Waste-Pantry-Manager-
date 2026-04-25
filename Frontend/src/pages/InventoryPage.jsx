import { useState } from 'react'
import { toast } from 'react-hot-toast'
import AddItemForm from '../components/AddItemForm'
import ItemCard from '../components/ItemCard'
import SortControls from '../components/SortControls'
import SummaryBar from '../components/SummaryBar'
import usePageTitle from '../hooks/usePageTitle'
import useInventory from '../hooks/useInventory'
import useSummary from '../hooks/useSummary'
import api from '../services/api'

function InventoryPage() {
  const [sortParam, setSortParam] = useState('expiry')
  const [searchTerm, setSearchTerm] = useState('')
  const [summaryRefreshKey, setSummaryRefreshKey] = useState(0)
  usePageTitle('Inventory | Zero-Waste Pantry Manager')

  const { items, loading, error, refetch } = useInventory(sortParam)
  const { summary, loading: summaryLoading } = useSummary(summaryRefreshKey)

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredItems = normalizedSearch
    ? items.filter((item) => item.name.toLowerCase().includes(normalizedSearch))
    : items

  const refreshAll = async () => {
    await refetch()
    setSummaryRefreshKey((prev) => prev + 1)
  }

  const handleDecrement = async (itemId) => {
    const currentItem = items.find((item) => item.id === itemId)

    if (!currentItem || currentItem.quantity === 0) {
      return
    }

    try {
      await api.patch(`/api/items/${itemId}/`, {
        quantity: currentItem.quantity - 1,
      })

      await refreshAll()
      toast.success('Quantity updated')
    } catch {
      toast.error('Failed to update quantity')
    }
  }

  const handleDelete = async (itemId) => {
    try {
      await api.delete(`/api/items/${itemId}/`)
      await refreshAll()
      toast.success('Item deleted')
    } catch {
      toast.error('Failed to delete item')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {summaryLoading ? (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <p className="text-sm text-gray-500">Loading summary...</p>
        </div>
      ) : (
        <SummaryBar summary={summary} />
      )}

      <AddItemForm onSuccess={refreshAll} />

      <SortControls currentSort={sortParam} onSortChange={setSortParam} />

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-100">
        <label htmlFor="search-items" className="block text-sm font-medium text-gray-700 mb-2">
          Search Items
        </label>
        <input
          id="search-items"
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by item name..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      {loading ? (
        <div className="animate-spin border-4 border-gray-200 border-t-gray-800 rounded-full w-10 h-10 mx-auto mt-20" />
      ) : error ? (
        <p className="text-center text-red-600 mt-10">{error}</p>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-400 mt-20 text-lg">No items in your pantry yet.</p>
      ) : filteredItems.length === 0 ? (
        <p className="text-center text-gray-400 mt-20 text-lg">No items match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onDecrement={handleDecrement}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default InventoryPage
