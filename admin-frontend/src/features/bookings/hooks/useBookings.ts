import { useState, useEffect, useCallback } from 'react'
import { mockBookingService } from '../../../services/bookingService'
import type { 
  Booking, 
  BookingWithDetails,
  BookingFilters, 
  BookingStats, 
  CreateBookingPayload, 
  UpdateBookingPayload 
} from '../../../shared/types/booking'
import type { PaginatedResponse } from '../../../shared/types/common'

interface UseBookingsOptions {
  initialFilters?: BookingFilters
  initialPage?: number
  initialLimit?: number
  withDetails?: boolean
}

interface UseBookingsReturn {
  // Data
  bookings: Booking[] | BookingWithDetails[]
  stats: BookingStats | null
  pagination: {
    page: number
    limit: number
    total: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  
  // State
  loading: boolean
  error: string | null
  filters: BookingFilters
  
  // Actions
  refetch: () => Promise<void>
  updateFilters: (newFilters: Partial<BookingFilters>) => void
  clearFilters: () => void
  
  // Pagination
  nextPage: () => void
  prevPage: () => void
  goToPage: (page: number) => void
  
  // CRUD Operations
  createBooking: (data: CreateBookingPayload) => Promise<Booking>
  updateBooking: (id: string, data: UpdateBookingPayload) => Promise<Booking>
  deleteBooking: (id: string) => Promise<void>
  
  // Status Operations
  confirmBooking: (id: string) => Promise<Booking>
  cancelBooking: (id: string, reason?: string) => Promise<Booking>
  completeBooking: (id: string) => Promise<Booking>
  updatePaymentStatus: (id: string, paymentStatus: Booking['paymentStatus']) => Promise<Booking>
  
  // Utility Operations
  checkAvailability: (vehicleId: string, startDate: string, endDate: string) => Promise<boolean>
  bulkUpdateBookings: (ids: string[], data: Partial<Booking>) => Promise<Booking[]>
  bulkDeleteBookings: (ids: string[]) => Promise<void>
}

export const useBookings = (options: UseBookingsOptions = {}): UseBookingsReturn => {
  const {
    initialFilters = {},
    initialPage = 1,
    initialLimit = 20,
    withDetails = true
  } = options

  // State
  const [bookings, setBookings] = useState<Booking[] | BookingWithDetails[]>([])
  const [stats, setStats] = useState<BookingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<BookingFilters>(initialFilters)
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response: PaginatedResponse<Booking | BookingWithDetails> = withDetails
        ? await mockBookingService.getAllWithDetails(filters, pagination.page, pagination.limit)
        : await mockBookingService.getAll(filters, pagination.page, pagination.limit)

      setBookings(response.data)
      setPagination(prev => ({
        ...prev,
        total: response.total,
        hasNextPage: response.hasNextPage,
        hasPrevPage: response.hasPrevPage
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.page, pagination.limit, withDetails])

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await mockBookingService.getStats()
      setStats(response.data)
    } catch (err) {
      console.error('Failed to fetch booking stats:', err)
    }
  }, [])

  // Effects
  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Refetch data
  const refetch = useCallback(async () => {
    await Promise.all([fetchBookings(), fetchStats()])
  }, [fetchBookings, fetchStats])

  // Filter operations
  const updateFilters = useCallback((newFilters: Partial<BookingFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [])

  // Pagination operations
  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }))
    }
  }, [pagination.hasNextPage])

  const prevPage = useCallback(() => {
    if (pagination.hasPrevPage) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }))
    }
  }, [pagination.hasPrevPage])

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= Math.ceil(pagination.total / pagination.limit)) {
      setPagination(prev => ({ ...prev, page }))
    }
  }, [pagination.total, pagination.limit])

  // CRUD Operations
  const createBooking = useCallback(async (data: CreateBookingPayload): Promise<Booking> => {
    try {
      setError(null)
      const response = await mockBookingService.create(data)
      await refetch() // Refresh data after creation
      return response.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [refetch])

  const updateBooking = useCallback(async (id: string, data: UpdateBookingPayload): Promise<Booking> => {
    try {
      setError(null)
      const response = await mockBookingService.update(id, data)
      await refetch() // Refresh data after update
      return response.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update booking'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [refetch])

  const deleteBooking = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await mockBookingService.delete(id)
      await refetch() // Refresh data after deletion
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete booking'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [refetch])

  // Status Operations
  const confirmBooking = useCallback(async (id: string): Promise<Booking> => {
    return updateBooking(id, { status: 'confirmed' })
  }, [updateBooking])

  const cancelBooking = useCallback(async (id: string, reason?: string): Promise<Booking> => {
    return updateBooking(id, { status: 'cancelled', cancellationReason: reason })
  }, [updateBooking])

  const completeBooking = useCallback(async (id: string): Promise<Booking> => {
    return updateBooking(id, { status: 'completed' })
  }, [updateBooking])

  const updatePaymentStatus = useCallback(async (id: string, paymentStatus: Booking['paymentStatus']): Promise<Booking> => {
    return updateBooking(id, { paymentStatus })
  }, [updateBooking])

  // Utility Operations
  const checkAvailability = useCallback(async (vehicleId: string, startDate: string, endDate: string): Promise<boolean> => {
    try {
      const response = await mockBookingService.checkAvailability(vehicleId, startDate, endDate)
      return response.data.available
    } catch (err) {
      console.error('Failed to check availability:', err)
      return false
    }
  }, [])

  const bulkUpdateBookings = useCallback(async (ids: string[], data: Partial<Booking>): Promise<Booking[]> => {
    try {
      setError(null)
      const response = await mockBookingService.bulkUpdate(ids, data)
      await refetch() // Refresh data after bulk update
      return response.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update bookings'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [refetch])

  const bulkDeleteBookings = useCallback(async (ids: string[]): Promise<void> => {
    try {
      setError(null)
      await mockBookingService.bulkDelete(ids)
      await refetch() // Refresh data after bulk deletion
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete bookings'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [refetch])

  return {
    // Data
    bookings,
    stats,
    pagination,
    
    // State
    loading,
    error,
    filters,
    
    // Actions
    refetch,
    updateFilters,
    clearFilters,
    
    // Pagination
    nextPage,
    prevPage,
    goToPage,
    
    // CRUD Operations
    createBooking,
    updateBooking,
    deleteBooking,
    
    // Status Operations
    confirmBooking,
    cancelBooking,
    completeBooking,
    updatePaymentStatus,
    
    // Utility Operations
    checkAvailability,
    bulkUpdateBookings,
    bulkDeleteBookings
  }
}
