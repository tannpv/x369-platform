import { useState } from 'react'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  EyeIcon,
  HeartIcon,
  StarIcon,
  ChartBarIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline'

interface ProductCardProps {
  name: string
  price: string
  rating: number
  reviews: number
  badge?: string
}

function ProductCard({ name, price, rating, reviews, badge }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg border border-[#e5eaef] overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-[#ecf2ff] to-[#f8fafc] flex items-center justify-center">
          <ShoppingCartIcon className="h-16 w-16 text-[#5d87ff] opacity-30" />
        </div>
        {badge && (
          <span className="absolute top-3 left-3 bg-[#fa896b] text-white text-xs font-medium px-2 py-1 rounded">
            {badge}
          </span>
        )}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
            <HeartIcon className="h-4 w-4 text-[#5a6a85]" />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
            <EyeIcon className="h-4 w-4 text-[#5a6a85]" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[#2a3547] mb-2">{name}</h3>
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-4 w-4 ${
                i < rating ? 'text-[#ffae1f] fill-current' : 'text-[#e5eaef]'
              }`}
            />
          ))}
          <span className="text-sm text-[#5a6a85] ml-2">({reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[#2a3547]">{price}</span>
          <button className="bg-[#5d87ff] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4570ea] transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EcommerceDashboard() {
  const [timeRange, setTimeRange] = useState('monthly')

  const ecommerceStats = [
    {
      title: 'Total Sales',
      value: '$63,489.50',
      change: '+12.5%',
      changeType: 'up' as const,
      icon: CurrencyDollarIcon,
      color: 'bg-[#5d87ff]',
    },
    {
      title: 'Orders',
      value: '1,245',
      change: '+8.2%',
      changeType: 'up' as const,
      icon: ShoppingCartIcon,
      color: 'bg-[#13deb9]',
    },
    {
      title: 'Products',
      value: '423',
      change: '+3.1%',
      changeType: 'up' as const,
      icon: ChartBarIcon,
      color: 'bg-[#ffae1f]',
    },
    {
      title: 'Customers',
      value: '2,891',
      change: '+15.3%',
      changeType: 'up' as const,
      icon: EyeIcon,
      color: 'bg-[#fa896b]',
    },
  ]

  const featuredProducts = [
    { name: 'MaterialPro Admin', price: '$299', rating: 5, reviews: 142, badge: 'Hot' },
    { name: 'Flexy Dashboard', price: '$199', rating: 4, reviews: 98 },
    { name: 'Ample Admin Pro', price: '$159', rating: 5, reviews: 203, badge: 'New' },
    { name: 'Modernize Template', price: '$89', rating: 4, reviews: 76 },
  ]

  const topCategories = [
    { name: 'Admin Templates', sales: '$23,568', percentage: 55, color: 'bg-[#5d87ff]' },
    { name: 'Dashboard Kits', sales: '$18,245', percentage: 45, color: 'bg-[#13deb9]' },
    { name: 'UI Components', sales: '$12,890', percentage: 35, color: 'bg-[#ffae1f]' },
    { name: 'Landing Pages', sales: '$8,950', percentage: 25, color: 'bg-[#fa896b]' },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2a3547]">eCommerce Dashboard</h1>
          <p className="text-[#5a6a85]">Monitor your online store performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm border border-[#e5eaef] rounded-lg px-3 py-2 text-[#2a3547] focus:outline-none focus:border-[#5d87ff]"
          >
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="yearly">This Year</option>
          </select>
          <button className="bg-[#5d87ff] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4570ea] transition-colors">
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ecommerceStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-[#e5eaef] p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#2a3547] mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-[#2a3547] mb-2">{stat.value}</p>
                <div className={`flex items-center space-x-1 text-sm ${
                  stat.changeType === 'up' ? 'text-[#13deb9]' : 'text-[#fa896b]'
                }`}>
                  {stat.changeType === 'up' ? (
                    <ArrowUpIcon className="h-4 w-4" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4" />
                  )}
                  <span className="font-medium">{stat.change}</span>
                  <span className="text-[#5a6a85]">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Chart and Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-[#e5eaef] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#2a3547]">Sales Analytics</h3>
              <p className="text-sm text-[#5a6a85]">Revenue trends over time</p>
            </div>
            <button className="text-[#5a6a85] hover:text-[#2a3547]">
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="h-80 bg-gradient-to-br from-[#ecf2ff] to-[#f8fafc] rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="h-16 w-16 text-[#5d87ff] mx-auto mb-4 opacity-50" />
              <h4 className="text-lg font-semibold text-[#2a3547] mb-2">Sales Chart</h4>
              <p className="text-[#5a6a85]">Interactive chart will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-lg border border-[#e5eaef] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#2a3547]">Top Categories</h3>
              <p className="text-sm text-[#5a6a85]">Best selling categories</p>
            </div>
          </div>
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-[#2a3547]">{category.name}</span>
                  <span className="text-sm font-semibold text-[#2a3547]">{category.sales}</span>
                </div>
                <div className="w-full bg-[#ecf2ff] rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${category.color}`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#5a6a85]">{category.percentage}% of total sales</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white rounded-lg border border-[#e5eaef] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[#2a3547]">Featured Products</h3>
            <p className="text-sm text-[#5a6a85]">Our best selling items</p>
          </div>
          <button className="text-[#5d87ff] hover:text-[#4570ea] text-sm font-medium">
            View All Products
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border border-[#e5eaef] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[#2a3547]">Recent Orders</h3>
            <p className="text-sm text-[#5a6a85]">Latest customer orders</p>
          </div>
          <button className="text-[#5d87ff] hover:text-[#4570ea] text-sm font-medium">
            View All Orders
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5eaef]">
                <th className="text-left py-3 px-4 font-semibold text-[#2a3547]">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold text-[#2a3547]">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-[#2a3547]">Product</th>
                <th className="text-left py-3 px-4 font-semibold text-[#2a3547]">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-[#2a3547]">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: '#ORD-001', customer: 'John Doe', product: 'MaterialPro Admin', amount: '$299', status: 'Completed' },
                { id: '#ORD-002', customer: 'Jane Smith', product: 'Flexy Dashboard', amount: '$199', status: 'Processing' },
                { id: '#ORD-003', customer: 'Mike Johnson', product: 'Ample Admin Pro', amount: '$159', status: 'Pending' },
                { id: '#ORD-004', customer: 'Sarah Wilson', product: 'Modernize Template', amount: '$89', status: 'Completed' },
              ].map((order, index) => (
                <tr key={index} className="border-b border-[#e5eaef] hover:bg-[#ecf2ff]/50">
                  <td className="py-3 px-4 text-[#2a3547]">{order.id}</td>
                  <td className="py-3 px-4 text-[#2a3547]">{order.customer}</td>
                  <td className="py-3 px-4 text-[#2a3547]">{order.product}</td>
                  <td className="py-3 px-4 font-semibold text-[#2a3547]">{order.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Completed' ? 'text-[#13deb9] bg-[#13deb9]/10' :
                      order.status === 'Processing' ? 'text-[#ffae1f] bg-[#ffae1f]/10' :
                      'text-[#fa896b] bg-[#fa896b]/10'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
