import { Link } from 'react-router-dom'
import InventoryStatusChart from '../components/InventoryStatusChart'
import ProfileSection from '../components/ProfileSection'
import SummaryBar from '../components/SummaryBar'
import usePageTitle from '../hooks/usePageTitle'
import useSummary from '../hooks/useSummary'

function DashboardPage() {
  const { summary, loading } = useSummary()
  usePageTitle('Dashboard | Zero-Waste Pantry Manager')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Private Dashboard</p>
        <h2 className="text-3xl font-bold text-gray-900">Your Pantry Command Center</h2>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <p className="text-sm text-gray-500">Loading dashboard data...</p>
        </div>
      ) : (
        <SummaryBar summary={summary} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">{!loading && <InventoryStatusChart summary={summary} />}</div>
        <ProfileSection />
      </div>

      <section className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Quick Actions</p>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Manage your pantry faster</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/inventory"
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Open Inventory
          </Link>
          <Link
            to="/inventory"
            className="border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Add or Update Items
          </Link>
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
