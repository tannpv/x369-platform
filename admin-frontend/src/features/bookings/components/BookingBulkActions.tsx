/**
 * BookingBulkActions component for performing bulk operations on bookings
 */

import { useState } from 'react'
import { 
  TrashIcon, 
  PencilSquareIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import type { Booking, BookingStatus, PaymentStatus } from '../../../shared/types/booking'
import { BOOKING_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from '../../../shared/constants/booking'

interface BookingBulkActionsProps {
  selectedBookings: string[]
  onBulkDelete: (ids: string[]) => Promise<void>
  onBulkUpdate: (ids: string[], data: Partial<Booking>) => Promise<void>
  onClearSelection: () => void
  isLoading?: boolean
}

export function BookingBulkActions({ 
  selectedBookings, 
  onBulkDelete, 
  onBulkUpdate, 
  onClearSelection,
  isLoading = false 
}: BookingBulkActionsProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showStatusUpdate, setShowStatusUpdate] = useState(false)
  const [showPaymentUpdate, setShowPaymentUpdate] = useState(false)

  if (selectedBookings.length === 0) {
    return null
  }

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedBookings.length} booking(s)? This action cannot be undone.`)) {
      await onBulkDelete(selectedBookings)
      onClearSelection()
    }
  }

  const handleStatusUpdate = async (status: BookingStatus) => {
    if (window.confirm(`Are you sure you want to update ${selectedBookings.length} booking(s) to "${status}" status?`)) {
      await onBulkUpdate(selectedBookings, { status })
      onClearSelection()
      setShowStatusUpdate(false)
    }
  }

  const handlePaymentUpdate = async (paymentStatus: PaymentStatus) => {
    if (window.confirm(`Are you sure you want to update ${selectedBookings.length} booking(s) payment status to "${paymentStatus}"?`)) {
      await onBulkUpdate(selectedBookings, { paymentStatus })
      onClearSelection()
      setShowPaymentUpdate(false)
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              {selectedBookings.length} booking{selectedBookings.length !== 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              disabled={isLoading}
              className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <PencilSquareIcon className="h-4 w-4" />
              Bulk Actions
              <ChevronDownIcon className="h-4 w-4" />
            </button>

            {showDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowStatusUpdate(true)
                      setShowDropdown(false)
                    }}
                    disabled={isLoading}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() => {
                      setShowPaymentUpdate(true)
                      setShowDropdown(false)
                    }}
                    disabled={isLoading}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Update Payment Status
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleBulkDelete}
                    disabled={isLoading}
                    className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleBulkDelete}
            disabled={isLoading}
            className="inline-flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <TrashIcon className="h-4 w-4" />
            Delete ({selectedBookings.length})
          </button>
        </div>

        <button
          onClick={onClearSelection}
          disabled={isLoading}
          className="inline-flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          <XCircleIcon className="h-4 w-4" />
          Clear Selection
        </button>
      </div>

      {/* Status Update Modal */}
      {showStatusUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Update Booking Status
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Select a new status for {selectedBookings.length} selected booking(s):
            </p>
            <div className="space-y-2 mb-6">
              {BOOKING_STATUS_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleStatusUpdate(option.value as BookingStatus)}
                  disabled={isLoading}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowStatusUpdate(false)}
                disabled={isLoading}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Status Update Modal */}
      {showPaymentUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Update Payment Status
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Select a new payment status for {selectedBookings.length} selected booking(s):
            </p>
            <div className="space-y-2 mb-6">
              {PAYMENT_STATUS_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => handlePaymentUpdate(option.value as PaymentStatus)}
                  disabled={isLoading}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPaymentUpdate(false)}
                disabled={isLoading}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
