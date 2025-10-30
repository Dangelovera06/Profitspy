import React, { useState, useEffect } from 'react'
import API_BASE_URL from '../config'
import axios from 'axios'
import AdCard from '../components/AdCard'
import Filters from '../components/Filters'
import StatsOverview from '../components/StatsOverview'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './Dashboard.css'

function Dashboard() {
  const [ads, setAds] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    minScore: '',
    sortBy: 'performance_score',
    order: 'DESC'
  })

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    fetchAds()
  }, [pagination.page, filters])

  const fetchAds = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      }
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null) {
          delete params[key]
        }
      })

      const response = await axios.get(`${API_BASE_URL}/api/ads`, { params })
      setAds(response.data.data)
      setPagination(prev => ({ ...prev, ...response.data.pagination }))
    } catch (error) {
      console.error('Error fetching ads:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/ads/stats/overview')
      setStats(response.data.overview)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="dashboard container">
      <div className="dashboard-header">
        <div>
          <h1>Ad Discovery Dashboard</h1>
          <p>Discover and analyze effective Meta ads from the Ads Library</p>
        </div>
      </div>

      <StatsOverview stats={stats} />
      
      <Filters filters={filters} onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading ads...</p>
        </div>
      ) : ads.length === 0 ? (
        <div className="empty-state card">
          <h3>No ads found</h3>
          <p>Try adjusting your filters or sync new ads from the Sync page</p>
        </div>
      ) : (
        <>
          <div className="ads-grid">
            {ads.map(ad => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              
              <div className="pagination-info">
                Page {pagination.page} of {pagination.totalPages}
                <span className="pagination-total">
                  ({pagination.total} total ads)
                </span>
              </div>

              <button
                className="btn btn-secondary"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard

