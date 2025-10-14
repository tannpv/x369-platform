import '../../../../core/errors/failures.dart';
import '../../../../core/utils/either.dart';
import '../../../../core/network/api_response.dart';
import '../../../../shared/models/vehicle_model.dart';
import '../../../../shared/models/location_model.dart';

abstract class VehicleRepository {
  Future<Either<Failure, PaginatedResponse<Vehicle>>> getVehicles({
    int limit = 20,
    int offset = 0,
    VehicleSearchFilter? filter,
  });
  
  Future<Either<Failure, PaginatedResponse<Vehicle>>> getAvailableVehicles({
    int limit = 20,
    int offset = 0,
    double? latitude,
    double? longitude,
    double? radius,
  });
  
  Future<Either<Failure, Vehicle>> getVehicleById(String id);
  
  Future<Either<Failure, Vehicle>> createVehicle(CreateVehicleRequest request);
  
  Future<Either<Failure, Vehicle>> updateVehicleLocation(String id, Location location);
  
  Future<Either<Failure, Vehicle>> updateVehicleStatus(String id, VehicleStatus status);
  
  Future<Either<Failure, Vehicle>> updateVehicleBattery(String id, int batteryLevel);
}
