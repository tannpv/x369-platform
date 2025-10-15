import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';

import '../../../../shared/models/user_model.dart';
import '../../domain/repositories/auth_repository.dart';

part 'auth_event.dart';
part 'auth_state.dart';

@injectable
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository _authRepository;

  AuthBloc(this._authRepository) : super(const AuthInitial()) {
    on<AuthLoginRequested>(_onLoginRequested);
    on<AuthRegisterRequested>(_onRegisterRequested);
    on<AuthLogoutRequested>(_onLogoutRequested);
    on<AuthStatusRequested>(_onStatusRequested);
    on<AuthTokenExpired>(_onTokenExpired);
  }

  Future<void> _onLoginRequested(
    AuthLoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    final loginRequest = LoginRequest(
      email: event.email,
      password: event.password,
    );

    final result = await _authRepository.login(loginRequest);

    result.fold(
      (failure) => emit(AuthError(
        message: failure.message,
        code: failure.code?.toString(),
      )),
      (loginResponse) => emit(AuthAuthenticated(
        user: loginResponse.user,
        token: loginResponse.token,
      )),
    );
  }

  Future<void> _onRegisterRequested(
    AuthRegisterRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    final registerRequest = CreateUserRequest(
      email: event.email,
      password: event.password,
      firstName: event.firstName,
      lastName: event.lastName,
      phone: event.phone,
      role: UserRole.customer, // Default to customer role
    );

    final result = await _authRepository.register(registerRequest);

    result.fold(
      (failure) => emit(AuthError(
        message: failure.message,
        code: failure.code?.toString(),
      )),
      (user) => emit(AuthRegistrationSuccess(user: user)),
    );
  }

  Future<void> _onLogoutRequested(
    AuthLogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    final result = await _authRepository.logout();

    result.fold(
      (failure) => emit(AuthError(
        message: failure.message,
        code: failure.code?.toString(),
      )),
      (_) => emit(const AuthUnauthenticated()),
    );
  }

  Future<void> _onStatusRequested(
    AuthStatusRequested event,
    Emitter<AuthState> emit,
  ) async {
    final isAuthenticated = await _authRepository.isAuthenticated();
    
    if (isAuthenticated) {
      // In a real app, you might want to validate the token or get user info
      final token = _authRepository.getCurrentToken();
      if (token != null) {
        // For now, we'll emit a minimal authenticated state
        // In production, you'd fetch user details
        emit(AuthAuthenticated(
          user: User(
            id: 'temp', // This should be fetched from API
            email: 'temp@example.com',
            firstName: 'User',
            lastName: 'Name',
            phone: '+1234567890',
            role: UserRole.customer,
            status: UserStatus.active,
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
          ),
          token: token,
        ));
      } else {
        emit(const AuthUnauthenticated());
      }
    } else {
      emit(const AuthUnauthenticated());
    }
  }

  Future<void> _onTokenExpired(
    AuthTokenExpired event,
    Emitter<AuthState> emit,
  ) async {
    await _authRepository.logout();
    emit(const AuthUnauthenticated());
  }
}
