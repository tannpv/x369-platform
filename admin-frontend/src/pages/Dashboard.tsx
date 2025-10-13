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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
)

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
    <div className="admin-card group hover:shadow-lg transition-all duration-300">
      <div className="admin-card-body">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</p>
            <div className="flex items-center">
              {trend === 'up' ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {change}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{changeText}</span>
            </div>
          </div>
          <div className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
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

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [85000, 92000, 78000, 95000, 108000, 124000, 135000, 128000, 142000, 158000, 175000, 186000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  const bookingsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Bookings',
        data: [65, 78, 90, 81, 96, 105, 89],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const vehicleTypesData = {
    labels: ['Sedan', 'SUV', 'Hatchback', 'Convertible', 'Electric'],
    datasets: [
      {
        data: [35, 28, 20, 10, 7],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        border: {
          display: false,
        },
      },
    },
  }

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor your car rental business performance and key metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 admin-card">
          <div className="admin-card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly revenue performance</p>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <EyeIcon className="h-4 w-4" />
                <span>View Report</span>
              </button>
            </div>
          </div>
          <div className="admin-card-body">
            <div className="h-80">
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Vehicle Distribution */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vehicle Distribution</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Fleet composition</p>
          </div>
          <div className="admin-card-body">
            <div className="h-64 flex items-center justify-center mb-6">
              <Doughnut data={vehicleTypesData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
            <div className="space-y-3">
              {vehicleTypesData.labels.map((label, index) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: vehicleTypesData.datasets[0].backgroundColor[index] }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {vehicleTypesData.datasets[0].data[index]}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Weekly Bookings */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Bookings</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">This week's performance</p>
              </div>
              <ChartBarIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="admin-card-body">
            <div className="h-64">
              <Bar data={bookingsData} options={chartOptions} />
            </div>
          </div>
        </div>

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
                    <tr key={booking.id}>
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
  )
}
