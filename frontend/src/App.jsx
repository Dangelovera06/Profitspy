import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import AdDetail from './pages/AdDetail'
import SyncAds from './pages/SyncAds'
import InfiniteHero from './components/ui/InfiniteHero'
import { AnimatedGridPattern } from './components/ui/AnimatedGridPattern'
import './App.css'

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  if (isHomePage) {
    return <InfiniteHero />;
  }

  return (
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ad/:id" element={<AdDetail />} />
          <Route path="/sync" element={<SyncAds />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InfiniteHero />} />
        <Route path="/*" element={
          <>
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
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/ad/:id" element={<AdDetail />} />
                  <Route path="/sync" element={<SyncAds />} />
                </Routes>
              </main>
            </div>
          </>
        } />
      </Routes>
    </Router>
  )
}

export default App

