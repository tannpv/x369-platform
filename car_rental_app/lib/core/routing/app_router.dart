import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/auth/presentation/pages/register_page.dart';
import '../../features/vehicles/presentation/pages/vehicle_list_page.dart';
import '../../features/vehicles/presentation/pages/vehicle_detail_page.dart';
import '../../features/bookings/presentation/pages/booking_list_page.dart';
import '../../features/bookings/presentation/pages/booking_detail_page.dart';
import '../../features/profile/presentation/pages/profile_page.dart';
import '../../features/debug/debug_log_page.dart';
import '../../features/debug/api_test_page.dart';
import '../../features/debug/vehicle_api_test_page.dart';
import '../widgets/main_navigation.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/vehicles',
    routes: [
      // Auth Routes
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/register',
        name: 'register',
        builder: (context, state) => const RegisterPage(),
      ),
      
      // Main App Routes with Bottom Navigation
      ShellRoute(
        builder: (context, state, child) => MainNavigation(child: child),
        routes: [
          // Vehicles
          GoRoute(
            path: '/vehicles',
            name: 'vehicles',
            builder: (context, state) => const VehicleListPage(),
          ),
          GoRoute(
            path: '/vehicles/:id',
            name: 'vehicle-detail',
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              return VehicleDetailPage(vehicleId: id);
            },
          ),
          
          // Bookings
          GoRoute(
            path: '/bookings',
            name: 'bookings',
            builder: (context, state) => const BookingListPage(),
          ),
          GoRoute(
            path: '/bookings/:id',
            name: 'booking-detail',
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              return BookingDetailPage(bookingId: id);
            },
          ),
          
          // Profile
          GoRoute(
            path: '/profile',
            name: 'profile',
            builder: (context, state) => const ProfilePage(),
          ),
          
          // Debug (only in debug mode)
          GoRoute(
            path: '/debug',
            name: 'debug',
            builder: (context, state) => const DebugLogPage(),
          ),
          GoRoute(
            path: '/api-test',
            name: 'api-test',
            builder: (context, state) => const ApiTestPage(),
          ),
          GoRoute(
            path: '/vehicle-api-test',
            name: 'vehicle-api-test',
            builder: (context, state) => const VehicleApiTestPage(),
          ),
        ],
      ),
    ],
    
    // Error handling
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red,
            ),
            const SizedBox(height: 16),
            Text(
              'Page not found',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            Text(
              'The page you are looking for does not exist.',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => context.go('/vehicles'),
              child: const Text('Go Home'),
            ),
          ],
        ),
      ),
    ),
  );
}
