import React from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, TrendingUp, Calendar, Globe } from 'lucide-react'
import './AdCard.css'

function AdCard({ ad }) {
  const getFirstText = (arr) => {
    if (Array.isArray(arr) && arr.length > 0) return arr[0]
    return ''
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'score-high'
    if (score >= 40) return 'score-medium'
    return 'score-low'
  }

  return (
    <div className="ad-card card">
      <div className="ad-card-header">
        <div>
          <h3 className="ad-page-name">{ad.page_name || 'Unknown Advertiser'}</h3>
          <div className="ad-meta">
            <span className="meta-item">
              <Calendar size={14} />
              {formatDate(ad.ad_delivery_start_time)}
            </span>
            {ad.target_locations && ad.target_locations.length > 0 && (
              <span className="meta-item">
                <Globe size={14} />
                {ad.target_locations[0]}
              </span>
            )}
          </div>
        </div>
        <span className={`badge ${ad.ad_status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
          {ad.ad_status}
        </span>
      </div>

      <div className="ad-content">
        {getFirstText(ad.ad_creative_link_titles) && (
          <h4 className="ad-title">{getFirstText(ad.ad_creative_link_titles)}</h4>
        )}
        {getFirstText(ad.ad_creative_bodies) && (
          <p className="ad-body">{getFirstText(ad.ad_creative_bodies)}</p>
        )}
      </div>

      <div className="ad-stats">
        <div className="stat">
          <div className="stat-label">Performance Score</div>
          <div className={`stat-value ${getScoreColor(ad.performance_score)}`}>
            <TrendingUp size={16} />
            {ad.performance_score ? ad.performance_score.toFixed(1) : '0.0'}
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">Impressions</div>
          <div className="stat-value">{ad.impressions || 'N/A'}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Spend</div>
          <div className="stat-value">
            {ad.spend ? `${ad.currency || '$'}${ad.spend}` : 'N/A'}
          </div>
        </div>
      </div>

      <div className="ad-actions">
        <Link to={`/ad/${ad.id}`} className="btn btn-secondary">
          View Details
        </Link>
        {ad.ad_snapshot_url && (
          <a 
            href={ad.ad_snapshot_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <ExternalLink size={16} />
            View Ad
          </a>
        )}
      </div>
    </div>
  )
}

export default AdCard

