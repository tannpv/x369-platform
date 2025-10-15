import 'package:flutter/material.dart';
import '../../core/utils/logger.dart';
import '../../core/network/dio_client.dart';
import '../../core/di/injection_container.dart';

class ApiTestPage extends StatefulWidget {
  const ApiTestPage({super.key});

  @override
  State<ApiTestPage> createState() => _ApiTestPageState();
}

class _ApiTestPageState extends State<ApiTestPage> {
  String _result = 'Tap button to test API';
  bool _loading = false;

  Future<void> _testApi() async {
    setState(() {
      _loading = true;
      _result = 'Testing API...';
    });

    try {
      final dioClient = getIt<DioClient>();
      AppLogger.i('Testing API connection to vehicles endpoint');
      
      final response = await dioClient.dio.get('/vehicles?limit=3');
      
      AppLogger.i('API Response received: ${response.statusCode}');
      AppLogger.d('API Response data: ${response.data}');
      
      if (response.statusCode == 200) {
        final data = response.data;
        final vehicleCount = data['vehicles']?.length ?? 0;
        setState(() {
          _result = 'SUCCESS! Got $vehicleCount vehicles from API.\n\n'
                   'Status: ${response.statusCode}\n'
                   'First vehicle: ${data['vehicles']?[0]?['make']} ${data['vehicles']?[0]?['model']}';
        });
        AppLogger.i('API test successful - received $vehicleCount vehicles');
      } else {
        setState(() {
          _result = 'API Error: Status ${response.statusCode}';
        });
        AppLogger.w('API returned non-200 status: ${response.statusCode}');
      }
    } catch (e) {
      setState(() {
        _result = 'ERROR: $e';
      });
      AppLogger.e('API test failed', e);
      
      // Try to provide more specific error information
      if (e.toString().contains('Failed host lookup')) {
        setState(() {
          _result = 'NETWORK ERROR: Cannot reach backend server.\n\n'
                   'Make sure backend is running at http://localhost:8000';
        });
      } else if (e.toString().contains('XMLHttpRequest error')) {
        setState(() {
          _result = 'CORS ERROR: Browser blocked the request.\n\n'
                   'This might be a CORS configuration issue.';
        });
      }
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('API Test'),
        backgroundColor: Colors.blue,
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
                      'Backend API Test',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Test connection to: http://localhost:8000/api/vehicles',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: _loading ? null : _testApi,
              icon: _loading 
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.wifi_tethering),
              label: Text(_loading ? 'Testing...' : 'Test API Connection'),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.all(16),
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
              ),
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
                        'Result:',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 8),
                      Expanded(
                        child: SingleChildScrollView(
                          child: Text(
                            _result,
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
                    onPressed: () {
                      Navigator.of(context).pop();
                    },
                    child: const Text('Back to App'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pushNamed(context, '/debug');
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('View Debug Logs'),
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
