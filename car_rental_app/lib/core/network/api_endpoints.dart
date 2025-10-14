class ApiEndpoints {
  // Base URL - should be configured via environment
  static const String baseUrl = 'http://localhost:8000/api';
  
  // Auth endpoints
  static const String login = '/auth/login';
  static const String register = '/users';
  
  // User endpoints
  static const String users = '/users';
  static String userById(String id) => '/users/$id';
  static const String userStats = '/v1/users/stats';
  
  // Vehicle endpoints
  static const String vehicles = '/vehicles';
  static String vehicleById(String id) => '/vehicles/$id';
  static const String availableVehicles = '/vehicles/available';
  static const String vehicleStats = '/v1/vehicles/stats';
  static String vehicleLocation(String id) => '/vehicles/$id/location';
  static String vehicleStatus(String id) => '/vehicles/$id/status';
  static String vehicleBattery(String id) => '/vehicles/$id/battery';
  
  // Booking endpoints
  static const String bookings = '/bookings';
  static String bookingById(String id) => '/bookings/$id';
  static const String activeBookings = '/bookings/active';
  static const String bookingStats = '/v1/bookings/stats';
  static String userBookings(String userId) => '/users/$userId/bookings';
  static String vehicleBookings(String vehicleId) => '/vehicles/$vehicleId/bookings';
  static String cancelBooking(String id) => '/bookings/$id/cancel';
  static String startBooking(String id) => '/bookings/$id/start';
  static String completeBooking(String id) => '/bookings/$id/complete';
  
  // Notification endpoints
  static const String notifications = '/notifications';
  
  // Health check
  static const String health = '/health';
}
