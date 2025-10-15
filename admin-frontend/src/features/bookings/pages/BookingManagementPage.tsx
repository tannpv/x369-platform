/**
 * BookingManagementPage - Main page for managing bookings
 */

import { useState } from 'react'
import { PlusIcon, Squares2X2Icon, ListBulletIcon, TableCellsIcon, CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import {
  BookingStatsGrid, 
  BookingFilters, 
  BookingCard, 
  BookingModal,
  BookingTable,
  BookingBulkActions,
  BookingCalendar,
  BookingAnalytics
} from '../components'
import { useBookings } from '../hooks/useBookings'
import type { 
  Booking, 
  BookingWithDetails, 
  BookingFilters as BookingFiltersType,
  CreateBookingPayload,
  UpdateBookingPayload
} from '../../../shared/types/booking'

type ViewMode = 'grid' | 'list' | 'table' | 'calendar' | 'analytics'
type ModalMode = 'create' | 'edit' | 'view' | null

export function BookingManagementPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null)
  const [selectedBookings, setSelectedBookings] = useState<string[]>([])
  const [sortField, setSortField] = useState<string>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const {
    bookings,
    stats,
    filters,
    pagination,
    loading: isLoading,
    error: isError,
    updateFilters: setFilters,
    clearFilters,
    goToPage,
    createBooking,
    updateBooking,
    deleteBooking,
    bulkUpdateBookings,
    bulkDeleteBookings
  } = useBookings({ withDetails: true })

  // Type assertion since we're using withDetails: true
  const bookingsWithDetails = bookings as BookingWithDetails[]

  const handleOpenModal = (mode: Exclude<ModalMode, null>, booking?: BookingWithDetails) => {
    setModalMode(mode)
    setSelectedBooking(booking || null)
  }

  const handleCloseModal = () => {
    setModalMode(null)
    setSelectedBooking(null)
  }

  const handleCreateBooking = async (data: CreateBookingPayload) => {
    await createBooking(data)
    handleCloseModal()
  }

  const handleUpdateBooking = async (data: UpdateBookingPayload) => {
    if (selectedBooking) {
      await updateBooking(selectedBooking.id, data)
      handleCloseModal()
    }
  }

  const handleModalSubmit = async (data: CreateBookingPayload | UpdateBookingPayload) => {
    if (modalMode === 'create') {
      await handleCreateBooking(data as CreateBookingPayload)
    } else if (modalMode === 'edit') {
      await handleUpdateBooking(data as UpdateBookingPayload)
    }
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleBulkDelete = async (ids: string[]) => {
    // Use the bulkDeleteBookings from the hook
    await bulkDeleteBookings(ids)
    setSelectedBookings([])
  }

  const handleBulkUpdate = async (ids: string[], data: Partial<Booking>) => {
    // Use the bulkUpdateBookings from the hook
    await bulkUpdateBookings(ids, data)
    setSelectedBookings([])
  }



  const clearSelection = () => {
    setSelectedBookings([])
  }

  const handleDeleteBooking = async (booking: BookingWithDetails | Booking) => {
    if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      await deleteBooking(booking.id)
    }
  }

  const handleFiltersChange = (newFilters: BookingFiltersType) => {
    setFilters(newFilters)
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">
            <h3 className="text-lg font-medium">Error Loading Bookings</h3>
            <p className="mt-2">There was an error loading the booking data. Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage vehicle bookings, track reservations, and monitor rental activity
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Grid view"
            >
              <Squares2X2Icon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="List view"
            >
              <ListBulletIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Table view"
            >
              <TableCellsIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Calendar view"
            >
              <CalendarIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'analytics'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Analytics view"
            >
              <ChartBarIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Create Booking Button */}
          <button
            onClick={() => handleOpenModal('create')}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            New Booking
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <BookingStatsGrid 
        stats={stats || {
          total: 0,
          pending: 0,
          confirmed: 0,
          active: 0,
          completed: 0,
          cancelled: 0,
          totalRevenue: 0,
          averageBookingValue: 0,
          completionRate: 0,
          cancellationRate: 0,
          upcomingBookings: 0,
          byType: { hourly: 0, daily: 0, weekly: 0, monthly: 0 },
          byPaymentStatus: { pending: 0, paid: 0, failed: 0, refunded: 0, partial: 0 },
          monthlyRevenue: 0,
          recentBookings: 0
        }} 
        isLoading={isLoading}
      />

      {/* Filters */}
      <BookingFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={clearFilters}
        isLoading={isLoading}
      />

      {/* Bulk Actions */}
      {viewMode === 'table' && (
        <BookingBulkActions
          selectedBookings={selectedBookings}
          onBulkDelete={handleBulkDelete}
          onBulkUpdate={handleBulkUpdate}
          onClearSelection={clearSelection}
          isLoading={isLoading}
        />
      )}

      {/* Bookings Content */}
      <div className="space-y-4">
        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {isLoading ? (
              'Loading bookings...'
            ) : (
              `Showing ${bookingsWithDetails.length} of ${pagination.total} bookings`
            )}
          </div>
          
          {pagination.total > 0 && (
            <div className="text-sm text-gray-600">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && bookingsWithDetails.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <PlusIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-4">
              {Object.values(filters).some(v => v !== undefined && v !== null && v !== '' && v !== 'all')
                ? 'No bookings match your current filters. Try adjusting your search criteria.'
                : 'Get started by creating your first booking.'
              }
            </p>
            <button
              onClick={() => handleOpenModal('create')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Create First Booking
            </button>
          </div>
        )}

        {/* Bookings Views */}
        {!isLoading && bookingsWithDetails.length > 0 && (
          <>
            {/* Grid and List Views */}
            {(viewMode === 'grid' || viewMode === 'list') && (
              <div className={viewMode === 'grid' 
                ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" 
                : "space-y-4"
              }>
                {bookingsWithDetails.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onView={() => handleOpenModal('view', booking)}
                    onEdit={() => handleOpenModal('edit', booking)}
                    onDelete={() => handleDeleteBooking(booking)}
                    isLoading={isLoading}
                    className={viewMode === 'list' ? 'max-w-none' : ''}
                  />
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <BookingTable
                bookings={bookingsWithDetails}
                onView={(booking) => handleOpenModal('view', booking)}
                onEdit={(booking) => handleOpenModal('edit', booking)}
                onDelete={handleDeleteBooking}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
                isLoading={isLoading}
              />
            )}

            {/* Calendar View */}
            {viewMode === 'calendar' && (
              <BookingCalendar
                bookings={bookingsWithDetails}
                onBookingClick={(booking) => handleOpenModal('view', booking)}
                onDateClick={(date) => {
                  // Pre-populate modal with selected date
                  console.log('Selected date for new booking:', date)
                  handleOpenModal('create')
                }}
                isLoading={isLoading}
              />
            )}

            {/* Analytics View */}
            {viewMode === 'analytics' && (
              <>
                {stats ? (
                  <BookingAnalytics
                    bookings={bookingsWithDetails}
                    stats={stats}
                    isLoading={isLoading}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ChartBarIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Loading</h3>
                    <p className="text-gray-600">
                      Analytics data is being prepared. This will be available once booking data is loaded.
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Pagination */}
        {!isLoading && pagination.total > pagination.limit && (
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(pagination.page - 1)}
                disabled={!pagination.hasPrevPage || isLoading}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.limit)) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      disabled={isLoading}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        page === pagination.page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
              
              <button
                onClick={() => goToPage(pagination.page + 1)}
                disabled={!pagination.hasNextPage || isLoading}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={modalMode !== null}
        onClose={handleCloseModal}
        mode={modalMode === null ? 'view' : modalMode}
        booking={selectedBooking || undefined}
        onSubmit={handleModalSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
