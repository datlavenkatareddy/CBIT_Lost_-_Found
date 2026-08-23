import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <NavLink className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <img
            src="/images/cbit-logo.png"
            alt="CBIT Logo"
            className="me-2"
            style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
          />
          <span>CBIT Lost &amp; Found</span>
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/lost-items">
                Lost Items
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/found-items">
                Found Items
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/report">
                Report Item
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
