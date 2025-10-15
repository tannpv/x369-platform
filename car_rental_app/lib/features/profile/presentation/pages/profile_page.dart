import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  // Mock user data
  final Map<String, dynamic> _user = {
    'name': 'John Doe',
    'email': 'john.doe@example.com',
    'phone': '+1 (555) 987-6543',
    'memberSince': '2023-01-15',
    'totalBookings': 12,
    'activeBookings': 1,
    'favoriteVehicles': 3,
    'profileImage': null,
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: _showSettings,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Profile Header
            _buildProfileHeader(),
            const SizedBox(height: 24),
            
            // Stats Cards
            _buildStatsGrid(),
            const SizedBox(height: 24),
            
            // Menu Options
            _buildMenuOptions(),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileHeader() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Profile Picture
            Stack(
              children: [
                CircleAvatar(
                  radius: 50,
                  backgroundColor: Theme.of(context).primaryColor.withOpacity(0.1),
                  child: _user['profileImage'] != null
                      ? ClipRRect(
                          borderRadius: BorderRadius.circular(50),
                          child: Image.network(
                            _user['profileImage'],
                            width: 100,
                            height: 100,
                            fit: BoxFit.cover,
                          ),
                        )
                      : Icon(
                          Icons.person,
                          size: 50,
                          color: Theme.of(context).primaryColor,
                        ),
                ),
                Positioned(
                  bottom: 0,
                  right: 0,
                  child: Container(
                    decoration: BoxDecoration(
                      color: Theme.of(context).primaryColor,
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: const Icon(
                        Icons.camera_alt,
                        color: Colors.white,
                        size: 20,
                      ),
                      onPressed: _changeProfilePicture,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            
            // User Info
            Text(
              _user['name'],
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 4),
            Text(
              _user['email'],
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Member since ${_formatDate(_user['memberSince'])}',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Colors.grey[500],
              ),
            ),
            const SizedBox(height: 16),
            
            // Edit Profile Button
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: _editProfile,
                icon: const Icon(Icons.edit),
                label: const Text('Edit Profile'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsGrid() {
    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            'Total Bookings',
            '${_user['totalBookings']}',
            Icons.book_online,
            Colors.blue,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatCard(
            'Active',
            '${_user['activeBookings']}',
            Icons.directions_car,
            Colors.green,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildStatCard(
            'Favorites',
            '${_user['favoriteVehicles']}',
            Icons.favorite,
            Colors.red,
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(
              icon,
              color: color,
              size: 28,
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                color: color,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: Theme.of(context).textTheme.bodySmall,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuOptions() {
    final menuItems = [
      {
        'title': 'My Bookings',
        'subtitle': 'View and manage your bookings',
        'icon': Icons.book_online,
        'onTap': () => context.go('/bookings'),
      },
      {
        'title': 'Favorite Vehicles',
        'subtitle': 'Your saved vehicles',
        'icon': Icons.favorite,
        'onTap': () => _showFavorites(),
      },
      {
        'title': 'Payment Methods',
        'subtitle': 'Manage payment options',
        'icon': Icons.payment,
        'onTap': () => _showPaymentMethods(),
      },
      {
        'title': 'Driving License',
        'subtitle': 'Update license information',
        'icon': Icons.credit_card,
        'onTap': () => _showLicenseInfo(),
      },
      {
        'title': 'Notifications',
        'subtitle': 'Notification preferences',
        'icon': Icons.notifications,
        'onTap': () => _showNotificationSettings(),
      },
      {
        'title': 'Help & Support',
        'subtitle': 'Get help or contact support',
        'icon': Icons.help,
        'onTap': () => _showSupport(),
      },
      {
        'title': 'About',
        'subtitle': 'App information and terms',
        'icon': Icons.info,
        'onTap': () => _showAbout(),
      },
      {
        'title': 'Sign Out',
        'subtitle': 'Sign out of your account',
        'icon': Icons.logout,
        'onTap': () => _signOut(),
        'isDestructive': true,
      },
    ];

    return Column(
      children: menuItems.map((item) => _buildMenuItem(item)).toList(),
    );
  }

  Widget _buildMenuItem(Map<String, dynamic> item) {
    final isDestructive = item['isDestructive'] ?? false;
    final color = isDestructive ? Colors.red : null;

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(
          item['icon'],
          color: color,
        ),
        title: Text(
          item['title'],
          style: TextStyle(color: color),
        ),
        subtitle: Text(item['subtitle']),
        trailing: Icon(
          Icons.arrow_forward_ios,
          size: 16,
          color: Colors.grey[400],
        ),
        onTap: item['onTap'],
      ),
    );
  }

  String _formatDate(String dateStr) {
    final date = DateTime.parse(dateStr);
    final months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return '${months[date.month - 1]} ${date.year}';
  }

  void _changeProfilePicture() {
    showModalBottomSheet(
      context: context,
      builder: (context) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt),
              title: const Text('Take Photo'),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Camera feature coming soon!')),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.photo_library),
              title: const Text('Choose from Gallery'),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Gallery feature coming soon!')),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.delete),
              title: const Text('Remove Photo'),
              onTap: () {
                Navigator.pop(context);
                setState(() {
                  _user['profileImage'] = null;
                });
              },
            ),
          ],
        ),
      ),
    );
  }

  void _editProfile() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Edit profile feature coming soon!')),
    );
  }

  void _showSettings() {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.settings),
              title: const Text('General Settings'),
              subtitle: const Text('Coming soon'),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Settings feature coming soon!')),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.notifications),
              title: const Text('Notifications'),
              subtitle: const Text('Coming soon'),
              onTap: () {
                Navigator.pop(context);
                _showNotificationSettings();
              },
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.wifi_tethering),
              title: const Text('API Test'),
              subtitle: const Text('Test backend API connection'),
              onTap: () {
                Navigator.pop(context);
                context.go('/api-test');
              },
            ),
            ListTile(
              leading: const Icon(Icons.directions_car),
              title: const Text('Vehicle API Test'),
              subtitle: const Text('Test vehicle BLoC integration'),
              onTap: () {
                Navigator.pop(context);
                context.go('/vehicle-api-test');
              },
            ),
            ListTile(
              leading: const Icon(Icons.bug_report),
              title: const Text('Debug Logs'),
              subtitle: const Text('View app logs for debugging'),
              onTap: () {
                Navigator.pop(context);
                context.go('/debug');
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showFavorites() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Favorites feature coming soon!')),
    );
  }

  void _showPaymentMethods() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Payment methods feature coming soon!')),
    );
  }

  void _showLicenseInfo() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('License info feature coming soon!')),
    );
  }

  void _showNotificationSettings() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Notification settings feature coming soon!')),
    );
  }

  void _showSupport() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Support feature coming soon!')),
    );
  }

  void _showAbout() {
    showAboutDialog(
      context: context,
      applicationName: 'Car Rental App',
      applicationVersion: '1.0.0',
      applicationIcon: Icon(
        Icons.directions_car,
        size: 48,
        color: Theme.of(context).primaryColor,
      ),
      children: const [
        Text('A modern car rental application built with Flutter and Clean Architecture.'),
      ],
    );
  }

  void _signOut() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Sign Out'),
        content: const Text('Are you sure you want to sign out?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              context.go('/login');
            },
            child: const Text('Sign Out'),
          ),
        ],
      ),
    );
  }
}
