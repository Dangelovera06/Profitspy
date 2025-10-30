import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BarChart3, RefreshCw, Home } from 'lucide-react'
import './Header.css'

function Header() {
  const location = useLocation()

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <BarChart3 size={32} />
            <span>ProfitSpy</span>
          </Link>
          
          <nav className="nav">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/sync" 
              className={`nav-link ${location.pathname === '/sync' ? 'active' : ''}`}
            >
              <RefreshCw size={20} />
              <span>Sync Ads</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

