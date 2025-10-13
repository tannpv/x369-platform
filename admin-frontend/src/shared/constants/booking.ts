import type { BookingStatus, PaymentStatus, BookingType } from '../types/booking'
import type { SelectOption } from '../types/common'

export const BOOKING_STATUSES: Record<BookingStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled'
} as const

export const PAYMENT_STATUSES: Record<PaymentStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
  partial: 'Partial'
} as const

export const BOOKING_TYPES: Record<BookingType, string> = {
  hourly: 'Hourly',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly'
} as const

export const BOOKING_STATUS_OPTIONS: SelectOption[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

export const PAYMENT_STATUS_OPTIONS: SelectOption[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'partial', label: 'Partial' }
]

export const BOOKING_TYPE_OPTIONS: SelectOption[] = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
]

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  completed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
} as const

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
  partial: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
} as const

export const BOOKING_TYPE_COLORS: Record<BookingType, string> = {
  hourly: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  daily: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  weekly: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
  monthly: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
} as const

// Business constants
export const BOOKING_RATES = {
  hourly: {
    economy: 15,
    compact: 18,
    midsize: 22,
    fullsize: 28,
    luxury: 45,
    suv: 35,
    truck: 40,
    van: 32
  },
  daily: {
    economy: 50,
    compact: 60,
    midsize: 75,
    fullsize: 95,
    luxury: 150,
    suv: 120,
    truck: 135,
    van: 110
  },
  weekly: {
    economy: 300,
    compact: 360,
    midsize: 450,
    fullsize: 570,
    luxury: 900,
    suv: 720,
    truck: 810,
    van: 660
  },
  monthly: {
    economy: 1200,
    compact: 1440,
    midsize: 1800,
    fullsize: 2280,
    luxury: 3600,
    suv: 2880,
    truck: 3240,
    van: 2640
  }
} as const

export const PICKUP_LOCATIONS = [
  'Downtown Office - 123 Main St',
  'Airport Terminal - Terminal 1',
  'Hotel District - 456 Grand Ave',
  'Shopping Mall - West End Mall',
  'Business Park - Corporate Center',
  'Train Station - Central Station',
  'Residential - Home Pickup',
  'Custom Location'
] as const

export const COMMON_DROPOFF_LOCATIONS = [
  'Same as Pickup',
  'Downtown Office - 123 Main St',  
  'Airport Terminal - Terminal 1',
  'Hotel District - 456 Grand Ave',
  'Shopping Mall - West End Mall',
  'Business Park - Corporate Center',
  'Train Station - Central Station',
  'Custom Location'
] as const

// Validation constants
export const MIN_BOOKING_DURATION = 1 // hours
export const MAX_BOOKING_DURATION = 30 * 24 // 30 days in hours
export const ADVANCE_BOOKING_DAYS = 90 // How far in advance bookings can be made
