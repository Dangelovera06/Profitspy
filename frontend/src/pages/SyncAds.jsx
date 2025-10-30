import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API_BASE_URL from '../config'
import axios from 'axios'
import { RefreshCw, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react'
import './SyncAds.css'

function SyncAds() {
  const [searchTerms, setSearchTerms] = useState('')
  const [country, setCountry] = useState('US')
  const [maxAds, setMaxAds] = useState(50)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Check for ongoing sync on mount
  useEffect(() => {
    const syncStatus = localStorage.getItem('syncStatus')
    if (syncStatus === 'syncing') {
      setLoading(true)
      setResult('Sync in progress... You can navigate away and come back.')
    }
  }, [])

  const handleSync = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)

    // Store sync status for background sync
    localStorage.setItem('syncStatus', 'syncing')
    localStorage.setItem('syncParams', JSON.stringify({ searchTerms, country, maxAds }))

    // Show immediate feedback
    setResult('🔄 Syncing in background... You can go to Dashboard now!')

    // Start sync in background (non-blocking)
    axios.post(`${API_BASE_URL}/api/sync`, {
      searchTerms,
      country,
      maxAds
    }, {
      timeout: 300000 // 5 minutes timeout
    })
    .then(response => {
      localStorage.setItem('syncStatus', 'complete')
      localStorage.setItem('syncResult', response.data.message || `Successfully synced ${response.data.count} ads!`)
      setResult(response.data.message || `✅ Successfully synced ${response.data.count} ads!`)
      setLoading(false)
    })
    .catch(err => {
      localStorage.setItem('syncStatus', 'error')
      const errorMsg = err.response?.data?.error || 'Sync failed. Please try again.'
      localStorage.setItem('syncError', errorMsg)
      setError(errorMsg)
      setLoading(false)
    })
  }

  const goToDashboard = () => {
    navigate('/dashboard')
  }

  return (
    <div className="sync-ads container">
      <div className="sync-header">
        <h1>Sync Winning Ads</h1>
        <p>Fetch high-performing ads using Apify's powerful scraper - no Meta API required!</p>
      </div>

      <div className="sync-content">
        <div className="card sync-form-card">
          <form onSubmit={handleSync} className="sync-form">
            <div className="form-group">
              <label htmlFor="searchTerms">
                Search Terms (Optional)
                <span className="label-hint">Leave empty to fetch all ads</span>
              </label>
              <input
                id="searchTerms"
                type="text"
                placeholder="e.g., fitness, marketing, ecommerce..."
                value={searchTerms}
                onChange={(e) => setSearchTerms(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">
                Target Country
                <span className="label-hint">2-letter country code</span>
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="US">United States (US)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="CA">Canada (CA)</option>
                <option value="AU">Australia (AU)</option>
                <option value="DE">Germany (DE)</option>
                <option value="FR">France (FR)</option>
                <option value="IT">Italy (IT)</option>
                <option value="ES">Spain (ES)</option>
                <option value="BR">Brazil (BR)</option>
                <option value="IN">India (IN)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="maxAds">
                Maximum Ads
                <span className="label-hint">Number of ads to fetch (10-100)</span>
              </label>
              <input
                id="maxAds"
                type="number"
                min="10"
                max="100"
                step="10"
                value={maxAds}
                onChange={(e) => setMaxAds(parseInt(e.target.value))}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-sync"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  Syncing in Background...
                </>
              ) : (
                <>
                  <RefreshCw size={20} />
                  Sync Ads
                </>
              )}
            </button>
          </form>

          {result && (
            <div className="alert alert-success">
              <CheckCircle size={20} />
              <div className="alert-content">
                <span>{result}</span>
                {loading && (
                  <button onClick={goToDashboard} className="btn btn-secondary btn-small">
                    Go to Dashboard <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="card sync-info-card">
          <h2>How to Use</h2>
          <ol className="info-list">
            <li>
              <strong>Enter search terms:</strong> Type keywords like "fitness", "ecommerce", or "saas" 
              to find specific types of ads, or leave blank to get popular ads
            </li>
            <li>
              <strong>Select country:</strong> Choose which country's ads you want to analyze
            </li>
            <li>
              <strong>Set max ads:</strong> Pick how many ads to fetch (10-100). More ads = more data but longer sync time
            </li>
            <li>
              <strong>Click Sync Ads:</strong> Start the sync process - it runs in the background so you 
              can navigate to the Dashboard immediately
            </li>
            <li>
              <strong>View results:</strong> Go to Dashboard to see all synced ads with performance scores, 
              images, videos, and recreation scripts
            </li>
          </ol>

          <div className="info-note">
            <AlertCircle size={16} />
            <p>
              <strong>Pro Tip:</strong> Sync runs in the background! Click "Go to Dashboard" after starting 
              and your ads will appear automatically when ready (~30-120 seconds).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SyncAds

