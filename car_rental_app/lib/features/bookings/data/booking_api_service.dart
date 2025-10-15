import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

import '../../../core/network/dio_client.dart';
import '../../../core/network/api_endpoints.dart';
import '../../../core/network/api_response.dart';
import '../../../shared/models/booking_model.dart';

@lazySingleton
class BookingApiService {
  final DioClient _dioClient;
  
  BookingApiService(this._dioClient);
  
  Future<ApiResponse<PaginatedResponse<Booking>>> getBookings({
    BookingFilter? filter,
  }) async {
    try {
      final queryParams = filter?.toJson() ?? {'limit': 20, 'offset': 0};
      
      final response = await _dioClient.dio.get(
        ApiEndpoints.bookings,
        queryParameters: queryParams,
      );
      
      final paginatedResponse = PaginatedResponse<Booking>.fromJson(
        response.data,
        Booking.fromJson,
        'bookings',
      );
      
      return ApiResponse.success(paginatedResponse);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Failed to get bookings',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
  
  Future<ApiResponse<PaginatedResponse<Booking>>> getUserBookings(
    String userId, {
    int limit = 20,
    int offset = 0,
  }) async {
    try {
      final response = await _dioClient.dio.get(
        ApiEndpoints.userBookings(userId),
        queryParameters: {
          'limit': limit,
          'offset': offset,
        },
      );
      
      final paginatedResponse = PaginatedResponse<Booking>.fromJson(
        response.data,
        Booking.fromJson,
        'bookings',
      );
      
      return ApiResponse.success(paginatedResponse);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Failed to get user bookings',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
  
  Future<ApiResponse<PaginatedResponse<Booking>>> getActiveBookings({
    int limit = 20,
    int offset = 0,
  }) async {
    try {
      final response = await _dioClient.dio.get(
        ApiEndpoints.activeBookings,
        queryParameters: {
          'limit': limit,
          'offset': offset,
        },
      );
      
      final paginatedResponse = PaginatedResponse<Booking>.fromJson(
        response.data,
        Booking.fromJson,
        'bookings',
      );
      
      return ApiResponse.success(paginatedResponse);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Failed to get active bookings',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
  
  Future<ApiResponse<Booking>> getBookingById(String id) async {
    try {
      final response = await _dioClient.dio.get(
        ApiEndpoints.bookingById(id),
      );
      
      final booking = Booking.fromJson(response.data);
      return ApiResponse.success(booking);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Failed to get booking',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
  
  Future<ApiResponse<Booking>> createBooking(CreateBookingRequest request) async {
    try {
      final response = await _dioClient.dio.post(
        ApiEndpoints.bookings,
        data: request.toJson(),
      );
      
      final booking = Booking.fromJson(response.data);
      return ApiResponse.success(booking);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Failed to create booking',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
  
  Future<ApiResponse<Booking>> cancelBooking(String id) async {
    try {
      final response = await _dioClient.dio.post(
        ApiEndpoints.cancelBooking(id),
      );
      
      final booking = Booking.fromJson(response.data);
      return ApiResponse.success(booking);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Failed to cancel booking',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
  
  Future<ApiResponse<Booking>> startBooking(String id) async {
    try {
      final response = await _dioClient.dio.post(
        ApiEndpoints.startBooking(id),
      );
      
      final booking = Booking.fromJson(response.data);
      return ApiResponse.success(booking);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Failed to start booking',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
  
  Future<ApiResponse<Booking>> completeBooking(String id) async {
    try {
      final response = await _dioClient.dio.post(
        ApiEndpoints.completeBooking(id),
      );
      
      final booking = Booking.fromJson(response.data);
      return ApiResponse.success(booking);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Failed to complete booking',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
}
