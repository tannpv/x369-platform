import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  TruckIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  BellIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Vehicles', href: '/vehicles', icon: TruckIcon },
  { name: 'Bookings', href: '/bookings', icon: CalendarIcon },
  { name: 'Users', href: '/users', icon: UserGroupIcon },
  { name: 'Notifications', href: '/notifications', icon: BellIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const getCurrentPageName = () => {
    const currentRoute = navigation.find(item => item.href === location.pathname);
    return currentRoute?.name || 'Dashboard';
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-slate-50'}`}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-72'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r shadow-xl`}>
          {/* Logo Section */}
          <div className={`flex items-center justify-between h-16 px-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-r from-blue-600 to-blue-700'} border-b`}>
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <TruckIcon className="w-5 h-5 text-blue-600" />
                </div>
                <h1 className="text-xl font-bold text-white">AutoRent Pro</h1>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-white/20 text-white'}`}
            >
              <ChevronLeftIcon className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? `${darkMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-600 text-white shadow-lg shadow-blue-200'}`
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                  }`}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <item.icon className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'} ${isActive ? 'text-white' : ''}`} />
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                  {!sidebarCollapsed && isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-80"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Section */}
          {!sidebarCollapsed && (
            <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-sm font-bold text-white">AD</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Admin User
                  </p>
                  <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    admin@autorent.com
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className={`h-16 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center space-x-4">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {getCurrentPageName()}
                </h2>
                <div className={`hidden md:block h-6 w-px ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                <p className={`hidden md:block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Self-Driving Car Rental Platform
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search Bar */}
                <div className="relative hidden md:block">
                  <MagnifyingGlassIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className={`pl-10 pr-4 py-2 w-80 text-sm rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors`}
                  />
                </div>

                {/* Theme Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                </button>

                {/* Notifications */}
                <button className={`relative p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <BellIcon className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">3</span>
                  </div>
                </button>

                {/* User Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                  <span className="text-sm font-bold text-white">AD</span>
                </div>
              </div>
            </div>
          </header>

          <main className={`flex-1 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
