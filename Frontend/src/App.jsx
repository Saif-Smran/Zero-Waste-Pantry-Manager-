import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RiQuestionLine } from 'react-icons/ri'
import InventoryPage from './pages/InventoryPage'

function App() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <nav className="w-full bg-gray-900 text-white flex justify-between items-center px-6 py-4">
        <h1 className="font-bold text-xl">Zero-Waste Pantry Manager</h1>
        <button
          type="button"
          className="bg-transparent border border-white text-white text-sm px-3 py-1 rounded hover:bg-white hover:text-gray-900 transition"
          onClick={() => {}}
        >
          <span className="inline-flex items-center gap-1">
            <RiQuestionLine />
            Help
          </span>
        </button>
      </nav>

      <main className="bg-[#f5f5f5] min-h-screen">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<InventoryPage />} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  )
}

export default App
