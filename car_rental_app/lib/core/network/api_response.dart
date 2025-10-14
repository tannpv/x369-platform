import 'package:dio/dio.dart';

class ApiResponse<T> {
  final T? data;
  final String? message;
  final bool success;
  final int? statusCode;

  ApiResponse({
    this.data,
    this.message,
    required this.success,
    this.statusCode,
  });

  factory ApiResponse.success(T data, {String? message, int? statusCode}) {
    return ApiResponse<T>(
      data: data,
      message: message,
      success: true,
      statusCode: statusCode,
    );
  }

  factory ApiResponse.error(String message, {int? statusCode, T? data}) {
    return ApiResponse<T>(
      data: data,
      message: message,
      success: false,
      statusCode: statusCode,
    );
  }

  factory ApiResponse.fromDioResponse(Response response, T data) {
    return ApiResponse<T>(
      data: data,
      success: response.statusCode != null && response.statusCode! < 400,
      statusCode: response.statusCode,
      message: response.statusMessage,
    );
  }
}

class PaginatedResponse<T> {
  final List<T> items;
  final int total;
  final int limit;
  final int offset;
  final bool hasMore;

  PaginatedResponse({
    required this.items,
    required this.total,
    required this.limit,
    required this.offset,
  }) : hasMore = (offset + items.length) < total;

  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Map<String, dynamic>) fromJson,
    String itemsKey,
  ) {
    final itemsList = (json[itemsKey] as List<dynamic>?)
            ?.map((item) => fromJson(item as Map<String, dynamic>))
            .toList() ??
        [];

    return PaginatedResponse<T>(
      items: itemsList,
      total: (json['total'] as num?)?.toInt() ?? itemsList.length,
      limit: (json['limit'] as num?)?.toInt() ?? itemsList.length,
      offset: (json['offset'] as num?)?.toInt() ?? 0,
    );
  }
}
