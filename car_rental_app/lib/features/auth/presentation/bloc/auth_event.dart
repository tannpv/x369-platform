part of 'auth_bloc.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class AuthLoginRequested extends AuthEvent {
  final String email;
  final String password;

  const AuthLoginRequested({
    required this.email,
    required this.password,
  });

  @override
  List<Object> get props => [email, password];
}

class AuthRegisterRequested extends AuthEvent {
  final String email;
  final String password;
  final String firstName;
  final String lastName;
  final String phone;

  const AuthRegisterRequested({
    required this.email,
    required this.password,
    required this.firstName,
    required this.lastName,
    required this.phone,
  });

  @override
  List<Object> get props => [email, password, firstName, lastName, phone];
}

class AuthLogoutRequested extends AuthEvent {
  const AuthLogoutRequested();
}

class AuthStatusRequested extends AuthEvent {
  const AuthStatusRequested();
}

class AuthTokenExpired extends AuthEvent {
  const AuthTokenExpired();
}
