function SearchBar({ searchTerm, onSearchChange, category, onCategoryChange }) {
  return (
    <div className="row mb-4">
      <div className="col-md-8 mb-2 mb-md-0">
        <input
          type="text"
          className="form-control"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          id="searchInput"
        />
      </div>
      <div className="col-md-4">
        <select
          className="form-select"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          id="categoryFilter"
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Documents">Documents</option>
          <option value="Books">Books</option>
          <option value="Accessories">Accessories</option>
          <option value="Others">Others</option>
        </select>
      </div>
    </div>
  )
}

export default SearchBar
