import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import InventoryPage from './pages/InventoryPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import useAuth from './hooks/useAuth'

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

function App() {
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-pantry-bg">
        <nav className="w-full bg-gray-900 text-white flex justify-between items-center px-6 py-4">
          <h1 className="font-bold text-xl">Zero-Waste Pantry Manager</h1>
          {isAuthenticated && (
            <button
              type="button"
              className="bg-white text-gray-900 text-sm px-3 py-1 rounded hover:bg-gray-100 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </nav>

        <main className="bg-pantry-bg min-h-screen">
          <Toaster position="top-right" />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <InventoryPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
