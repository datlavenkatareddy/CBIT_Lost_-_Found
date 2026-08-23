function StatCard({ label, value, color }) {
  return (
    <div className="card stat-card text-center h-100">
      <div className="card-body">
        <h3 className={`mb-1 text-${color || 'primary'}`}>{value}</h3>
        <p className="card-text text-muted mb-0">{label}</p>
      </div>
    </div>
  )
}

export default StatCard
