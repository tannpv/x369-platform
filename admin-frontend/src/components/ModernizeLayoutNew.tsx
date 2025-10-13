import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  InboxIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
  PuzzlePieceIcon,
  GlobeAltIcon,
  TruckIcon,
  UsersIcon,
  CalendarIcon,
  CreditCardIcon as PaymentIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline'
import ThemeCustomizer from './ThemeCustomizer'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<any>
  badge?: string | number
  current?: boolean
}

const dashboards: NavigationItem[] = [
  { name: 'Modern', href: '/', icon: HomeIcon },
  { name: 'eCommerce', href: '/ecommerce', icon: BuildingStorefrontIcon },
]

const apps: NavigationItem[] = [
  { name: 'Chats', href: '/apps/chats', icon: ChatBubbleLeftRightIcon },
  { name: 'Calendar', href: '/apps/calendar', icon: CalendarDaysIcon },
  { name: 'Email', href: '/apps/email', icon: InboxIcon },
  { name: 'Notes', href: '/apps/notes', icon: DocumentTextIcon },
  { name: 'Contacts', href: '/apps/contacts', icon: UserGroupIcon },
  { name: 'Tickets', href: '/apps/tickets', icon: ClipboardDocumentListIcon },
]

const pages: NavigationItem[] = [
  { name: 'Pricing', href: '/pages/pricing', icon: CreditCardIcon },
  { name: 'Account Setting', href: '/pages/account', icon: Cog6ToothIcon },
  { name: 'FAQ', href: '/pages/faq', icon: QuestionMarkCircleIcon },
]

const widgets: NavigationItem[] = [
  { name: 'Cards', href: '/widgets', icon: PuzzlePieceIcon },
]

const management: NavigationItem[] = [
  { name: 'Vehicles', href: '/vehicles', icon: TruckIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
  { name: 'Bookings', href: '/bookings', icon: CalendarIcon },
  { name: 'Payments', href: '/payments', icon: PaymentIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  { name: 'Security', href: '/security', icon: ShieldCheckIcon },
  { name: 'Notifications', href: '/notifications', icon: BellAlertIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ModernizeLayoutNew() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [themeCustomizerOpen, setThemeCustomizerOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={classNames(
        'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
        'bg-white border-r',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )} 
      style={{ 
        width: 'var(--sidebar-width)',
        borderColor: 'var(--bs-border-color)'
      }}>
        
        {/* Logo */}
        <div className="flex h-[70px] items-center px-6">
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded" 
                 style={{ backgroundColor: 'var(--bs-primary)' }}>
              <span className="text-lg font-bold text-white">M</span>
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{ color: 'var(--bs-dark)' }}>Modernize</h1>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-6 pb-6" style={{ height: 'calc(100vh - 70px)', overflowY: 'auto' }}>
          {/* Dashboards Section */}
          <div className="mb-8">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider" 
               style={{ color: 'var(--bs-gray-500)' }}>
              Dashboards
            </p>
            <div className="space-y-1">
              {dashboards.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'text-white shadow-sm'
                        : 'hover:bg-opacity-10'
                    )}
                    style={isActive ? { 
                      backgroundColor: 'var(--bs-primary)',
                      color: 'white'
                    } : {
                      color: 'var(--bs-gray-500)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(93, 135, 255, 0.1)'
                        e.currentTarget.style.color = 'var(--bs-primary)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = 'var(--bs-gray-500)'
                      }
                    }}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Apps Section */}
          <div className="mb-8">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider" 
               style={{ color: 'var(--bs-gray-500)' }}>
              Apps
            </p>
            <div className="space-y-1">
              {apps.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'text-white shadow-sm'
                        : 'hover:bg-opacity-10'
                    )}
                    style={isActive ? { 
                      backgroundColor: 'var(--bs-primary)',
                      color: 'white'
                    } : {
                      color: 'var(--bs-gray-500)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(93, 135, 255, 0.1)'
                        e.currentTarget.style.color = 'var(--bs-primary)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = 'var(--bs-gray-500)'
                      }
                    }}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Pages Section */}
          <div className="mb-8">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider" 
               style={{ color: 'var(--bs-gray-500)' }}>
              Pages
            </p>
            <div className="space-y-1">
              {pages.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'text-white shadow-sm'
                        : 'hover:bg-opacity-10'
                    )}
                    style={isActive ? { 
                      backgroundColor: 'var(--bs-primary)',
                      color: 'white'
                    } : {
                      color: 'var(--bs-gray-500)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(93, 135, 255, 0.1)'
                        e.currentTarget.style.color = 'var(--bs-primary)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = 'var(--bs-gray-500)'
                      }
                    }}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Widgets Section */}
          <div className="mb-8">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider" 
               style={{ color: 'var(--bs-gray-500)' }}>
              Widgets
            </p>
            <div className="space-y-1">
              {widgets.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'text-white shadow-sm'
                        : 'hover:bg-opacity-10'
                    )}
                    style={isActive ? { 
                      backgroundColor: 'var(--bs-primary)',
                      color: 'white'
                    } : {
                      color: 'var(--bs-gray-500)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(93, 135, 255, 0.1)'
                        e.currentTarget.style.color = 'var(--bs-primary)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = 'var(--bs-gray-500)'
                      }
                    }}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Management Section */}
          <div className="mb-8">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider" 
               style={{ color: 'var(--bs-gray-500)' }}>
              Management
            </p>
            <div className="space-y-1">
              {management.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'text-white shadow-sm'
                        : 'hover:bg-opacity-10'
                    )}
                    style={isActive ? { 
                      backgroundColor: 'var(--bs-primary)',
                      color: 'white'
                    } : {
                      color: 'var(--bs-gray-500)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(93, 135, 255, 0.1)'
                        e.currentTarget.style.color = 'var(--bs-primary)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = 'var(--bs-gray-500)'
                      }
                    }}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className={`min-h-screen main-content ${sidebarOpen ? 'sidebar-mobile' : ''}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm border-b" 
                style={{ 
                  height: 'var(--header-height)',
                  borderColor: 'var(--bs-border-color)'
                }}>
          <div className="flex h-full items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden rounded-lg p-2 hover:bg-gray-100"
                style={{ color: 'var(--bs-gray-500)' }}
                onClick={() => setSidebarOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              
              {/* Search */}
              <div className="hidden md:flex relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" 
                                     style={{ color: 'var(--bs-gray-500)' }} />
                <input
                  type="text"
                  placeholder="Search here..."
                  className="w-96 rounded-full border px-10 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: 'var(--bs-border-color)',
                    color: 'var(--bs-body-color)',
                    borderRadius: 'var(--bs-border-radius-2xl)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--bs-primary)'
                    e.target.style.boxShadow = '0 0 0 0.2rem rgba(93, 135, 255, 0.25)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--bs-border-color)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language */}
              <button className="hidden md:flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors">
                <GlobeAltIcon className="h-4 w-4" style={{ color: 'var(--bs-gray-500)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--bs-gray-500)' }}>EN</span>
                <ChevronDownIcon className="h-4 w-4" style={{ color: 'var(--bs-gray-500)' }} />
              </button>

              {/* Theme toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
                style={{ color: 'var(--bs-gray-500)' }}
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>

              {/* Settings */}
              <button
                onClick={() => setThemeCustomizerOpen(true)}
                className="hidden md:block rounded-lg p-2 hover:bg-gray-100 transition-colors"
                style={{ color: 'var(--bs-gray-500)' }}
              >
                <Cog6ToothIcon className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <button className="relative rounded-lg p-2 hover:bg-gray-100 transition-colors">
                <BellIcon className="h-5 w-5" style={{ color: 'var(--bs-gray-500)' }} />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-xs text-white flex items-center justify-center font-medium"
                      style={{ backgroundColor: 'var(--bs-danger)' }}>
                  3
                </span>
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-full flex items-center justify-center"
                     style={{ 
                       background: 'linear-gradient(135deg, var(--bs-primary) 0%, var(--bs-secondary) 100%)'
                     }}>
                  <span className="text-sm font-semibold text-white">MA</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium" style={{ color: 'var(--bs-body-color)' }}>Mathew Anderson</p>
                  <p className="text-xs" style={{ color: 'var(--bs-gray-500)' }}>Designer</p>
                </div>
                <ChevronDownIcon className="hidden md:block h-4 w-4" style={{ color: 'var(--bs-gray-500)' }} />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Floating Settings Button */}
      <button
        onClick={() => setThemeCustomizerOpen(true)}
        className="fixed right-6 bottom-6 z-40 p-4 text-white rounded-full shadow-lg hover:scale-110 transition-all"
        style={{ backgroundColor: 'var(--bs-primary)' }}
        title="Theme Settings"
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bs-primary)'
          e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bs-primary)'
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
        }}
      >
        <Cog6ToothIcon className="h-6 w-6 transition-transform" />
      </button>

      {/* Theme Customizer */}
      <ThemeCustomizer 
        isOpen={themeCustomizerOpen} 
        onClose={() => setThemeCustomizerOpen(false)} 
      />
    </div>
  )
}
