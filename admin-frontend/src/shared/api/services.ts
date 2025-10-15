import apiClient from './client';
import type { 
  User, 
  CreateUserRequest, 
  Vehicle, 
  CreateVehicleRequest, 
  Booking, 
  BookingStats,
  BookingFilter,
  Notification,
  NotificationStats,
  DashboardStats,
  PaginatedResponse
} from '../types/api';

// User API
export const userApi = {
  getUsers: async (limit = 10, offset = 0): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get(`/api/v1/users?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/api/v1/users/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post('/api/v1/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put(`/api/v1/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/users/${id}`);
  },

  getUserStats: async (): Promise<{ totalUsers: number; activeUsers: number }> => {
    const response = await apiClient.get('/api/v1/users/stats');
    return response.data;
  }
};

// Vehicle API
export const vehicleApi = {
  getVehicles: async (limit = 10, offset = 0): Promise<PaginatedResponse<Vehicle>> => {
    const response = await apiClient.get(`/api/v1/vehicles?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  getVehicleById: async (id: string): Promise<Vehicle> => {
    const response = await apiClient.get(`/api/v1/vehicles/${id}`);
    return response.data;
  },

  createVehicle: async (data: CreateVehicleRequest): Promise<Vehicle> => {
    const response = await apiClient.post('/api/v1/vehicles', data);
    return response.data;
  },

  updateVehicle: async (id: string, data: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await apiClient.put(`/api/v1/vehicles/${id}`, data);
    return response.data;
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/v1/vehicles/${id}`);
  },

  updateVehicleStatus: async (id: string, status: Vehicle['status']): Promise<Vehicle> => {
    const response = await apiClient.patch(`/api/v1/vehicles/${id}/status`, { status });
    return response.data;
  },

  getVehicleStats: async (): Promise<{
    totalVehicles: number;
    availableVehicles: number;
    inUseVehicles: number;
    maintenanceVehicles: number;
  }> => {
    const response = await apiClient.get('/api/v1/vehicles/stats');
    return response.data;
  }
};

// Booking API
export const bookingApi = {
  getBookings: async (filter: BookingFilter = {}): Promise<PaginatedResponse<Booking>> => {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });
    
    const response = await apiClient.get(`/api/v1/bookings?${params.toString()}`);
    return response.data;
  },

  getBookingById: async (id: string): Promise<Booking> => {
    const response = await apiClient.get(`/api/v1/bookings/${id}`);
    return response.data;
  },

  updateBooking: async (id: string, data: Partial<Booking>): Promise<Booking> => {
    const response = await apiClient.put(`/api/v1/bookings/${id}`, data);
    return response.data;
  },

  cancelBooking: async (id: string): Promise<void> => {
    await apiClient.post(`/api/v1/bookings/${id}/cancel`);
  },

  getActiveBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get('/api/v1/bookings/active');
    return response.data;
  },

  getBookingStats: async (userId?: string): Promise<BookingStats> => {
    const params = userId ? `?user_id=${userId}` : '';
    const response = await apiClient.get(`/api/v1/bookings/stats${params}`);
    return response.data;
  },

  getUserBookings: async (userId: string, limit = 10, offset = 0): Promise<Booking[]> => {
    const response = await apiClient.get(`/api/v1/users/${userId}/bookings?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  getVehicleBookings: async (vehicleId: string, limit = 10, offset = 0): Promise<Booking[]> => {
    const response = await apiClient.get(`/api/v1/vehicles/${vehicleId}/bookings?limit=${limit}&offset=${offset}`);
    return response.data;
  }
};

// Notification API
export const notificationApi = {
  getNotifications: async (userId?: string, limit = 20, offset = 0): Promise<PaginatedResponse<Notification>> => {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (userId) params.append('user_id', userId);
    
    const response = await apiClient.get(`/api/v1/notifications?${params.toString()}`);
    return response.data;
  },

  getNotificationById: async (id: string): Promise<Notification> => {
    const response = await apiClient.get(`/api/v1/notifications/${id}`);
    return response.data;
  },

  createNotification: async (data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    priority?: string;
    data?: Record<string, any>;
  }): Promise<Notification> => {
    const response = await apiClient.post('/api/v1/notifications', data);
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.post(`/api/v1/notifications/${id}/read`);
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    await apiClient.post(`/api/v1/users/${userId}/notifications/mark-all-read`);
  },

  sendPendingNotifications: async (): Promise<void> => {
    await apiClient.post('/api/v1/notifications/send-pending');
  },

  getNotificationStats: async (userId?: string): Promise<NotificationStats> => {
    const params = userId ? `?user_id=${userId}` : '';
    const response = await apiClient.get(`/api/v1/notifications/stats${params}`);
    return response.data;
  }
};

// Dashboard API
export const dashboardApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    // Aggregate data from multiple endpoints
    const [userStats, vehicleStats, bookingStats, recentBookings] = await Promise.all([
      userApi.getUserStats(),
      vehicleApi.getVehicleStats(),
      bookingApi.getBookingStats(),
      bookingApi.getBookings({ limit: 10, offset: 0 })
    ]);

    // Mock some additional dashboard data for now
    const dashboardStats: DashboardStats = {
      totalUsers: userStats.totalUsers,
      totalVehicles: vehicleStats.totalVehicles,
      activeBookings: bookingStats.activeBookings,
      totalRevenue: bookingStats.totalRevenue,
      recentBookings: recentBookings.data,
      vehicleStatusDistribution: {
        available: vehicleStats.availableVehicles,
        in_use: vehicleStats.inUseVehicles,
        maintenance: vehicleStats.maintenanceVehicles,
        offline: vehicleStats.totalVehicles - vehicleStats.availableVehicles - vehicleStats.inUseVehicles - vehicleStats.maintenanceVehicles
      },
      bookingTrends: [
        // Mock data - in real implementation, this would come from analytics API
        { date: '2025-10-04', bookings: 45, revenue: 2340 },
        { date: '2025-10-05', bookings: 52, revenue: 2680 },
        { date: '2025-10-06', bookings: 48, revenue: 2450 },
        { date: '2025-10-07', bookings: 61, revenue: 3120 },
        { date: '2025-10-08', bookings: 55, revenue: 2890 },
        { date: '2025-10-09', bookings: 67, revenue: 3450 },
        { date: '2025-10-10', bookings: 43, revenue: 2210 }
      ]
    };

    return dashboardStats;
  }
};

// Health check API
export const healthApi = {
  checkHealth: async (): Promise<{ status: string; services: Record<string, string> }> => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  checkServiceHealth: async (service: string): Promise<{ status: string }> => {
    const response = await apiClient.get(`/api/v1/services/${service}/health`);
    return response.data;
  }
};
