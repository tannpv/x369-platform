import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  ChartBarIcon,
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
  XMarkIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ChevronDownIcon,
  TruckIcon,
  SunIcon,
  MoonIcon,
  PuzzlePieceIcon,
} from '@heroicons/react/24/outline'
import ThemeCustomizer from './ThemeCustomizer'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<any>
  badge?: string | number
  current?: boolean
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
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
  { name: 'Widgets', href: '/widgets', icon: PuzzlePieceIcon },
  { name: 'Pricing', href: '/pages/pricing', icon: CreditCardIcon },
  { name: 'Account Setting', href: '/pages/account', icon: Cog6ToothIcon },
  { name: 'FAQ', href: '/pages/faq', icon: QuestionMarkCircleIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ModernizeLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [themeCustomizerOpen, setThemeCustomizerOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#ecf2ff]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={classNames(
        'fixed inset-y-0 left-0 z-50 w-[270px] transform bg-[#2a3547] transition-transform duration-300 ease-in-out lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="flex h-[70px] items-center px-6 border-b border-[#3a4553]">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5d87ff]">
              <TruckIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Modernize</h1>
              <p className="text-xs text-[#7c8fac]">Admin Template</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          {/* Dashboard Section */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-[#7c8fac] uppercase tracking-wider mb-3">
              Dashboard
            </p>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    isActive
                      ? 'bg-[#5d87ff] text-white shadow-sm'
                      : 'text-[#7c8fac] hover:bg-[#3a4553] hover:text-white',
                    'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150'
                  )}
                >
                  <item.icon
                    className={classNames(
                      isActive ? 'text-white' : 'text-[#7c8fac] group-hover:text-white',
                      'mr-3 h-5 w-5 flex-shrink-0'
                    )}
                  />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className={classNames(
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-[#3a4553] text-[#7c8fac]',
                      'ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium'
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Apps Section */}
          <div className="mt-8 space-y-1">
            <p className="px-3 text-xs font-semibold text-[#7c8fac] uppercase tracking-wider mb-3">
              Apps
            </p>
            {apps.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    isActive
                      ? 'bg-[#5d87ff] text-white shadow-sm'
                      : 'text-[#7c8fac] hover:bg-[#3a4553] hover:text-white',
                    'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150'
                  )}
                >
                  <item.icon
                    className={classNames(
                      isActive ? 'text-white' : 'text-[#7c8fac] group-hover:text-white',
                      'mr-3 h-5 w-5 flex-shrink-0'
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Pages Section */}
          <div className="mt-8 space-y-1">
            <p className="px-3 text-xs font-semibold text-[#7c8fac] uppercase tracking-wider mb-3">
              Pages
            </p>
            {pages.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    isActive
                      ? 'bg-[#5d87ff] text-white shadow-sm'
                      : 'text-[#7c8fac] hover:bg-[#3a4553] hover:text-white',
                    'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150'
                  )}
                >
                  <item.icon
                    className={classNames(
                      isActive ? 'text-white' : 'text-[#7c8fac] group-hover:text-white',
                      'mr-3 h-5 w-5 flex-shrink-0'
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-[270px]">
        {/* Header */}
        <header className="sticky top-0 z-30 h-[70px] bg-white border-b border-[#e5eaef] shadow-sm">
          <div className="flex h-full items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden rounded-lg p-2 text-[#5a6a85] hover:bg-[#ecf2ff]"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              
              {/* Search */}
              <div className="hidden md:flex relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5a6a85]" />
                <input
                  type="text"
                  placeholder="Search here..."
                  className="w-96 rounded-full border border-[#e5eaef] bg-white pl-10 pr-4 py-2.5 text-sm text-[#2a3547] placeholder-[#5a6a85] focus:border-[#5d87ff] focus:outline-none focus:ring-1 focus:ring-[#5d87ff]"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick Actions - Hidden on small screens */}
              <div className="hidden lg:flex items-center space-x-1 mr-4">
                <Link
                  to="/apps/chats"
                  className="flex items-center space-x-2 rounded-lg px-3 py-2 text-[#5a6a85] hover:bg-[#ecf2ff] transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  <span className="text-xs">Chats</span>
                  <span className="bg-[#fa896b] text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
                </Link>
                <Link
                  to="/apps/email"
                  className="flex items-center space-x-2 rounded-lg px-3 py-2 text-[#5a6a85] hover:bg-[#ecf2ff] transition-colors"
                >
                  <InboxIcon className="h-4 w-4" />
                  <span className="text-xs">Inbox</span>
                  <span className="bg-[#13deb9] text-white text-xs px-1.5 py-0.5 rounded-full">5</span>
                </Link>
              </div>

              {/* Language */}
              <button className="hidden md:flex items-center space-x-2 rounded-lg px-3 py-2 text-[#5a6a85] hover:bg-[#ecf2ff]">
                <span className="text-sm font-medium">EN</span>
                <ChevronDownIcon className="h-4 w-4" />
              </button>

              {/* Theme toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-lg p-2 text-[#5a6a85] hover:bg-[#ecf2ff]"
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
                className="hidden md:block rounded-lg p-2 text-[#5a6a85] hover:bg-[#ecf2ff] transition-colors"
              >
                <Cog6ToothIcon className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <button className="relative rounded-lg p-2 text-[#5a6a85] hover:bg-[#ecf2ff]">
                <BellIcon className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#fa896b] text-xs text-white flex items-center justify-center font-medium pulse-notification">
                  3
                </span>
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-r from-[#5d87ff] to-[#49beff] flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">JD</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-[#2a3547]">Mathew Anderson</p>
                  <p className="text-xs text-[#5a6a85]">Designer</p>
                </div>
                <ChevronDownIcon className="hidden md:block h-4 w-4 text-[#5a6a85]" />
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
        className="fixed right-6 bottom-6 z-40 p-4 bg-[#5d87ff] text-white rounded-full shadow-lg hover:bg-[#4570ea] transition-all hover:scale-110 hover:rotate-90 group"
        title="Theme Settings"
      >
        <Cog6ToothIcon className="h-6 w-6 transition-transform group-hover:rotate-180" />
      </button>

      {/* Theme Customizer */}
      <ThemeCustomizer 
        isOpen={themeCustomizerOpen} 
        onClose={() => setThemeCustomizerOpen(false)} 
      />
    </div>
  )
}
