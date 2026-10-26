import { useState, useEffect } from 'react'
import StatCard from '../components/StatCard'
import { API_BASE_URL, getImageUrl } from '../services/api'

function Dashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch live data from backend API
  useEffect(() => {
    fetch(`${API_BASE_URL}/items?limit=100`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((res) => {
        const itemData = Array.isArray(res) ? res : (res.data || [])
        setItems(itemData)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Fetch error:', err)
        setError('Unable to load item data.')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="container mt-4">
        <p>Loading items...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    )
  }

  // Use items fetched directly from MongoDB
  const allItems = items

  // Compute statistics from data
  const lostCount = allItems.filter((item) => item.type === 'lost').length
  const foundCount = allItems.filter((item) => item.type === 'found').length
  const resolvedCount = allItems.filter((item) => item.status === 'resolved').length
  const totalCount = allItems.length

  // Category counts for bar chart
  const categories = ['Electronics', 'Documents', 'Books', 'Accessories', 'Others']
  const categoryCounts = categories.map((cat) => ({
    name: cat,
    count: allItems.filter((item) => item.category === cat).length
  }))
  const maxCategoryCount = Math.max(...categoryCounts.map((c) => c.count), 1)

  // Monthly counts for bar chart
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthMap = {}
  allItems.forEach((item) => {
    const d = new Date(item.date)
    const sortKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`
    if (!monthMap[sortKey]) {
      monthMap[sortKey] = { label, count: 0 }
    }
    monthMap[sortKey].count++
  })
  const monthData = Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, val]) => val)
  const maxMonthCount = Math.max(...monthData.map((m) => m.count), 1)

  // Recent reports (5 most recent by date)
  const recentItems = [...allItems]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <div className="container mt-4 mb-4">
      {/* College Heading */}
      <div className="text-center mb-4">
        <h1>College Lost &amp; Found Portal</h1>
        <p className="text-muted">
          A simple platform for students to report and find lost belongings on campus.
        </p>
        <p className="text-muted small">
          CBIT &mdash; Chaitanya Bharathi Institute of Technology
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <StatCard label="Lost Reports" value={lostCount} color="danger" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard label="Found Reports" value={foundCount} color="success" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard label="Resolved Cases" value={resolvedCount} color="info" />
        </div>
        <div className="col-6 col-md-3">
          <StatCard label="Total Reports" value={totalCount} color="primary" />
        </div>
      </div>

      {/* Simple Analytics */}
      <div className="row mb-4">
        {/* Reports by Category */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Reports by Category</h5>
              <div className="mt-3">
                {categoryCounts.map((cat) => (
                  <div key={cat.name} className="d-flex align-items-center mb-2">
                    <span className="analytics-label">{cat.name}</span>
                    <div className="analytics-bar-container flex-grow-1 mx-2">
                      <div
                        className="analytics-bar"
                        style={{ width: `${(cat.count / maxCategoryCount) * 100}%` }}
                      ></div>
                    </div>
                    <span className="analytics-count">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reports by Month */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Reports by Month</h5>
              <div className="mt-3">
                {monthData.map((month) => (
                  <div key={month.label} className="d-flex align-items-center mb-2">
                    <span className="analytics-label">{month.label}</span>
                    <div className="analytics-bar-container flex-grow-1 mx-2">
                      <div
                        className="analytics-bar bg-info"
                        style={{ width: `${(month.count / maxMonthCount) * 100}%` }}
                      ></div>
                    </div>
                    <span className="analytics-count">{month.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports Table */}
      <h5 className="mb-3">Recent Reports</h5>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>Image</th>
              <th>Item</th>
              <th>Type</th>
              <th>Category</th>
              <th>Location</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.itemName}
                    className="recent-table-img"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = '/images/placeholder.svg'
                    }}
                  />
                </td>
                <td>{item.itemName}</td>
                <td>
                  <span className={`badge ${item.type === 'lost' ? 'bg-danger' : 'bg-success'}`}>
                    {item.type === 'lost' ? 'Lost' : 'Found'}
                  </span>
                </td>
                <td>{item.category}</td>
                <td>{item.location}</td>
                <td>
                  {new Date(item.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard
