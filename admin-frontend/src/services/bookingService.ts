/**
 * Booking service for API operations
 */

import { apiService } from './api'
import type { ApiResponse, PaginatedResponse } from '../shared/types/common'
import type { 
  Booking, 
  BookingWithDetails,
  BookingFilters, 
  BookingStats, 
  CreateBookingPayload, 
  UpdateBookingPayload
} from '../shared/types/booking'
import { BOOKING_SEED_DATA, getBookingsWithDetails, getBookingStats as getSeedBookingStats } from '../shared/data/bookingSeedData'

export class BookingService {
  async getAll(filters?: BookingFilters, page = 1, limit = 20): Promise<PaginatedResponse<Booking>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    
    return apiService.get(`/bookings?${params}`)
  }

  async getAllWithDetails(filters?: BookingFilters, page = 1, limit = 20): Promise<PaginatedResponse<BookingWithDetails>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    
    return apiService.get(`/bookings/details?${params}`)
  }

  async getById(id: string): Promise<ApiResponse<Booking>> {
    return apiService.get(`/bookings/${id}`)
  }

  async getByIdWithDetails(id: string): Promise<ApiResponse<BookingWithDetails>> {
    return apiService.get(`/bookings/${id}/details`)
  }

  async create(data: CreateBookingPayload): Promise<ApiResponse<Booking>> {
    return apiService.post('/bookings', data)
  }

  async update(id: string, data: UpdateBookingPayload): Promise<ApiResponse<Booking>> {
    return apiService.patch(`/bookings/${id}`, data)
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/bookings/${id}`)
  }

  async getStats(filters?: BookingFilters): Promise<ApiResponse<BookingStats>> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    return apiService.get(`/bookings/stats?${params}`)
  }

  async confirm(id: string): Promise<ApiResponse<Booking>> {
    return this.update(id, { status: 'confirmed' })
  }

  async cancel(id: string, reason?: string): Promise<ApiResponse<Booking>> {
    return this.update(id, { status: 'cancelled', cancellationReason: reason })
  }

  async complete(id: string): Promise<ApiResponse<Booking>> {
    return this.update(id, { status: 'completed' })
  }

  async updatePaymentStatus(id: string, paymentStatus: Booking['paymentStatus']): Promise<ApiResponse<Booking>> {
    return this.update(id, { paymentStatus })
  }

  async getByCustomer(customerId: string): Promise<ApiResponse<Booking[]>> {
    return apiService.get(`/customers/${customerId}/bookings`)
  }

  async getByVehicle(vehicleId: string): Promise<ApiResponse<Booking[]>> {
    return apiService.get(`/vehicles/${vehicleId}/bookings`)
  }

  async getByDriver(driverId: string): Promise<ApiResponse<Booking[]>> {
    return apiService.get(`/drivers/${driverId}/bookings`)
  }

  async checkAvailability(vehicleId: string, startDate: string, endDate: string): Promise<ApiResponse<{ available: boolean }>> {
    return apiService.post('/bookings/check-availability', { vehicleId, startDate, endDate })
  }

  async bulkUpdate(ids: string[], data: Partial<Booking>): Promise<ApiResponse<Booking[]>> {
    return apiService.patch('/bookings/bulk', { ids, data })
  }

  async bulkDelete(ids: string[]): Promise<ApiResponse<void>> {
    return apiService.post('/bookings/bulk-delete', { ids })
  }
}

// Mock service for development
export class MockBookingService {
  private bookings: Booking[] = [...BOOKING_SEED_DATA]

  async getAll(filters?: BookingFilters, page = 1, limit = 20): Promise<PaginatedResponse<Booking>> {
    let filteredBookings = [...this.bookings]

    // Apply filters
    if (filters?.query) {
      const query = filters.query.toLowerCase()
      const bookingsWithDetails = getBookingsWithDetails()
      const matchingBookings = bookingsWithDetails.filter(b => 
        b.id.toLowerCase().includes(query) ||
        b.customer?.firstName.toLowerCase().includes(query) ||
        b.customer?.lastName.toLowerCase().includes(query) ||
        b.customer?.email.toLowerCase().includes(query) ||
        b.vehicle?.make.toLowerCase().includes(query) ||
        b.vehicle?.model.toLowerCase().includes(query) ||
        b.vehicle?.licensePlate.toLowerCase().includes(query) ||
        b.specialRequests?.toLowerCase().includes(query)
      )
      filteredBookings = this.bookings.filter(b => 
        matchingBookings.some(mb => mb.id === b.id)
      )
    }

    if (filters?.status && filters.status !== 'all') {
      filteredBookings = filteredBookings.filter(b => b.status === filters.status)
    }

    if (filters?.paymentStatus && filters.paymentStatus !== 'all') {
      filteredBookings = filteredBookings.filter(b => b.paymentStatus === filters.paymentStatus)
    }

    if (filters?.type && filters.type !== 'all') {
      filteredBookings = filteredBookings.filter(b => b.type === filters.type)
    }

    if (filters?.customerId) {
      filteredBookings = filteredBookings.filter(b => b.customerId === filters.customerId)
    }

    if (filters?.vehicleId) {
      filteredBookings = filteredBookings.filter(b => b.vehicleId === filters.vehicleId)
    }

    if (filters?.driverId) {
      filteredBookings = filteredBookings.filter(b => b.driverId === filters.driverId)
    }

    if (filters?.startDate) {
      filteredBookings = filteredBookings.filter(b => 
        new Date(b.startDate) >= new Date(filters.startDate!)
      )
    }

    if (filters?.endDate) {
      filteredBookings = filteredBookings.filter(b => 
        new Date(b.endDate) <= new Date(filters.endDate!)
      )
    }

    if (filters?.minAmount) {
      filteredBookings = filteredBookings.filter(b => b.totalAmount >= filters.minAmount!)
    }

    if (filters?.maxAmount) {
      filteredBookings = filteredBookings.filter(b => b.totalAmount <= filters.maxAmount!)
    }

    // Sort by creation date (newest first)
    filteredBookings.sort((a, b) => new Date(b.createdAt || b.startDate).getTime() - new Date(a.createdAt || a.startDate).getTime())

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedBookings = filteredBookings.slice(startIndex, endIndex)

    return {
      data: paginatedBookings,
      total: filteredBookings.length,
      page,
      limit,
      hasNextPage: endIndex < filteredBookings.length,
      hasPrevPage: page > 1
    }
  }

  async getAllWithDetails(filters?: BookingFilters, page = 1, limit = 20): Promise<PaginatedResponse<BookingWithDetails>> {
    const paginatedResult = await this.getAll(filters, page, limit)
    const bookingsWithDetails = getBookingsWithDetails()
    
    const detailedBookings = paginatedResult.data.map(booking => 
      bookingsWithDetails.find(b => b.id === booking.id)!
    )

    return {
      ...paginatedResult,
      data: detailedBookings
    }
  }

  async getById(id: string): Promise<ApiResponse<Booking>> {
    const booking = this.bookings.find(b => b.id === id)
    if (!booking) {
      throw new Error('Booking not found')
    }
    
    return {
      success: true,
      data: booking
    }
  }

  async getByIdWithDetails(id: string): Promise<ApiResponse<BookingWithDetails>> {
    const booking = this.bookings.find(b => b.id === id)
    if (!booking) {
      throw new Error('Booking not found')
    }

    const bookingsWithDetails = getBookingsWithDetails()
    const bookingWithDetails = bookingsWithDetails.find(b => b.id === id)!
    
    return {
      success: true,
      data: bookingWithDetails
    }
  }

  async create(data: CreateBookingPayload): Promise<ApiResponse<Booking>> {
    // Calculate duration and amount
    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)) // hours

    // Simple rate calculation - in real app this would be more complex
    const baseRate = 25 // $25/hour base rate
    const totalAmount = baseRate * duration * 1.15 // Add 15% for taxes/fees

    const newBooking: Booking = {
      ...data,
      id: `B${String(this.bookings.length + 1).padStart(3, '0')}`,
      status: 'pending',
      duration,
      baseRate,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.bookings.push(newBooking)
    
    return {
      success: true,
      data: newBooking
    }
  }

  async update(id: string, data: UpdateBookingPayload): Promise<ApiResponse<Booking>> {
    const bookingIndex = this.bookings.findIndex(b => b.id === id)
    if (bookingIndex === -1) {
      throw new Error('Booking not found')
    }

    const updatedBooking = {
      ...this.bookings[bookingIndex],
      ...data,
      updatedAt: new Date().toISOString()
    }

    // Add status-specific timestamps
    if (data.status === 'confirmed' && !updatedBooking.confirmedAt) {
      updatedBooking.confirmedAt = new Date().toISOString()
    } else if (data.status === 'completed' && !updatedBooking.completedAt) {
      updatedBooking.completedAt = new Date().toISOString()
    } else if (data.status === 'cancelled' && !updatedBooking.cancelledAt) {
      updatedBooking.cancelledAt = new Date().toISOString()
    }

    this.bookings[bookingIndex] = updatedBooking
    
    return {
      success: true,
      data: updatedBooking
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const bookingIndex = this.bookings.findIndex(b => b.id === id)
    if (bookingIndex === -1) {
      throw new Error('Booking not found')
    }
    
    this.bookings.splice(bookingIndex, 1)
    
    return {
      success: true,
      data: undefined
    }
  }

  async getStats(): Promise<ApiResponse<BookingStats>> {
    const stats = getSeedBookingStats()
    return {
      success: true,
      data: stats
    }
  }

  async confirm(id: string): Promise<ApiResponse<Booking>> {
    return this.update(id, { status: 'confirmed' })
  }

  async cancel(id: string, reason?: string): Promise<ApiResponse<Booking>> {
    return this.update(id, { status: 'cancelled', cancellationReason: reason })
  }

  async complete(id: string): Promise<ApiResponse<Booking>> {
    return this.update(id, { status: 'completed' })
  }

  async updatePaymentStatus(id: string, paymentStatus: Booking['paymentStatus']): Promise<ApiResponse<Booking>> {
    return this.update(id, { paymentStatus })
  }

  async getByCustomer(customerId: string): Promise<ApiResponse<Booking[]>> {
    const bookings = this.bookings.filter(b => b.customerId === customerId)
    return {
      success: true,
      data: bookings
    }
  }

  async getByVehicle(vehicleId: string): Promise<ApiResponse<Booking[]>> {
    const bookings = this.bookings.filter(b => b.vehicleId === vehicleId)
    return {
      success: true,
      data: bookings
    }
  }

  async getByDriver(driverId: string): Promise<ApiResponse<Booking[]>> {
    const bookings = this.bookings.filter(b => b.driverId === driverId)
    return {
      success: true,
      data: bookings
    }
  }

  async checkAvailability(vehicleId: string, startDate: string, endDate: string): Promise<ApiResponse<{ available: boolean }>> {
    // Check if vehicle has any conflicting bookings
    const conflictingBookings = this.bookings.filter(b => 
      b.vehicleId === vehicleId &&
      b.status !== 'cancelled' &&
      (
        (new Date(startDate) >= new Date(b.startDate) && new Date(startDate) < new Date(b.endDate)) ||
        (new Date(endDate) > new Date(b.startDate) && new Date(endDate) <= new Date(b.endDate)) ||
        (new Date(startDate) <= new Date(b.startDate) && new Date(endDate) >= new Date(b.endDate))
      )
    )

    return {
      success: true,
      data: { available: conflictingBookings.length === 0 }
    }
  }

  async bulkUpdate(ids: string[], data: Partial<Booking>): Promise<ApiResponse<Booking[]>> {
    const updatedBookings: Booking[] = []
    
    for (const id of ids) {
      try {
        const result = await this.update(id, data)
        updatedBookings.push(result.data)
      } catch (error) {
        // Continue with other bookings even if one fails
        console.error(`Failed to update booking ${id}:`, error)
      }
    }
    
    return {
      success: true,
      data: updatedBookings
    }
  }

  async bulkDelete(ids: string[]): Promise<ApiResponse<void>> {
    for (const id of ids) {
      try {
        await this.delete(id)
      } catch (error) {
        // Continue with other bookings even if one fails
        console.error(`Failed to delete booking ${id}:`, error)
      }
    }
    
    return {
      success: true,
      data: undefined
    }
  }
}

// Export instances
export const bookingService = new BookingService()
export const mockBookingService = new MockBookingService()
