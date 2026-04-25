import { useState } from 'react'
import {
  NavLink,
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'
import { RiLoader4Line, RiQuestionLine } from 'react-icons/ri'
import HelpModal from '../components/HelpModal'
import useAuth from '../hooks/useAuth'
import AboutPage from '../pages/AboutPage'
import DashboardPage from '../pages/DashboardPage'
import HomePage from '../pages/HomePage'
import InventoryPage from '../pages/InventoryPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="animate-spin border-4 border-gray-200 border-t-gray-800 rounded-full w-10 h-10 mx-auto mt-20" />
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function GuestOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="animate-spin border-4 border-gray-200 border-t-gray-800 rounded-full w-10 h-10 mx-auto mt-20" />
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function RouteFallback() {
  const { isAuthenticated } = useAuth()

  return <Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />
}

function AppLayout() {
  const { isAuthenticated, user, logout } = useAuth()
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const activeClass = 'text-white bg-gray-700'
  const idleClass = 'text-gray-200 hover:text-white hover:bg-gray-800'

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
    <div className="min-h-screen bg-pantry-bg">
      <nav className="w-full bg-gray-900 text-white px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col gap-3 sm:gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-bold text-xl">Zero-Waste Pantry Manager</h1>
            {isAuthenticated && (
              <p className="text-xs text-gray-300 mt-1">Signed in as {user?.username || 'pantry user'}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) => `px-3 py-1.5 rounded text-sm transition ${isActive ? activeClass : idleClass}`}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => `px-3 py-1.5 rounded text-sm transition ${isActive ? activeClass : idleClass}`}
            >
              About
            </NavLink>

            {!isAuthenticated && (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) => `px-3 py-1.5 rounded text-sm transition ${isActive ? activeClass : idleClass}`}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) => `px-3 py-1.5 rounded text-sm transition ${isActive ? activeClass : idleClass}`}
                >
                  Register
                </NavLink>
              </>
            )}

            {isAuthenticated && (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => `px-3 py-1.5 rounded text-sm transition ${isActive ? activeClass : idleClass}`}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/inventory"
                  className={({ isActive }) => `px-3 py-1.5 rounded text-sm transition ${isActive ? activeClass : idleClass}`}
                >
                  Inventory
                </NavLink>
                <button
                  type="button"
                  className="flex items-center gap-1 bg-white text-gray-900 text-sm px-3 py-1.5 rounded hover:bg-gray-100 transition"
                  onClick={() => setIsHelpOpen(true)}
                >
                  <RiQuestionLine size={16} />
                  Help
                </button>
                <button
                  type="button"
                  className="bg-white text-gray-900 text-sm px-3 py-1.5 rounded hover:bg-gray-100 transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  aria-busy={isLoggingOut}
                >
                  <span className="inline-flex items-center gap-1">
                    {isLoggingOut && <RiLoader4Line className="animate-spin" size={14} />}
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="bg-pantry-bg min-h-[calc(100vh-84px)]">
        <Outlet />
      </main>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'inventory',
        element: (
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'login',
        element: (
          <GuestOnlyRoute>
            <LoginPage />
          </GuestOnlyRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <GuestOnlyRoute>
            <RegisterPage />
          </GuestOnlyRoute>
        ),
      },
      { path: '*', element: <RouteFallback /> },
    ],
  },
])

function AppRouter() {
  return <RouterProvider router={router} />
}

export default AppRouter
