/**
 * BookingCalendar component for displaying bookings in a calendar view
 */

import { useState } from 'react'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CalendarIcon 
} from '@heroicons/react/24/outline'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns'
import clsx from 'clsx'
import type { BookingWithDetails, Booking } from '../../../shared/types/booking'
import { BOOKING_STATUS_COLORS } from '../../../shared/constants/booking'

interface BookingCalendarProps {
  bookings: (BookingWithDetails | Booking)[]
  onBookingClick: (booking: BookingWithDetails | Booking) => void
  onDateClick?: (date: Date) => void
  isLoading?: boolean
}

export function BookingCalendar({ 
  bookings, 
  onBookingClick, 
  onDateClick,
  isLoading = false 
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => {
      const startDate = new Date(booking.startDate)
      const endDate = new Date(booking.endDate)
      return date >= startDate && date <= endDate
    })
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Calendar Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
            >
              Today
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={goToPreviousMonth}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-xs font-medium text-gray-500 uppercase">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const dayBookings = getBookingsForDate(date)
            const isCurrentMonth = isSameMonth(date, currentMonth)
            const isToday = isSameDay(date, new Date())

            return (
              <div
                key={index}
                className={clsx(
                  "min-h-[100px] p-2 border border-gray-100 rounded-md cursor-pointer hover:bg-gray-50 transition-colors",
                  !isCurrentMonth && "bg-gray-50 text-gray-400",
                  isToday && "bg-blue-50 border-blue-200"
                )}
                onClick={() => onDateClick && onDateClick(date)}
              >
                <div className={clsx(
                  "text-sm font-medium mb-1",
                  isToday && "text-blue-600"
                )}>
                  {format(date, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayBookings.slice(0, 3).map((booking) => {
                    const statusColor = BOOKING_STATUS_COLORS[booking.status]
                    return (
                      <div
                        key={booking.id}
                        className={clsx(
                          "text-xs px-2 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity",
                          statusColor
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          onBookingClick(booking)
                        }}
                        title={`Booking #${booking.id.slice(-8).toUpperCase()}`}
                      >
                        <div className="truncate">
                          {'customer' in booking && booking.customer 
                            ? `${booking.customer.firstName} ${booking.customer.lastName}`
                            : `#${booking.id.slice(-8)}`
                          }
                        </div>
                      </div>
                    )
                  })}
                  
                  {dayBookings.length > 3 && (
                    <div className="text-xs text-gray-500 px-2">
                      +{dayBookings.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Click dates to create bookings</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-200 rounded"></div>
              <span className="text-gray-600">Pending</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-200 rounded"></div>
              <span className="text-gray-600">Confirmed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-200 rounded"></div>
              <span className="text-gray-600">Active</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-200 rounded"></div>
              <span className="text-gray-600">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
