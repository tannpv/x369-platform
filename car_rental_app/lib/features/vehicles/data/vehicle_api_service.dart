import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

import '../../../core/network/dio_client.dart';
import '../../../core/network/api_endpoints.dart';
import '../../../core/network/api_response.dart';
import '../../../shared/models/vehicle_model.dart';
import '../../../shared/models/location_model.dart';

@lazySingleton
class VehicleApiService {
  final DioClient _dioClient;
  
  VehicleApiService(this._dioClient);
  
  Future<ApiResponse<PaginatedResponse<Vehicle>>> getVehicles({
    int limit = 20,
    int offset = 0,
    VehicleSearchFilter? filter,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'limit': limit,
        'offset': offset,
      };
      
      if (filter != null) {
        queryParams.addAll(filter.toJson());
      }
      
      final response = await _dioClient.dio.get(
        ApiEndpoints.vehicles,
        queryParameters: queryParams,
      );
      
      final paginatedResponse = PaginatedResponse<Vehicle>.fromJson(
        response.data,
        Vehicle.fromJson,
        'vehicles',
      );
      
      return ApiResponse.success(paginatedResponse);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Failed to get vehicles',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
  
  Future<ApiResponse<PaginatedResponse<Vehicle>>> getAvailableVehicles({
    int limit = 20,
    int offset = 0,
    double? latitude,
    double? longitude,
    double? radius,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'limit': limit,
        'offset': offset,
      };
      
      if (latitude != null) queryParams['latitude'] = latitude;
      if (longitude != null) queryParams['longitude'] = longitude;
      if (radius != null) queryParams['radius'] = radius;
      
      final response = await _dioClient.dio.get(
        ApiEndpoints.availableVehicles,
        queryParameters: queryParams,
      );
      
      final paginatedResponse = PaginatedResponse<Vehicle>.fromJson(
        response.data,
        Vehicle.fromJson,
        'vehicles',
      );
      
      return ApiResponse.success(paginatedResponse);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Failed to get available vehicles',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
  
  Future<ApiResponse<Vehicle>> getVehicleById(String id) async {
    try {
      final response = await _dioClient.dio.get(
        ApiEndpoints.vehicleById(id),
      );
      
      final vehicle = Vehicle.fromJson(response.data);
      return ApiResponse.success(vehicle);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Failed to get vehicle',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
  
  Future<ApiResponse<Vehicle>> createVehicle(CreateVehicleRequest request) async {
    try {
      final response = await _dioClient.dio.post(
        ApiEndpoints.vehicles,
        data: request.toJson(),
      );
      
      final vehicle = Vehicle.fromJson(response.data);
      return ApiResponse.success(vehicle);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Failed to create vehicle',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
  
  Future<ApiResponse<Vehicle>> updateVehicleLocation(
    String id,
    Location location,
  ) async {
    try {
      final response = await _dioClient.dio.put(
        ApiEndpoints.vehicleLocation(id),
        data: location.toJson(),
      );
      
      final vehicle = Vehicle.fromJson(response.data);
      return ApiResponse.success(vehicle);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Failed to update vehicle location',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
  
  Future<ApiResponse<Vehicle>> updateVehicleStatus(
    String id,
    VehicleStatus status,
  ) async {
    try {
      final response = await _dioClient.dio.put(
        ApiEndpoints.vehicleStatus(id),
        data: {'status': status.value},
      );
      
      final vehicle = Vehicle.fromJson(response.data);
      return ApiResponse.success(vehicle);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Failed to update vehicle status',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
  
  Future<ApiResponse<Vehicle>> updateVehicleBattery(
    String id,
    int batteryLevel,
  ) async {
    try {
      final response = await _dioClient.dio.put(
        ApiEndpoints.vehicleBattery(id),
        data: {'battery_level': batteryLevel},
      );
      
      final vehicle = Vehicle.fromJson(response.data);
      return ApiResponse.success(vehicle);
    } on DioException catch (e) {
      return ApiResponse.error(
        e.error?.toString() ?? 'Failed to update vehicle battery',
        statusCode: e.response?.statusCode,
      );
    } catch (e) {
      return ApiResponse.error('Unexpected error occurred');
    }
  }
}
