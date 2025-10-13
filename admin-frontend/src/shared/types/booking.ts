import type { BaseEntity } from './common'
import type { Address } from './user'

export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partial'
export type BookingType = 'hourly' | 'daily' | 'weekly' | 'monthly'

export interface Booking extends BaseEntity {
  // Core booking information
  customerId: string
  vehicleId: string
  driverId?: string
  
  // Booking details
  status: BookingStatus
  type: BookingType
  startDate: string
  endDate: string
  duration: number // in hours
  
  // Location information
  pickupLocation: Address
  dropoffLocation: Address
  
  // Financial information
  baseRate: number
  totalAmount: number
  paymentStatus: PaymentStatus
  
  // Additional information
  specialRequests?: string
  notes?: string
  
  // Metadata
  confirmedAt?: string
  completedAt?: string
  cancelledAt?: string
  cancellationReason?: string
}

export interface BookingFilters {
  query?: string
  status?: BookingStatus | 'all'
  paymentStatus?: PaymentStatus | 'all'
  type?: BookingType | 'all'
  customerId?: string
  vehicleId?: string
  driverId?: string
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
}

export interface CreateBookingPayload {
  customerId: string
  vehicleId: string
  driverId?: string
  type: BookingType
  startDate: string
  endDate: string
  pickupLocation: Address
  dropoffLocation: Address
  specialRequests?: string
  notes?: string
}

export interface UpdateBookingPayload extends Partial<CreateBookingPayload> {
  status?: BookingStatus
  paymentStatus?: PaymentStatus
  totalAmount?: number
  cancellationReason?: string
}

export interface BookingStats {
  total: number
  pending: number
  confirmed: number
  active: number
  completed: number
  cancelled: number
  totalRevenue: number
  averageBookingValue: number
  completionRate: number
  cancellationRate: number
  upcomingBookings: number
  byType: Record<BookingType, number>
  byPaymentStatus: Record<PaymentStatus, number>
  monthlyRevenue: number
  recentBookings: number
}

// Booking with populated references for display
export interface BookingWithDetails extends Booking {
  customer?: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    avatar?: string
  }
  vehicle?: {
    id: string
    make: string
    model: string
    year: number
    licensePlate: string
    type: string
    imageUrl?: string
  }
  driver?: {
    id: string
    firstName: string
    lastName: string
    phone?: string
    avatar?: string
    rating?: number
  }
}
