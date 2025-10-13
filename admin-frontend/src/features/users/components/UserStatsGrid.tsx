import React from 'react'
import { StatsCard } from '../../../components/ui'
import { useUserStats } from '../hooks/useUsers'
import type { UserFilters } from '../../../shared/types/user'
import { 
  UsersIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'

interface UserStatsGridProps {
  filters?: UserFilters
}

const UserStatsGrid: React.FC<UserStatsGridProps> = ({ filters }) => {
  const { stats, loading } = useUserStats(filters)

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ))}
      </div>
    )
  }

  const activePercentage = stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : '0'
  const newUserGrowth = stats.newThisMonth > 0 ? `+${stats.newThisMonth}` : '0'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Users"
        value={stats.total.toLocaleString()}
        icon={UsersIcon}
        color="bg-blue-500"
        change={`${activePercentage}% active`}
        changeType="neutral"
      />
      
      <StatsCard
        title="Active Users"
        value={stats.active.toLocaleString()}
        icon={CheckCircleIcon}
        color="bg-green-500"
        change={`${((stats.active / (stats.total || 1)) * 100).toFixed(1)}%`}
        changeType="positive"
      />
      
      <StatsCard
        title="New This Month"
        value={stats.newThisMonth.toLocaleString()}
        icon={ClockIcon}
        color="bg-purple-500"
        change={newUserGrowth}
        changeType={stats.newThisMonth > 0 ? "positive" : "neutral"}
      />
      
      <StatsCard
        title="Total Revenue"
        value={`$${stats.totalRevenue.toLocaleString()}`}
        icon={ExclamationTriangleIcon}
        color="bg-orange-500"
        change={`Avg: ${stats.averageRating}/5`}
        changeType="neutral"
      />
    </div>
  )
}

export default UserStatsGrid
