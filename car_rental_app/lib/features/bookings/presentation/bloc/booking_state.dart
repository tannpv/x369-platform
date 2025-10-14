part of 'booking_bloc.dart';

abstract class BookingState extends Equatable {
  const BookingState();

  @override
  List<Object?> get props => [];
}

class BookingInitial extends BookingState {
  const BookingInitial();
}

class BookingLoading extends BookingState {
  const BookingLoading();
}

class BookingLoadingMore extends BookingState {
  final List<Booking> bookings;
  final bool hasMore;

  const BookingLoadingMore({
    required this.bookings,
    required this.hasMore,
  });

  @override
  List<Object> get props => [bookings, hasMore];
}

class BookingLoaded extends BookingState {
  final List<Booking> bookings;
  final bool hasMore;
  final BookingFilter? currentFilter;

  const BookingLoaded({
    required this.bookings,
    required this.hasMore,
    this.currentFilter,
  });

  @override
  List<Object?> get props => [bookings, hasMore, currentFilter];

  BookingLoaded copyWith({
    List<Booking>? bookings,
    bool? hasMore,
    BookingFilter? currentFilter,
  }) {
    return BookingLoaded(
      bookings: bookings ?? this.bookings,
      hasMore: hasMore ?? this.hasMore,
      currentFilter: currentFilter ?? this.currentFilter,
    );
  }
}

class BookingDetailLoaded extends BookingState {
  final Booking booking;

  const BookingDetailLoaded({
    required this.booking,
  });

  @override
  List<Object> get props => [booking];
}

class BookingActionLoading extends BookingState {
  final String action;
  final String bookingId;

  const BookingActionLoading({
    required this.action,
    required this.bookingId,
  });

  @override
  List<Object> get props => [action, bookingId];
}

class BookingActionSuccess extends BookingState {
  final String action;
  final Booking booking;
  final String message;

  const BookingActionSuccess({
    required this.action,
    required this.booking,
    required this.message,
  });

  @override
  List<Object> get props => [action, booking, message];
}

class BookingCreated extends BookingState {
  final Booking booking;

  const BookingCreated({
    required this.booking,
  });

  @override
  List<Object> get props => [booking];
}

class BookingError extends BookingState {
  final String message;
  final String? code;
  final String? action;

  const BookingError({
    required this.message,
    this.code,
    this.action,
  });

  @override
  List<Object?> get props => [message, code, action];
}

class BookingEmpty extends BookingState {
  final String message;

  const BookingEmpty({
    this.message = 'No bookings found',
  });

  @override
  List<Object> get props => [message];
}
