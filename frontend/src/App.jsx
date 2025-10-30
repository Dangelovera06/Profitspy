import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import AdDetail from './pages/AdDetail'
import SyncAds from './pages/SyncAds'
import { AnimatedGridPattern } from './components/ui/AnimatedGridPattern'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <AnimatedGridPattern
          numSquares={60}
          maxOpacity={0.15}
          duration={3}
          repeatDelay={1}
          className="animated-background"
        />
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ad/:id" element={<AdDetail />} />
            <Route path="/sync" element={<SyncAds />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

