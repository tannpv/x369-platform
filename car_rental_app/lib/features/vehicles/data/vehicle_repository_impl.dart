import 'package:injectable/injectable.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/utils/either.dart';
import '../../../../core/network/api_response.dart';
import '../../../../core/utils/logger.dart';
import '../../../../shared/models/vehicle_model.dart';
import '../../../../shared/models/location_model.dart';
import '../domain/repositories/vehicle_repository.dart';
import 'vehicle_api_service.dart';

@LazySingleton(as: VehicleRepository)
class VehicleRepositoryImpl implements VehicleRepository {
  final VehicleApiService _apiService;
  
  VehicleRepositoryImpl(this._apiService);
  
  @override
  Future<Either<Failure, PaginatedResponse<Vehicle>>> getVehicles({
    int limit = 20,
    int offset = 0,
    VehicleSearchFilter? filter,
  }) async {
    AppLogger.i('VehicleRepository: Starting getVehicles API call');
    AppLogger.d('Parameters - limit: $limit, offset: $offset, filter: $filter');
    
    try {
      final response = await _apiService.getVehicles(
        limit: limit,
        offset: offset,
        filter: filter,
      );
      
      AppLogger.i('VehicleRepository: API call successful, got ${response.data?.items.length ?? 0} vehicles');
      
      if (response.success && response.data != null) {
        return Right(response.data!);
      } else {
        AppLogger.w('VehicleRepository: API returned unsuccessful response: ${response.message}');
        return Left(ServerFailure(message: response.message ?? 'Failed to load vehicles'));
      }
    } catch (e, stackTrace) {
      AppLogger.e('VehicleRepository: API call failed', e, stackTrace);
      
      // Fallback to mock data if API fails
      AppLogger.i('VehicleRepository: Falling back to mock data');
      await Future.delayed(const Duration(milliseconds: 300)); // Shorter delay for fallback
      
      final mockVehicles = [
      Vehicle(
        id: '1',
        make: 'Tesla',
        model: 'Model 3',
        year: 2024,
        licensePlate: 'ELC001',
        vin: '1111222233',
        color: 'Black',
        status: VehicleStatus.available,
        location: Location(latitude: 37.7949, longitude: -122.3994, address: 'San Francisco, CA'),
        batteryLevel: 85,
        fuelLevel: 100,
        mileage: 12500,
        features: ['Autopilot', 'Supercharging', 'Premium Audio'],
        createdAt: DateTime.now().subtract(const Duration(days: 30)),
        updatedAt: DateTime.now(),
        brand: 'Tesla',
        name: 'Model 3',
        type: 'Electric Sedan',
        fuelType: 'Electric',
        transmission: 'Automatic',
        seats: 5,
        pricePerHour: 75.0,
        images: [],
        description: 'Premium electric sedan with advanced autopilot features',
        available: true,
      ),
      Vehicle(
        id: '2',
        make: 'Honda',
        model: 'Civic',
        year: 2022,
        licensePlate: 'XYZ789',
        vin: '9876543210',
        color: 'Blue',
        status: VehicleStatus.available,
        location: Location(latitude: 37.7849, longitude: -122.4094, address: 'Downtown San Francisco, CA'),
        batteryLevel: 0,
        fuelLevel: 90,
        mileage: 25000,
        features: ['Bluetooth', 'USB', 'Backup Camera'],
        createdAt: DateTime.now().subtract(const Duration(days: 60)),
        updatedAt: DateTime.now(),
        brand: 'Honda',
        name: 'Civic',
        type: 'Compact Sedan',
        fuelType: 'Gasoline',
        transmission: 'Manual',
        seats: 5,
        pricePerHour: 45.0,
        images: [],
        description: 'Reliable and fuel-efficient compact car',
        available: true,
      ),
      Vehicle(
        id: '3',
        make: 'Toyota',
        model: 'Camry',
        year: 2023,
        licensePlate: 'ABC123',
        vin: '1234567890',
        color: 'White',
        status: VehicleStatus.available,
        location: Location(latitude: 37.7749, longitude: -122.4194, address: 'Mission District, San Francisco, CA'),
        batteryLevel: 0,
        fuelLevel: 80,
        mileage: 15000,
        features: ['GPS', 'AC', 'Lane Assist'],
        createdAt: DateTime.now().subtract(const Duration(days: 45)),
        updatedAt: DateTime.now(),
        brand: 'Toyota',
        name: 'Camry',
        type: 'Midsize Sedan',
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        seats: 5,
        pricePerHour: 55.0,
        images: [],
        description: 'Spacious and comfortable midsize sedan',
        available: true,
      ),
    ];
    
    // Apply search filter if provided
    var filteredVehicles = mockVehicles;
    if (filter != null && filter.searchQuery != null && filter.searchQuery!.isNotEmpty) {
      filteredVehicles = mockVehicles.where((vehicle) {
        final query = filter.searchQuery!.toLowerCase();
        return vehicle.brand.toLowerCase().contains(query) ||
               vehicle.name.toLowerCase().contains(query) ||
               vehicle.make.toLowerCase().contains(query) ||
               vehicle.model.toLowerCase().contains(query);
      }).toList();
    }
    
    final response = PaginatedResponse<Vehicle>(
      items: filteredVehicles,
      total: filteredVehicles.length,
      limit: limit,
      offset: offset,
    );
    
    AppLogger.d('VehicleRepository: Returning ${filteredVehicles.length} mock vehicles');
    return Right(response);
    }
  }
  
  @override
  Future<Either<Failure, PaginatedResponse<Vehicle>>> getAvailableVehicles({
    int limit = 20,
    int offset = 0,
    double? latitude,
    double? longitude,
    double? radius,
  }) async {
    try {
      final response = await _apiService.getAvailableVehicles(
        limit: limit,
        offset: offset,
        latitude: latitude,
        longitude: longitude,
        radius: radius,
      );
      
      if (response.success && response.data != null) {
        return Right(response.data!);
      } else {
        return Left(ServerFailure(
          message: response.message ?? 'Failed to get available vehicles',
          code: response.statusCode,
        ));
      }
    } catch (e) {
      return Left(ServerFailure(
        message: e.toString(),
      ));
    }
  }
  
  @override
  Future<Either<Failure, Vehicle>> getVehicleById(String id) async {
    try {
      final response = await _apiService.getVehicleById(id);
      
      if (response.success && response.data != null) {
        return Right(response.data!);
      } else {
        return Left(ServerFailure(
          message: response.message ?? 'Failed to get vehicle',
          code: response.statusCode,
        ));
      }
    } catch (e) {
      return Left(ServerFailure(
        message: e.toString(),
      ));
    }
  }
  
  @override
  Future<Either<Failure, Vehicle>> createVehicle(CreateVehicleRequest request) async {
    try {
      final response = await _apiService.createVehicle(request);
      
      if (response.success && response.data != null) {
        return Right(response.data!);
      } else {
        return Left(ServerFailure(
          message: response.message ?? 'Failed to create vehicle',
          code: response.statusCode,
        ));
      }
    } catch (e) {
      return Left(ServerFailure(
        message: e.toString(),
      ));
    }
  }
  
  @override
  Future<Either<Failure, Vehicle>> updateVehicleLocation(String id, Location location) async {
    try {
      final response = await _apiService.updateVehicleLocation(id, location);
      
      if (response.success && response.data != null) {
        return Right(response.data!);
      } else {
        return Left(ServerFailure(
          message: response.message ?? 'Failed to update vehicle location',
          code: response.statusCode,
        ));
      }
    } catch (e) {
      return Left(ServerFailure(
        message: e.toString(),
      ));
    }
  }
  
  @override
  Future<Either<Failure, Vehicle>> updateVehicleStatus(String id, VehicleStatus status) async {
    try {
      final response = await _apiService.updateVehicleStatus(id, status);
      
      if (response.success && response.data != null) {
        return Right(response.data!);
      } else {
        return Left(ServerFailure(
          message: response.message ?? 'Failed to update vehicle status',
          code: response.statusCode,
        ));
      }
    } catch (e) {
      return Left(ServerFailure(
        message: e.toString(),
      ));
    }
  }
  
  @override
  Future<Either<Failure, Vehicle>> updateVehicleBattery(String id, int batteryLevel) async {
    try {
      final response = await _apiService.updateVehicleBattery(id, batteryLevel);
      
      if (response.success && response.data != null) {
        return Right(response.data!);
      } else {
        return Left(ServerFailure(
          message: response.message ?? 'Failed to update vehicle battery',
          code: response.statusCode,
        ));
      }
    } catch (e) {
      return Left(ServerFailure(
        message: e.toString(),
      ));
    }
  }
}
