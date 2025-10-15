/**
 * BookingFilters component for advanced booking filtering
 */

import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  CalendarIcon, 
  CurrencyDollarIcon, 
  UserIcon, 
  TruckIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline'
import type { BookingFilters as BookingFiltersType } from '../../../shared/types/booking'
import { BOOKING_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS, BOOKING_TYPE_OPTIONS } from '../../../shared/constants/booking'
import type { SelectOption } from '../../../shared/types/common'

interface BookingFiltersProps {
  filters: BookingFiltersType
  onFiltersChange: (filters: BookingFiltersType) => void
  onClearFilters: () => void
  isLoading?: boolean
}

export function BookingFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  isLoading = false 
}: BookingFiltersProps) {
  const handleInputChange = (key: keyof BookingFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== '' && value !== 'all'
  )

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            disabled={isLoading}
            className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
          >
            <XMarkIcon className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Search Query */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Bookings
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, customer, vehicle, or special requests..."
              value={filters.query || ''}
              onChange={(e) => handleInputChange('query', e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status || 'all'}
            onChange={(e) => handleInputChange('status', e.target.value === 'all' ? undefined : e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="all">All Statuses</option>
            {BOOKING_STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Status
          </label>
          <select
            value={filters.paymentStatus || 'all'}
            onChange={(e) => handleInputChange('paymentStatus', e.target.value === 'all' ? undefined : e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="all">All Payment Statuses</option>
            {PAYMENT_STATUS_OPTIONS.map((option: SelectOption) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Booking Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Booking Type
          </label>
          <select
            value={filters.type || 'all'}
            onChange={(e) => handleInputChange('type', e.target.value === 'all' ? undefined : e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="all">All Types</option>
            {BOOKING_TYPE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CalendarIcon className="inline h-4 w-4 mr-1" />
            Start Date From
          </label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        {/* End Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CalendarIcon className="inline h-4 w-4 mr-1" />
            End Date To
          </label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        {/* Min Amount Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CurrencyDollarIcon className="inline h-4 w-4 mr-1" />
            Min Amount
          </label>
          <input
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={filters.minAmount || ''}
            onChange={(e) => handleInputChange('minAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        {/* Max Amount Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CurrencyDollarIcon className="inline h-4 w-4 mr-1" />
            Max Amount
          </label>
          <input
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={filters.maxAmount || ''}
            onChange={(e) => handleInputChange('maxAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        {/* Customer ID Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <UserIcon className="inline h-4 w-4 mr-1" />
            Customer ID
          </label>
          <input
            type="text"
            placeholder="Enter customer ID"
            value={filters.customerId || ''}
            onChange={(e) => handleInputChange('customerId', e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        {/* Vehicle ID Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <TruckIcon className="inline h-4 w-4 mr-1" />
            Vehicle ID
          </label>
          <input
            type="text"
            placeholder="Enter vehicle ID"
            value={filters.vehicleId || ''}
            onChange={(e) => handleInputChange('vehicleId', e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>

        {/* Driver ID Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <UserIcon className="inline h-4 w-4 mr-1" />
            Driver ID
          </label>
          <input
            type="text"
            placeholder="Enter driver ID"
            value={filters.driverId || ''}
            onChange={(e) => handleInputChange('driverId', e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.query && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                Search: "{filters.query}"
                <button
                  onClick={() => handleInputChange('query', undefined)}
                  className="ml-1 hover:text-blue-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                Status: {BOOKING_STATUS_OPTIONS.find(o => o.value === filters.status)?.label}
                <button
                  onClick={() => handleInputChange('status', undefined)}
                  className="ml-1 hover:text-green-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.paymentStatus && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-md">
                Payment: {PAYMENT_STATUS_OPTIONS.find((o: SelectOption) => o.value === filters.paymentStatus)?.label}
                <button
                  onClick={() => handleInputChange('paymentStatus', undefined)}
                  className="ml-1 hover:text-yellow-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.type && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md">
                Type: {BOOKING_TYPE_OPTIONS.find((o: SelectOption) => o.value === filters.type)?.label}
                <button
                  onClick={() => handleInputChange('type', undefined)}
                  className="ml-1 hover:text-purple-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {(filters.minAmount || filters.maxAmount) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-md">
                Amount: ${filters.minAmount || '0'} - ${filters.maxAmount || '∞'}
                <button
                  onClick={() => {
                    handleInputChange('minAmount', undefined)
                    handleInputChange('maxAmount', undefined)
                  }}
                  className="ml-1 hover:text-indigo-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
