import {
  ChartBarIcon,
  UsersIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  StarIcon,
  MapPinIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline'

const StatWidget = ({ title, value, change, changeType, icon: Icon, color, bgGradient }: any) => (
  <div className={`${bgGradient} rounded-lg p-6 text-white card-hover`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-white/80 text-sm mb-2">{title}</p>
        <p className="text-3xl font-bold mb-3">{value}</p>
        {change && (
          <div className="flex items-center space-x-1">
            {changeType === 'up' ? (
              <ArrowUpIcon className="h-4 w-4" />
            ) : (
              <ArrowDownIcon className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">{change}</span>
            <span className="text-white/70 text-sm">vs last month</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
)

const ActivityCard = ({ icon: Icon, title, description, time, color }: any) => (
  <div className="flex items-start space-x-4 p-4 hover:bg-[#ecf2ff]/50 rounded-lg transition-colors">
    <div className={`p-2 rounded-lg ${color}`}>
      <Icon className="h-5 w-5 text-white" />
    </div>
    <div className="flex-1">
      <h4 className="font-medium text-[#2a3547] mb-1">{title}</h4>
      <p className="text-sm text-[#5a6a85] mb-2">{description}</p>
      <p className="text-xs text-[#5a6a85] flex items-center">
        <ClockIcon className="h-3 w-3 mr-1" />
        {time}
      </p>
    </div>
  </div>
)

const WeatherWidget = () => (
  <div className="bg-gradient-to-br from-[#49beff] to-[#5d87ff] rounded-lg p-6 text-white card-hover">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Today's Weather</h3>
        <p className="text-white/80 text-sm flex items-center">
          <MapPinIcon className="h-4 w-4 mr-1" />
          San Francisco, CA
        </p>
      </div>
      <div className="text-right">
        <p className="text-3xl font-bold">72°F</p>
        <p className="text-white/80 text-sm">Sunny</p>
      </div>
    </div>
    <div className="flex justify-between text-sm">
      <div className="text-center">
        <p className="text-white/80">High</p>
        <p className="font-semibold">78°</p>
      </div>
      <div className="text-center">
        <p className="text-white/80">Low</p>
        <p className="font-semibold">65°</p>
      </div>
      <div className="text-center">
        <p className="text-white/80">Humidity</p>
        <p className="font-semibold">45%</p>
      </div>
    </div>
  </div>
)

export default function WidgetsPage() {
  const colorfulStats = [
    {
      title: 'Total Revenue',
      value: '$89,245',
      change: '+12.5%',
      changeType: 'up',
      icon: CurrencyDollarIcon,
      bgGradient: 'bg-gradient-to-r from-[#5d87ff] to-[#49beff]',
    },
    {
      title: 'New Users',
      value: '2,847',
      change: '+8.2%',
      changeType: 'up',
      icon: UsersIcon,
      bgGradient: 'bg-gradient-to-r from-[#13deb9] to-[#06b6d4]',
    },
    {
      title: 'Orders',
      value: '1,396',
      change: '+15.3%',
      changeType: 'up',
      icon: ShoppingCartIcon,
      bgGradient: 'bg-gradient-to-r from-[#ffae1f] to-[#f59e0b]',
    },
    {
      title: 'Page Views',
      value: '45,672',
      change: '-2.1%',
      changeType: 'down',
      icon: EyeIcon,
      bgGradient: 'bg-gradient-to-r from-[#fa896b] to-[#f97316]',
    },
  ]

  const recentActivities = [
    {
      icon: UsersIcon,
      title: 'New user registered',
      description: 'John Doe joined the platform',
      time: '2 minutes ago',
      color: 'bg-[#5d87ff]',
    },
    {
      icon: ShoppingCartIcon,
      title: 'New order received',
      description: 'Order #1245 for $299.99',
      time: '5 minutes ago',
      color: 'bg-[#13deb9]',
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'New message',
      description: 'Sarah sent you a message',
      time: '8 minutes ago',
      color: 'bg-[#ffae1f]',
    },
    {
      icon: HeartIcon,
      title: 'Product liked',
      description: 'MaterialPro template was liked',
      time: '12 minutes ago',
      color: 'bg-[#fa896b]',
    },
  ]

  const socialStats = [
    { platform: 'Facebook', followers: '12.5K', growth: '+5.2%', color: 'bg-[#1877f2]' },
    { platform: 'Twitter', followers: '8.9K', growth: '+3.1%', color: 'bg-[#1da1f2]' },
    { platform: 'Instagram', followers: '15.2K', growth: '+8.7%', color: 'bg-gradient-to-r from-[#f56040] to-[#833ab4]' },
    { platform: 'LinkedIn', followers: '6.3K', growth: '+2.4%', color: 'bg-[#0077b5]' },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2a3547] mb-2">Widgets & Cards</h1>
        <p className="text-[#5a6a85]">Beautiful widget components for your dashboard</p>
      </div>

      {/* Colorful Stat Cards */}
      <div>
        <h2 className="text-lg font-semibold text-[#2a3547] mb-4">Gradient Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {colorfulStats.map((stat, index) => (
            <StatWidget key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Weather and Social Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherWidget />
        
        {/* Social Media Stats */}
        <div className="bg-white rounded-lg border border-[#e5eaef] p-6 card-hover">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#2a3547]">Social Media</h3>
              <p className="text-sm text-[#5a6a85]">Followers overview</p>
            </div>
          </div>
          <div className="space-y-4">
            {socialStats.map((social, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-[#ecf2ff] to-transparent rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${social.color} flex items-center justify-center`}>
                    <span className="text-white font-semibold text-sm">
                      {social.platform.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-[#2a3547]">{social.platform}</p>
                    <p className="text-sm text-[#5a6a85]">{social.followers} followers</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-[#13deb9]">{social.growth}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-[#e5eaef] p-6 card-hover">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#2a3547]">Recent Activities</h3>
              <p className="text-sm text-[#5a6a85]">Latest platform activities</p>
            </div>
            <button className="text-[#5d87ff] hover:text-[#4570ea] text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-2">
            {recentActivities.map((activity, index) => (
              <ActivityCard key={index} {...activity} />
            ))}
          </div>
        </div>

        {/* Mini Calendar */}
        <div className="bg-white rounded-lg border border-[#e5eaef] p-6 card-hover">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#2a3547]">Calendar</h3>
              <p className="text-sm text-[#5a6a85]">October 2025</p>
            </div>
            <CalendarDaysIcon className="h-5 w-5 text-[#5a6a85]" />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-[#5a6a85] mb-2">
              <div>S</div>
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {[...Array(31)].map((_, i) => (
                <div
                  key={i}
                  className={`p-2 rounded ${
                    i + 1 === 13
                      ? 'bg-[#5d87ff] text-white'
                      : 'text-[#2a3547] hover:bg-[#ecf2ff] cursor-pointer'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-[#e5eaef]">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#5d87ff]"></div>
                <span className="text-sm text-[#2a3547]">Meeting at 2:00 PM</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#13deb9]"></div>
                <span className="text-sm text-[#2a3547]">Team Review</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Cards */}
      <div>
        <h2 className="text-lg font-semibold text-[#2a3547] mb-4">Progress Widgets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Project Progress', value: 85, color: 'bg-[#5d87ff]' },
            { title: 'Task Completion', value: 72, color: 'bg-[#13deb9]' },
            { title: 'Revenue Goal', value: 91, color: 'bg-[#ffae1f]' },
            { title: 'User Satisfaction', value: 96, color: 'bg-[#fa896b]' },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg border border-[#e5eaef] p-6 card-hover">
              <div className="text-center">
                <h3 className="font-semibold text-[#2a3547] mb-4">{item.title}</h3>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#ecf2ff"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - item.value / 100)}`}
                      className={`transition-all duration-1000 ${
                        item.color === 'bg-[#5d87ff]' ? 'text-[#5d87ff]' :
                        item.color === 'bg-[#13deb9]' ? 'text-[#13deb9]' :
                        item.color === 'bg-[#ffae1f]' ? 'text-[#ffae1f]' : 'text-[#fa896b]'
                      }`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#2a3547]">{item.value}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <StarIcon className={`h-4 w-4 ${
                    item.color === 'bg-[#5d87ff]' ? 'text-[#5d87ff]' :
                    item.color === 'bg-[#13deb9]' ? 'text-[#13deb9]' :
                    item.color === 'bg-[#ffae1f]' ? 'text-[#ffae1f]' : 'text-[#fa896b]'
                  }`} />
                  <span className="text-sm text-[#5a6a85]">Excellent</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
