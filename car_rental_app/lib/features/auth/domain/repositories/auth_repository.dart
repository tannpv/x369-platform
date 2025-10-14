import '../../../../core/errors/failures.dart';
import '../../../../core/utils/either.dart';
import '../../../../shared/models/user_model.dart';

abstract class AuthRepository {
  Future<Either<Failure, LoginResponse>> login(LoginRequest request);
  Future<Either<Failure, User>> register(CreateUserRequest request);
  Future<Either<Failure, void>> logout();
  Future<bool> isAuthenticated();
  String? getCurrentToken();
}
