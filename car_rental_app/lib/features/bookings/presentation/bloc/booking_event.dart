part of 'booking_bloc.dart';

abstract class BookingEvent extends Equatable {
  const BookingEvent();

  @override
  List<Object?> get props => [];
}

class BookingLoadRequested extends BookingEvent {
  final BookingFilter? filter;

  const BookingLoadRequested({
    this.filter,
  });

  @override
  List<Object?> get props => [filter];
}

class BookingLoadMoreRequested extends BookingEvent {
  const BookingLoadMoreRequested();
}

class BookingUserLoadRequested extends BookingEvent {
  final String userId;
  final int limit;
  final int offset;

  const BookingUserLoadRequested({
    required this.userId,
    this.limit = 20,
    this.offset = 0,
  });

  @override
  List<Object> get props => [userId, limit, offset];
}

class BookingActiveLoadRequested extends BookingEvent {
  final int limit;
  final int offset;

  const BookingActiveLoadRequested({
    this.limit = 20,
    this.offset = 0,
  });

  @override
  List<Object> get props => [limit, offset];
}

class BookingDetailLoadRequested extends BookingEvent {
  final String bookingId;

  const BookingDetailLoadRequested({
    required this.bookingId,
  });

  @override
  List<Object> get props => [bookingId];
}

class BookingCreateRequested extends BookingEvent {
  final String userId;
  final String vehicleId;
  final DateTime startTime;
  final double pickupLatitude;
  final double pickupLongitude;
  final String pickupAddress;
  final double? dropoffLatitude;
  final double? dropoffLongitude;
  final String? dropoffAddress;

  const BookingCreateRequested({
    required this.userId,
    required this.vehicleId,
    required this.startTime,
    required this.pickupLatitude,
    required this.pickupLongitude,
    required this.pickupAddress,
    this.dropoffLatitude,
    this.dropoffLongitude,
    this.dropoffAddress,
  });

  @override
  List<Object?> get props => [
        userId,
        vehicleId,
        startTime,
        pickupLatitude,
        pickupLongitude,
        pickupAddress,
        dropoffLatitude,
        dropoffLongitude,
        dropoffAddress,
      ];
}

class BookingCancelRequested extends BookingEvent {
  final String bookingId;

  const BookingCancelRequested({
    required this.bookingId,
  });

  @override
  List<Object> get props => [bookingId];
}

class BookingStartRequested extends BookingEvent {
  final String bookingId;

  const BookingStartRequested({
    required this.bookingId,
  });

  @override
  List<Object> get props => [bookingId];
}

class BookingCompleteRequested extends BookingEvent {
  final String bookingId;

  const BookingCompleteRequested({
    required this.bookingId,
  });

  @override
  List<Object> get props => [bookingId];
}

class BookingRefreshRequested extends BookingEvent {
  const BookingRefreshRequested();
}
