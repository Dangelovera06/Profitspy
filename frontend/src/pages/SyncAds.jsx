import React, { useState } from 'react'
import API_BASE_URL from '../config'
import axios from 'axios'
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'
import './SyncAds.css'

function SyncAds() {
  const [searchTerms, setSearchTerms] = useState('')
  const [country, setCountry] = useState('US')
  const [maxAds, setMaxAds] = useState(50)
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
        country,
        maxAds
      })
      setResult(response.data.message || `Successfully synced ${response.data.count} ads!`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to sync ads. Please check your Apify API token in backend .env file.')
    } finally {
      setLoading(false)
    }
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
              <strong>Get Apify API token:</strong> Sign up at{' '}
              <a href="https://apify.com" target="_blank" rel="noopener noreferrer">apify.com</a> 
              {' '}and get your API token from{' '}
              <a href="https://console.apify.com/account/integrations" target="_blank" rel="noopener noreferrer">
                account integrations
              </a>
            </li>
            <li>
              <strong>Configure backend:</strong> Add <code>APIFY_API_TOKEN=your_token</code> to 
              your backend <code>.env</code> file and restart the server
            </li>
            <li>
              <strong>Choose parameters:</strong> Enter keywords, select country, and set max ads to fetch
            </li>
            <li>
              <strong>Start scraping:</strong> Click sync and wait ~30-120 seconds for Apify to 
              scrape the ads (free tier: $5/month credits)
            </li>
            <li>
              <strong>Automatic analysis:</strong> Performance scores are calculated based on 
              impressions, spend, reach, and engagement metrics
            </li>
            <li>
              <strong>Browse and recreate:</strong> View all synced ads on the dashboard with 
              recreation scripts ready to copy
            </li>
          </ol>

          <div className="info-note">
            <AlertCircle size={16} />
            <p>
              <strong>Quick Start:</strong> See <code>APIFY_SETUP.md</code> in the project root for 
              detailed setup instructions. Free tier includes $5 in monthly credits!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SyncAds

