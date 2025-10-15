import 'package:injectable/injectable.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/utils/either.dart';
import '../../../../core/network/api_response.dart';
import '../../../../shared/models/booking_model.dart';
import '../domain/repositories/booking_repository.dart';
import 'booking_api_service.dart';

@LazySingleton(as: BookingRepository)
class BookingRepositoryImpl implements BookingRepository {
  final BookingApiService _apiService;
  
  BookingRepositoryImpl(this._apiService);
  
  @override
  Future<Either<Failure, PaginatedResponse<Booking>>> getBookings({
    BookingFilter? filter,
  }) async {
    try {
      final response = await _apiService.getBookings(filter: filter);
      
      if (response.success && response.data != null) {
        return Right(response.data!);
      } else {
        return Left(ServerFailure(
          message: response.message ?? 'Failed to get bookings',
          code: response.statusCode,
        ));
      }
    } catch (e) {
      return Left(ServerFailure(
        message: e.toString(),
      ));
    }
  }
  
  @override
  Future<Either<Failure, PaginatedResponse<Booking>>> getUserBookings(
    String userId, {
    int limit = 20,
    int offset = 0,
  }) async {
    try {
      final response = await _apiService.getUserBookings(
        userId,
        limit: limit,
        offset: offset,
      );
      
      if (response.success && response.data != null) {
        return Right(response.data!);
      } else {
        return Left(ServerFailure(
          message: response.message ?? 'Failed to get user bookings',
          code: response.statusCode,
        ));
      }
    } catch (e) {
      return Left(ServerFailure(
        message: e.toString(),
      ));
    }
  }
  
  @override
  Future<Either<Failure, PaginatedResponse<Booking>>> getActiveBookings({
    int limit = 20,
    int offset = 0,
  }) async {
    try {
      final response = await _apiService.getActiveBookings(
        limit: limit,
        offset: offset,
      );
      
      if (response.success && response.data != null) {
        return Right(response.data!);
      } else {
        return Left(ServerFailure(
          message: response.message ?? 'Failed to get active bookings',
          code: response.statusCode,
        ));
      }
    } catch (e) {
      return Left(ServerFailure(
        message: e.toString(),
      ));
    }
  }
  
  @override
  Future<Either<Failure, Booking>> getBookingById(String id) async {
    try {
      final response = await _apiService.getBookingById(id);
      
      if (response.success && response.data != null) {
        return Right(response.data!);
      } else {
        return Left(ServerFailure(
          message: response.message ?? 'Failed to get booking',
          code: response.statusCode,
        ));
      }
    } catch (e) {
      return Left(ServerFailure(
        message: e.toString(),
      ));
    }
  }
  
  @override
  Future<Either<Failure, Booking>> createBooking(CreateBookingRequest request) async {
    try {
      final response = await _apiService.createBooking(request);
      
      if (response.success && response.data != null) {
        return Right(response.data!);
      } else {
        return Left(ServerFailure(
          message: response.message ?? 'Failed to create booking',
          code: response.statusCode,
        ));
      }
    } catch (e) {
      return Left(ServerFailure(
        message: e.toString(),
      ));
    }
  }
  
  @override
  Future<Either<Failure, Booking>> cancelBooking(String id) async {
    try {
      final response = await _apiService.cancelBooking(id);
      
      if (response.success && response.data != null) {
        return Right(response.data!);
      } else {
        return Left(ServerFailure(
          message: response.message ?? 'Failed to cancel booking',
          code: response.statusCode,
        ));
      }
    } catch (e) {
      return Left(ServerFailure(
        message: e.toString(),
      ));
    }
  }
  
  @override
  Future<Either<Failure, Booking>> startBooking(String id) async {
    try {
      final response = await _apiService.startBooking(id);
      
      if (response.success && response.data != null) {
        return Right(response.data!);
      } else {
        return Left(ServerFailure(
          message: response.message ?? 'Failed to start booking',
          code: response.statusCode,
        ));
      }
    } catch (e) {
      return Left(ServerFailure(
        message: e.toString(),
      ));
    }
  }
  
  @override
  Future<Either<Failure, Booking>> completeBooking(String id) async {
    try {
      final response = await _apiService.completeBooking(id);
      
      if (response.success && response.data != null) {
        return Right(response.data!);
      } else {
        return Left(ServerFailure(
          message: response.message ?? 'Failed to complete booking',
          code: response.statusCode,
        ));
      }
    } catch (e) {
      return Left(ServerFailure(
        message: e.toString(),
      ));
    }
  }
}
