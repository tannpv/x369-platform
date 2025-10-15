import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';

import '../../../../shared/models/booking_model.dart';
import '../../domain/repositories/booking_repository.dart';

part 'booking_event.dart';
part 'booking_state.dart';

@injectable
class BookingBloc extends Bloc<BookingEvent, BookingState> {
  final BookingRepository _bookingRepository;
  
  List<Booking> _bookings = [];
  BookingFilter? _currentFilter;

  BookingBloc(this._bookingRepository) : super(const BookingInitial()) {
    on<BookingLoadRequested>(_onLoadRequested);
    on<BookingLoadMoreRequested>(_onLoadMoreRequested);
    on<BookingUserLoadRequested>(_onUserLoadRequested);
    on<BookingActiveLoadRequested>(_onActiveLoadRequested);
    on<BookingDetailLoadRequested>(_onDetailLoadRequested);
    on<BookingCreateRequested>(_onCreateRequested);
    on<BookingCancelRequested>(_onCancelRequested);
    on<BookingStartRequested>(_onStartRequested);
    on<BookingCompleteRequested>(_onCompleteRequested);
    on<BookingRefreshRequested>(_onRefreshRequested);
  }

  Future<void> _onLoadRequested(
    BookingLoadRequested event,
    Emitter<BookingState> emit,
  ) async {
    emit(const BookingLoading());
    _bookings.clear();
    _currentFilter = event.filter;

    final result = await _bookingRepository.getBookings(filter: event.filter);

    result.fold(
      (failure) => emit(BookingError(
        message: failure.message,
        code: failure.code?.toString(),
      )),
      (paginatedResponse) {
        _bookings = paginatedResponse.items;

        if (_bookings.isEmpty) {
          emit(const BookingEmpty());
        } else {
          emit(BookingLoaded(
            bookings: List.from(_bookings),
            hasMore: paginatedResponse.hasMore,
            currentFilter: _currentFilter,
          ));
        }
      },
    );
  }

  Future<void> _onLoadMoreRequested(
    BookingLoadMoreRequested event,
    Emitter<BookingState> emit,
  ) async {
    if (state is BookingLoaded) {
      final currentState = state as BookingLoaded;
      if (currentState.hasMore) {
        emit(BookingLoadingMore(
          bookings: _bookings,
          hasMore: true,
        ));

        final updatedFilter = _currentFilter?.copyWith(
          offset: _bookings.length,
        ) ?? BookingFilter(offset: _bookings.length);

        final result = await _bookingRepository.getBookings(filter: updatedFilter);

        result.fold(
          (failure) => emit(BookingError(
            message: failure.message,
            code: failure.code?.toString(),
          )),
          (paginatedResponse) {
            _bookings.addAll(paginatedResponse.items);
            emit(BookingLoaded(
              bookings: List.from(_bookings),
              hasMore: paginatedResponse.hasMore,
              currentFilter: _currentFilter,
            ));
          },
        );
      }
    }
  }

  Future<void> _onUserLoadRequested(
    BookingUserLoadRequested event,
    Emitter<BookingState> emit,
  ) async {
    if (event.offset == 0) {
      emit(const BookingLoading());
      _bookings.clear();
    } else {
      emit(BookingLoadingMore(bookings: _bookings, hasMore: true));
    }

    final result = await _bookingRepository.getUserBookings(
      event.userId,
      limit: event.limit,
      offset: event.offset,
    );

    result.fold(
      (failure) => emit(BookingError(
        message: failure.message,
        code: failure.code?.toString(),
      )),
      (paginatedResponse) {
        if (event.offset == 0) {
          _bookings = paginatedResponse.items;
        } else {
          _bookings.addAll(paginatedResponse.items);
        }

        if (_bookings.isEmpty) {
          emit(const BookingEmpty(message: 'No bookings found for this user'));
        } else {
          emit(BookingLoaded(
            bookings: List.from(_bookings),
            hasMore: paginatedResponse.hasMore,
          ));
        }
      },
    );
  }

  Future<void> _onActiveLoadRequested(
    BookingActiveLoadRequested event,
    Emitter<BookingState> emit,
  ) async {
    if (event.offset == 0) {
      emit(const BookingLoading());
      _bookings.clear();
    } else {
      emit(BookingLoadingMore(bookings: _bookings, hasMore: true));
    }

    final result = await _bookingRepository.getActiveBookings(
      limit: event.limit,
      offset: event.offset,
    );

    result.fold(
      (failure) => emit(BookingError(
        message: failure.message,
        code: failure.code?.toString(),
      )),
      (paginatedResponse) {
        if (event.offset == 0) {
          _bookings = paginatedResponse.items;
        } else {
          _bookings.addAll(paginatedResponse.items);
        }

        if (_bookings.isEmpty) {
          emit(const BookingEmpty(message: 'No active bookings found'));
        } else {
          emit(BookingLoaded(
            bookings: List.from(_bookings),
            hasMore: paginatedResponse.hasMore,
          ));
        }
      },
    );
  }

  Future<void> _onDetailLoadRequested(
    BookingDetailLoadRequested event,
    Emitter<BookingState> emit,
  ) async {
    emit(const BookingLoading());

    final result = await _bookingRepository.getBookingById(event.bookingId);

    result.fold(
      (failure) => emit(BookingError(
        message: failure.message,
        code: failure.code?.toString(),
      )),
      (booking) => emit(BookingDetailLoaded(booking: booking)),
    );
  }

  Future<void> _onCreateRequested(
    BookingCreateRequested event,
    Emitter<BookingState> emit,
  ) async {
    emit(const BookingActionLoading(action: 'create', bookingId: ''));

    final createRequest = CreateBookingRequest(
      userId: event.userId,
      vehicleId: event.vehicleId,
      startTime: event.startTime,
      pickupLatitude: event.pickupLatitude,
      pickupLongitude: event.pickupLongitude,
      pickupAddress: event.pickupAddress,
      dropoffLatitude: event.dropoffLatitude,
      dropoffLongitude: event.dropoffLongitude,
      dropoffAddress: event.dropoffAddress,
    );

    final result = await _bookingRepository.createBooking(createRequest);

    result.fold(
      (failure) => emit(BookingError(
        message: failure.message,
        code: failure.code?.toString(),
        action: 'create',
      )),
      (booking) => emit(BookingCreated(booking: booking)),
    );
  }

  Future<void> _onCancelRequested(
    BookingCancelRequested event,
    Emitter<BookingState> emit,
  ) async {
    emit(BookingActionLoading(action: 'cancel', bookingId: event.bookingId));

    final result = await _bookingRepository.cancelBooking(event.bookingId);

    result.fold(
      (failure) => emit(BookingError(
        message: failure.message,
        code: failure.code?.toString(),
        action: 'cancel',
      )),
      (booking) => emit(BookingActionSuccess(
        action: 'cancel',
        booking: booking,
        message: 'Booking cancelled successfully',
      )),
    );
  }

  Future<void> _onStartRequested(
    BookingStartRequested event,
    Emitter<BookingState> emit,
  ) async {
    emit(BookingActionLoading(action: 'start', bookingId: event.bookingId));

    final result = await _bookingRepository.startBooking(event.bookingId);

    result.fold(
      (failure) => emit(BookingError(
        message: failure.message,
        code: failure.code?.toString(),
        action: 'start',
      )),
      (booking) => emit(BookingActionSuccess(
        action: 'start',
        booking: booking,
        message: 'Booking started successfully',
      )),
    );
  }

  Future<void> _onCompleteRequested(
    BookingCompleteRequested event,
    Emitter<BookingState> emit,
  ) async {
    emit(BookingActionLoading(action: 'complete', bookingId: event.bookingId));

    final result = await _bookingRepository.completeBooking(event.bookingId);

    result.fold(
      (failure) => emit(BookingError(
        message: failure.message,
        code: failure.code?.toString(),
        action: 'complete',
      )),
      (booking) => emit(BookingActionSuccess(
        action: 'complete',
        booking: booking,
        message: 'Booking completed successfully',
      )),
    );
  }

  Future<void> _onRefreshRequested(
    BookingRefreshRequested event,
    Emitter<BookingState> emit,
  ) async {
    add(BookingLoadRequested(filter: _currentFilter));
  }
}
