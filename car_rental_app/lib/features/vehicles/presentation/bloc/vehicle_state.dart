part of 'vehicle_bloc.dart';

abstract class VehicleState extends Equatable {
  const VehicleState();

  @override
  List<Object?> get props => [];
}

class VehicleInitial extends VehicleState {
  const VehicleInitial();
}

class VehicleLoading extends VehicleState {
  const VehicleLoading();
}

class VehicleLoadingMore extends VehicleState {
  final List<Vehicle> vehicles;
  final bool hasMore;

  const VehicleLoadingMore({
    required this.vehicles,
    required this.hasMore,
  });

  @override
  List<Object> get props => [vehicles, hasMore];
}

class VehicleLoaded extends VehicleState {
  final List<Vehicle> vehicles;
  final bool hasMore;
  final VehicleSearchFilter? currentFilter;

  const VehicleLoaded({
    required this.vehicles,
    required this.hasMore,
    this.currentFilter,
  });

  @override
  List<Object?> get props => [vehicles, hasMore, currentFilter];

  VehicleLoaded copyWith({
    List<Vehicle>? vehicles,
    bool? hasMore,
    VehicleSearchFilter? currentFilter,
  }) {
    return VehicleLoaded(
      vehicles: vehicles ?? this.vehicles,
      hasMore: hasMore ?? this.hasMore,
      currentFilter: currentFilter ?? this.currentFilter,
    );
  }
}

class VehicleDetailLoaded extends VehicleState {
  final Vehicle vehicle;

  const VehicleDetailLoaded({
    required this.vehicle,
  });

  @override
  List<Object> get props => [vehicle];
}

class VehicleError extends VehicleState {
  final String message;
  final String? code;
  final List<Vehicle> vehicles;

  const VehicleError({
    required this.message,
    this.code,
    this.vehicles = const [],
  });

  @override
  List<Object?> get props => [message, code, vehicles];
}

class VehicleEmpty extends VehicleState {
  final String message;

  const VehicleEmpty({
    this.message = 'No vehicles found',
  });

  @override
  List<Object> get props => [message];
}
