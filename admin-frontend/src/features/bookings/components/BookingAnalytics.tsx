/**
 * BookingAnalytics component for advanced booking insights
 */

import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  CurrencyDollarIcon,
  UsersIcon,
  CalendarDaysIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { format, subDays, eachDayOfInterval } from 'date-fns'
import type { BookingStats, BookingWithDetails, Booking } from '../../../shared/types/booking'
import { BOOKING_TYPES, PAYMENT_STATUSES } from '../../../shared/constants/booking'

interface BookingAnalyticsProps {
  stats: BookingStats
  bookings: (BookingWithDetails | Booking)[]
  isLoading?: boolean
}

export function BookingAnalytics({ stats, bookings, isLoading = false }: BookingAnalyticsProps) {
  // Calculate recent trends (last 7 days)
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  })

  const dailyBookings = last7Days.map(date => {
    const dayBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.startDate)
      return format(bookingDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    })
    return {
      date: format(date, 'MMM d'),
      count: dayBookings.length,
      revenue: dayBookings.reduce((sum, booking) => sum + booking.totalAmount, 0)
    }
  })

  const maxCount = Math.max(...dailyBookings.map(d => d.count))
  const maxRevenue = Math.max(...dailyBookings.map(d => d.revenue))

  // Calculate performance metrics
  const totalBookings = stats.total
  const completionRate = totalBookings > 0 ? ((stats.completed / totalBookings) * 100).toFixed(1) : '0'
  const cancellationRate = totalBookings > 0 ? ((stats.cancelled / totalBookings) * 100).toFixed(1) : '0'
  const avgBookingValue = stats.averageBookingValue

  // Popular booking types
  const bookingTypeData = Object.entries(stats.byType).map(([type, count]) => ({
    type: BOOKING_TYPES[type as keyof typeof BOOKING_TYPES],
    count,
    percentage: totalBookings > 0 ? ((count / totalBookings) * 100).toFixed(1) : '0'
  })).sort((a, b) => b.count - a.count)

  // Payment status distribution
  const paymentStatusData = Object.entries(stats.byPaymentStatus).map(([status, count]) => ({
    status: PAYMENT_STATUSES[status as keyof typeof PAYMENT_STATUSES],
    count,
    percentage: totalBookings > 0 ? ((count / totalBookings) * 100).toFixed(1) : '0'
  })).sort((a, b) => b.count - a.count)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <ChartBarIcon className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
            <div className="text-xs text-gray-500 mt-1">{stats.completed} of {totalBookings} completed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{cancellationRate}%</div>
            <div className="text-sm text-gray-600">Cancellation Rate</div>
            <div className="text-xs text-gray-500 mt-1">{stats.cancelled} of {totalBookings} cancelled</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">${avgBookingValue.toFixed(0)}</div>
            <div className="text-sm text-gray-600">Avg. Booking Value</div>
            <div className="text-xs text-gray-500 mt-1">Per booking</div>
          </div>
        </div>
      </div>

      {/* Daily Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">7-Day Trend</h3>
        </div>
        
        <div className="space-y-4">
          {/* Bookings Chart */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CalendarDaysIcon className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Daily Bookings</span>
            </div>
            <div className="flex items-end gap-1 h-20">
              {dailyBookings.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-200 rounded-sm mb-1"
                    style={{
                      height: `${maxCount > 0 ? (day.count / maxCount) * 60 : 0}px`,
                      minHeight: day.count > 0 ? '4px' : '0px'
                    }}
                    title={`${day.date}: ${day.count} bookings`}
                  ></div>
                  <span className="text-xs text-gray-500 rotate-45 origin-center whitespace-nowrap">
                    {day.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Chart */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Daily Revenue</span>
            </div>
            <div className="flex items-end gap-1 h-20">
              {dailyBookings.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-green-200 rounded-sm mb-1"
                    style={{
                      height: `${maxRevenue > 0 ? (day.revenue / maxRevenue) * 60 : 0}px`,
                      minHeight: day.revenue > 0 ? '4px' : '0px'
                    }}
                    title={`${day.date}: $${day.revenue.toFixed(0)}`}
                  ></div>
                  <span className="text-xs text-gray-500 rotate-45 origin-center whitespace-nowrap">
                    {day.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Types Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ClockIcon className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Booking Types</h3>
          </div>
          
          <div className="space-y-3">
            {bookingTypeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-purple-200"></div>
                  <span className="text-sm text-gray-700">{item.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  <span className="text-xs text-gray-500">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Payment Status</h3>
          </div>
          
          <div className="space-y-3">
            {paymentStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-200"></div>
                  <span className="text-sm text-gray-700">{item.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  <span className="text-xs text-gray-500">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <UsersIcon className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Quick Insights</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-lg font-semibold text-blue-600">{stats.active}</div>
            <div className="text-sm text-blue-700">Active Bookings</div>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="text-lg font-semibold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-yellow-700">Pending Approval</div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-lg font-semibold text-green-600">${stats.totalRevenue.toFixed(0)}</div>
            <div className="text-sm text-green-700">Total Revenue</div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-lg font-semibold text-purple-600">${stats.monthlyRevenue.toFixed(0)}</div>
            <div className="text-sm text-purple-700">This Month</div>
          </div>
        </div>
      </div>
    </div>
  )
}
