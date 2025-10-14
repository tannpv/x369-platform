// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
}

// Vehicle types
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: 'available' | 'in_use' | 'maintenance' | 'offline';
  latitude: number;
  longitude: number;
  batteryLevel?: number;
  mileage: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleRequest {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  latitude: number;
  longitude: number;
  features: string[];
}

// Booking types
export interface Booking {
  id: string;
  userId: string;
  vehicleId: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  startTime: string;
  endTime?: string;
  pickupLatitude: number;
  pickupLongitude: number;
  pickupAddress: string;
  dropoffLatitude?: number;
  dropoffLongitude?: number;
  dropoffAddress?: string;
  distance?: number;
  duration?: number;
  cost?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  averageDistance: number;
  averageDuration: number;
}

export interface BookingFilter {
  userId?: string;
  vehicleId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  data?: Record<string, any>;
  readAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStats {
  totalNotifications: number;
  unreadCount: number;
  pendingCount: number;
  sentCount: number;
  failedCount: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

// Dashboard types
export interface DashboardStats {
  totalUsers: number;
  totalVehicles: number;
  activeBookings: number;
  totalRevenue: number;
  recentBookings: Booking[];
  vehicleStatusDistribution: {
    available: number;
    in_use: number;
    maintenance: number;
    offline: number;
  };
  bookingTrends: {
    date: string;
    bookings: number;
    revenue: number;
  }[];
}
