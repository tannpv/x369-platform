import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

import '../../../core/network/dio_client.dart';
import '../../../core/network/api_endpoints.dart';
import '../../../core/network/api_response.dart';
import '../../../shared/models/user_model.dart';

@lazySingleton
class UserApiService {
  final DioClient _dioClient;
  
  UserApiService(this._dioClient);
  
  Future<ApiResponse<User>> getCurrentUser() async {
    try {
      // For now, we'll extract user ID from token or make a /me endpoint call
      // This is a simplified implementation
      final response = await _dioClient.dio.get('/users/me');
      
      final user = User.fromJson(response.data);
      return ApiResponse.success(user);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Failed to get user',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
  
  Future<ApiResponse<User>> getUserById(String id) async {
    try {
      final response = await _dioClient.dio.get(
        ApiEndpoints.userById(id),
      );
      
      final user = User.fromJson(response.data);
      return ApiResponse.success(user);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Failed to get user',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
  
  Future<ApiResponse<PaginatedResponse<User>>> getUsers({
    int limit = 20,
    int offset = 0,
  }) async {
    try {
      final response = await _dioClient.dio.get(
        ApiEndpoints.users,
        queryParameters: {
          'limit': limit,
          'offset': offset,
        },
      );
      
      final paginatedResponse = PaginatedResponse<User>.fromJson(
        response.data,
        User.fromJson,
        'users',
      );
      
      return ApiResponse.success(paginatedResponse);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Failed to get users',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
  
  Future<ApiResponse<User>> updateUser(String id, UpdateUserRequest request) async {
    try {
      final response = await _dioClient.dio.put(
        ApiEndpoints.userById(id),
        data: request.toJson(),
      );
      
      final user = User.fromJson(response.data);
      return ApiResponse.success(user);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Failed to update user',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
  
  Future<ApiResponse<void>> deleteUser(String id) async {
    try {
      await _dioClient.dio.delete(ApiEndpoints.userById(id));
      return ApiResponse.success(null);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Failed to delete user',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
}
