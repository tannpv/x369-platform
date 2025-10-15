enum BookingStatus {
  pending('pending'),
  confirmed('confirmed'),
  active('active'),
  completed('completed'),
  cancelled('cancelled');

  const BookingStatus(this.value);
  final String value;

  static BookingStatus fromString(String value) {
    return BookingStatus.values.firstWhere(
      (status) => status.value == value,
      orElse: () => BookingStatus.pending,
    );
  }
}

class Booking {
  final String id;
  final String userId;
  final String vehicleId;
  final BookingStatus status;
  final DateTime startTime;
  final DateTime? endTime;
  final double pickupLatitude;
  final double pickupLongitude;
  final String pickupAddress;
  final double? dropoffLatitude;
  final double? dropoffLongitude;
  final String? dropoffAddress;
  final double? distance; // in kilometers
  final int? duration; // in minutes
  final double? cost;
  final DateTime createdAt;
  final DateTime updatedAt;

  Booking({
    required this.id,
    required this.userId,
    required this.vehicleId,
    required this.status,
    required this.startTime,
    this.endTime,
    required this.pickupLatitude,
    required this.pickupLongitude,
    required this.pickupAddress,
    this.dropoffLatitude,
    this.dropoffLongitude,
    this.dropoffAddress,
    this.distance,
    this.duration,
    this.cost,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      vehicleId: json['vehicle_id'] as String,
      status: BookingStatus.fromString(json['status'] as String),
      startTime: DateTime.parse(json['start_time'] as String),
      endTime: json['end_time'] != null
          ? DateTime.parse(json['end_time'] as String)
          : null,
      pickupLatitude: (json['pickup_latitude'] as num).toDouble(),
      pickupLongitude: (json['pickup_longitude'] as num).toDouble(),
      pickupAddress: json['pickup_address'] as String,
      dropoffLatitude: json['dropoff_latitude'] != null
          ? (json['dropoff_latitude'] as num).toDouble()
          : null,
      dropoffLongitude: json['dropoff_longitude'] != null
          ? (json['dropoff_longitude'] as num).toDouble()
          : null,
      dropoffAddress: json['dropoff_address'] as String?,
      distance: json['distance'] != null
          ? (json['distance'] as num).toDouble()
          : null,
      duration: json['duration'] != null
          ? (json['duration'] as num).toInt()
          : null,
      cost: json['cost'] != null ? (json['cost'] as num).toDouble() : null,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'vehicle_id': vehicleId,
      'status': status.value,
      'start_time': startTime.toIso8601String(),
      'end_time': endTime?.toIso8601String(),
      'pickup_latitude': pickupLatitude,
      'pickup_longitude': pickupLongitude,
      'pickup_address': pickupAddress,
      'dropoff_latitude': dropoffLatitude,
      'dropoff_longitude': dropoffLongitude,
      'dropoff_address': dropoffAddress,
      'distance': distance,
      'duration': duration,
      'cost': cost,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  bool get isActive => status == BookingStatus.active;
  bool get isCompleted => status == BookingStatus.completed;
  bool get isCancelled => status == BookingStatus.cancelled;
  bool get canBeCancelled => 
      status == BookingStatus.pending || status == BookingStatus.confirmed;

  Duration? get totalDuration => endTime != null 
      ? endTime!.difference(startTime) 
      : null;

  String get formattedCost => cost != null ? '\$${cost!.toStringAsFixed(2)}' : 'TBD';

  Booking copyWith({
    String? id,
    String? userId,
    String? vehicleId,
    BookingStatus? status,
    DateTime? startTime,
    DateTime? endTime,
    double? pickupLatitude,
    double? pickupLongitude,
    String? pickupAddress,
    double? dropoffLatitude,
    double? dropoffLongitude,
    String? dropoffAddress,
    double? distance,
    int? duration,
    double? cost,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Booking(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      vehicleId: vehicleId ?? this.vehicleId,
      status: status ?? this.status,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      pickupLatitude: pickupLatitude ?? this.pickupLatitude,
      pickupLongitude: pickupLongitude ?? this.pickupLongitude,
      pickupAddress: pickupAddress ?? this.pickupAddress,
      dropoffLatitude: dropoffLatitude ?? this.dropoffLatitude,
      dropoffLongitude: dropoffLongitude ?? this.dropoffLongitude,
      dropoffAddress: dropoffAddress ?? this.dropoffAddress,
      distance: distance ?? this.distance,
      duration: duration ?? this.duration,
      cost: cost ?? this.cost,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

class CreateBookingRequest {
  final String userId;
  final String vehicleId;
  final DateTime startTime;
  final double pickupLatitude;
  final double pickupLongitude;
  final String pickupAddress;
  final double? dropoffLatitude;
  final double? dropoffLongitude;
  final String? dropoffAddress;

  CreateBookingRequest({
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

  Map<String, dynamic> toJson() {
    return {
      'user_id': userId,
      'vehicle_id': vehicleId,
      'start_time': startTime.toIso8601String(),
      'pickup_latitude': pickupLatitude,
      'pickup_longitude': pickupLongitude,
      'pickup_address': pickupAddress,
      'dropoff_latitude': dropoffLatitude,
      'dropoff_longitude': dropoffLongitude,
      'dropoff_address': dropoffAddress,
    };
  }
}

class BookingFilter {
  final String? userId;
  final String? vehicleId;
  final BookingStatus? status;
  final DateTime? startDate;
  final DateTime? endDate;
  final int limit;
  final int offset;

  BookingFilter({
    this.userId,
    this.vehicleId,
    this.status,
    this.startDate,
    this.endDate,
    this.limit = 20,
    this.offset = 0,
  });

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> json = {
      'limit': limit,
      'offset': offset,
    };
    if (userId != null) json['user_id'] = userId;
    if (vehicleId != null) json['vehicle_id'] = vehicleId;
    if (status != null) json['status'] = status!.value;
    if (startDate != null) json['start_date'] = startDate!.toIso8601String();
    if (endDate != null) json['end_date'] = endDate!.toIso8601String();
    return json;
  }

  BookingFilter copyWith({
    String? userId,
    String? vehicleId,
    BookingStatus? status,
    DateTime? startDate,
    DateTime? endDate,
    int? limit,
    int? offset,
  }) {
    return BookingFilter(
      userId: userId ?? this.userId,
      vehicleId: vehicleId ?? this.vehicleId,
      status: status ?? this.status,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      limit: limit ?? this.limit,
      offset: offset ?? this.offset,
    );
  }
}
