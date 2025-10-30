import React, { useState } from 'react'
import API_BASE_URL from '../config'
import axios from 'axios'
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'
import './SyncAds.css'

function SyncAds() {
  const [searchTerms, setSearchTerms] = useState('')
  const [country, setCountry] = useState('US')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleSync = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await axios.post(`${API_BASE_URL}/api/sync`, {
        searchTerms,
        country
      })
      setResult(response.data.message)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to sync ads. Please check your API configuration.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sync-ads container">
      <div className="sync-header">
        <h1>Sync Winning Ads</h1>
        <p>Fetch and import high-performing ads to analyze and recreate</p>
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

            <button
              type="submit"
              className="btn btn-primary btn-sync"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  Syncing...
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
              <span>{result}</span>
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
          <h2>How it works</h2>
          <ol className="info-list">
            <li>
              <strong>Configure your API token:</strong> Add your access token to the backend 
              <code>.env</code> file
            </li>
            <li>
              <strong>Choose search parameters:</strong> Enter keywords and select a target country
            </li>
            <li>
              <strong>Sync ads:</strong> Click the button to fetch winning ads from the library
            </li>
            <li>
              <strong>Automatic scoring:</strong> The system calculates performance scores based on 
              impressions, spend, and other metrics
            </li>
            <li>
              <strong>Browse and recreate:</strong> View all synced ads on the dashboard with 
              advanced filtering and recreation scripts
            </li>
          </ol>

          <div className="info-note">
            <AlertCircle size={16} />
            <p>
              <strong>Note:</strong> You need a valid API access token to use this feature. 
              Configure it in your backend environment settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SyncAds

