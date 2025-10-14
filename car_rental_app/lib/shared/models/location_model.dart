import 'package:equatable/equatable.dart';

class Location extends Equatable {
  final double latitude;
  final double longitude;
  final String address;
  final String? city;
  final String? state;
  final String? country;
  final String? zipCode;

  const Location({
    required this.latitude,
    required this.longitude,
    required this.address,
    this.city,
    this.state,
    this.country,
    this.zipCode,
  });

  @override
  List<Object?> get props => [
        latitude,
        longitude,
        address,
        city,
        state,
        country,
        zipCode,
      ];

  Map<String, dynamic> toJson() {
    return {
      'latitude': latitude,
      'longitude': longitude,
      'address': address,
      'city': city,
      'state': state,
      'country': country,
      'zipCode': zipCode,
    };
  }

  factory Location.fromJson(Map<String, dynamic> json) {
    return Location(
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      address: json['address'] as String,
      city: json['city'] as String?,
      state: json['state'] as String?,
      country: json['country'] as String?,
      zipCode: json['zipCode'] as String?,
    );
  }

  Location copyWith({
    double? latitude,
    double? longitude,
    String? address,
    String? city,
    String? state,
    String? country,
    String? zipCode,
  }) {
    return Location(
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      address: address ?? this.address,
      city: city ?? this.city,
      state: state ?? this.state,
      country: country ?? this.country,
      zipCode: zipCode ?? this.zipCode,
    );
  }

  @override
  String toString() {
    return 'Location(latitude: $latitude, longitude: $longitude, address: $address, city: $city, state: $state, country: $country, zipCode: $zipCode)';
  }
}
