enum UserRole {
  customer('customer'),
  admin('admin');

  const UserRole(this.value);
  final String value;

  static UserRole fromString(String value) {
    return UserRole.values.firstWhere(
      (role) => role.value == value,
      orElse: () => UserRole.customer,
    );
  }
}

enum UserStatus {
  active('active'),
  inactive('inactive'),
  suspended('suspended');

  const UserStatus(this.value);
  final String value;

  static UserStatus fromString(String value) {
    return UserStatus.values.firstWhere(
      (status) => status.value == value,
      orElse: () => UserStatus.active,
    );
  }
}

class User {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final String phone;
  final UserRole role;
  final UserStatus status;
  final DateTime createdAt;
  final DateTime updatedAt;

  User({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.phone,
    required this.role,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      email: json['email'] as String,
      firstName: json['first_name'] as String,
      lastName: json['last_name'] as String,
      phone: json['phone'] as String,
      role: UserRole.fromString(json['role'] as String),
      status: UserStatus.fromString(json['status'] as String),
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'first_name': firstName,
      'last_name': lastName,
      'phone': phone,
      'role': role.value,
      'status': status.value,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  String get fullName => '$firstName $lastName';

  User copyWith({
    String? id,
    String? email,
    String? firstName,
    String? lastName,
    String? phone,
    UserRole? role,
    UserStatus? status,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      phone: phone ?? this.phone,
      role: role ?? this.role,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

class CreateUserRequest {
  final String email;
  final String password;
  final String firstName;
  final String lastName;
  final String phone;
  final UserRole role;

  CreateUserRequest({
    required this.email,
    required this.password,
    required this.firstName,
    required this.lastName,
    required this.phone,
    required this.role,
  });

  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'password': password,
      'first_name': firstName,
      'last_name': lastName,
      'phone': phone,
      'role': role.value,
    };
  }
}

class UpdateUserRequest {
  final String? firstName;
  final String? lastName;
  final String? phone;
  final UserStatus? status;

  UpdateUserRequest({
    this.firstName,
    this.lastName,
    this.phone,
    this.status,
  });

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> json = {};
    if (firstName != null) json['first_name'] = firstName;
    if (lastName != null) json['last_name'] = lastName;
    if (phone != null) json['phone'] = phone;
    if (status != null) json['status'] = status!.value;
    return json;
  }
}

class LoginRequest {
  final String email;
  final String password;

  LoginRequest({
    required this.email,
    required this.password,
  });

  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'password': password,
    };
  }
}

class LoginResponse {
  final User user;
  final String token;

  LoginResponse({
    required this.user,
    required this.token,
  });

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      user: User.fromJson(json['user'] as Map<String, dynamic>),
      token: json['token'] as String,
    );
  }
}
