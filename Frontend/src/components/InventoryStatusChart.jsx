function clampPercent(value) {
  if (!Number.isFinite(value)) {
    return 0
  }

  if (value < 0) {
    return 0
  }

  if (value > 100) {
    return 100
  }

  return value
}

function InventoryStatusChart({ summary }) {
  const total = Number(summary?.total_items || 0)
  const expired = Number(summary?.expired_count || 0)
  const nearExpiry = Number(summary?.near_expiry_count || 0)
  const fresh = Math.max(total - expired - nearExpiry, 0)

  const rows = [
    { key: 'fresh', label: 'Fresh', value: fresh, color: 'bg-emerald-600' },
    { key: 'near', label: 'Expiring Soon', value: nearExpiry, color: 'bg-amber-500' },
    { key: 'expired', label: 'Expired', value: expired, color: 'bg-rose-600' },
  ]

  const safeTotal = total > 0 ? total : 1

  return (
    <section className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Status Breakdown</p>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pantry Health Chart</h3>

      <div className="space-y-4">
        {rows.map((row) => {
          const percentage = clampPercent((row.value / safeTotal) * 100)

          return (
            <div key={row.key}>
              <div className="flex items-center justify-between mb-1 text-sm">
                <span className="text-gray-700 font-medium">{row.label}</span>
                <span className="text-gray-600">{row.value}</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`${row.color} h-full rounded-full`} style={{ width: `${percentage}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default InventoryStatusChart
