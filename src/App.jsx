import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import LostItems from './pages/LostItems'
import FoundItems from './pages/FoundItems'
import ReportItem from './pages/ReportItem'

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/lost-items" element={<LostItems />} />
          <Route path="/found-items" element={<FoundItems />} />
          <Route path="/report" element={<ReportItem />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
