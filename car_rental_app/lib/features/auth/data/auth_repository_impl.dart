import 'package:injectable/injectable.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/utils/either.dart';
import '../../../../core/utils/logger.dart';
import '../../../../shared/models/user_model.dart';
import '../domain/repositories/auth_repository.dart';
import 'auth_api_service.dart';

@LazySingleton(as: AuthRepository)
class AuthRepositoryImpl implements AuthRepository {
  final AuthApiService _apiService;
  
  AuthRepositoryImpl(this._apiService);
  
  @override
  Future<Either<Failure, LoginResponse>> login(LoginRequest request) async {
    AppLogger.i('AuthRepository: Starting login for email: ${request.email}');
    
    try {
      final response = await _apiService.login(request);
      AppLogger.d('AuthRepository: API response received with status: ${response.success}');
      
      if (response.success && response.data != null) {
        AppLogger.i('AuthRepository: Login successful for user: ${response.data!.user.email}');
        return Right(response.data!);
      } else {
        AppLogger.w('AuthRepository: Login failed - ${response.message}');
        return Left(ServerFailure(
          message: response.message ?? 'Login failed',
          code: response.statusCode,
        ));
      }
    } catch (e, stackTrace) {
      AppLogger.e('AuthRepository: Login error', e, stackTrace);
      return Left(ServerFailure(
        message: e.toString(),
      ));
    }
  }
  
  @override
  Future<Either<Failure, User>> register(CreateUserRequest request) async {
    try {
      final response = await _apiService.register(request);
      
      if (response.success && response.data != null) {
        return Right(response.data!);
      } else {
        return Left(ServerFailure(
          message: response.message ?? 'Registration failed',
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
  Future<Either<Failure, void>> logout() async {
    try {
      final response = await _apiService.logout();
      
      if (response.success) {
        return const Right(null);
      } else {
        return Left(ServerFailure(
          message: response.message ?? 'Logout failed',
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
  Future<bool> isAuthenticated() async {
    return await _apiService.isAuthenticated();
  }
  
  @override
  String? getCurrentToken() {
    return _apiService.getCurrentToken();
  }
}
