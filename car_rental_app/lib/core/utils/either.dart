/// A class that represents either a success or failure value.
/// Based on functional programming Either type.
abstract class Either<L, R> {
  const Either();
  
  /// Returns true if this is a Left value
  bool get isLeft;
  
  /// Returns true if this is a Right value  
  bool get isRight;
  
  /// Transforms the right value if present
  Either<L, T> map<T>(T Function(R) f);
  
  /// Transforms the left value if present
  Either<T, R> mapLeft<T>(T Function(L) f);
  
  /// Executes one of the provided functions based on the type
  T fold<T>(T Function(L) onLeft, T Function(R) onRight);
  
  /// Returns the right value or null
  R? getOrNull();
  
  /// Returns the left value or null
  L? getLeftOrNull();
}

/// Represents a failure/error value
class Left<L, R> extends Either<L, R> {
  final L value;
  
  const Left(this.value);
  
  @override
  bool get isLeft => true;
  
  @override
  bool get isRight => false;
  
  @override
  Either<L, T> map<T>(T Function(R) f) => Left<L, T>(value);
  
  @override
  Either<T, R> mapLeft<T>(T Function(L) f) => Left<T, R>(f(value));
  
  @override
  T fold<T>(T Function(L) onLeft, T Function(R) onRight) => onLeft(value);
  
  @override
  R? getOrNull() => null;
  
  @override
  L? getLeftOrNull() => value;
  
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Left<L, R> && value == other.value;
  
  @override
  int get hashCode => value.hashCode;
  
  @override
  String toString() => 'Left($value)';
}

/// Represents a success value
class Right<L, R> extends Either<L, R> {
  final R value;
  
  const Right(this.value);
  
  @override
  bool get isLeft => false;
  
  @override
  bool get isRight => true;
  
  @override
  Either<L, T> map<T>(T Function(R) f) => Right<L, T>(f(value));
  
  @override
  Either<T, R> mapLeft<T>(T Function(L) f) => Right<T, R>(value);
  
  @override
  T fold<T>(T Function(L) onLeft, T Function(R) onRight) => onRight(value);
  
  @override
  R? getOrNull() => value;
  
  @override
  L? getLeftOrNull() => null;
  
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Right<L, R> && value == other.value;
  
  @override
  int get hashCode => value.hashCode;
  
  @override
  String toString() => 'Right($value)';
}
