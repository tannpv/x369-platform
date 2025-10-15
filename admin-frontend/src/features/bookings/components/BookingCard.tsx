/**
 * BookingCard component for displaying booking summary information
 */

import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  CalendarIcon, 
  UserIcon, 
  TruckIcon, 
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { formatDistanceToNow, format } from 'date-fns'
import clsx from 'clsx'
import type { Booking, BookingWithDetails } from '../../../shared/types/booking'
import { 
  BOOKING_STATUSES, 
  PAYMENT_STATUSES, 
  BOOKING_TYPES,
  BOOKING_STATUS_COLORS, 
  PAYMENT_STATUS_COLORS 
} from '../../../shared/constants/booking'

interface BookingCardProps {
  booking: BookingWithDetails | Booking
  onView: (booking: BookingWithDetails | Booking) => void
  onEdit: (booking: BookingWithDetails | Booking) => void
  onDelete: (booking: BookingWithDetails | Booking) => void
  isLoading?: boolean
  className?: string
}

export function BookingCard({ 
  booking, 
  onView, 
  onEdit, 
  onDelete, 
  isLoading = false,
  className 
}: BookingCardProps) {
  const statusColor = BOOKING_STATUS_COLORS[booking.status]
  const paymentColor = PAYMENT_STATUS_COLORS[booking.paymentStatus]
  
  const totalDays = Math.ceil(
    (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)
  )

  const formatDate = (date: string) => format(new Date(date), 'MMM d, yyyy')
  const formatDateTime = (date: string) => format(new Date(date), 'MMM d, yyyy h:mm a')

  return (
    <div className={clsx(
      "bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow",
      isLoading && "opacity-50 pointer-events-none",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Booking #{booking.id.slice(-8).toUpperCase()}
              </h3>
              <span className={clsx(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                statusColor
              )}>
                {BOOKING_STATUSES[booking.status]}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Created {booking.createdAt ? formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true }) : 'Recently'}
            </p>
          </div>
          
          <div className="flex items-center gap-1 ml-4">
            <button
              onClick={() => onView(booking)}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
              title="View booking"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => onEdit(booking)}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors disabled:opacity-50"
              title="Edit booking"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(booking)}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              title="Delete booking"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer & Vehicle Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {'customer' in booking && booking.customer 
                    ? `${booking.customer.firstName} ${booking.customer.lastName}`
                    : `Customer #${booking.customerId}`
                  }
                </p>
                <p className="text-xs text-gray-500">
                  {'customer' in booking && booking.customer 
                    ? booking.customer.email
                    : booking.customerId
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <TruckIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {'vehicle' in booking && booking.vehicle 
                    ? `${booking.vehicle.make} ${booking.vehicle.model}`
                    : `Vehicle #${booking.vehicleId}`
                  }
                </p>
                <p className="text-xs text-gray-500">
                  {'vehicle' in booking && booking.vehicle 
                    ? `${booking.vehicle.year} • ${booking.vehicle.licensePlate}`
                    : booking.vehicleId
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                </p>
                <p className="text-xs text-gray-500">
                  {totalDays} day{totalDays !== 1 ? 's' : ''} • {BOOKING_TYPES[booking.type]}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <CurrencyDollarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  ${booking.totalAmount.toFixed(2)}
                </p>
                <div className="flex items-center gap-1">
                  <span className={clsx(
                    "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium",
                    paymentColor
                  )}>
                    {PAYMENT_STATUSES[booking.paymentStatus]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Times */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              <span>Pickup: {formatDateTime(booking.startDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              <span>Return: {formatDateTime(booking.endDate)}</span>
            </div>
          </div>
        </div>

        {/* Special Requests */}
        {booking.specialRequests && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Special Requests:</span> {booking.specialRequests}
            </p>
          </div>
        )}

        {/* Driver Info */}
        {booking.driverId && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Driver:</span>{' '}
              {'driver' in booking && booking.driver 
                ? `${booking.driver.firstName} ${booking.driver.lastName}${booking.driver.phone ? ` (${booking.driver.phone})` : ''}`
                : `Driver #${booking.driverId}`
              }
            </p>
          </div>
        )}

        {/* Location Info */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              <span className="font-medium">Pickup:</span> {booking.pickupLocation.city}, {booking.pickupLocation.state}
            </div>
            <div>
              <span className="font-medium">Return:</span> {booking.dropoffLocation.city}, {booking.dropoffLocation.state}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
