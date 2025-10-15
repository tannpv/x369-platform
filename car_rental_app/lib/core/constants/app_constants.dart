// App-wide constants
class AppConstants {
  // API Configuration
  static const String baseUrl = 'http://localhost:8000/api';
  static const Duration connectTimeout = Duration(milliseconds: 5000);
  static const Duration receiveTimeout = Duration(milliseconds: 3000);
  
  // Storage Keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';
  static const String themeKey = 'theme_mode';
  
  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;
  
  // Validation
  static const int minPasswordLength = 8;
  static const int maxNameLength = 50;
  
  // UI Constants
  static const double defaultPadding = 16.0;
  static const double defaultRadius = 12.0;
  static const double defaultElevation = 4.0;
  
  // Animation Durations
  static const Duration fastAnimation = Duration(milliseconds: 200);
  static const Duration normalAnimation = Duration(milliseconds: 300);
  static const Duration slowAnimation = Duration(milliseconds: 500);
  
  // Car Rental Specific
  static const List<String> fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
  static const List<String> transmissionTypes = ['Manual', 'Automatic'];
  static const List<String> carCategories = ['Economy', 'Compact', 'Midsize', 'Luxury', 'SUV'];
  
  // Date Formats
  static const String dateFormat = 'yyyy-MM-dd';
  static const String dateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
  static const String displayDateFormat = 'MMM dd, yyyy';
}



// Error Messages
class ErrorMessages {
  static const String networkError = 'Network connection failed. Please check your internet connection.';
  static const String serverError = 'Server error occurred. Please try again later.';
  static const String unauthorizedError = 'You are not authorized. Please login again.';
  static const String notFoundError = 'Requested resource not found.';
  static const String validationError = 'Please check your input and try again.';
  static const String unknownError = 'An unknown error occurred. Please try again.';
  
  // Auth specific
  static const String invalidCredentials = 'Invalid email or password.';
  static const String emailAlreadyExists = 'Email already exists.';
  static const String weakPassword = 'Password is too weak.';
  
  // Booking specific
  static const String vehicleNotAvailable = 'Vehicle is not available for the selected dates.';
  static const String invalidBookingDates = 'Invalid booking dates selected.';
  static const String bookingCancellationFailed = 'Failed to cancel booking.';
}
