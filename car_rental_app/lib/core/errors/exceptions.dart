// Custom exceptions
class ServerException implements Exception {
  final String message;
  final int? statusCode;
  
  const ServerException({
    required this.message,
    this.statusCode,
  });
  
  @override
  String toString() => 'ServerException: $message (Status: $statusCode)';
}

class NetworkException implements Exception {
  final String message;
  
  const NetworkException({
    required this.message,
  });
  
  @override
  String toString() => 'NetworkException: $message';
}

class CacheException implements Exception {
  final String message;
  
  const CacheException({
    required this.message,
  });
  
  @override
  String toString() => 'CacheException: $message';
}

class ValidationException implements Exception {
  final String message;
  final Map<String, String>? fieldErrors;
  
  const ValidationException({
    required this.message,
    this.fieldErrors,
  });
  
  @override
  String toString() => 'ValidationException: $message';
}

class AuthException implements Exception {
  final String message;
  final int? statusCode;
  
  const AuthException({
    required this.message,
    this.statusCode,
  });
  
  @override
  String toString() => 'AuthException: $message (Status: $statusCode)';
}

class PermissionException implements Exception {
  final String message;
  
  const PermissionException({
    required this.message,
  });
  
  @override
  String toString() => 'PermissionException: $message';
}
