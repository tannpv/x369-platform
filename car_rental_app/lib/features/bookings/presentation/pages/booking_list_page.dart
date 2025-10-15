import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/widgets/common_widgets.dart';

class BookingListPage extends StatefulWidget {
  const BookingListPage({super.key});

  @override
  State<BookingListPage> createState() => _BookingListPageState();
}

class _BookingListPageState extends State<BookingListPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isLoading = false;

  // Mock booking data
  final List<Map<String, dynamic>> _bookings = [
    {
      'id': '1',
      'vehicleModel': 'Toyota Camry',
      'vehicleImage': 'https://via.placeholder.com/80x60/2563EB/FFFFFF?text=Camry',
      'pickupDate': '2024-03-20',
      'returnDate': '2024-03-23',
      'totalAmount': 150.0,
      'status': 'confirmed',
      'pickupLocation': 'Downtown Office',
      'returnLocation': 'Downtown Office',
    },
    {
      'id': '2',
      'vehicleModel': 'Honda CR-V',
      'vehicleImage': 'https://via.placeholder.com/80x60/10B981/FFFFFF?text=CR-V',
      'pickupDate': '2024-03-15',
      'returnDate': '2024-03-18',
      'totalAmount': 195.0,
      'status': 'active',
      'pickupLocation': 'Airport Terminal',
      'returnLocation': 'Airport Terminal',
    },
    {
      'id': '3',
      'vehicleModel': 'Tesla Model 3',
      'vehicleImage': 'https://via.placeholder.com/80x60/F59E0B/FFFFFF?text=Tesla',
      'pickupDate': '2024-03-10',
      'returnDate': '2024-03-12',
      'totalAmount': 160.0,
      'status': 'completed',
      'pickupLocation': 'City Center',
      'returnLocation': 'City Center',
    },
    {
      'id': '4',
      'vehicleModel': 'Ford Focus',
      'vehicleImage': 'https://via.placeholder.com/80x60/EF4444/FFFFFF?text=Focus',
      'pickupDate': '2024-03-25',
      'returnDate': '2024-03-28',
      'totalAmount': 105.0,
      'status': 'pending',
      'pickupLocation': 'Mall Location',
      'returnLocation': 'Mall Location',
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Bookings'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'All'),
            Tab(text: 'Active'),
            Tab(text: 'Upcoming'),
            Tab(text: 'History'),
          ],
          labelColor: Theme.of(context).primaryColor,
          unselectedLabelColor: Colors.grey,
          indicatorColor: Theme.of(context).primaryColor,
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildBookingList(_bookings),
          _buildBookingList(_bookings.where((b) => b['status'] == 'active').toList()),
          _buildBookingList(_bookings.where((b) => b['status'] == 'confirmed').toList()),
          _buildBookingList(_bookings.where((b) => b['status'] == 'completed').toList()),
        ],
      ),
    );
  }

  Widget _buildBookingList(List<Map<String, dynamic>> bookings) {
    if (_isLoading) {
      return const LoadingWidget(message: 'Loading bookings...');
    }

    if (bookings.isEmpty) {
      return const EmptyStateWidget(
        title: 'No Bookings Found',
        message: 'You don\'t have any bookings in this category yet.',
        icon: Icons.book_online,
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: bookings.length,
      itemBuilder: (context, index) {
        final booking = bookings[index];
        return _BookingCard(
          booking: booking,
          onTap: () => context.push('/bookings/${booking['id']}'),
        );
      },
    );
  }
}

class _BookingCard extends StatelessWidget {
  final Map<String, dynamic> booking;
  final VoidCallback onTap;

  const _BookingCard({
    required this.booking,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header with status
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Booking #${booking['id']}',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: Colors.grey[600],
                    ),
                  ),
                  _buildStatusChip(booking['status']),
                ],
              ),
              const SizedBox(height: 12),
              
              // Vehicle info
              Row(
                children: [
                  Container(
                    width: 80,
                    height: 60,
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Center(
                      child: Icon(
                        Icons.directions_car,
                        color: Colors.grey[400],
                        size: 32,
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          booking['vehicleModel'],
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${booking['pickupDate']} - ${booking['returnDate']}',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    '\$${booking['totalAmount']}',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: Theme.of(context).primaryColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              
              // Location info
              Row(
                children: [
                  Icon(
                    Icons.location_on,
                    size: 16,
                    color: Colors.grey[600],
                  ),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      booking['pickupLocation'],
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ),
                ],
              ),
              
              // Action buttons based on status
              if (booking['status'] == 'pending') ...[
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => _showCancelDialog(context),
                        child: const Text('Cancel'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () => _showModifyDialog(context),
                        child: const Text('Modify'),
                      ),
                    ),
                  ],
                ),
              ] else if (booking['status'] == 'active') ...[
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () => _showExtendDialog(context),
                    icon: const Icon(Icons.access_time),
                    label: const Text('Extend Booking'),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusChip(String status) {
    Color color;
    String text;
    
    switch (status.toLowerCase()) {
      case 'active':
        color = Colors.green;
        text = 'Active';
        break;
      case 'confirmed':
        color = Colors.blue;
        text = 'Confirmed';
        break;
      case 'completed':
        color = Colors.grey;
        text = 'Completed';
        break;
      case 'pending':
        color = Colors.orange;
        text = 'Pending';
        break;
      case 'cancelled':
        color = Colors.red;
        text = 'Cancelled';
        break;
      default:
        color = Colors.grey;
        text = status;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  void _showCancelDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancel Booking'),
        content: const Text('Are you sure you want to cancel this booking?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('No'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Booking cancelled successfully')),
              );
            },
            child: const Text('Yes, Cancel'),
          ),
        ],
      ),
    );
  }

  void _showModifyDialog(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Modify booking feature coming soon!')),
    );
  }

  void _showExtendDialog(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Extend booking feature coming soon!')),
    );
  }
}
