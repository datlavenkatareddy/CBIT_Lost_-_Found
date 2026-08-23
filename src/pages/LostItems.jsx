import { useState, useEffect } from 'react'
import ItemCard from '../components/ItemCard'
import SearchBar from '../components/SearchBar'

function LostItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('All')

  // Fetch items using Fetch API
  useEffect(() => {
    fetch('/data/items.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        // Merge with session-submitted items
        const sessionItems = JSON.parse(sessionStorage.getItem('reportedItems') || '[]')
        const allItems = [...data, ...sessionItems]
        // Filter only lost items
        setItems(allItems.filter((item) => item.type === 'lost'))
        setLoading(false)
      })
      .catch((err) => {
        console.error('Fetch error:', err)
        setError('Unable to load item data.')
        setLoading(false)
      })
  }, [])

  // Filter items based on search term and category
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = category === 'All' || item.category === category
    return matchesSearch && matchesCategory
  })

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

  return (
    <div className="container mt-4 mb-4">
      <h2>Lost Items</h2>
      <p className="text-muted">Items reported missing by students on campus.</p>

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        category={category}
        onCategoryChange={setCategory}
      />

      {filteredItems.length === 0 ? (
        <p className="text-muted">No items found matching your criteria.</p>
      ) : (
        <div className="row g-3">
          {filteredItems.map((item) => (
            <div key={item.id} className="col-sm-6 col-md-4 col-lg-3">
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LostItems
