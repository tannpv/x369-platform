/**
 * BookingStatsGrid Component
 * Displays key booking statistics in a grid layout
 */

import { 
  CalendarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'
import type { BookingStats } from '../../../shared/types/booking'
import StatsCard from '../../../components/ui/StatsCard'
import type { StatsCard as StatsCardType } from '../../../shared/types/common'

interface BookingStatsGridProps {
  stats: BookingStats
  isLoading?: boolean
}

export function BookingStatsGrid({ 
  stats, 
  isLoading = false 
}: BookingStatsGridProps) {
  const statCards: StatsCardType[] = [
    {
      title: 'Total Bookings',
      value: stats.total,
      icon: CalendarIcon,
      color: 'text-blue-600'
    },
    {
      title: 'Active Bookings',
      value: stats.active,
      icon: CheckCircleIcon,
      color: 'text-green-600'
    },
    {
      title: 'Pending Bookings',
      value: stats.pending,
      icon: ClockIcon,
      color: 'text-yellow-600'
    },
    {
      title: 'Completed Bookings',
      value: stats.completed,
      icon: CheckCircleIcon,
      color: 'text-purple-600'
    },
    {
      title: 'Cancelled Bookings',
      value: stats.cancelled,
      icon: XCircleIcon,
      color: 'text-red-600'
    },
    {
      title: 'Total Revenue',
      value: stats.totalRevenue,
      icon: CurrencyDollarIcon,
      color: 'text-emerald-600'
    },
    {
      title: 'Avg. Booking Value',
      value: stats.averageBookingValue,
      icon: ChartBarIcon,
      color: 'text-indigo-600'
    },
    {
      title: 'Monthly Revenue',
      value: stats.monthlyRevenue,
      icon: ArrowTrendingUpIcon,
      color: 'text-teal-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <StatsCard
          key={index}
          {...stat}
          loading={isLoading}
        />
      ))}
    </div>
  )
}

export default BookingStatsGrid
