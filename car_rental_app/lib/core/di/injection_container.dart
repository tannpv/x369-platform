import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'injection_container.config.dart';

final GetIt getIt = GetIt.instance;

@InjectableInit()
void configureDependencies() => getIt.init();

Future<void> init() async {
  // Register SharedPreferences
  final sharedPreferences = await SharedPreferences.getInstance();
  getIt.registerLazySingleton<SharedPreferences>(() => sharedPreferences);
  
  // Initialize injectable
  configureDependencies();
}
