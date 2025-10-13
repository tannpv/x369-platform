import { Routes, Route } from 'react-router-dom'
import ModernizeLayoutNew from './components/ModernizeLayoutNew'
import ModernizeDashboardNew from './pages/ModernizeDashboardNew'
import EcommerceDashboard from './pages/EcommerceDashboard'
import WidgetsPage from './pages/WidgetsPage'
import { VehicleManagementPage } from './features/vehicles'
import { UserManagementPage } from './features/users'

// Placeholder components for other pages
function Analytics() {
  return (
    <div className="space-y-6">
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Advanced Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Coming soon - Advanced analytics and reporting</p>
        </div>
        <div className="admin-card-body">
          <div className="h-96 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pro Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400">Advanced reporting features coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Users() {
  return (
    <div className="space-y-6">
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your platform users</p>
        </div>
        <div className="admin-card-body">
          <div className="h-96 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">User Management</h3>
              <p className="text-gray-600 dark:text-gray-400">User management features in development</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



function Bookings() {
  return (
    <div className="space-y-6">
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Booking Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Handle customer bookings and reservations</p>
        </div>
        <div className="admin-card-body">
          <div className="h-96 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Booking System</h3>
              <p className="text-gray-600 dark:text-gray-400">Comprehensive booking management in progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GenericPage({ title, description, emoji, gradient }: { title: string, description: string, emoji: string, gradient: string }) {
  return (
    <div className="space-y-6">
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        <div className="admin-card-body">
          <div className={`h-96 ${gradient} rounded-lg flex items-center justify-center`}>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">{emoji}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400">Feature in development</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<ModernizeLayoutNew />}>
        <Route index element={<ModernizeDashboardNew />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="ecommerce" element={<EcommerceDashboard />} />
        <Route path="apps/chats" element={<GenericPage title="Chat Application" description="Real-time messaging" emoji="💬" gradient="bg-gradient-to-r from-blue-50 to-cyan-50" />} />
        <Route path="apps/calendar" element={<GenericPage title="Calendar" description="Schedule and events" emoji="📅" gradient="bg-gradient-to-r from-purple-50 to-pink-50" />} />
        <Route path="apps/email" element={<GenericPage title="Email" description="Email management" emoji="📧" gradient="bg-gradient-to-r from-green-50 to-emerald-50" />} />
        <Route path="apps/notes" element={<GenericPage title="Notes" description="Take notes" emoji="📝" gradient="bg-gradient-to-r from-yellow-50 to-orange-50" />} />
        <Route path="apps/contacts" element={<GenericPage title="Contacts" description="Contact management" emoji="👥" gradient="bg-gradient-to-r from-indigo-50 to-blue-50" />} />
        <Route path="apps/tickets" element={<GenericPage title="Tickets" description="Support tickets" emoji="🎫" gradient="bg-gradient-to-r from-red-50 to-pink-50" />} />
        <Route path="widgets" element={<WidgetsPage />} />
        <Route path="pages/pricing" element={<GenericPage title="Pricing" description="Pricing plans" emoji="💰" gradient="bg-gradient-to-r from-green-50 to-teal-50" />} />
        <Route path="pages/account" element={<GenericPage title="Account Settings" description="User settings" emoji="⚙️" gradient="bg-gradient-to-r from-gray-50 to-slate-50" />} />
        <Route path="pages/faq" element={<GenericPage title="FAQ" description="Frequently asked questions" emoji="❓" gradient="bg-gradient-to-r from-violet-50 to-purple-50" />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="vehicles" element={<VehicleManagementPage />} />
        <Route path="bookings" element={<Bookings />} />
        <Route 
          path="payments" 
          element={
            <GenericPage 
              title="Payment Management" 
              description="Handle payments and transactions"
              emoji="💳"
              gradient="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
            />
          } 
        />
        <Route 
          path="reports" 
          element={
            <GenericPage 
              title="Reports & Analytics" 
              description="Generate comprehensive business reports"
              emoji="📊"
              gradient="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
            />
          } 
        />
        <Route 
          path="security" 
          element={
            <GenericPage 
              title="Security & Access Control" 
              description="Manage system security and user permissions"
              emoji="🔒"
              gradient="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20"
            />
          } 
        />
        <Route 
          path="notifications" 
          element={
            <GenericPage 
              title="Notification Center" 
              description="Manage system notifications and alerts"
              emoji="🔔"
              gradient="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20"
            />
          } 
        />
        <Route 
          path="settings" 
          element={
            <GenericPage 
              title="System Settings" 
              description="Configure system preferences and options"
              emoji="⚙️"
              gradient="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20"
            />
          } 
        />
      </Route>
    </Routes>
  )
}

export default App
