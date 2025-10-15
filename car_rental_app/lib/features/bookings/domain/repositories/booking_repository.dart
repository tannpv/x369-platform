import '../../../../core/errors/failures.dart';
import '../../../../core/utils/either.dart';
import '../../../../core/network/api_response.dart';
import '../../../../shared/models/booking_model.dart';

abstract class BookingRepository {
  Future<Either<Failure, PaginatedResponse<Booking>>> getBookings({
    BookingFilter? filter,
  });
  
  Future<Either<Failure, PaginatedResponse<Booking>>> getUserBookings(
    String userId, {
    int limit = 20,
    int offset = 0,
  });
  
  Future<Either<Failure, PaginatedResponse<Booking>>> getActiveBookings({
    int limit = 20,
    int offset = 0,
  });
  
  Future<Either<Failure, Booking>> getBookingById(String id);
  
  Future<Either<Failure, Booking>> createBooking(CreateBookingRequest request);
  
  Future<Either<Failure, Booking>> cancelBooking(String id);
  
  Future<Either<Failure, Booking>> startBooking(String id);
  
  Future<Either<Failure, Booking>> completeBooking(String id);
}
