// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:car_rental_app/core/network/dio_client.dart' as _i157;
import 'package:car_rental_app/features/auth/data/auth_api_service.dart'
    as _i423;
import 'package:car_rental_app/features/auth/data/auth_repository_impl.dart'
    as _i690;
import 'package:car_rental_app/features/auth/data/user_api_service.dart'
    as _i732;
import 'package:car_rental_app/features/auth/domain/repositories/auth_repository.dart'
    as _i1012;
import 'package:car_rental_app/features/auth/presentation/bloc/auth_bloc.dart'
    as _i780;
import 'package:car_rental_app/features/bookings/data/booking_api_service.dart'
    as _i158;
import 'package:car_rental_app/features/bookings/data/booking_repository_impl.dart'
    as _i516;
import 'package:car_rental_app/features/bookings/domain/repositories/booking_repository.dart'
    as _i2;
import 'package:car_rental_app/features/bookings/presentation/bloc/booking_bloc.dart'
    as _i319;
import 'package:car_rental_app/features/vehicles/data/vehicle_api_service.dart'
    as _i1064;
import 'package:car_rental_app/features/vehicles/data/vehicle_repository_impl.dart'
    as _i425;
import 'package:car_rental_app/features/vehicles/domain/repositories/vehicle_repository.dart'
    as _i61;
import 'package:car_rental_app/features/vehicles/presentation/bloc/vehicle_bloc.dart'
    as _i667;
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;

extension GetItInjectableX on _i174.GetIt {
// initializes the registration of main-scope dependencies inside of GetIt
  _i174.GetIt init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) {
    final gh = _i526.GetItHelper(
      this,
      environment,
      environmentFilter,
    );
    gh.lazySingleton<_i157.DioClient>(() => _i157.DioClient());
    gh.lazySingleton<_i423.AuthApiService>(
        () => _i423.AuthApiService(gh<_i157.DioClient>()));
    gh.lazySingleton<_i732.UserApiService>(
        () => _i732.UserApiService(gh<_i157.DioClient>()));
    gh.lazySingleton<_i1064.VehicleApiService>(
        () => _i1064.VehicleApiService(gh<_i157.DioClient>()));
    gh.lazySingleton<_i158.BookingApiService>(
        () => _i158.BookingApiService(gh<_i157.DioClient>()));
    gh.lazySingleton<_i2.BookingRepository>(
        () => _i516.BookingRepositoryImpl(gh<_i158.BookingApiService>()));
    gh.lazySingleton<_i1012.AuthRepository>(
        () => _i690.AuthRepositoryImpl(gh<_i423.AuthApiService>()));
    gh.factory<_i780.AuthBloc>(
        () => _i780.AuthBloc(gh<_i1012.AuthRepository>()));
    gh.lazySingleton<_i61.VehicleRepository>(
        () => _i425.VehicleRepositoryImpl(gh<_i1064.VehicleApiService>()));
    gh.factory<_i667.VehicleBloc>(
        () => _i667.VehicleBloc(gh<_i61.VehicleRepository>()));
    gh.factory<_i319.BookingBloc>(
        () => _i319.BookingBloc(gh<_i2.BookingRepository>()));
    return this;
  }
}
