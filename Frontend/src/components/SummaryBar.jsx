function SummaryBar({ summary }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex gap-8 mb-4 flex-wrap">
      <div>
        <p className="text-sm text-gray-500">Total Items</p>
        <p className="text-2xl font-bold text-gray-800">{summary.total_items}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Expiring Soon</p>
        <p className="text-2xl font-bold text-[#e65100]">{summary.near_expiry_count}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Expired</p>
        <p className="text-2xl font-bold text-[#c62828]">{summary.expired_count}</p>
      </div>
    </div>
  )
}

export default SummaryBar