import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../constants/app_constants.dart';
import '../utils/logger.dart';
import '../errors/exceptions.dart';

@lazySingleton
class DioClient {
  late final Dio _dio;
  SharedPreferences? _prefs;
  
  DioClient() {
    _dio = Dio();
    _initializePrefs();
    _setupInterceptors();
  }
  
  Dio get dio => _dio;
  
  Future<void> _initializePrefs() async {
    _prefs = await SharedPreferences.getInstance();
  }
  
  void _setupInterceptors() {
    _dio.options = BaseOptions(
      baseUrl: AppConstants.baseUrl,
      connectTimeout: AppConstants.connectTimeout,
      receiveTimeout: AppConstants.receiveTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    );
    
    // Request interceptor
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          AppLogger.d('REQUEST[${options.method}] => PATH: ${options.path}');
          AppLogger.d('REQUEST DATA: ${options.data}');
          handler.next(options);
        },
        onResponse: (response, handler) {
          AppLogger.d('RESPONSE[${response.statusCode}] => PATH: ${response.requestOptions.path}');
          AppLogger.d('RESPONSE DATA: ${response.data}');
          handler.next(response);
        },
        onError: (error, handler) {
          AppLogger.e('ERROR[${error.response?.statusCode}] => PATH: ${error.requestOptions.path}');
          AppLogger.e('ERROR MESSAGE: ${error.message}');
          handler.next(error);
        },
      ),
    );
    
    // Auth interceptor
    _dio.interceptors.add(AuthInterceptor(_prefs));
    
    // Error interceptor
    _dio.interceptors.add(ErrorInterceptor());
  }
  
  String? getToken() {
    return _prefs?.getString('auth_token');
  }
  
  Future<void> setToken(String token) async {
    await _prefs?.setString('auth_token', token);
  }
  
  Future<void> clearToken() async {
    await _prefs?.remove('auth_token');
  }
}

class AuthInterceptor extends Interceptor {
  final SharedPreferences? _prefs;
  
  AuthInterceptor(this._prefs);
  
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final token = _prefs?.getString('auth_token');
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }
  
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      AppLogger.w('Unauthorized request detected');
      // Clear token on 401
      _prefs?.remove('auth_token');
    }
    handler.next(err);
  }
}

class ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    Exception exception;
    
    switch (err.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        exception = NetworkException(
          message: 'Connection timeout. Please check your internet connection.',
        );
        break;
      case DioExceptionType.badResponse:
        final statusCode = err.response?.statusCode;
        final message = _extractErrorMessage(err.response?.data) ?? 
                        err.response?.statusMessage ?? 
                        'Server error occurred';
        
        if (statusCode == 401) {
          exception = AuthException(
            message: 'Authentication failed. Please login again.',
            statusCode: statusCode,
          );
        } else if (statusCode == 403) {
          exception = PermissionException(
            message: 'You don\'t have permission to perform this action.',
          );
        } else if (statusCode != null && statusCode >= 400 && statusCode < 500) {
          exception = ValidationException(
            message: message,
            fieldErrors: _extractFieldErrors(err.response?.data),
          );
        } else {
          exception = ServerException(
            message: message,
            statusCode: statusCode,
          );
        }
        break;
      case DioExceptionType.cancel:
        exception = NetworkException(
          message: 'Request was cancelled',
        );
        break;
      case DioExceptionType.unknown:
      default:
        exception = NetworkException(
          message: 'Network error occurred. Please check your connection.',
        );
        break;
    }
    
    handler.reject(DioException(
      requestOptions: err.requestOptions,
      error: exception,
      type: err.type,
      response: err.response,
    ));
  }
  
  String? _extractErrorMessage(dynamic data) {
    if (data is Map<String, dynamic>) {
      return data['message'] as String? ?? 
             data['error'] as String? ?? 
             data['detail'] as String?;
    }
    return null;
  }
  
  Map<String, String>? _extractFieldErrors(dynamic data) {
    if (data is Map<String, dynamic> && data.containsKey('errors')) {
      final errors = data['errors'];
      if (errors is Map<String, dynamic>) {
        return errors.map((key, value) => MapEntry(key, value.toString()));
      }
    }
    return null;
  }
}
