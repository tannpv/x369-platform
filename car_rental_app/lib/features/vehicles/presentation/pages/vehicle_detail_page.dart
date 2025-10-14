import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class VehicleDetailPage extends StatefulWidget {
  final String vehicleId;
  
  const VehicleDetailPage({
    super.key,
    required this.vehicleId,
  });

  @override
  State<VehicleDetailPage> createState() => _VehicleDetailPageState();
}

class _VehicleDetailPageState extends State<VehicleDetailPage> {
  bool _isLoading = false;
  
  // Mock vehicle data
  late final Map<String, dynamic> _vehicle = {
    'id': widget.vehicleId,
    'model': 'Toyota Camry',
    'year': 2023,
    'pricePerDay': 50.0,
    'fuelType': 'Petrol',
    'transmission': 'Automatic',
    'seats': 5,
    'category': 'Midsize',
    'color': 'White',
    'licensePlate': 'ABC-123',
    'mileage': 15000,
    'features': [
      'Air Conditioning',
      'Bluetooth',
      'GPS Navigation',
      'Backup Camera',
      'Heated Seats',
      'Sunroof',
    ],
    'description': 'A reliable and comfortable midsize sedan perfect for city driving and long trips. Features modern amenities and excellent fuel efficiency.',
    'images': [
      'https://via.placeholder.com/400x300/2563EB/FFFFFF?text=Front+View',
      'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Side+View',
      'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Interior',
      'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Back+View',
    ],
    'available': true,
    'rating': 4.5,
    'reviewCount': 127,
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // App Bar with Images
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: PageView.builder(
                itemCount: _vehicle['images'].length,
                itemBuilder: (context, index) {
                  return Container(
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                    ),
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.directions_car,
                            size: 80,
                            color: Colors.grey[400],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Image ${index + 1}',
                            style: TextStyle(
                              color: Colors.grey[600],
                              fontSize: 16,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
          
          // Vehicle Details
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title and Price
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _vehicle['model'],
                              style: Theme.of(context).textTheme.headlineMedium,
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                const Icon(Icons.star, color: Colors.amber, size: 20),
                                const SizedBox(width: 4),
                                Text(
                                  '${_vehicle['rating']} (${_vehicle['reviewCount']} reviews)',
                                  style: Theme.of(context).textTheme.bodyMedium,
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            '\$${_vehicle['pricePerDay']}',
                            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                              color: Theme.of(context).primaryColor,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            'per day',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  
                  // Specifications
                  _buildSection(
                    'Specifications',
                    Column(
                      children: [
                        _buildSpecRow('Year', '${_vehicle['year']}'),
                        _buildSpecRow('Fuel Type', _vehicle['fuelType']),
                        _buildSpecRow('Transmission', _vehicle['transmission']),
                        _buildSpecRow('Seats', '${_vehicle['seats']}'),
                        _buildSpecRow('Category', _vehicle['category']),
                        _buildSpecRow('Color', _vehicle['color']),
                        _buildSpecRow('License Plate', _vehicle['licensePlate']),
                        _buildSpecRow('Mileage', '${_vehicle['mileage']} km'),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // Features
                  _buildSection(
                    'Features',
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: (_vehicle['features'] as List<String>)
                          .map((feature) => Chip(
                                label: Text(feature),
                                backgroundColor: Theme.of(context).primaryColor.withOpacity(0.1),
                              ))
                          .toList(),
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // Description
                  _buildSection(
                    'Description',
                    Text(
                      _vehicle['description'],
                      style: Theme.of(context).textTheme.bodyLarge,
                    ),
                  ),
                  const SizedBox(height: 100), // Space for bottom button
                ],
              ),
            ),
          ),
        ],
      ),
      
      // Bottom Book Button
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Theme.of(context).scaffoldBackgroundColor,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 4,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    // Add to favorites
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Added to favorites!')),
                    );
                  },
                  icon: const Icon(Icons.favorite_border),
                  label: const Text('Favorite'),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                flex: 2,
                child: ElevatedButton.icon(
                  onPressed: _vehicle['available'] ? _handleBooking : null,
                  icon: const Icon(Icons.book_online),
                  label: Text(_vehicle['available'] ? 'Book Now' : 'Not Available'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSection(String title, Widget content) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.titleLarge,
        ),
        const SizedBox(height: 12),
        content,
      ],
    );
  }

  Widget _buildSpecRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Colors.grey[600],
            ),
          ),
          Text(
            value,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  void _handleBooking() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        maxChildSize: 0.9,
        minChildSize: 0.5,
        expand: false,
        builder: (context, scrollController) {
          return Container(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Book ${_vehicle['model']}',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(Icons.close),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                
                // Date Selection
                ListTile(
                  leading: const Icon(Icons.calendar_today),
                  title: const Text('Pickup Date'),
                  subtitle: const Text('Select pickup date'),
                  trailing: const Icon(Icons.arrow_forward_ios),
                  onTap: () {
                    // Show date picker
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.calendar_today),
                  title: const Text('Return Date'),
                  subtitle: const Text('Select return date'),
                  trailing: const Icon(Icons.arrow_forward_ios),
                  onTap: () {
                    // Show date picker
                  },
                ),
                
                const Divider(),
                
                // Booking Summary
                ListTile(
                  title: const Text('Daily Rate'),
                  trailing: Text('\$${_vehicle['pricePerDay']}'),
                ),
                ListTile(
                  title: const Text('Duration'),
                  trailing: const Text('3 days'),
                ),
                ListTile(
                  title: const Text('Total'),
                  trailing: Text(
                    '\$${(_vehicle['pricePerDay'] * 3).toStringAsFixed(2)}',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: Theme.of(context).primaryColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                
                const Spacer(),
                
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Booking confirmed! Check your bookings.'),
                          backgroundColor: Colors.green,
                        ),
                      );
                      context.go('/bookings');
                    },
                    child: const Text('Confirm Booking'),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
