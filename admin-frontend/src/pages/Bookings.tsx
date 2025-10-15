import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarIcon, MapPinIcon, UserIcon, TruckIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { bookingApi } from '../shared/api/services';
import Card from '../shared/components/Card';
import Table, { TableActions } from '../shared/components/Table';
import { PageLoading } from '../shared/components/LoadingSpinner';
import type { Booking, BookingFilter } from '../shared/types/api';

export default function Bookings() {
  const [filters, setFilters] = useState<BookingFilter>({
    limit: 10,
    offset: 0,
  });
  const [page, setPage] = useState(0);

  const queryClient = useQueryClient();

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => bookingApi.getBookings({ ...filters, offset: page * (filters.limit || 10) }),
  });

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Booking['status'] }) =>
      bookingApi.updateBooking(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: bookingApi.cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const handleStatusChange = (booking: Booking, newStatus: Booking['status']) => {
    updateBookingMutation.mutate({ id: booking.id, status: newStatus });
  };

  const handleCancel = (booking: Booking) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBookingMutation.mutate(booking.id);
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-success/10 text-success border border-success/20';
      case 'active': return 'bg-primary/10 text-primary border border-primary/20';
      case 'completed': return 'bg-muted/50 text-muted-foreground border border-border';
      case 'cancelled': return 'bg-destructive/10 text-destructive border border-destructive/20';
      case 'pending': return 'bg-warning/10 text-warning border border-warning/20';
      default: return 'bg-muted/50 text-muted-foreground border border-border';
    }
  };

  const columns = [
    {
      key: 'id' as keyof Booking,
      header: 'Booking ID',
      render: (id: string) => (
        <span className="font-mono text-sm font-medium text-foreground bg-muted/30 px-2 py-1 rounded border border-border">
          {id.slice(0, 8)}...
        </span>
      ),
    },
    {
      key: 'userId' as keyof Booking,
      header: 'User',
      render: (userId: string) => (
        <div className="flex items-center text-sm">
          <UserIcon className="h-4 w-4 mr-2 text-primary" />
          <span className="font-mono text-muted-foreground">{userId.slice(0, 8)}...</span>
        </div>
      ),
    },
    {
      key: 'vehicleId' as keyof Booking,
      header: 'Vehicle',
      render: (vehicleId: string) => (
        <div className="flex items-center text-sm">
          <TruckIcon className="h-4 w-4 mr-2 text-primary" />
          <span className="font-mono text-muted-foreground">{vehicleId.slice(0, 8)}...</span>
        </div>
      ),
    },
    {
      key: 'status' as keyof Booking,
      header: 'Status',
      render: (status: Booking['status']) => (
        <span className={`inline-flex px-3 py-1.5 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      key: 'startTime' as keyof Booking,
      header: 'Start Time',
      render: (startTime: string) => (
        <div className="flex items-center text-sm">
          <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
          <div>
            <div className="font-medium text-foreground">{format(new Date(startTime), 'MMM dd, yyyy')}</div>
            <div className="text-xs text-muted-foreground">{format(new Date(startTime), 'HH:mm')}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'pickupAddress' as keyof Booking,
      header: 'Pickup Location',
      render: (address: string) => (
        <div className="flex items-center text-sm max-w-32">
          <MapPinIcon className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
          <span className="truncate text-muted-foreground" title={address}>{address}</span>
        </div>
      ),
    },
    {
      key: 'cost' as keyof Booking,
      header: 'Cost',
      render: (cost: number | undefined) => (
        <span className="font-semibold text-foreground">
          {cost ? `$${cost.toFixed(2)}` : <span className="text-muted-foreground">Pending</span>}
        </span>
      ),
    },
    {
      key: 'actions' as keyof Booking,
      header: 'Actions',
      render: (_: any, booking: Booking) => (
        <TableActions>
          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <select
              value={booking.status}
              onChange={(e) => handleStatusChange(booking, e.target.value as Booking['status'])}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              disabled={updateBookingMutation.isPending}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          )}
          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <button
              onClick={() => handleCancel(booking)}
              className="text-destructive hover:text-destructive/80 text-sm px-3 py-1.5 border border-destructive/20 rounded-lg hover:bg-destructive/10 transition-colors font-medium"
              disabled={cancelBookingMutation.isPending}
            >
              Cancel
            </button>
          )}
        </TableActions>
      ),
    },
  ];

  if (isLoading) return <PageLoading />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Bookings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage vehicle reservations and trips</p>
      </div>

      {/* Filters */}
      <Card title="Filters">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
              className="w-full border border-border rounded-lg px-3 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value || undefined })}
              className="w-full border border-border rounded-lg px-3 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value || undefined })}
              className="w-full border border-border rounded-lg px-3 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ limit: 10, offset: 0 })}
              className="w-full px-4 py-2.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg transition-colors font-medium border border-border"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </Card>

      {/* Bookings Table */}
      <Card>
        <Table
          data={bookingsData?.data || []}
          columns={columns}
          loading={isLoading}
          emptyMessage="No bookings found."
        />
        
        {bookingsData && bookingsData.total > (filters.limit || 10) && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {page * (filters.limit || 10) + 1} to {Math.min((page + 1) * (filters.limit || 10), bookingsData.total)} of {bookingsData.total} bookings
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={(page + 1) * (filters.limit || 10) >= bookingsData.total}
                className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
