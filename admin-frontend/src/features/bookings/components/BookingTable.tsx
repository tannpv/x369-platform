/**
 * BookingTable component for displaying bookings in a table format
 */

import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  ChevronUpDownIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import clsx from 'clsx'
import type { BookingWithDetails, Booking } from '../../../shared/types/booking'
import { 
  BOOKING_STATUSES, 
  PAYMENT_STATUSES, 
  BOOKING_TYPES,
  BOOKING_STATUS_COLORS, 
  PAYMENT_STATUS_COLORS 
} from '../../../shared/constants/booking'

interface BookingTableProps {
  bookings: (BookingWithDetails | Booking)[]
  onView: (booking: BookingWithDetails | Booking) => void
  onEdit: (booking: BookingWithDetails | Booking) => void
  onDelete: (booking: BookingWithDetails | Booking) => void
  onSort?: (field: string) => void
  sortField?: string
  sortDirection?: 'asc' | 'desc'
  isLoading?: boolean
}

export function BookingTable({ 
  bookings, 
  onView, 
  onEdit, 
  onDelete, 
  onSort,
  sortField,
  sortDirection,
  isLoading = false 
}: BookingTableProps) {
  const formatDate = (date: string) => format(new Date(date), 'MMM d, yyyy')
  const formatDateTime = (date: string) => format(new Date(date), 'MMM d, h:mm a')

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
    }
    return (
      <ChevronUpDownIcon 
        className={clsx(
          "h-4 w-4",
          sortDirection === 'asc' ? 'text-blue-600 rotate-180' : 'text-blue-600'
        )} 
      />
    )
  }

  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center gap-1">
                  Booking ID
                  {getSortIcon('id')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('customer')}
              >
                <div className="flex items-center gap-1">
                  Customer
                  {getSortIcon('customer')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('vehicle')}
              >
                <div className="flex items-center gap-1">
                  Vehicle
                  {getSortIcon('vehicle')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('startDate')}
              >
                <div className="flex items-center gap-1">
                  Dates
                  {getSortIcon('startDate')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('totalAmount')}
              >
                <div className="flex items-center gap-1">
                  Amount
                  {getSortIcon('totalAmount')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  {getSortIcon('status')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('paymentStatus')}
              >
                <div className="flex items-center gap-1">
                  Payment
                  {getSortIcon('paymentStatus')}
                </div>
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => {
              const statusColor = BOOKING_STATUS_COLORS[booking.status]
              const paymentColor = PAYMENT_STATUS_COLORS[booking.paymentStatus]
              
              return (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{booking.id.slice(-8).toUpperCase()}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {'customer' in booking && booking.customer 
                        ? `${booking.customer.firstName} ${booking.customer.lastName}`
                        : `Customer #${booking.customerId}`
                      }
                    </div>
                    <div className="text-sm text-gray-500">
                      {'customer' in booking && booking.customer 
                        ? booking.customer.email
                        : booking.customerId
                      }
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {'vehicle' in booking && booking.vehicle 
                        ? `${booking.vehicle.make} ${booking.vehicle.model}`
                        : `Vehicle #${booking.vehicleId}`
                      }
                    </div>
                    <div className="text-sm text-gray-500">
                      {'vehicle' in booking && booking.vehicle 
                        ? `${booking.vehicle.year} • ${booking.vehicle.licensePlate}`
                        : booking.vehicleId
                      }
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {BOOKING_TYPES[booking.type]}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${booking.totalAmount.toFixed(2)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      statusColor
                    )}>
                      {BOOKING_STATUSES[booking.status]}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      paymentColor
                    )}>
                      {PAYMENT_STATUSES[booking.paymentStatus]}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onView(booking)}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="View booking"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(booking)}
                        className="p-1 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors"
                        title="Edit booking"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(booking)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete booking"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {bookings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No bookings found</div>
        </div>
      )}
    </div>
  )
}
