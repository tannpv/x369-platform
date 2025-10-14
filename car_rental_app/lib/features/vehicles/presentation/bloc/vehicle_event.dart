part of 'vehicle_bloc.dart';

abstract class VehicleEvent extends Equatable {
  const VehicleEvent();

  @override
  List<Object?> get props => [];
}

class VehicleLoadRequested extends VehicleEvent {
  final int limit;
  final int offset;
  final VehicleSearchFilter? filter;

  const VehicleLoadRequested({
    this.limit = 20,
    this.offset = 0,
    this.filter,
  });

  @override
  List<Object?> get props => [limit, offset, filter];
}

class VehicleLoadMoreRequested extends VehicleEvent {
  const VehicleLoadMoreRequested();
}

class VehicleAvailableLoadRequested extends VehicleEvent {
  final int limit;
  final int offset;
  final double? latitude;
  final double? longitude;
  final double? radius;

  const VehicleAvailableLoadRequested({
    this.limit = 20,
    this.offset = 0,
    this.latitude,
    this.longitude,
    this.radius,
  });

  @override
  List<Object?> get props => [limit, offset, latitude, longitude, radius];
}

class VehicleDetailLoadRequested extends VehicleEvent {
  final String vehicleId;

  const VehicleDetailLoadRequested({
    required this.vehicleId,
  });

  @override
  List<Object> get props => [vehicleId];
}

class VehicleSearchFilterChanged extends VehicleEvent {
  final VehicleSearchFilter? filter;

  const VehicleSearchFilterChanged({
    this.filter,
  });

  @override
  List<Object?> get props => [filter];
}

class VehicleSearchRequested extends VehicleEvent {
  final String query;

  const VehicleSearchRequested({
    required this.query,
  });

  @override
  List<Object> get props => [query];
}

class VehicleRefreshRequested extends VehicleEvent {
  const VehicleRefreshRequested();
}
