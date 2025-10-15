/**
 * BookingModal component for creating, editing, and viewing bookings
 */

import { useState, useEffect } from 'react'
import { CalendarIcon, UserIcon, TruckIcon, CurrencyDollarIcon, MapPinIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Modal from '../../../components/ui/Modal'
import type { 
  Booking, 
  BookingWithDetails, 
  CreateBookingPayload, 
  UpdateBookingPayload, 
  BookingStatus, 
  PaymentStatus, 
  BookingType 
} from '../../../shared/types/booking'
import type { Address } from '../../../shared/types/user'
import { 
  BOOKING_STATUS_OPTIONS, 
  PAYMENT_STATUS_OPTIONS, 
  BOOKING_TYPE_OPTIONS,
  BOOKING_STATUSES,
  PAYMENT_STATUSES,
  BOOKING_TYPES
} from '../../../shared/constants/booking'

type BookingModalMode = 'create' | 'edit' | 'view'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  mode: BookingModalMode
  booking?: BookingWithDetails | Booking
  onSubmit: (data: CreateBookingPayload | UpdateBookingPayload) => Promise<void>
  isLoading?: boolean
}

interface FormData {
  customerId: string
  vehicleId: string
  driverId: string
  type: BookingType
  startDate: string
  endDate: string
  pickupLocation: Address
  dropoffLocation: Address
  specialRequests: string
  notes: string
  status?: BookingStatus
  paymentStatus?: PaymentStatus
}

const initialFormData: FormData = {
  customerId: '',
  vehicleId: '',
  driverId: '',
  type: 'daily',
  startDate: '',
  endDate: '',
  pickupLocation: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  },
  dropoffLocation: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  },
  specialRequests: '',
  notes: ''
}

export function BookingModal({ 
  isOpen, 
  onClose, 
  mode, 
  booking, 
  onSubmit, 
  isLoading = false 
}: BookingModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isReadonly = mode === 'view'
  const isEdit = mode === 'edit'

  // Load booking data when editing or viewing
  useEffect(() => {
    if (booking && (mode === 'edit' || mode === 'view')) {
      setFormData({
        customerId: booking.customerId,
        vehicleId: booking.vehicleId,
        driverId: booking.driverId || '',
        type: booking.type,
        startDate: booking.startDate.split('T')[0], // Extract date part
        endDate: booking.endDate.split('T')[0],
        pickupLocation: booking.pickupLocation,
        dropoffLocation: booking.dropoffLocation,
        specialRequests: booking.specialRequests || '',
        notes: booking.notes || '',
        status: booking.status,
        paymentStatus: booking.paymentStatus
      })
    } else if (mode === 'create') {
      setFormData(initialFormData)
    }
    setErrors({})
  }, [booking, mode, isOpen])

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleLocationChange = (locationType: 'pickupLocation' | 'dropoffLocation', field: keyof Address, value: string) => {
    setFormData(prev => ({
      ...prev,
      [locationType]: {
        ...prev[locationType],
        [field]: value
      }
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerId.trim()) {
      newErrors.customerId = 'Customer ID is required'
    }
    if (!formData.vehicleId.trim()) {
      newErrors.vehicleId = 'Vehicle ID is required'
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date'
    }

    // Validate pickup location
    if (!formData.pickupLocation.street.trim()) {
      newErrors['pickupLocation.street'] = 'Pickup street is required'
    }
    if (!formData.pickupLocation.city.trim()) {
      newErrors['pickupLocation.city'] = 'Pickup city is required'
    }
    if (!formData.pickupLocation.state.trim()) {
      newErrors['pickupLocation.state'] = 'Pickup state is required'
    }

    // Validate dropoff location
    if (!formData.dropoffLocation.street.trim()) {
      newErrors['dropoffLocation.street'] = 'Return street is required'
    }
    if (!formData.dropoffLocation.city.trim()) {
      newErrors['dropoffLocation.city'] = 'Return city is required'
    }
    if (!formData.dropoffLocation.state.trim()) {
      newErrors['dropoffLocation.state'] = 'Return state is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      if (mode === 'create') {
        await onSubmit({
          customerId: formData.customerId,
          vehicleId: formData.vehicleId,
          driverId: formData.driverId || undefined,
          type: formData.type,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          pickupLocation: formData.pickupLocation,
          dropoffLocation: formData.dropoffLocation,
          specialRequests: formData.specialRequests || undefined,
          notes: formData.notes || undefined
        })
      } else if (mode === 'edit') {
        await onSubmit({
          customerId: formData.customerId,
          vehicleId: formData.vehicleId,
          driverId: formData.driverId || undefined,
          type: formData.type,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          pickupLocation: formData.pickupLocation,
          dropoffLocation: formData.dropoffLocation,
          specialRequests: formData.specialRequests || undefined,
          notes: formData.notes || undefined,
          status: formData.status,
          paymentStatus: formData.paymentStatus
        })
      }
      onClose()
    } catch (error) {
      console.error('Failed to submit booking:', error)
    }
  }

  const getModalTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create New Booking'
      case 'edit':
        return `Edit Booking #${booking?.id.slice(-8).toUpperCase()}`
      case 'view':
        return `Booking Details #${booking?.id.slice(-8).toUpperCase()}`
      default:
        return 'Booking'
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Booking Status (Edit/View only) */}
        {(isEdit || isReadonly) && booking && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Status
              </label>
              {isReadonly ? (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                  {BOOKING_STATUSES[booking.status]}
                </div>
              ) : (
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {BOOKING_STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              {isReadonly ? (
                <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                  {PAYMENT_STATUSES[booking.paymentStatus]}
                </div>
              ) : (
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {PAYMENT_STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}

        {/* Customer and Vehicle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <UserIcon className="inline h-4 w-4 mr-1" />
              Customer ID *
            </label>
            <input
              type="text"
              value={formData.customerId}
              onChange={(e) => handleInputChange('customerId', e.target.value)}
              disabled={isReadonly}
              className={clsx(
                "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                errors.customerId ? "border-red-300" : "border-gray-300",
                isReadonly && "bg-gray-50"
              )}
              placeholder="Enter customer ID"
            />
            {errors.customerId && (
              <p className="mt-1 text-sm text-red-600">{errors.customerId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TruckIcon className="inline h-4 w-4 mr-1" />
              Vehicle ID *
            </label>
            <input
              type="text"
              value={formData.vehicleId}
              onChange={(e) => handleInputChange('vehicleId', e.target.value)}
              disabled={isReadonly}
              className={clsx(
                "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                errors.vehicleId ? "border-red-300" : "border-gray-300",
                isReadonly && "bg-gray-50"
              )}
              placeholder="Enter vehicle ID"
            />
            {errors.vehicleId && (
              <p className="mt-1 text-sm text-red-600">{errors.vehicleId}</p>
            )}
          </div>
        </div>

        {/* Driver and Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Driver ID (Optional)
            </label>
            <input
              type="text"
              value={formData.driverId}
              onChange={(e) => handleInputChange('driverId', e.target.value)}
              disabled={isReadonly}
              className={clsx(
                "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                isReadonly && "bg-gray-50"
              )}
              placeholder="Enter driver ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Booking Type *
            </label>
            {isReadonly ? (
              <div className="px-3 py-2 bg-gray-50 rounded-md text-sm">
                {BOOKING_TYPES[formData.type]}
              </div>
            ) : (
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {BOOKING_TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="inline h-4 w-4 mr-1" />
              Start Date *
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              disabled={isReadonly}
              className={clsx(
                "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                errors.startDate ? "border-red-300" : "border-gray-300",
                isReadonly && "bg-gray-50"
              )}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="inline h-4 w-4 mr-1" />
              End Date *
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              disabled={isReadonly}
              className={clsx(
                "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                errors.endDate ? "border-red-300" : "border-gray-300",
                isReadonly && "bg-gray-50"
              )}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
            )}
          </div>
        </div>

        {/* Pickup Location */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <MapPinIcon className="h-4 w-4 mr-2" />
            Pickup Location *
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                value={formData.pickupLocation.street}
                onChange={(e) => handleLocationChange('pickupLocation', 'street', e.target.value)}
                disabled={isReadonly}
                className={clsx(
                  "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  errors['pickupLocation.street'] ? "border-red-300" : "border-gray-300",
                  isReadonly && "bg-gray-50"
                )}
                placeholder="Enter street address"
              />
              {errors['pickupLocation.street'] && (
                <p className="mt-1 text-sm text-red-600">{errors['pickupLocation.street']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.pickupLocation.city}
                onChange={(e) => handleLocationChange('pickupLocation', 'city', e.target.value)}
                disabled={isReadonly}
                className={clsx(
                  "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  errors['pickupLocation.city'] ? "border-red-300" : "border-gray-300",
                  isReadonly && "bg-gray-50"
                )}
                placeholder="Enter city"
              />
              {errors['pickupLocation.city'] && (
                <p className="mt-1 text-sm text-red-600">{errors['pickupLocation.city']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                value={formData.pickupLocation.state}
                onChange={(e) => handleLocationChange('pickupLocation', 'state', e.target.value)}
                disabled={isReadonly}
                className={clsx(
                  "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  errors['pickupLocation.state'] ? "border-red-300" : "border-gray-300",
                  isReadonly && "bg-gray-50"
                )}
                placeholder="Enter state"
              />
              {errors['pickupLocation.state'] && (
                <p className="mt-1 text-sm text-red-600">{errors['pickupLocation.state']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={formData.pickupLocation.zipCode}
                onChange={(e) => handleLocationChange('pickupLocation', 'zipCode', e.target.value)}
                disabled={isReadonly}
                className={clsx(
                  "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  isReadonly && "bg-gray-50"
                )}
                placeholder="Enter ZIP code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.pickupLocation.country}
                onChange={(e) => handleLocationChange('pickupLocation', 'country', e.target.value)}
                disabled={isReadonly}
                className={clsx(
                  "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  isReadonly && "bg-gray-50"
                )}
                placeholder="Enter country"
              />
            </div>
          </div>
        </div>

        {/* Return/Dropoff Location */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <MapPinIcon className="h-4 w-4 mr-2" />
            Return Location *
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                value={formData.dropoffLocation.street}
                onChange={(e) => handleLocationChange('dropoffLocation', 'street', e.target.value)}
                disabled={isReadonly}
                className={clsx(
                  "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  errors['dropoffLocation.street'] ? "border-red-300" : "border-gray-300",
                  isReadonly && "bg-gray-50"
                )}
                placeholder="Enter street address"
              />
              {errors['dropoffLocation.street'] && (
                <p className="mt-1 text-sm text-red-600">{errors['dropoffLocation.street']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.dropoffLocation.city}
                onChange={(e) => handleLocationChange('dropoffLocation', 'city', e.target.value)}
                disabled={isReadonly}
                className={clsx(
                  "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  errors['dropoffLocation.city'] ? "border-red-300" : "border-gray-300",
                  isReadonly && "bg-gray-50"
                )}
                placeholder="Enter city"
              />
              {errors['dropoffLocation.city'] && (
                <p className="mt-1 text-sm text-red-600">{errors['dropoffLocation.city']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                value={formData.dropoffLocation.state}
                onChange={(e) => handleLocationChange('dropoffLocation', 'state', e.target.value)}
                disabled={isReadonly}
                className={clsx(
                  "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  errors['dropoffLocation.state'] ? "border-red-300" : "border-gray-300",
                  isReadonly && "bg-gray-50"
                )}
                placeholder="Enter state"
              />
              {errors['dropoffLocation.state'] && (
                <p className="mt-1 text-sm text-red-600">{errors['dropoffLocation.state']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={formData.dropoffLocation.zipCode}
                onChange={(e) => handleLocationChange('dropoffLocation', 'zipCode', e.target.value)}
                disabled={isReadonly}
                className={clsx(
                  "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  isReadonly && "bg-gray-50"
                )}
                placeholder="Enter ZIP code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.dropoffLocation.country}
                onChange={(e) => handleLocationChange('dropoffLocation', 'country', e.target.value)}
                disabled={isReadonly}
                className={clsx(
                  "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  isReadonly && "bg-gray-50"
                )}
                placeholder="Enter country"
              />
            </div>
          </div>
        </div>

        {/* Special Requests and Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              disabled={isReadonly}
              rows={3}
              className={clsx(
                "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                isReadonly && "bg-gray-50"
              )}
              placeholder="Enter any special requests..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Internal Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              disabled={isReadonly}
              rows={3}
              className={clsx(
                "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                isReadonly && "bg-gray-50"
              )}
              placeholder="Enter internal notes..."
            />
          </div>
        </div>

        {/* Amount Display (View/Edit only) */}
        {booking && (isEdit || isReadonly) && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Total Amount</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                ${booking.totalAmount.toFixed(2)}
              </span>
            </div>
            {booking.baseRate && (
              <div className="mt-2 text-xs text-gray-600">
                Base rate: ${booking.baseRate}/hour • Duration: {booking.duration}h
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isReadonly ? 'Close' : 'Cancel'}
          </button>
          
          {!isReadonly && (
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : (mode === 'create' ? 'Create Booking' : 'Update Booking')}
            </button>
          )}
        </div>
      </form>
    </Modal>
  )
}
