/**
 * Booking seed data generator
 * Generates realistic booking data with proper relationships to users and vehicles
 */

import type { Booking, BookingWithDetails, BookingStatus, PaymentStatus, BookingType } from '../types/booking'
import type { Address } from '../types/user'
import { USER_SEED_DATA } from './userSeedData'
import vehicleSeedData from './vehicleSeedData'
import type { Vehicle } from '../types/vehicle'
import { BOOKING_RATES, PICKUP_LOCATIONS, COMMON_DROPOFF_LOCATIONS } from '../constants/booking'

// Utility functions
const randomChoice = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)]
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min
const randomFloat = (min: number, max: number, decimals = 2): number => 
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals))

// Address generator for locations
const generateAddress = (location: string): Address => {
  const addressMap: Record<string, Address> = {
    'Downtown Office - 123 Main St': {
      street: '123 Main St',
      city: 'Downtown',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    'Airport Terminal - Terminal 1': {
      street: 'Terminal 1, Airport Rd',
      city: 'Airport',
      state: 'NY',
      zipCode: '10002',
      country: 'USA'
    },
    'Hotel District - 456 Grand Ave': {
      street: '456 Grand Ave',
      city: 'Hotel District',
      state: 'NY',
      zipCode: '10003',
      country: 'USA'
    },
    'Shopping Mall - West End Mall': {
      street: '789 Mall Dr',
      city: 'West End',
      state: 'NY',
      zipCode: '10004',
      country: 'USA'
    },
    'Business Park - Corporate Center': {
      street: '101 Corporate Blvd',
      city: 'Business Park',
      state: 'NY',
      zipCode: '10005',
      country: 'USA'
    },
    'Train Station - Central Station': {
      street: '555 Railway Ave',
      city: 'Central',
      state: 'NY',
      zipCode: '10006',
      country: 'USA'
    }
  }

  return addressMap[location] || {
    street: '123 Custom St',
    city: 'Custom Location',
    state: 'NY',
    zipCode: '10000',
    country: 'USA'
  }
}

// Generate realistic booking dates
const generateBookingDates = (): { startDate: string; endDate: string; duration: number; type: BookingType } => {
  const now = new Date()
  const types: BookingType[] = ['hourly', 'daily', 'weekly', 'monthly']
  const typeWeights = [0.3, 0.5, 0.15, 0.05] // 30% hourly, 50% daily, 15% weekly, 5% monthly
  
  // Weighted random selection
  const rand = Math.random()
  let cumulativeWeight = 0
  let selectedType: BookingType = 'daily'
  
  for (let i = 0; i < types.length; i++) {
    cumulativeWeight += typeWeights[i]
    if (rand < cumulativeWeight) {
      selectedType = types[i]
      break
    }
  }

  // Generate start date (past 6 months to future 3 months)
  const daysFromNow = randomInt(-180, 90)
  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() + daysFromNow)

  let duration: number
  let endDate: Date

  switch (selectedType) {
    case 'hourly':
      duration = randomInt(2, 12) // 2-12 hours
      endDate = new Date(startDate)
      endDate.setHours(endDate.getHours() + duration)
      break
    case 'daily':
      duration = randomInt(1, 7) * 24 // 1-7 days
      endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + duration / 24)
      break
    case 'weekly':
      duration = randomInt(1, 4) * 7 * 24 // 1-4 weeks
      endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + duration / 24)
      break
    case 'monthly':
      duration = randomInt(1, 3) * 30 * 24 // 1-3 months
      endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + duration / 24)
      break
  }

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    duration,
    type: selectedType
  }
}

// Calculate booking amount based on vehicle type and duration
const calculateBookingAmount = (vehicleType: string, bookingType: BookingType, duration: number): number => {
  const rates = BOOKING_RATES[bookingType]
  const rate = rates[vehicleType as keyof typeof rates] || rates.economy
  
  let units: number
  switch (bookingType) {
    case 'hourly':
      units = duration
      break
    case 'daily':
      units = Math.ceil(duration / 24)
      break
    case 'weekly':
      units = Math.ceil(duration / (7 * 24))
      break
    case 'monthly':
      units = Math.ceil(duration / (30 * 24))
      break
  }

  const baseAmount = rate * units
  // Add random fees (taxes, insurance, etc.)
  const fees = baseAmount * randomFloat(0.05, 0.15)
  return parseFloat((baseAmount + fees).toFixed(2))
}

// Get status based on booking dates
const getBookingStatus = (startDate: string, endDate: string): { status: BookingStatus; paymentStatus: PaymentStatus } => {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (end < now) {
    // Past booking
    if (Math.random() < 0.95) {
      return { status: 'completed', paymentStatus: 'paid' }
    } else {
      return { status: 'cancelled', paymentStatus: Math.random() < 0.5 ? 'refunded' : 'paid' }
    }
  } else if (start <= now && end >= now) {
    // Active booking
    return { status: 'active', paymentStatus: 'paid' }
  } else {
    // Future booking
    const rand = Math.random()
    if (rand < 0.7) {
      return { status: 'confirmed', paymentStatus: 'paid' }
    } else if (rand < 0.9) {
      return { status: 'pending', paymentStatus: 'pending' }
    } else {
      return { status: 'cancelled', paymentStatus: 'failed' }
    }
  }
}

// Generate special requests
const generateSpecialRequests = (): string | undefined => {
  if (Math.random() < 0.3) { // 30% chance of special requests
    const requests = [
      'GPS navigation system required',
      'Child safety seat needed',
      'Non-smoking vehicle preferred',
      'Automatic transmission only',
      'Fuel tank to be full at pickup',
      'Extra insurance coverage',
      'Wheelchair accessible vehicle',
      'Pet-friendly vehicle',
      'Bluetooth connectivity required',
      'Roof rack or cargo space needed'
    ]
    return randomChoice(requests)
  }
  return undefined
}

// Generate a single booking
const generateBooking = (index: number): Booking => {
  // Get random customer (exclude admins and managers from being customers)
  const customers = USER_SEED_DATA.filter(u => u.role === 'customer')
  const customer = randomChoice(customers)
  
  // Get random vehicle
  const vehicle: Vehicle = randomChoice(vehicleSeedData)
  
  // Get optional driver (only for certain bookings)
  const drivers = USER_SEED_DATA.filter(u => u.role === 'driver')
  const driver = Math.random() < 0.3 ? randomChoice(drivers) : undefined // 30% chance of having a driver
  
  // Generate booking dates and type
  const { startDate, endDate, duration, type } = generateBookingDates()
  
  // Generate locations
  const pickupLocation = generateAddress(randomChoice([...PICKUP_LOCATIONS]))
  const dropoffSameAsPickup = Math.random() < 0.7 // 70% same location
  let dropoffLocation: Address
  
  if (dropoffSameAsPickup) {
    dropoffLocation = pickupLocation
  } else {
    const dropoffOptions = [...COMMON_DROPOFF_LOCATIONS].filter(loc => loc !== 'Same as Pickup')
    dropoffLocation = generateAddress(randomChoice(dropoffOptions))
  }
  
  // Calculate pricing
  const baseRate = calculateBookingAmount(vehicle.type, 'hourly', 1)
  const totalAmount = calculateBookingAmount(vehicle.type, type, duration)
  
  // Get status based on dates
  const { status, paymentStatus } = getBookingStatus(startDate, endDate)
  
  // Generate timestamps
  const createdAt = new Date(startDate)
  createdAt.setDate(createdAt.getDate() - randomInt(1, 30)) // Created 1-30 days before start
  
  const updatedAt = status === 'pending' ? createdAt.toISOString() : 
    new Date(Math.max(createdAt.getTime(), new Date(startDate).getTime() - randomInt(0, 7) * 24 * 60 * 60 * 1000)).toISOString()

  return {
    id: `B${String(index + 1).padStart(3, '0')}`,
    customerId: customer.id,
    vehicleId: vehicle.id,
    driverId: driver?.id,
    status,
    type,
    startDate,
    endDate,
    duration,
    pickupLocation,
    dropoffLocation,
    baseRate,
    totalAmount,
    paymentStatus,
    specialRequests: generateSpecialRequests(),
    notes: Math.random() < 0.1 ? 'Customer requested early pickup' : undefined,
    confirmedAt: ['confirmed', 'active', 'completed'].includes(status) ? 
      new Date(createdAt.getTime() + randomInt(1, 24) * 60 * 60 * 1000).toISOString() : undefined,
    completedAt: status === 'completed' ? endDate : undefined,
    cancelledAt: status === 'cancelled' ? 
      new Date(Math.min(new Date(startDate).getTime(), Date.now()) - randomInt(1, 7) * 24 * 60 * 60 * 1000).toISOString() : undefined,
    cancellationReason: status === 'cancelled' ? randomChoice([
      'Customer request',
      'Vehicle unavailable',
      'Payment failed',
      'Weather conditions',
      'Emergency situation'
    ]) : undefined,
    createdAt: createdAt.toISOString(),
    updatedAt
  }
}

/**
 * Generate array of bookings with realistic data
 */
export const generateBookings = (count: number = 75): Booking[] => {
  return Array.from({ length: count }, (_, index) => generateBooking(index))
}

/**
 * Pre-generated seed data for 75 bookings
 */
export const BOOKING_SEED_DATA: Booking[] = generateBookings(75)

/**
 * Get bookings with populated user and vehicle details
 */
export const getBookingsWithDetails = (): BookingWithDetails[] => {
  return BOOKING_SEED_DATA.map(booking => {
    const customer = USER_SEED_DATA.find(u => u.id === booking.customerId)
    const vehicle = vehicleSeedData.find((v: Vehicle) => v.id === booking.vehicleId)
    const driver = booking.driverId ? USER_SEED_DATA.find(u => u.id === booking.driverId) : undefined

    return {
      ...booking,
      customer: customer ? {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        avatar: customer.avatar
      } : undefined,
      vehicle: vehicle ? {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        licensePlate: vehicle.licensePlate,
        type: vehicle.type,
        imageUrl: vehicle.image
      } : undefined,
      driver: driver ? {
        id: driver.id,
        firstName: driver.firstName,
        lastName: driver.lastName,
        phone: driver.phone,
        avatar: driver.avatar,
        rating: driver.rating
      } : undefined
    }
  })
}

/**
 * Get bookings by status
 */
export const getBookingsByStatus = (status: BookingStatus): Booking[] => {
  return BOOKING_SEED_DATA.filter(booking => booking.status === status)
}

/**
 * Get bookings by customer
 */
export const getBookingsByCustomer = (customerId: string): Booking[] => {
  return BOOKING_SEED_DATA.filter(booking => booking.customerId === customerId)
}

/**
 * Get bookings by vehicle
 */
export const getBookingsByVehicle = (vehicleId: string): Booking[] => {
  return BOOKING_SEED_DATA.filter(booking => booking.vehicleId === vehicleId)
}

/**
 * Get booking statistics
 */
export const getBookingStats = () => {
  const total = BOOKING_SEED_DATA.length
  const pending = BOOKING_SEED_DATA.filter(b => b.status === 'pending').length
  const confirmed = BOOKING_SEED_DATA.filter(b => b.status === 'confirmed').length
  const active = BOOKING_SEED_DATA.filter(b => b.status === 'active').length
  const completed = BOOKING_SEED_DATA.filter(b => b.status === 'completed').length
  const cancelled = BOOKING_SEED_DATA.filter(b => b.status === 'cancelled').length
  
  const totalRevenue = BOOKING_SEED_DATA
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalAmount, 0)
  
  const completedBookings = BOOKING_SEED_DATA.filter(b => b.status === 'completed')
  const averageBookingValue = completedBookings.length > 0 ? 
    completedBookings.reduce((sum, b) => sum + b.totalAmount, 0) / completedBookings.length : 0
  
  const completionRate = total > 0 ? (completed / (completed + cancelled)) * 100 : 0
  const cancellationRate = total > 0 ? (cancelled / total) * 100 : 0
  
  // Upcoming bookings (confirmed or active in the future)
  const now = new Date()
  const upcomingBookings = BOOKING_SEED_DATA.filter(b => 
    new Date(b.startDate) > now && ['confirmed', 'pending'].includes(b.status)
  ).length
  
  // This month's revenue
  const thisMonth = new Date()
  const startOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1)
  const monthlyRevenue = BOOKING_SEED_DATA
    .filter(b => 
      b.paymentStatus === 'paid' && 
      new Date(b.createdAt || b.startDate) >= startOfMonth
    )
    .reduce((sum, b) => sum + b.totalAmount, 0)
  
  // Recent bookings (last 7 days)
  const lastWeek = new Date()
  lastWeek.setDate(lastWeek.getDate() - 7)
  const recentBookings = BOOKING_SEED_DATA.filter(b => 
    new Date(b.createdAt || b.startDate) >= lastWeek
  ).length
  
  const byType = {
    hourly: BOOKING_SEED_DATA.filter(b => b.type === 'hourly').length,
    daily: BOOKING_SEED_DATA.filter(b => b.type === 'daily').length,
    weekly: BOOKING_SEED_DATA.filter(b => b.type === 'weekly').length,
    monthly: BOOKING_SEED_DATA.filter(b => b.type === 'monthly').length
  }
  
  const byPaymentStatus = {
    pending: BOOKING_SEED_DATA.filter(b => b.paymentStatus === 'pending').length,
    paid: BOOKING_SEED_DATA.filter(b => b.paymentStatus === 'paid').length,
    failed: BOOKING_SEED_DATA.filter(b => b.paymentStatus === 'failed').length,
    refunded: BOOKING_SEED_DATA.filter(b => b.paymentStatus === 'refunded').length,
    partial: BOOKING_SEED_DATA.filter(b => b.paymentStatus === 'partial').length
  }
  
  return {
    total,
    pending,
    confirmed,
    active,
    completed,
    cancelled,
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    averageBookingValue: parseFloat(averageBookingValue.toFixed(2)),
    completionRate: parseFloat(completionRate.toFixed(1)),
    cancellationRate: parseFloat(cancellationRate.toFixed(1)),
    upcomingBookings,
    monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)),
    recentBookings,
    byType,
    byPaymentStatus
  }
}

// Export sample bookings for testing
export const SAMPLE_BOOKINGS = {
  pending: BOOKING_SEED_DATA.find(b => b.status === 'pending')!,
  confirmed: BOOKING_SEED_DATA.find(b => b.status === 'confirmed')!,
  active: BOOKING_SEED_DATA.find(b => b.status === 'active')!,
  completed: BOOKING_SEED_DATA.find(b => b.status === 'completed')!,
  cancelled: BOOKING_SEED_DATA.find(b => b.status === 'cancelled')!,
  withDriver: BOOKING_SEED_DATA.find(b => b.driverId)!,
  withoutDriver: BOOKING_SEED_DATA.find(b => !b.driverId)!,
  hourly: BOOKING_SEED_DATA.find(b => b.type === 'hourly')!,
  daily: BOOKING_SEED_DATA.find(b => b.type === 'daily')!,
  weekly: BOOKING_SEED_DATA.find(b => b.type === 'weekly')!,
  monthly: BOOKING_SEED_DATA.find(b => b.type === 'monthly')!
}
