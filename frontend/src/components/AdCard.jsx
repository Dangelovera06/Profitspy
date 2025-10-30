import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, TrendingUp, Calendar, Globe, Copy, Play, Image as ImageIcon } from 'lucide-react'
import './AdCard.css'

function AdCard({ ad }) {
  const [copySuccess, setCopySuccess] = useState(false)

  const getFirstText = (arr) => {
    if (Array.isArray(arr) && arr.length > 0) return arr[0]
    return ''
  }

  const getFirstImage = () => {
    if (ad.images && Array.isArray(ad.images) && ad.images.length > 0) {
      return ad.images[0]
    }
    return null
  }

  const getFirstVideo = () => {
    if (ad.videos && Array.isArray(ad.videos) && ad.videos.length > 0) {
      return ad.videos[0]
    }
    return null
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

  const handleGenerateScript = () => {
    const script = `# Ad Recreation Script
# Advertiser: ${ad.page_name || 'Unknown'}
# Performance Score: ${ad.performance_score ? ad.performance_score.toFixed(1) : '0.0'}

Title: ${getFirstText(ad.ad_creative_link_titles) || 'N/A'}
Body: ${getFirstText(ad.ad_creative_bodies) || 'N/A'}
Description: ${getFirstText(ad.ad_creative_link_descriptions) || 'N/A'}

Target Locations: ${ad.target_locations ? ad.target_locations.join(', ') : 'N/A'}
Target Ages: ${ad.target_ages || 'N/A'}
Platforms: ${ad.publisher_platforms ? ad.publisher_platforms.join(', ') : 'N/A'}

# TODO: Customize this ad copy for your campaign
`
    navigator.clipboard.writeText(script)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
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
        <div className="ad-header-right">
          <span className={`badge ${ad.ad_status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
            {ad.ad_status}
          </span>
          {ad.media_type && (
            <span className="media-type-badge">
              {ad.media_type === 'video' ? <Play size={14} /> : ad.media_type === 'image' ? <ImageIcon size={14} /> : null}
              {ad.media_type}
            </span>
          )}
        </div>
      </div>

      {/* Media Preview */}
      {(getFirstImage() || getFirstVideo()) && (
        <div className="ad-media-preview">
          {getFirstVideo() ? (
            <div className="media-video-container">
              <video 
                src={getFirstVideo()} 
                controls={false}
                muted
                className="ad-media-video"
                poster={getFirstImage()}
              />
              <div className="video-overlay">
                <Play size={32} />
              </div>
            </div>
          ) : getFirstImage() ? (
            <img 
              src={getFirstImage()} 
              alt="Ad creative" 
              className="ad-media-image"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentElement.style.display = 'none'
              }}
            />
          ) : null}
        </div>
      )}

      <div className="ad-content">
        {getFirstText(ad.ad_creative_link_titles) && (
          <h4 className="ad-title">{getFirstText(ad.ad_creative_link_titles)}</h4>
        )}
        {getFirstText(ad.ad_creative_bodies) && (
          <p className="ad-body">{getFirstText(ad.ad_creative_bodies)}</p>
        )}
        {ad.landing_page_url && (
          <a 
            href={ad.landing_page_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ad-landing-link"
          >
            <ExternalLink size={14} />
            Visit Landing Page
          </a>
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
        <button 
          onClick={handleGenerateScript}
          className="btn btn-primary"
          title="Copy recreation script"
        >
          <Copy size={16} />
          {copySuccess ? 'Copied!' : 'Recreate'}
        </button>
      </div>
    </div>
  )
}

export default AdCard

