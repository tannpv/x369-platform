import { useState } from 'react'
import {
  CurrencyDollarIcon,
  UsersIcon,
  TruckIcon,
  CalendarDaysIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

interface StatCardProps {
  title: string
  value: string
  change: number
  changeText: string
  icon: React.ComponentType<any>
  color: string
  trend: 'up' | 'down'
}

function StatCard({ title, value, change, changeText, icon: Icon, color, trend }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
      {/* Gradient overlay */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${color.replace('bg-gradient-to-r', 'bg-gradient-to-br')}`}></div>
      
      {/* Content */}
      <div className="relative p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
              <div className={`w-2 h-2 rounded-full ${color.includes('green') ? 'bg-green-400' : color.includes('blue') ? 'bg-blue-400' : color.includes('purple') ? 'bg-purple-400' : 'bg-orange-400'}`}></div>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">{value}</p>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                trend === 'up' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {trend === 'up' ? (
                  <ArrowUpIcon className="h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3" />
                )}
                <span>{change}%</span>
              </div>
              <span className="text-sm text-gray-500">{changeText}</span>
            </div>
          </div>
          
          {/* Icon with beautiful gradient background */}
          <div className={`relative p-4 rounded-2xl ${color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
            <Icon className="h-8 w-8 text-white relative z-10" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent"></div>
          </div>
        </div>
        
        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
      </div>
    </div>
  )
}

interface ActivityItemProps {
  type: 'booking' | 'payment' | 'user' | 'vehicle'
  title: string
  description: string
  time: string
  status: 'success' | 'warning' | 'info' | 'danger'
}

function ActivityItem({ type, title, description, time, status }: ActivityItemProps) {
  const getIcon = () => {
    switch (type) {
      case 'booking': return CalendarDaysIcon
      case 'payment': return CurrencyDollarIcon
      case 'user': return UsersIcon
      case 'vehicle': return TruckIcon
      default: return DocumentTextIcon
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'info': return 'bg-blue-100 text-blue-800'
      case 'danger': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const Icon = getIcon()

  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
      <div className={`p-2 rounded-lg ${getStatusColor()}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
        <ClockIcon className="h-3 w-3 mr-1" />
        {time}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('7d')

  const stats = [
    {
      title: 'Total Revenue',
      value: '$124,500',
      change: 12.5,
      changeText: 'from last month',
      icon: CurrencyDollarIcon,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      trend: 'up' as const,
    },
    {
      title: 'Active Users',
      value: '12,543',
      change: 8.2,
      changeText: 'from last month',
      icon: UsersIcon,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      trend: 'up' as const,
    },
    {
      title: 'Vehicle Fleet',
      value: '856',
      change: 3.1,
      changeText: 'vehicles added',
      icon: TruckIcon,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      trend: 'up' as const,
    },
    {
      title: 'Bookings Today',
      value: '127',
      change: -2.4,
      changeText: 'from yesterday',
      icon: CalendarDaysIcon,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      trend: 'down' as const,
    },
  ]

  const recentBookings = [
    { id: 'BK001', customer: 'John Smith', vehicle: 'Toyota Camry', date: '2024-01-15', status: 'active', amount: '$120' },
    { id: 'BK002', customer: 'Emma Davis', vehicle: 'Honda CR-V', date: '2024-01-14', status: 'completed', amount: '$95' },
    { id: 'BK003', customer: 'Michael Chen', vehicle: 'Tesla Model 3', date: '2024-01-14', status: 'pending', amount: '$180' },
    { id: 'BK004', customer: 'Sarah Wilson', vehicle: 'BMW X5', date: '2024-01-13', status: 'active', amount: '$250' },
    { id: 'BK005', customer: 'David Brown', vehicle: 'Audi A4', date: '2024-01-13', status: 'cancelled', amount: '$140' },
  ]

  const recentActivity = [
    {
      type: 'booking' as const,
      title: 'New booking created',
      description: 'John Smith booked Toyota Camry for 3 days',
      time: '2 minutes ago',
      status: 'success' as const,
    },
    {
      type: 'payment' as const,
      title: 'Payment received',
      description: '$250 payment from Emma Davis',
      time: '5 minutes ago',
      status: 'success' as const,
    },
    {
      type: 'user' as const,
      title: 'New user registered',
      description: 'Michael Chen joined the platform',
      time: '10 minutes ago',
      status: 'info' as const,
    },
    {
      type: 'vehicle' as const,
      title: 'Vehicle maintenance',
      description: 'BMW X5 scheduled for maintenance',
      time: '15 minutes ago',
      status: 'warning' as const,
    },
    {
      type: 'booking' as const,
      title: 'Booking cancelled',
      description: 'Sarah Wilson cancelled Honda Accord booking',
      time: '20 minutes ago',
      status: 'danger' as const,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'badge badge-success'
      case 'completed': return 'badge badge-info'
      case 'pending': return 'badge badge-warning'
      case 'cancelled': return 'badge badge-danger'
      default: return 'badge badge-secondary'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 -m-6 p-6">
      <div className="space-y-8">
        {/* Header with beautiful gradient background */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full blur-xl"></div>
          
          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-indigo-100 text-lg">
                Monitor your car rental business performance and key metrics
              </p>
              <div className="flex items-center space-x-6 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Live Data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-sm">Real-time Updates</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
              >
                <option value="7d" className="text-gray-900">Last 7 days</option>
                <option value="30d" className="text-gray-900">Last 30 days</option>
                <option value="90d" className="text-gray-900">Last 90 days</option>
                <option value="1y" className="text-gray-900">Last year</option>
              </select>
            </div>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>        {/* Beautiful Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Revenue Chart - Enhanced Design */}
          <div className="xl:col-span-2 group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">Revenue Analytics</h3>
                  <p className="text-indigo-100">Monthly performance insights</p>
                </div>
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors px-4 py-2 rounded-xl flex items-center space-x-2 text-sm font-medium">
                  <EyeIcon className="h-4 w-4" />
                  <span>View Report</span>
                </button>
              </div>
            </div>
            
            {/* Chart Area */}
            <div className="p-6">
              <div className="h-80 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl flex items-center justify-center relative overflow-hidden border border-indigo-100">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
                <div className="text-center relative z-10">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-2xl w-fit mx-auto mb-4">
                    <ChartBarIcon className="h-12 w-12 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Advanced Analytics</h4>
                  <p className="text-gray-600">Beautiful interactive charts coming soon</p>
                  <div className="flex justify-center space-x-2 mt-4">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>          {/* Vehicle Distribution - Enhanced */}
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
            {/* Beautiful Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="relative">
                <h3 className="text-xl font-bold mb-1">Fleet Overview</h3>
                <p className="text-emerald-100">Vehicle distribution</p>
              </div>
            </div>
            
            <div className="p-6">
              {/* Donut Chart Placeholder */}
              <div className="h-48 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden border border-emerald-100">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5"></div>
                <div className="text-center relative z-10">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-2xl w-fit mx-auto mb-3">
                    <TruckIcon className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">Fleet Analytics</p>
                  <p className="text-gray-500 text-sm">Chart loading...</p>
                </div>
              </div>
              
              {/* Enhanced Legend */}
              <div className="space-y-4">
                {[
                  { type: 'Sedan', percentage: 35, color: 'from-blue-400 to-blue-600' },
                  { type: 'SUV', percentage: 28, color: 'from-green-400 to-green-600' },
                  { type: 'Hatchback', percentage: 20, color: 'from-yellow-400 to-orange-500' },
                  { type: 'Convertible', percentage: 10, color: 'from-red-400 to-red-600' },
                  { type: 'Electric', percentage: 7, color: 'from-purple-400 to-purple-600' }
                ].map((item, index) => (
                  <div key={item.type} className="group/item flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.color} shadow-lg`}></div>
                      <span className="font-medium text-gray-700 group-hover/item:text-gray-900">{item.type}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-900 min-w-[3rem] text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Latest system events</p>
          </div>
          <div className="admin-card-body p-0">
            <div className="max-h-80 overflow-y-auto">
              {recentActivity.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Latest customer bookings</p>
          </div>
          <div className="admin-card-body p-0">
            <div className="overflow-hidden">
              <table className="admin-table">
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.customer}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{booking.vehicle}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={getStatusBadge(booking.status)}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.amount}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
