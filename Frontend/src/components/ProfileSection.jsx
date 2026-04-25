import { useMemo, useState } from 'react'
import { RiLoader4Line } from 'react-icons/ri'
import useAuth from '../hooks/useAuth'

function ProfileSection() {
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const greeting = useMemo(() => {
    const hour = new Date().getHours()

    if (hour < 12) {
      return 'Good morning'
    }

    if (hour < 18) {
      return 'Good afternoon'
    }

    return 'Good evening'
  }, [])

  const handleLogout = async () => {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)

    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <section className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Profile</p>
      <h3 className="text-lg font-semibold text-gray-900">{greeting}, {user?.username || 'Pantry User'}!</h3>
      <p className="text-sm text-gray-600 mt-1">
        Stay on top of expiring items and keep your pantry data clean.
      </p>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-60"
          onClick={handleLogout}
          disabled={isLoggingOut}
          aria-busy={isLoggingOut}
        >
          <span className="inline-flex items-center gap-1">
            {isLoggingOut && <RiLoader4Line className="animate-spin" size={14} />}
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </span>
        </button>
      </div>
    </section>
  )
}

export default ProfileSection
