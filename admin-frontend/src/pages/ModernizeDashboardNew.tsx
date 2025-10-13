import { useState } from 'react'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  EllipsisHorizontalIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  TruckIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline'

export default function ModernizeDashboardNew() {
  const [timeRange, setTimeRange] = useState('monthly')

  return (
    <div className="space-y-6">
      {/* First Row - Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Updates Card */}
        <div className="modernize-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--bs-body-color)' }}>
                Revenue Updates
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--bs-gray-500)' }}>
                Overview of profit
              </p>
            </div>
            <button style={{ color: 'var(--bs-gray-500)' }}>
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-3">
            <p className="text-2xl font-bold" style={{ color: 'var(--bs-body-color)' }}>
              $63,489.50
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--bs-gray-500)' }}>
                  Earnings this month
                </span>
                <span className="text-sm font-semibold" style={{ color: 'var(--bs-body-color)' }}>
                  $48,820
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--bs-gray-500)' }}>
                  Expense this month
                </span>
                <span className="text-sm font-semibold" style={{ color: 'var(--bs-body-color)' }}>
                  $26,498
                </span>
              </div>
              <button className="w-full mt-4 modernize-btn modernize-btn-primary">
                View Full Report
              </button>
            </div>
          </div>
        </div>

        {/* Yearly Breakup Card */}
        <div className="modernize-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--bs-body-color)' }}>
                Yearly Breakup
              </h3>
            </div>
            <button style={{ color: 'var(--bs-gray-500)' }}>
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-3">
            <p className="text-2xl font-bold" style={{ color: 'var(--bs-body-color)' }}>
              $36,358
            </p>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm" style={{ color: 'var(--bs-success)' }}>
                <ArrowUpIcon className="h-4 w-4" />
                <span className="font-medium">+9%</span>
              </div>
              <span className="text-sm" style={{ color: 'var(--bs-gray-500)' }}>last year</span>
            </div>
            <div className="mt-4">
              <div className="flex space-x-4">
                <div className="text-center">
                  <p className="text-xs mb-2" style={{ color: 'var(--bs-gray-500)' }}>2023</p>
                  <div className="w-12 h-24 rounded" 
                       style={{ backgroundColor: 'var(--bs-light)' }}></div>
                </div>
                <div className="text-center">
                  <p className="text-xs mb-2" style={{ color: 'var(--bs-gray-500)' }}>2024</p>
                  <div className="w-12 h-32 rounded" 
                       style={{ backgroundColor: 'var(--bs-primary)' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Earnings Card */}
        <div className="modernize-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--bs-body-color)' }}>
                Monthly Earnings
              </h3>
            </div>
            <button style={{ color: 'var(--bs-gray-500)' }}>
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-3">
            <p className="text-2xl font-bold" style={{ color: 'var(--bs-body-color)' }}>
              $6,820
            </p>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm" style={{ color: 'var(--bs-success)' }}>
                <ArrowUpIcon className="h-4 w-4" />
                <span className="font-medium">+9%</span>
              </div>
              <span className="text-sm" style={{ color: 'var(--bs-gray-500)' }}>last year</span>
            </div>
          </div>
        </div>

        {/* Employee Salary Card */}
        <div className="modernize-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--bs-body-color)' }}>
                Employee Salary
              </h3>
              <p className="text-sm" style={{ color: 'var(--bs-gray-500)' }}>
                Every month
              </p>
            </div>
            <button style={{ color: 'var(--bs-gray-500)' }}>
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded" 
                 style={{ backgroundColor: 'rgba(93, 135, 255, 0.05)' }}>
              <span className="text-sm" style={{ color: 'var(--bs-gray-500)' }}>Salary</span>
              <span className="text-lg font-semibold" style={{ color: 'var(--bs-body-color)' }}>$36,358</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded" 
                 style={{ backgroundColor: 'rgba(19, 222, 185, 0.05)' }}>
              <span className="text-sm" style={{ color: 'var(--bs-gray-500)' }}>Profit</span>
              <span className="text-lg font-semibold" style={{ color: 'var(--bs-body-color)' }}>$5,296</span>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row - Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Customers', value: '36,358', change: '+9%', icon: UsersIcon, color: 'var(--bs-secondary)' },
          { title: 'Projects', value: '78,298', change: '+9%', icon: TruckIcon, color: 'var(--bs-success)' },
          { title: 'Orders', value: '78,298', change: '+9%', icon: CurrencyDollarIcon, color: 'var(--bs-warning)' },
          { title: 'Bookings', value: '78,298', change: '+9%', icon: CalendarDaysIcon, color: 'var(--bs-danger)' },
        ].map((stat, index) => (
          <div key={index} className="modernize-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--bs-body-color)' }}>
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold mb-2" style={{ color: 'var(--bs-body-color)' }}>
                  {stat.value}
                </p>
                <div className="flex items-center space-x-1 text-sm" style={{ color: 'var(--bs-success)' }}>
                  <ArrowUpIcon className="h-4 w-4" />
                  <span className="font-medium">{stat.change}</span>
                </div>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: stat.color }}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Third Row - Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Updates Chart */}
        <div className="lg:col-span-2 modernize-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--bs-body-color)' }}>
                Revenue Updates
              </h3>
              <p className="text-sm" style={{ color: 'var(--bs-gray-500)' }}>
                Overview of profit
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm border rounded-lg px-3 py-1 focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: 'var(--bs-border-color)',
                  color: 'var(--bs-body-color)',
                  borderRadius: 'var(--bs-border-radius)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--bs-primary)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--bs-border-color)'
                }}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <button style={{ color: 'var(--bs-gray-500)' }}>
                <EllipsisHorizontalIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="h-80 rounded-lg flex items-center justify-center" 
               style={{ backgroundColor: 'var(--bs-light)' }}>
            <div className="text-center">
              <ChartBarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" 
                           style={{ color: 'var(--bs-primary)' }} />
              <h4 className="text-lg font-semibold mb-2" style={{ color: 'var(--bs-body-color)' }}>
                Revenue Chart
              </h4>
              <p style={{ color: 'var(--bs-gray-500)' }}>
                Chart component will be integrated here
              </p>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="modernize-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--bs-body-color)' }}>
                Top Performers
              </h3>
              <p className="text-sm" style={{ color: 'var(--bs-gray-500)' }}>
                Best employees
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Sunil Joshi', role: 'Web Designer', project: 'Elite Admin', priority: 'Low', budget: '3.9k' },
              { name: 'John Deo', role: 'Web Designer', project: 'Flexy Admin', priority: 'Medium', budget: '24.5k' },
              { name: 'Nirav Joshi', role: 'Web Designer', project: 'Material Pro', priority: 'High', budget: '12.8k' },
              { name: 'Yuvraj Sheth', role: 'Web Designer', project: 'Xtreme Admin', priority: 'Low', budget: '4.8k' },
              { name: 'Micheal Doe', role: 'Web Designer', project: 'Helping Hands WP Theme', priority: 'High', budget: '9.3k' },
            ].map((performer, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full flex items-center justify-center"
                     style={{ 
                       background: 'linear-gradient(135deg, var(--bs-primary) 0%, var(--bs-secondary) 100%)'
                     }}>
                  <span className="text-xs font-semibold text-white">
                    {performer.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--bs-body-color)' }}>
                    {performer.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--bs-gray-500)' }}>
                    {performer.role}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium`}
                        style={{
                          color: performer.priority === 'High' ? 'var(--bs-danger)' : 
                                 performer.priority === 'Medium' ? 'var(--bs-warning)' : 'var(--bs-success)',
                          backgroundColor: performer.priority === 'High' ? 'rgba(250, 137, 107, 0.1)' : 
                                          performer.priority === 'Medium' ? 'rgba(255, 174, 31, 0.1)' : 'rgba(19, 222, 185, 0.1)'
                        }}>
                    {performer.priority}
                  </span>
                  <p className="text-sm font-semibold mt-1" style={{ color: 'var(--bs-body-color)' }}>
                    {performer.budget}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
