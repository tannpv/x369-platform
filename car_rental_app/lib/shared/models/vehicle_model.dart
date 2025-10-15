import 'location_model.dart';

enum VehicleStatus {
  available('available'),
  rented('rented'),
  maintenance('maintenance'),
  offline('offline');

  const VehicleStatus(this.value);
  final String value;

  static VehicleStatus fromString(String value) {
    return VehicleStatus.values.firstWhere(
      (status) => status.value == value,
      orElse: () => VehicleStatus.available,
    );
  }
}


class Vehicle {
  final String id;
  final String make;
  final String model;
  final int year;
  final String licensePlate;
  final String vin;
  final String color;
  final VehicleStatus status;
  final Location location;
  final int batteryLevel;
  final int fuelLevel;
  final int mileage;
  final List<String> features;
  final DateTime createdAt;
  final DateTime updatedAt;

  // Rental-specific properties
  final String brand;
  final String name;
  final String type;
  final String fuelType;
  final String transmission;
  final int seats;
  final double pricePerHour;
  final List<String> images;
  final String description;
  final bool available;

  Vehicle({
    required this.id,
    required this.make,
    required this.model,
    required this.year,
    required this.licensePlate,
    required this.vin,
    required this.color,
    required this.status,
    required this.location,
    required this.batteryLevel,
    required this.fuelLevel,
    required this.mileage,
    required this.features,
    required this.createdAt,
    required this.updatedAt,
    // Rental-specific defaults
    String? brand,
    String? name,
    String? type,
    String? fuelType,
    String? transmission,
    int? seats,
    double? pricePerHour,
    List<String>? images,
    String? description,
    bool? available,
  })  : brand = brand ?? make,
        name = name ?? model,
        type = type ?? 'Standard',
        fuelType = fuelType ?? 'Gasoline',
        transmission = transmission ?? 'Automatic',
        seats = seats ?? 5,
        pricePerHour = pricePerHour ?? 50.0,
        images = images ?? [],
        description = description ?? '',
        available = available ?? (status == VehicleStatus.available);

  factory Vehicle.fromJson(Map<String, dynamic> json) {
    return Vehicle(
      id: json['id'] as String,
      make: json['make'] as String,
      model: json['model'] as String,
      year: (json['year'] as num).toInt(),
      licensePlate: json['license_plate'] as String,
      vin: json['vin'] as String,
      color: json['color'] as String,
      status: VehicleStatus.fromString(json['status'] as String),
      location: Location.fromJson(json['location'] as Map<String, dynamic>),
      batteryLevel: (json['battery_level'] as num).toInt(),
      fuelLevel: (json['fuel_level'] as num).toInt(),
      mileage: (json['mileage'] as num).toInt(),
      features: (json['features'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
      // Rental-specific properties
      brand: json['brand'] as String? ?? '',
      name: json['name'] as String? ?? '',
      type: json['type'] as String? ?? 'Standard',
      fuelType: json['fuel_type'] as String? ?? 'Gasoline',
      transmission: json['transmission'] as String? ?? 'Automatic',
      seats: (json['seats'] as num?)?.toInt() ?? 5,
      pricePerHour: (json['price_per_hour'] as num?)?.toDouble() ?? 50.0,
      images: (json['images'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          [],
      description: json['description'] as String? ?? '',
      available: json['available'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'make': make,
      'model': model,
      'year': year,
      'license_plate': licensePlate,
      'vin': vin,
      'color': color,
      'status': status.value,
      'location': location.toJson(),
      'battery_level': batteryLevel,
      'fuel_level': fuelLevel,
      'mileage': mileage,
      'features': features,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
      // Rental-specific properties
      'brand': brand,
      'name': name,
      'type': type,
      'fuel_type': fuelType,
      'transmission': transmission,
      'seats': seats,
      'price_per_hour': pricePerHour,
      'images': images,
      'description': description,
      'available': available,
    };
  }

  String get displayName => '$make $model ($year)';
  bool get isElectric => batteryLevel > 0;
  bool get isAvailable => status == VehicleStatus.available;

  Vehicle copyWith({
    String? id,
    String? make,
    String? model,
    int? year,
    String? licensePlate,
    String? vin,
    String? color,
    VehicleStatus? status,
    Location? location,
    int? batteryLevel,
    int? fuelLevel,
    int? mileage,
    List<String>? features,
    DateTime? createdAt,
    DateTime? updatedAt,
    // Rental-specific properties
    String? brand,
    String? name,
    String? type,
    String? fuelType,
    String? transmission,
    int? seats,
    double? pricePerHour,
    List<String>? images,
    String? description,
    bool? available,
  }) {
    return Vehicle(
      id: id ?? this.id,
      make: make ?? this.make,
      model: model ?? this.model,
      year: year ?? this.year,
      licensePlate: licensePlate ?? this.licensePlate,
      vin: vin ?? this.vin,
      color: color ?? this.color,
      status: status ?? this.status,
      location: location ?? this.location,
      batteryLevel: batteryLevel ?? this.batteryLevel,
      fuelLevel: fuelLevel ?? this.fuelLevel,
      mileage: mileage ?? this.mileage,
      features: features ?? this.features,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      // Rental-specific properties
      brand: brand ?? this.brand,
      name: name ?? this.name,
      type: type ?? this.type,
      fuelType: fuelType ?? this.fuelType,
      transmission: transmission ?? this.transmission,
      seats: seats ?? this.seats,
      pricePerHour: pricePerHour ?? this.pricePerHour,
      images: images ?? this.images,
      description: description ?? this.description,
      available: available ?? this.available,
    );
  }
}

class CreateVehicleRequest {
  final String make;
  final String model;
  final int year;
  final String licensePlate;
  final String vin;
  final String color;
  final Location location;
  final List<String> features;

  CreateVehicleRequest({
    required this.make,
    required this.model,
    required this.year,
    required this.licensePlate,
    required this.vin,
    required this.color,
    required this.location,
    required this.features,
  });

  Map<String, dynamic> toJson() {
    return {
      'make': make,
      'model': model,
      'year': year,
      'license_plate': licensePlate,
      'vin': vin,
      'color': color,
      'location': location.toJson(),
      'features': features,
    };
  }
}

class VehicleSearchFilter {
  final String? searchQuery;
  final VehicleStatus? status;
  final String? make;
  final String? model;
  final String? type;
  final String? fuelType;
  final String? transmission;
  final int? yearFrom;
  final int? yearTo;
  final double? priceFrom;
  final double? priceTo;
  final int? seatsMin;
  final int? seatsMax;
  final double? latitude;
  final double? longitude;
  final double? radius; // in kilometers

  VehicleSearchFilter({
    this.searchQuery,
    this.status,
    this.make,
    this.model,
    this.type,
    this.fuelType,
    this.transmission,
    this.yearFrom,
    this.yearTo,
    this.priceFrom,
    this.priceTo,
    this.seatsMin,
    this.seatsMax,
    this.latitude,
    this.longitude,
    this.radius,
  });

  VehicleSearchFilter copyWith({
    String? searchQuery,
    VehicleStatus? status,
    String? make,
    String? model,
    String? type,
    String? fuelType,
    String? transmission,
    int? yearFrom,
    int? yearTo,
    double? priceFrom,
    double? priceTo,
    int? seatsMin,
    int? seatsMax,
    double? latitude,
    double? longitude,
    double? radius,
  }) {
    return VehicleSearchFilter(
      searchQuery: searchQuery ?? this.searchQuery,
      status: status ?? this.status,
      make: make ?? this.make,
      model: model ?? this.model,
      type: type ?? this.type,
      fuelType: fuelType ?? this.fuelType,
      transmission: transmission ?? this.transmission,
      yearFrom: yearFrom ?? this.yearFrom,
      yearTo: yearTo ?? this.yearTo,
      priceFrom: priceFrom ?? this.priceFrom,
      priceTo: priceTo ?? this.priceTo,
      seatsMin: seatsMin ?? this.seatsMin,
      seatsMax: seatsMax ?? this.seatsMax,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      radius: radius ?? this.radius,
    );
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> json = {};
    if (searchQuery != null && searchQuery!.isNotEmpty) json['search'] = searchQuery;
    if (status != null) json['status'] = status!.value;
    if (make != null) json['make'] = make;
    if (model != null) json['model'] = model;
    if (type != null) json['type'] = type;
    if (fuelType != null) json['fuel_type'] = fuelType;
    if (transmission != null) json['transmission'] = transmission;
    if (yearFrom != null) json['year_from'] = yearFrom;
    if (yearTo != null) json['year_to'] = yearTo;
    if (priceFrom != null) json['price_from'] = priceFrom;
    if (priceTo != null) json['price_to'] = priceTo;
    if (seatsMin != null) json['seats_min'] = seatsMin;
    if (seatsMax != null) json['seats_max'] = seatsMax;
    if (latitude != null) json['latitude'] = latitude;
    if (longitude != null) json['longitude'] = longitude;
    if (radius != null) json['radius'] = radius;
    return json;
  }

  bool get isEmpty {
    return searchQuery == null ||
        searchQuery!.isEmpty &&
            status == null &&
            make == null &&
            model == null &&
            type == null &&
            fuelType == null &&
            transmission == null &&
            yearFrom == null &&
            yearTo == null &&
            priceFrom == null &&
            priceTo == null &&
            seatsMin == null &&
            seatsMax == null &&
            latitude == null &&
            longitude == null &&
            radius == null;
  }
}
