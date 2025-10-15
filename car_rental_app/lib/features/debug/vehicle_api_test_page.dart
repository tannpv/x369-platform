import 'package:flutter/material.dart';
import '../../core/utils/logger.dart';
import '../../core/di/injection_container.dart';
import '../../core/network/dio_client.dart';
import '../../features/vehicles/presentation/bloc/vehicle_bloc.dart';

class VehicleApiTestPage extends StatefulWidget {
  const VehicleApiTestPage({super.key});

  @override
  State<VehicleApiTestPage> createState() => _VehicleApiTestPageState();
}

class _VehicleApiTestPageState extends State<VehicleApiTestPage> {
  late VehicleBloc _vehicleBloc;
  String _testResult = 'Ready to test vehicle API integration';
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _vehicleBloc = getIt<VehicleBloc>();
  }

  @override
  void dispose() {
    _vehicleBloc.close();
    super.dispose();
  }

  void _testVehicleAPI() {
    setState(() {
      _isLoading = true;
      _testResult = 'Testing vehicle API integration...';
    });

    AppLogger.i('VehicleApiTestPage: Starting vehicle API test');
    
    // Listen to BLoC state changes
    _vehicleBloc.stream.listen((state) {
      AppLogger.d('VehicleApiTestPage: Received state: ${state.runtimeType}');
      
      if (state is VehicleLoaded) {
        setState(() {
          _isLoading = false;
          _testResult = 'SUCCESS! ✅\n\n'
                       'Loaded ${state.vehicles.length} vehicles from API\n'
                       'Has more: ${state.hasMore}\n'
                       'First vehicle: ${state.vehicles.first.make} ${state.vehicles.first.model}\n'
                       'Status: ${state.vehicles.first.status.value}\n'
                       'Location: ${state.vehicles.first.location.address}';
        });
        AppLogger.i('VehicleApiTestPage: Test successful - ${state.vehicles.length} vehicles loaded');
      } else if (state is VehicleError) {
        setState(() {
          _isLoading = false;
          _testResult = 'ERROR ❌\n\n'
                       'Failed to load vehicles from API\n'
                       'Error: ${state.message}\n\n'
                       'This might be:\n'
                       '• Network connectivity issue\n'
                       '• CORS configuration problem\n'
                       '• Backend service not responding\n'
                       '• API endpoint mismatch';
        });
        AppLogger.e('VehicleApiTestPage: Test failed - ${state.message}');
      } else if (state is VehicleLoading) {
        setState(() {
          _testResult = 'Loading vehicles from API...\n\n'
                       'Making request to: http://localhost:8000/api/vehicles\n'
                       'Please wait...';
        });
        AppLogger.d('VehicleApiTestPage: Loading state received');
      }
    });

    // Load vehicles using BLoC
    _vehicleBloc.add(const VehicleLoadRequested(
      limit: 10,
      offset: 0,
      filter: null,
    ));
  }

  void _testDirectAPI() async {
    setState(() {
      _isLoading = true;
      _testResult = 'Testing direct API call...';
    });

    try {
      final dioClient = getIt<DioClient>();
      AppLogger.i('VehicleApiTestPage: Making direct API call');
      
      final response = await dioClient.dio.get('/vehicles?limit=3');
      
      if (response.statusCode == 200) {
        final data = response.data;
        final vehicles = data['vehicles'] as List;
        
        setState(() {
          _isLoading = false;
          _testResult = 'DIRECT API SUCCESS! ✅\n\n'
                       'Status Code: ${response.statusCode}\n'
                       'Vehicle Count: ${vehicles.length}\n'
                       'Total Available: ${data['total']}\n\n'
                       'First Vehicle:\n'
                       '• Make: ${vehicles.first['make']}\n'
                       '• Model: ${vehicles.first['model']}\n'
                       '• Year: ${vehicles.first['year']}\n'
                       '• Status: ${vehicles.first['status']}\n'
                       '• License: ${vehicles.first['license_plate']}';
        });
        AppLogger.i('VehicleApiTestPage: Direct API test successful');
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
        _testResult = 'DIRECT API ERROR ❌\n\n$e';
      });
      AppLogger.e('VehicleApiTestPage: Direct API test failed', e);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Vehicle API Test'),
        backgroundColor: Colors.green,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Vehicle API Integration Test',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Testing Flutter → BLoC → Repository → API → Backend',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _isLoading ? null : _testVehicleAPI,
                    icon: _isLoading 
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Icon(Icons.directions_car),
                    label: const Text('Test BLoC Integration'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.all(16),
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _isLoading ? null : _testDirectAPI,
                    icon: const Icon(Icons.api),
                    label: const Text('Test Direct API'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.all(16),
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Expanded(
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Test Results:',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 8),
                      Expanded(
                        child: SingleChildScrollView(
                          child: SelectableText(
                            _testResult,
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              fontFamily: 'monospace',
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text('Back'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => Navigator.pushNamed(context, '/debug'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orange,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('View Logs'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
