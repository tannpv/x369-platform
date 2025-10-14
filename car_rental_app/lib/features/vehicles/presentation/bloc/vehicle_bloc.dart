import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';

import '../../../../shared/models/vehicle_model.dart';
import '../../domain/repositories/vehicle_repository.dart';

part 'vehicle_event.dart';
part 'vehicle_state.dart';

@injectable
class VehicleBloc extends Bloc<VehicleEvent, VehicleState> {
  final VehicleRepository _vehicleRepository;
  
  List<Vehicle> _vehicles = [];
  VehicleSearchFilter? _currentFilter;

  VehicleBloc(this._vehicleRepository) : super(const VehicleInitial()) {
    on<VehicleLoadRequested>(_onLoadRequested);
    on<VehicleLoadMoreRequested>(_onLoadMoreRequested);
    on<VehicleAvailableLoadRequested>(_onAvailableLoadRequested);
    on<VehicleDetailLoadRequested>(_onDetailLoadRequested);
    on<VehicleSearchRequested>(_onSearchRequested);
    on<VehicleSearchFilterChanged>(_onSearchFilterChanged);
    on<VehicleRefreshRequested>(_onRefreshRequested);
  }

  Future<void> _onLoadRequested(
    VehicleLoadRequested event,
    Emitter<VehicleState> emit,
  ) async {
    if (event.offset == 0) {
      emit(const VehicleLoading());
      _vehicles.clear();
    } else {
      emit(VehicleLoadingMore(vehicles: _vehicles, hasMore: true));
    }

    _currentFilter = event.filter;

    final result = await _vehicleRepository.getVehicles(
      limit: event.limit,
      offset: event.offset,
      filter: event.filter,
    );

    result.fold(
      (failure) => emit(VehicleError(
        message: failure.message,
        code: failure.code?.toString(),
      )),
      (paginatedResponse) {
        if (event.offset == 0) {
          _vehicles = paginatedResponse.items;
        } else {
          _vehicles.addAll(paginatedResponse.items);
        }

        if (_vehicles.isEmpty) {
          emit(const VehicleEmpty());
        } else {
          emit(VehicleLoaded(
            vehicles: List.from(_vehicles),
            hasMore: paginatedResponse.hasMore,
            currentFilter: _currentFilter,
          ));
        }
      },
    );
  }

  Future<void> _onLoadMoreRequested(
    VehicleLoadMoreRequested event,
    Emitter<VehicleState> emit,
  ) async {
    if (state is VehicleLoaded) {
      final currentState = state as VehicleLoaded;
      if (currentState.hasMore) {
        add(VehicleLoadRequested(
          offset: _vehicles.length,
          filter: _currentFilter,
        ));
      }
    }
  }

  Future<void> _onAvailableLoadRequested(
    VehicleAvailableLoadRequested event,
    Emitter<VehicleState> emit,
  ) async {
    if (event.offset == 0) {
      emit(const VehicleLoading());
      _vehicles.clear();
    } else {
      emit(VehicleLoadingMore(vehicles: _vehicles, hasMore: true));
    }

    final result = await _vehicleRepository.getAvailableVehicles(
      limit: event.limit,
      offset: event.offset,
      latitude: event.latitude,
      longitude: event.longitude,
      radius: event.radius,
    );

    result.fold(
      (failure) => emit(VehicleError(
        message: failure.message,
        code: failure.code?.toString(),
      )),
      (paginatedResponse) {
        if (event.offset == 0) {
          _vehicles = paginatedResponse.items;
        } else {
          _vehicles.addAll(paginatedResponse.items);
        }

        if (_vehicles.isEmpty) {
          emit(const VehicleEmpty(message: 'No available vehicles found'));
        } else {
          emit(VehicleLoaded(
            vehicles: List.from(_vehicles),
            hasMore: paginatedResponse.hasMore,
          ));
        }
      },
    );
  }

  Future<void> _onDetailLoadRequested(
    VehicleDetailLoadRequested event,
    Emitter<VehicleState> emit,
  ) async {
    emit(const VehicleLoading());

    final result = await _vehicleRepository.getVehicleById(event.vehicleId);

    result.fold(
      (failure) => emit(VehicleError(
        message: failure.message,
        code: failure.code?.toString(),
      )),
      (vehicle) => emit(VehicleDetailLoaded(vehicle: vehicle)),
    );
  }

  Future<void> _onSearchRequested(
    VehicleSearchRequested event,
    Emitter<VehicleState> emit,
  ) async {
    emit(const VehicleLoading());
    _vehicles.clear();

    // Create search filter with the query
    final searchFilter = VehicleSearchFilter(searchQuery: event.query);
    _currentFilter = searchFilter;

    final result = await _vehicleRepository.getVehicles(
      limit: 20,
      offset: 0,
      filter: searchFilter,
    );

    result.fold(
      (failure) => emit(VehicleError(
        message: failure.message,
        code: failure.code?.toString(),
        vehicles: _vehicles,
      )),
      (paginatedResponse) {
        _vehicles.addAll(paginatedResponse.items);
        if (_vehicles.isEmpty) {
          emit(const VehicleEmpty());
        } else {
          emit(VehicleLoaded(
            vehicles: _vehicles,
            hasMore: paginatedResponse.hasMore,
            currentFilter: _currentFilter,
          ));
        }
      },
    );
  }

  Future<void> _onSearchFilterChanged(
    VehicleSearchFilterChanged event,
    Emitter<VehicleState> emit,
  ) async {
    _currentFilter = event.filter;
    add(const VehicleLoadRequested(offset: 0));
  }

  Future<void> _onRefreshRequested(
    VehicleRefreshRequested event,
    Emitter<VehicleState> emit,
  ) async {
    add(VehicleLoadRequested(offset: 0, filter: _currentFilter));
  }
}
