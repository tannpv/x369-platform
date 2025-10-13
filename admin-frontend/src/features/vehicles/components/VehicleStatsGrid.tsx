import { TruckIcon, CheckCircleIcon, ClockIcon, WrenchScrewdriverIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { StatsCard } from '../../../components/ui'
import { useVehicleStats } from '../hooks/useVehicles'
import type { VehicleFilters } from '../../../shared/types/vehicle'

interface VehicleStatsGridProps {
  filters?: VehicleFilters
  className?: string
}

const VehicleStatsGrid: React.FC<VehicleStatsGridProps> = ({ filters, className }) => {
  const { stats, loading, error } = useVehicleStats(filters)

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">Failed to load statistics: {error}</p>
      </div>
    )
  }

  const statsCards = [
    {
      title: 'Total Vehicles',
      value: stats?.total || 0,
      icon: TruckIcon,
      color: 'var(--bs-primary)'
    },
    {
      title: 'Available',
      value: stats?.available || 0,
      change: stats?.available ? `${((stats.available / stats.total) * 100).toFixed(1)}%` : undefined,
      changeType: 'positive' as const,
      icon: CheckCircleIcon,
      color: 'var(--bs-success)'
    },
    {
      title: 'Rented',
      value: stats?.rented || 0,
      change: stats?.rented ? `${((stats.rented / stats.total) * 100).toFixed(1)}%` : undefined,
      changeType: 'neutral' as const,
      icon: ClockIcon,
      color: 'var(--bs-warning)'
    },
    {
      title: 'Maintenance',
      value: stats?.maintenance || 0,
      change: stats?.maintenance ? `${((stats.maintenance / stats.total) * 100).toFixed(1)}%` : undefined,
      changeType: 'negative' as const,
      icon: WrenchScrewdriverIcon,
      color: 'var(--bs-danger)'
    },
    {
      title: 'Total Revenue',
      value: stats?.totalRevenue || 0,
      change: stats?.averageRating ? `${stats.averageRating.toFixed(1)} avg rating` : undefined,
      changeType: 'positive' as const,
      icon: CurrencyDollarIcon,
      color: 'var(--bs-info)'
    }
  ]

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 ${className || ''}`}>
      {statsCards.map((card, index) => (
        <StatsCard
          key={index}
          {...card}
          loading={loading}
        />
      ))}
    </div>
  )
}

export default VehicleStatsGrid
