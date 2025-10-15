import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

import '../../../core/network/dio_client.dart';
import '../../../core/network/api_endpoints.dart';
import '../../../core/network/api_response.dart';
import '../../../shared/models/user_model.dart';

@lazySingleton
class AuthApiService {
  final DioClient _dioClient;
  
  AuthApiService(this._dioClient);
  
  Future<ApiResponse<LoginResponse>> login(LoginRequest request) async {
    try {
      final response = await _dioClient.dio.post(
        ApiEndpoints.login,
        data: request.toJson(),
      );
      
      final loginResponse = LoginResponse.fromJson(response.data);
      
      // Store token
      await _dioClient.setToken(loginResponse.token);
      
      return ApiResponse.success(loginResponse);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Login failed',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
  
  Future<ApiResponse<User>> register(CreateUserRequest request) async {
    try {
      final response = await _dioClient.dio.post(
        ApiEndpoints.register,
        data: request.toJson(),
      );
      
      final user = User.fromJson(response.data);
      return ApiResponse.success(user);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Registration failed',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
  
  Future<ApiResponse<void>> logout() async {
    try {
      // Clear local token
      await _dioClient.clearToken();
      
      // Note: If backend has logout endpoint that invalidates token,
      // we would call it here:
      // await _dioClient.dio.post('/auth/logout');
      
      return ApiResponse.success(null);
    } catch (e) {
      return ApiResponse.error('Logout failed');
    }
  }
  
  Future<bool> isAuthenticated() async {
    return _dioClient.getToken() != null;
  }
  
  String? getCurrentToken() {
    return _dioClient.getToken();
  }
}
