import React from 'react'
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react'
import './StatsOverview.css'

function StatsOverview({ stats }) {
  if (!stats) return null

  const statCards = [
    {
      icon: <BarChart3 size={24} />,
      label: 'Total Ads',
      value: stats.total_ads?.toLocaleString() || '0',
      color: 'blue'
    },
    {
      icon: <Activity size={24} />,
      label: 'Active Ads',
      value: stats.active_ads?.toLocaleString() || '0',
      color: 'green'
    },
    {
      icon: <Users size={24} />,
      label: 'Advertisers',
      value: stats.unique_advertisers?.toLocaleString() || '0',
      color: 'purple'
    },
    {
      icon: <TrendingUp size={24} />,
      label: 'Avg Performance',
      value: stats.avg_performance_score ? stats.avg_performance_score.toFixed(1) : '0.0',
      color: 'orange'
    }
  ]

  return (
    <div className="stats-overview">
      {statCards.map((stat, index) => (
        <div key={index} className={`stat-card card stat-${stat.color}`}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-info">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsOverview

