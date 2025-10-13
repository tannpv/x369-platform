import { useState } from 'react'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  TruckIcon,
  CalendarDaysIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
  ShoppingBagIcon,
  StarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

interface StatCardProps {
  title: string
  value: string
  change?: string
  changeType?: 'up' | 'down'
  subtitle?: string
  icon?: React.ComponentType<any>
  color?: string
}

function StatCard({ title, value, change, changeType, subtitle, icon: Icon, color = 'bg-[#5d87ff]' }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-[#e5eaef] p-6 card-hover">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#2a3547] mb-1">{title}</h3>
          <p className="text-3xl font-bold text-[#2a3547] mb-2">{value}</p>
          {change && (
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 text-sm ${
                changeType === 'up' ? 'text-[#13deb9]' : 'text-[#fa896b]'
              }`}>
                {changeType === 'up' ? (
                  <ArrowUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4" />
                )}
                <span className="font-medium">{change}</span>
              </div>
              {subtitle && <span className="text-sm text-[#5a6a85]">{subtitle}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        )}
      </div>
    </div>
  )
}

export default function ModernizeDashboard() {
  const [timeRange, setTimeRange] = useState('monthly')

  const topCards = [
    {
      title: 'Revenue Updates',
      subtitle: 'Overview of profit',
      value: '$63,489.50',
    },
    {
      title: 'Yearly Breakup',
      value: '$36,358',
      change: '+9%',
      changeType: 'up' as const,
      subtitle: 'last year',
    },
    {
      title: 'Monthly Earnings',
      value: '$6,820',
      change: '+9%',
      changeType: 'up' as const,
      subtitle: 'last year',
    },
    {
      title: 'Employee Salary',
      subtitle: 'Every month',
      value: '$36,358',
      isEmployeeSalary: true,
    },
  ]

  const statsCards = [
    {
      title: 'Customers',
      value: '36,358',
      change: '+9%',
      changeType: 'up' as const,
      icon: UsersIcon,
      color: 'bg-[#49beff]',
    },
    {
      title: 'Projects',
      value: '78,298',
      change: '-3%',
      changeType: 'down' as const,
      icon: TruckIcon,
      color: 'bg-[#13deb9]',
    },
    {
      title: 'Sales',
      value: '78,298',
      change: '+9%',
      changeType: 'up' as const,
      icon: CurrencyDollarIcon,
      color: 'bg-[#ffae1f]',
    },
    {
      title: 'Bookings',
      value: '78,298',  
      change: '+9%',
      changeType: 'up' as const,
      icon: CalendarDaysIcon,
      color: 'bg-[#fa896b]',
    },
  ]

  const topPerformers = [
    { name: 'Sunil Joshi', role: 'Web Designer', project: 'Elite Admin', priority: 'Low', budget: '3.9k' },
    { name: 'John Deo', role: 'Web Designer', project: 'Flexy Admin', priority: 'Medium', budget: '24.5k' },
    { name: 'Nirav Joshi', role: 'Web Designer', project: 'Material Pro', priority: 'High', budget: '12.8k' },
    { name: 'Yuvraj Sheth', role: 'Web Designer', project: 'Xtreme Admin', priority: 'Low', budget: '4.8k' },
    { name: 'Micheal Doe', role: 'Web Designer', project: 'Helping Hands WP Theme', priority: 'High', budget: '9.3k' },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-[#fa896b] bg-[#fa896b]/10'
      case 'Medium': return 'text-[#ffae1f] bg-[#ffae1f]/10'
      case 'Low': return 'text-[#13deb9] bg-[#13deb9]/10'
      default: return 'text-[#5a6a85] bg-[#5a6a85]/10'
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Row - Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topCards.map((card, index) => (
          <div key={index} className={`bg-white rounded-lg border border-[#e5eaef] p-6 card-hover ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#2a3547] mb-2">{card.title}</h3>
                {card.subtitle && <p className="text-sm text-[#5a6a85] mb-4">{card.subtitle}</p>}
              </div>
              <button className="text-[#5a6a85] hover:text-[#2a3547]">
                <EllipsisHorizontalIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-2xl font-bold text-[#2a3547]">{card.value}</p>
              {card.change && (
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 text-sm ${
                    card.changeType === 'up' ? 'text-[#13deb9]' : 'text-[#fa896b]'
                  }`}>
                    {card.changeType === 'up' ? (
                      <ArrowUpIcon className="h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4" />
                    )}
                    <span className="font-medium">{card.change}</span>
                  </div>
                  {card.subtitle && <span className="text-sm text-[#5a6a85]">{card.subtitle}</span>}
                </div>
              )}
            </div>
            {index === 0 && (
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#5a6a85]">Earnings this month</span>
                  <span className="text-sm font-semibold text-[#2a3547]">$48,820</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#5a6a85]">Expense this month</span>
                  <span className="text-sm font-semibold text-[#2a3547]">$26,498</span>
                </div>
                <button className="w-full mt-4 bg-[#5d87ff] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#4570ea] transition-colors">
                  View Full Report
                </button>
              </div>
            )}
            {index === 1 && (
              <div className="mt-4">
                <div className="flex space-x-4">
                  <div className="text-center">
                    <p className="text-xs text-[#5a6a85]">2023</p>
                    <div className="w-12 h-24 bg-[#ecf2ff] rounded mt-2"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#5a6a85]">2024</p>
                    <div className="w-12 h-32 bg-[#5d87ff] rounded mt-2"></div>
                  </div>
                </div>
              </div>
            )}
            {(card as any).isEmployeeSalary && (
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#5a6a85]">Salary</span>
                  <span className="text-sm font-semibold text-[#2a3547]">$36,358</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#5a6a85]">Profit</span>
                  <span className="text-sm font-semibold text-[#2a3547]">$5,296</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Revenue Chart and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-[#e5eaef] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#2a3547]">Revenue Updates</h3>
              <p className="text-sm text-[#5a6a85]">Overview of profit</p>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm border border-[#e5eaef] rounded-lg px-3 py-1 text-[#2a3547] focus:outline-none focus:border-[#5d87ff]"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <button className="text-[#5a6a85] hover:text-[#2a3547]">
                <EllipsisHorizontalIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="h-80 bg-gradient-to-br from-[#ecf2ff] to-[#f8fafc] rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="h-16 w-16 text-[#5d87ff] mx-auto mb-4 opacity-50" />
              <h4 className="text-lg font-semibold text-[#2a3547] mb-2">Revenue Chart</h4>
              <p className="text-[#5a6a85]">Chart component will be integrated here</p>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg border border-[#e5eaef] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#2a3547]">Top Performers</h3>
              <p className="text-sm text-[#5a6a85]">Best employees</p>
            </div>
          </div>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#5d87ff] to-[#49beff] flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">
                    {performer.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2a3547] truncate">{performer.name}</p>
                  <p className="text-xs text-[#5a6a85]">{performer.role}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(performer.priority)}`}>
                    {performer.priority}
                  </span>
                  <p className="text-sm font-semibold text-[#2a3547] mt-1">{performer.budget}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Best Selling Products */}
        <div className="bg-white rounded-lg border border-[#e5eaef] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#2a3547]">Best Selling Products</h3>
              <p className="text-sm text-[#5a6a85]">Overview 2023</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#5d87ff]/5 to-[#49beff]/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-[#5d87ff] flex items-center justify-center">
                  <ShoppingBagIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2a3547]">MaterialPro</p>
                  <p className="text-xs text-[#5a6a85]">55%</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-[#2a3547]">$23,568</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#13deb9]/5 to-[#49beff]/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-[#13deb9] flex items-center justify-center">
                  <ShoppingBagIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2a3547]">Flexy Admin</p>
                  <p className="text-xs text-[#5a6a85]">45%</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-[#2a3547]">$18,245</span>
            </div>
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="bg-white rounded-lg border border-[#e5eaef] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#2a3547]">Weekly Stats</h3>
              <p className="text-sm text-[#5a6a85]">Average sales</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 rounded-full bg-[#5d87ff]"></div>
                <span className="text-sm text-[#2a3547]">Top Sales</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#2a3547]">Johnathan Doe</p>
                <p className="text-xs text-[#13deb9]">+68</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 rounded-full bg-[#13deb9]"></div>
                <span className="text-sm text-[#2a3547]">Best Seller</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#2a3547]">MaterialPro Admin</p>
                <p className="text-xs text-[#13deb9]">+68</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 rounded-full bg-[#fa896b]"></div>
                <span className="text-sm text-[#2a3547]">Most Commented</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#2a3547]">Ample Admin</p>
                <p className="text-xs text-[#13deb9]">+68</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg border border-[#e5eaef] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#2a3547]">Recent Activities</h3>
              <p className="text-sm text-[#5a6a85]">Latest updates</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-[#5d87ff] flex items-center justify-center flex-shrink-0">
                <ClockIcon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#2a3547]">New order received</p>
                <p className="text-xs text-[#5a6a85]">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-[#13deb9] flex items-center justify-center flex-shrink-0">
                <UsersIcon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#2a3547]">New user registered</p>
                <p className="text-xs text-[#5a6a85]">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-[#ffae1f] flex items-center justify-center flex-shrink-0">
                <StarIcon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#2a3547]">Product review added</p>
                <p className="text-xs text-[#5a6a85]">10 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Messages/Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Super Awesome Message */}
        <div className="bg-white rounded-lg border border-[#e5eaef] overflow-hidden">
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#5d87ff] to-[#49beff] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-white">JD</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-lg font-semibold text-[#2a3547]">Super awesome, Vue coming soon!</h4>
                  <span className="text-xs text-[#5a6a85]">22 March, 2023</span>
                </div>
                <p className="text-sm text-[#5a6a85] leading-relaxed">
                  We're excited to announce that Vue.js support is coming to our admin template. 
                  This will provide developers with even more flexibility and choice in their projects.
                </p>
                <div className="flex items-center space-x-2 mt-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-6 w-6 rounded-full bg-gradient-to-r from-[#5d87ff] to-[#49beff] border-2 border-white -ml-2 first:ml-0" />
                  ))}
                  <span className="text-xs text-[#5a6a85] ml-2">+24 others</span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-2 bg-gradient-to-r from-[#5d87ff] to-[#49beff]"></div>
        </div>

        {/* Employee Salary Card */}
        <div className="bg-white rounded-lg border border-[#e5eaef] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#2a3547]">Employee Salary</h3>
              <p className="text-sm text-[#5a6a85]">Every Month</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#5d87ff]/5 to-transparent rounded-lg">
              <span className="text-sm text-[#5a6a85]">Salary</span>
              <span className="text-lg font-semibold text-[#2a3547]">$36,358</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#13deb9]/5 to-transparent rounded-lg">
              <span className="text-sm text-[#5a6a85]">Profit</span>
              <span className="text-lg font-semibold text-[#2a3547]">$5,296</span>
            </div>
            <div className="pt-4 border-t border-[#e5eaef]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#2a3547]">Total Budget</span>
                <span className="text-xl font-bold text-[#5d87ff]">$41,654</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
