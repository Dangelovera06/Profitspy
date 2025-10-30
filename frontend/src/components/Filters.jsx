import React from 'react'
import { Search, Filter, Activity, TrendingUp, ArrowDownUp, Target } from 'lucide-react'
import './Filters.css'

function Filters({ filters, onFilterChange }) {
  return (
    <div className="filters card">
      <div className="filters-row">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          />
        </div>

        <div className="filter-select-wrapper">
          <Target size={16} className="filter-icon" />
          <select
            className="filter-select"
            value={filters.searchType}
            onChange={(e) => onFilterChange({ ...filters, searchType: e.target.value })}
          >
            <option value="keyword">Keyword</option>
            <option value="creator">Creator</option>
            <option value="advertiser">Advertiser</option>
          </select>
        </div>
        
        <div className="filter-select-wrapper">
          <Activity size={16} className="filter-icon" />
          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div className="filter-select-wrapper">
          <Filter size={16} className="filter-icon" />
          <select
            className="filter-select"
            value={filters.minScore}
            onChange={(e) => onFilterChange({ ...filters, minScore: e.target.value })}
          >
            <option value="">Min Score</option>
            <option value="80">80+</option>
            <option value="60">60+</option>
            <option value="40">40+</option>
            <option value="20">20+</option>
          </select>
        </div>

        <div className="filter-select-wrapper">
          <TrendingUp size={16} className="filter-icon" />
          <select
            className="filter-select"
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
          >
            <option value="performance_score">Top Performers</option>
            <option value="ad_delivery_start_time">Newest First</option>
            <option value="engagement_rate">Most Engaging</option>
          </select>
        </div>

        <div className="filter-select-wrapper">
          <ArrowDownUp size={16} className="filter-icon" />
          <select
            className="filter-select"
            value={filters.order}
            onChange={(e) => onFilterChange({ ...filters, order: e.target.value })}
          >
            <option value="DESC">↓ High to Low</option>
            <option value="ASC">↑ Low to High</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default Filters

