# CBIT Lost & Found Portal

A web application designed for **Chaitanya Bharathi Institute of Technology (CBIT)** students and staff to report, track, and recover lost and found belongings across the campus.

---

## 🚀 Features

- **Dashboard & Analytics**:
  - Dynamic metrics calculated from local mock dataset: Lost Reports, Found Reports, Resolved Cases, and Total Reports.
  - Category breakdown and monthly report distribution.
  - Recent reports table with thumbnail previews, location, date, and status badges.
- **Lost & Found Item Listings**:
  - Dedicated pages for lost items and found items.
  - Client-side search filtering by item name, description, and location.
  - Category filtering (Electronics, Documents, Books, Accessories, Others).
- **Item Reporting with Form Validation**:
  - Toggle between Lost Item and Found Item reporting modes.
  - Conditional field handling (e.g., Roll Number required for lost reports).
  - Client-side validation using Regular Expressions (10-digit Indian phone numbers `^[6-9]\d{9}$`, email syntax).
  - Client-side image upload and instant preview using HTML5 `FileReader` API (Base64 DataURL).
- **Session Persistence**:
  - Seamlessly retains user-reported items during the browser session using `sessionStorage` alongside mock data.

---

## 🛠️ Technology Stack

- **Frontend Library**: [React 19](https://react.dev/) (Functional Components, Hooks: `useState`, `useEffect`)
- **Routing**: [React Router DOM v7](https://reactrouter.com/) (Single Page Application architecture)
- **Styling**: [Bootstrap 5.3](https://getbootstrap.com/) + Custom CSS (`App.css`)
- **Build Tool**: [Vite 8](https://vitejs.dev/) with `@vitejs/plugin-react`
- **Language**: JavaScript (ES6+ / JSX)
- **Data Source**: Local mock JSON (`public/data/items.json`)

---

## 📁 Project Structure

```text
CaseStudy1/
│
├── public/
│   ├── data/
│   │   └── items.json          # Mock dataset of campus lost/found reports
│   └── images/                 # Product and item images / assets
│
├── src/
│   ├── components/
│   │   ├── Footer.jsx          # Branded footer component
│   │   ├── ItemCard.jsx        # Reusable item card component
│   │   ├── Navbar.jsx          # Top navigation bar with CBIT logo
│   │   ├── SearchBar.jsx       # Keyword search & category filter component
│   │   └── StatCard.jsx        # Metric summary card
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx       # Main dashboard with statistics & recent reports
│   │   ├── FoundItems.jsx      # Found items listing & search
│   │   ├── LostItems.jsx       # Lost items listing & search
│   │   └── ReportItem.jsx      # Report submission form with validation
│   │
│   ├── App.css                 # Custom CSS & clean styling
│   ├── App.jsx                 # Route definitions & layout wrapper
│   └── main.jsx                # React root mount & BrowserRouter
│
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
├── package.json                # Project scripts & dependencies
├── package-lock.json           # Locked dependency versions
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone <REPO_URL>
   cd CaseStudy1
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```
