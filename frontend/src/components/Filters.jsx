import React from 'react'
import { Search, Filter } from 'lucide-react'
import './Filters.css'

function Filters({ filters, onFilterChange }) {
  return (
    <div className="filters card">
      <div className="filters-row">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search ads by keyword, advertiser..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          />
        </div>
        
        <div className="filter-group">
          <Filter size={20} />
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Min Score:</label>
          <input
            type="number"
            min="0"
            max="100"
            value={filters.minScore}
            onChange={(e) => onFilterChange({ ...filters, minScore: e.target.value })}
            placeholder="0"
          />
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
          >
            <option value="performance_score">Performance Score</option>
            <option value="ad_delivery_start_time">Start Date</option>
            <option value="engagement_rate">Engagement Rate</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filters.order}
            onChange={(e) => onFilterChange({ ...filters, order: e.target.value })}
          >
            <option value="DESC">Descending</option>
            <option value="ASC">Ascending</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default Filters

