function ItemCard({ item }) {
  // Format date for display
  const formattedDate = new Date(item.date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  return (
    <div className="card h-100">
      <img
        src={item.image || '/images/placeholder.svg'}
        className="card-img-top item-card-img"
        alt={item.itemName}
        onError={(e) => {
          e.currentTarget.onerror = null
          e.currentTarget.src = '/images/placeholder.svg'
        }}
      />
      <div className="card-body">
        <h5 className="card-title">{item.itemName}</h5>
        <p className="card-text mb-1">
          <strong>Category:</strong> {item.category}
        </p>
        <p className="card-text mb-1">
          <strong>Location:</strong> {item.location}
        </p>
        <p className="card-text mb-1">
          <strong>Date:</strong> {formattedDate}
        </p>
        {item.rollNo && (
          <p className="card-text mb-1">
            <strong>Roll No:</strong> {item.rollNo}
          </p>
        )}
        <p className="card-text mb-0">
          <strong>Reported by:</strong> {item.reportedBy}
        </p>
      </div>
      <div className="card-footer">
        <small className={`badge ${item.status === 'resolved' ? 'bg-success' : 'bg-warning text-dark'}`}>
          {item.status === 'resolved' ? 'Resolved' : 'Active'}
        </small>
      </div>
    </div>
  )
}

export default ItemCard
