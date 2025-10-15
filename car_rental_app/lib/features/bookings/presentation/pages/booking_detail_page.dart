import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class BookingDetailPage extends StatefulWidget {
  final String bookingId;
  
  const BookingDetailPage({
    super.key,
    required this.bookingId,
  });

  @override
  State<BookingDetailPage> createState() => _BookingDetailPageState();
}

class _BookingDetailPageState extends State<BookingDetailPage> {
  bool _isLoading = false;
  
  // Mock booking data
  late final Map<String, dynamic> _booking = {
    'id': widget.bookingId,
    'vehicleModel': 'Toyota Camry',
    'vehicleYear': 2023,
    'vehicleLicensePlate': 'ABC-123',
    'vehicleColor': 'White',
    'bookingReference': 'CR${widget.bookingId.padLeft(6, '0')}',
    'pickupDate': '2024-03-20',
    'pickupTime': '10:00 AM',
    'returnDate': '2024-03-23',
    'returnTime': '10:00 AM',
    'totalDays': 3,
    'dailyRate': 50.0,
    'totalAmount': 150.0,
    'status': 'confirmed',
    'paymentStatus': 'paid',
    'pickupLocation': {
      'name': 'Downtown Office',
      'address': '123 Main Street, Downtown',
      'phone': '+1 (555) 123-4567',
    },
    'returnLocation': {
      'name': 'Downtown Office',
      'address': '123 Main Street, Downtown',
      'phone': '+1 (555) 123-4567',
    },
    'customer': {
      'name': 'John Doe',
      'email': 'john.doe@example.com',
      'phone': '+1 (555) 987-6543',
    },
    'bookingDate': '2024-03-15',
    'features': [
      'Air Conditioning',
      'Bluetooth',
      'GPS Navigation',
      'Backup Camera',
    ],
    'notes': 'Please ensure vehicle is clean and fueled.',
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Booking #${_booking['id']}'),
        actions: [
          PopupMenuButton<String>(
            onSelected: _handleMenuAction,
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'download',
                child: ListTile(
                  leading: Icon(Icons.download),
                  title: Text('Download Receipt'),
                  contentPadding: EdgeInsets.zero,
                ),
              ),
              const PopupMenuItem(
                value: 'share',
                child: ListTile(
                  leading: Icon(Icons.share),
                  title: Text('Share Booking'),
                  contentPadding: EdgeInsets.zero,
                ),
              ),
              if (_booking['status'] == 'confirmed' || _booking['status'] == 'pending')
                const PopupMenuItem(
                  value: 'cancel',
                  child: ListTile(
                    leading: Icon(Icons.cancel, color: Colors.red),
                    title: Text('Cancel Booking', style: TextStyle(color: Colors.red)),
                    contentPadding: EdgeInsets.zero,
                  ),
                ),
            ],
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Card
            _buildStatusCard(),
            const SizedBox(height: 16),
            
            // Vehicle Details
            _buildSection(
              'Vehicle Details',
              Column(
                children: [
                  _buildDetailRow('Model', _booking['vehicleModel']),
                  _buildDetailRow('Year', '${_booking['vehicleYear']}'),
                  _buildDetailRow('License Plate', _booking['vehicleLicensePlate']),
                  _buildDetailRow('Color', _booking['vehicleColor']),
                ],
              ),
            ),
            const SizedBox(height: 16),
            
            // Booking Details
            _buildSection(
              'Booking Details',
              Column(
                children: [
                  _buildDetailRow('Reference', _booking['bookingReference']),
                  _buildDetailRow('Pickup Date', '${_booking['pickupDate']} at ${_booking['pickupTime']}'),
                  _buildDetailRow('Return Date', '${_booking['returnDate']} at ${_booking['returnTime']}'),
                  _buildDetailRow('Duration', '${_booking['totalDays']} days'),
                  _buildDetailRow('Booking Date', _booking['bookingDate']),
                ],
              ),
            ),
            const SizedBox(height: 16),
            
            // Pickup Location
            _buildSection(
              'Pickup Location',
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _booking['pickupLocation']['name'],
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _booking['pickupLocation']['address'],
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _booking['pickupLocation']['phone'],
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () => _showDirections('pickup'),
                          icon: const Icon(Icons.directions),
                          label: const Text('Directions'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () => _callLocation('pickup'),
                          icon: const Icon(Icons.phone),
                          label: const Text('Call'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            
            // Return Location
            _buildSection(
              'Return Location',
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _booking['returnLocation']['name'],
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _booking['returnLocation']['address'],
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _booking['returnLocation']['phone'],
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () => _showDirections('return'),
                          icon: const Icon(Icons.directions),
                          label: const Text('Directions'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () => _callLocation('return'),
                          icon: const Icon(Icons.phone),
                          label: const Text('Call'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            
            // Payment Details
            _buildSection(
              'Payment Details',
              Column(
                children: [
                  _buildDetailRow('Daily Rate', '\$${_booking['dailyRate']}'),
                  _buildDetailRow('Duration', '${_booking['totalDays']} days'),
                  _buildDetailRow('Subtotal', '\$${(_booking['dailyRate'] * _booking['totalDays']).toStringAsFixed(2)}'),
                  const Divider(),
                  _buildDetailRow(
                    'Total Amount',
                    '\$${_booking['totalAmount']}',
                    isTotal: true,
                  ),
                  _buildDetailRow('Payment Status', _booking['paymentStatus'], isStatus: true),
                ],
              ),
            ),
            const SizedBox(height: 16),
            
            // Vehicle Features
            _buildSection(
              'Vehicle Features',
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: (_booking['features'] as List<String>)
                    .map((feature) => Chip(
                          label: Text(feature),
                          backgroundColor: Theme.of(context).primaryColor.withOpacity(0.1),
                        ))
                    .toList(),
              ),
            ),
            const SizedBox(height: 16),
            
            // Notes
            if (_booking['notes'] != null && _booking['notes'].isNotEmpty)
              _buildSection(
                'Special Notes',
                Text(
                  _booking['notes'],
                  style: Theme.of(context).textTheme.bodyLarge,
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusCard() {
    Color statusColor;
    IconData statusIcon;
    String statusText = _booking['status'];
    
    switch (_booking['status'].toLowerCase()) {
      case 'active':
        statusColor = Colors.green;
        statusIcon = Icons.check_circle;
        statusText = 'Active';
        break;
      case 'confirmed':
        statusColor = Colors.blue;
        statusIcon = Icons.schedule;
        statusText = 'Confirmed';
        break;
      case 'completed':
        statusColor = Colors.grey;
        statusIcon = Icons.done_all;
        statusText = 'Completed';
        break;
      case 'pending':
        statusColor = Colors.orange;
        statusIcon = Icons.pending;
        statusText = 'Pending';
        break;
      case 'cancelled':
        statusColor = Colors.red;
        statusIcon = Icons.cancel;
        statusText = 'Cancelled';
        break;
      default:
        statusColor = Colors.grey;
        statusIcon = Icons.info;
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: statusColor.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                statusIcon,
                color: statusColor,
                size: 32,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Booking Status',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    statusText,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: statusColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, Widget content) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 12),
            content,
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value, {bool isTotal = false, bool isStatus = false}) {
    TextStyle? valueStyle = Theme.of(context).textTheme.bodyMedium;
    
    if (isTotal) {
      valueStyle = Theme.of(context).textTheme.titleMedium?.copyWith(
        fontWeight: FontWeight.bold,
        color: Theme.of(context).primaryColor,
      );
    } else if (isStatus) {
      Color statusColor = value.toLowerCase() == 'paid' ? Colors.green : Colors.orange;
      valueStyle = Theme.of(context).textTheme.bodyMedium?.copyWith(
        color: statusColor,
        fontWeight: FontWeight.w500,
      );
    }

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
          Text(value, style: valueStyle),
        ],
      ),
    );
  }

  void _handleMenuAction(String action) {
    switch (action) {
      case 'download':
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Receipt download started')),
        );
        break;
      case 'share':
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Sharing booking details...')),
        );
        break;
      case 'cancel':
        _showCancelDialog();
        break;
    }
  }

  void _showCancelDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancel Booking'),
        content: const Text(
          'Are you sure you want to cancel this booking? This action cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('No'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Booking cancelled successfully'),
                  backgroundColor: Colors.green,
                ),
              );
              context.pop();
            },
            child: const Text('Yes, Cancel'),
          ),
        ],
      ),
    );
  }

  void _showDirections(String locationType) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Opening directions to $locationType location...')),
    );
  }

  void _callLocation(String locationType) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Calling $locationType location...')),
    );
  }
}
