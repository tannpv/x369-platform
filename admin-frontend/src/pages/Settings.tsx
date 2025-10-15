import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ServerIcon, 
  ShieldCheckIcon, 
  BellIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import { healthApi } from '../shared/api/services';
import Card from '../shared/components/Card';
import { PageLoading } from '../shared/components/LoadingSpinner';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('system');

  const { data: healthData, isLoading } = useQuery({
    queryKey: ['health'],
    queryFn: healthApi.checkHealth,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const tabs = [
    { id: 'system', name: 'System', icon: ServerIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
  ];

  if (isLoading) return <PageLoading />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Configure platform settings and monitor system health</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <Card title="System Health" subtitle="Monitor the status of all services">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Overall Status</h4>
                  <p className="text-sm text-gray-600">All services operational</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  healthData?.status === 'healthy' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {healthData?.status || 'Unknown'}
                </div>
              </div>

              {healthData?.services && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(healthData.services).map(([service, status]) => (
                    <div key={service} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <ServerIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="font-medium text-gray-900 capitalize">{service.replace('-', ' ')}</span>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        status === 'healthy' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card title="System Configuration" subtitle="Manage system-wide settings">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">API Rate Limiting</h4>
                  <p className="text-sm text-gray-600">Control API request rates</p>
                </div>
                <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="100">100 requests/minute</option>
                  <option value="200">200 requests/minute</option>
                  <option value="500">500 requests/minute</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Data Retention</h4>
                  <p className="text-sm text-gray-600">How long to keep historical data</p>
                </div>
                <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                  <p className="text-sm text-gray-600">Temporarily disable user access</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card title="Security Settings" subtitle="Configure authentication and authorization">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">JWT Token Expiry</h4>
                  <p className="text-sm text-gray-600">How long authentication tokens remain valid</p>
                </div>
                <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="240">4 hours</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Password Requirements</h4>
                  <p className="text-sm text-gray-600">Minimum password complexity</p>
                </div>
                <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="basic">Basic (6+ characters)</option>
                  <option value="medium">Medium (8+ with numbers)</option>
                  <option value="strong">Strong (12+ with symbols)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <Card title="Notification Settings" subtitle="Configure how and when notifications are sent">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Send notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Send push notifications to mobile devices</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Notification Batch Size</h4>
                  <p className="text-sm text-gray-600">How many notifications to send at once</p>
                </div>
                <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="10">10 notifications</option>
                  <option value="50">50 notifications</option>
                  <option value="100">100 notifications</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <Card title="Analytics Settings" subtitle="Configure data collection and reporting">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Usage Analytics</h4>
                  <p className="text-sm text-gray-600">Collect anonymous usage statistics</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Performance Monitoring</h4>
                  <p className="text-sm text-gray-600">Monitor API response times and errors</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Report Frequency</h4>
                  <p className="text-sm text-gray-600">How often to generate analytics reports</p>
                </div>
                <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Save Settings
        </button>
      </div>
    </div>
  );
}
