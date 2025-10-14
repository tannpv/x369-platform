import 'package:equatable/equatable.dart';

// Base failure class
abstract class Failure extends Equatable {
  final String message;
  final int? code;
  
  const Failure({
    required this.message,
    this.code,
  });
  
  @override
  List<Object?> get props => [message, code];
}

// Server failure
class ServerFailure extends Failure {
  const ServerFailure({
    required super.message,
    super.code,
  });
}

// Network failure
class NetworkFailure extends Failure {
  const NetworkFailure({
    required super.message,
    super.code,
  });
}

// Cache failure
class CacheFailure extends Failure {
  const CacheFailure({
    required super.message,
    super.code,
  });
}

// Validation failure
class ValidationFailure extends Failure {
  const ValidationFailure({
    required super.message,
    super.code,
  });
}

// Authentication failure
class AuthFailure extends Failure {
  const AuthFailure({
    required super.message,
    super.code,
  });
}

// Permission failure
class PermissionFailure extends Failure {
  const PermissionFailure({
    required super.message,
    super.code,
  });
}
