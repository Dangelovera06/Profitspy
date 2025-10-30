import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, ExternalLink, Calendar, Globe, Target, DollarSign, Eye, TrendingUp } from 'lucide-react'
import './AdDetail.css'

function AdDetail() {
  const { id } = useParams()
  const [ad, setAd] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAd()
  }, [id])

  const fetchAd = async () => {
    try {
      const response = await axios.get(`/api/ads/${id}`)
      setAd(response.data)
    } catch (error) {
      console.error('Error fetching ad:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'score-high'
    if (score >= 40) return 'score-medium'
    return 'score-low'
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading ad details...</p>
        </div>
      </div>
    )
  }

  if (!ad) {
    return (
      <div className="container">
        <div className="empty-state card">
          <h3>Ad not found</h3>
          <Link to="/" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="ad-detail container">
      <Link to="/" className="back-link">
        <ArrowLeft size={20} />
        Back to Dashboard
      </Link>

      <div className="detail-header card">
        <div className="detail-header-content">
          <div>
            <h1>{ad.page_name || 'Unknown Advertiser'}</h1>
            <div className="detail-meta">
              <span className="meta-item">
                <Calendar size={16} />
                Started: {formatDate(ad.ad_delivery_start_time)}
              </span>
              {ad.ad_delivery_stop_time && (
                <span className="meta-item">
                  <Calendar size={16} />
                  Ended: {formatDate(ad.ad_delivery_stop_time)}
                </span>
              )}
            </div>
          </div>
          <div className="detail-header-actions">
            <span className={`badge ${ad.ad_status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
              {ad.ad_status}
            </span>
            {ad.ad_snapshot_url && (
              <a 
                href={ad.ad_snapshot_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <ExternalLink size={16} />
                View Original Ad
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-main">
          <div className="card">
            <h2>Ad Creative</h2>
            {ad.ad_creative_link_titles && ad.ad_creative_link_titles.length > 0 && (
              <div className="creative-section">
                <h3>Titles</h3>
                {ad.ad_creative_link_titles.map((title, index) => (
                  <p key={index} className="creative-text">{title}</p>
                ))}
              </div>
            )}
            {ad.ad_creative_bodies && ad.ad_creative_bodies.length > 0 && (
              <div className="creative-section">
                <h3>Body Text</h3>
                {ad.ad_creative_bodies.map((body, index) => (
                  <p key={index} className="creative-text">{body}</p>
                ))}
              </div>
            )}
            {ad.ad_creative_link_descriptions && ad.ad_creative_link_descriptions.length > 0 && (
              <div className="creative-section">
                <h3>Descriptions</h3>
                {ad.ad_creative_link_descriptions.map((desc, index) => (
                  <p key={index} className="creative-text">{desc}</p>
                ))}
              </div>
            )}
            {ad.ad_creative_link_captions && ad.ad_creative_link_captions.length > 0 && (
              <div className="creative-section">
                <h3>Captions</h3>
                {ad.ad_creative_link_captions.map((caption, index) => (
                  <p key={index} className="creative-text">{caption}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="card">
            <h2>Performance Metrics</h2>
            <div className="metrics">
              <div className="metric">
                <div className="metric-icon">
                  <TrendingUp size={20} />
                </div>
                <div className="metric-info">
                  <div className="metric-label">Performance Score</div>
                  <div className={`metric-value ${getScoreColor(ad.performance_score)}`}>
                    {ad.performance_score ? ad.performance_score.toFixed(1) : '0.0'}
                  </div>
                </div>
              </div>

              <div className="metric">
                <div className="metric-icon">
                  <Eye size={20} />
                </div>
                <div className="metric-info">
                  <div className="metric-label">Impressions</div>
                  <div className="metric-value">{ad.impressions || 'N/A'}</div>
                </div>
              </div>

              <div className="metric">
                <div className="metric-icon">
                  <DollarSign size={20} />
                </div>
                <div className="metric-info">
                  <div className="metric-label">Spend</div>
                  <div className="metric-value">
                    {ad.spend ? `${ad.currency || '$'}${ad.spend}` : 'N/A'}
                  </div>
                </div>
              </div>

              {ad.estimated_audience_size && (
                <div className="metric">
                  <div className="metric-icon">
                    <Target size={20} />
                  </div>
                  <div className="metric-info">
                    <div className="metric-label">Est. Audience</div>
                    <div className="metric-value">{ad.estimated_audience_size}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h2>Targeting</h2>
            <div className="targeting-info">
              {ad.target_locations && ad.target_locations.length > 0 && (
                <div className="targeting-item">
                  <Globe size={16} />
                  <div>
                    <div className="targeting-label">Locations</div>
                    <div className="targeting-value">
                      {ad.target_locations.join(', ')}
                    </div>
                  </div>
                </div>
              )}
              {ad.target_ages && (
                <div className="targeting-item">
                  <Target size={16} />
                  <div>
                    <div className="targeting-label">Age Range</div>
                    <div className="targeting-value">{ad.target_ages}</div>
                  </div>
                </div>
              )}
              {ad.target_gender && (
                <div className="targeting-item">
                  <Target size={16} />
                  <div>
                    <div className="targeting-label">Gender</div>
                    <div className="targeting-value">{ad.target_gender}</div>
                  </div>
                </div>
              )}
              {ad.publisher_platforms && ad.publisher_platforms.length > 0 && (
                <div className="targeting-item">
                  <Globe size={16} />
                  <div>
                    <div className="targeting-label">Platforms</div>
                    <div className="targeting-value">
                      {ad.publisher_platforms.join(', ')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdDetail

