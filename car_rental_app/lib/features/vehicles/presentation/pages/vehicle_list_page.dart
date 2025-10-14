import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/di/injection_container.dart';
import '../../../../core/widgets/common_widgets.dart';
import '../../../../shared/models/vehicle_model.dart';
import '../bloc/vehicle_bloc.dart';

class VehicleListPage extends StatelessWidget {
  const VehicleListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => getIt<VehicleBloc>()..add(const VehicleLoadRequested()),
      child: const _VehicleListContent(),
    );
  }
}

class _VehicleListContent extends StatefulWidget {
  const _VehicleListContent();

  @override
  State<_VehicleListContent> createState() => _VehicleListContentState();
}

class _VehicleListContentState extends State<_VehicleListContent> {
  final _searchController = TextEditingController();
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    // Set up infinite scroll
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent * 0.9) {
      // Load more when 90% scrolled
      context.read<VehicleBloc>().add(const VehicleLoadMoreRequested());
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Available Vehicles'),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterDialog,
          ),
        ],
      ),
      body: BlocListener<VehicleBloc, VehicleState>(
        listener: (context, state) {
          if (state is VehicleError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.red,
              ),
            );
          }
        },
        child: Column(
          children: [
            // Search Bar
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: TextField(
                controller: _searchController,
                decoration: const InputDecoration(
                  hintText: 'Search vehicles...',
                  prefixIcon: Icon(Icons.search),
                ),              onChanged: (value) {
                // Debounce search to avoid too many API calls
                if (value.isNotEmpty) {
                  context.read<VehicleBloc>().add(VehicleSearchRequested(query: value));
                } else {
                  context.read<VehicleBloc>().add(const VehicleLoadRequested());
                }
              },
              ),
            ),
            
            // Vehicle List
            Expanded(
              child: BlocBuilder<VehicleBloc, VehicleState>(
                builder: (context, state) {
                  if (state is VehicleLoading) {
                    return const LoadingWidget(message: 'Loading vehicles...');
                  }
                  
                  if (state is VehicleError) {
                    return CustomErrorWidget(
                      message: state.message,
                      onRetry: () => context.read<VehicleBloc>().add(const VehicleLoadRequested()),
                    );
                  }
                  
                  if (state is VehicleEmpty) {
                    return const EmptyStateWidget(
                      title: 'No Vehicles Found',
                      message: 'There are no vehicles available at the moment.',
                      icon: Icons.directions_car_outlined,
                    );
                  }
                  
                  if (state is VehicleLoaded || state is VehicleLoadingMore) {
                    final vehicles = state is VehicleLoaded 
                        ? state.vehicles 
                        : (state as VehicleLoadingMore).vehicles;
                    
                    return ListView.builder(
                      controller: _scrollController,
                      padding: const EdgeInsets.symmetric(horizontal: 16.0),
                      itemCount: vehicles.length + (state is VehicleLoadingMore ? 1 : 0),
                      itemBuilder: (context, index) {
                        if (index >= vehicles.length) {
                          // Loading indicator for pagination
                          return const Padding(
                            padding: EdgeInsets.all(16.0),
                            child: Center(child: CircularProgressIndicator()),
                          );
                        }
                        
                        final vehicle = vehicles[index];
                        return _VehicleCard(
                          vehicle: vehicle,
                          onTap: () => context.push('/vehicles/${vehicle.id}'),
                        );
                      },
                    );
                  }
                  
                  return const EmptyStateWidget(
                    title: 'No Vehicles Found',
                    message: 'There are no vehicles available at the moment.',
                    icon: Icons.directions_car_outlined,
                  );
                },
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // Navigate to booking or filter
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Quick booking feature coming soon!')),
          );
        },
        icon: const Icon(Icons.add),
        label: const Text('Quick Book'),
      ),
    );
  }

  void _showFilterDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        final state = context.read<VehicleBloc>().state;
        final currentFilter = state is VehicleLoaded ? state.currentFilter : null;
        
        return _VehicleFilterDialog(
          currentFilter: currentFilter,
          onFilterChanged: (filter) {
            context.read<VehicleBloc>().add(VehicleSearchFilterChanged(filter: filter));
          },
        );
      },
    );
  }
}

class _VehicleCard extends StatelessWidget {
  final Vehicle vehicle;
  final VoidCallback onTap;

  const _VehicleCard({
    required this.vehicle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Vehicle Image
            Container(
              height: 200,
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                color: Colors.grey[200],
              ),
              child: Stack(
                children: [
                  // Display image if available, otherwise show placeholder
                  if (vehicle.images.isNotEmpty)
                    Container(
                      width: double.infinity,
                      height: double.infinity,
                      decoration: BoxDecoration(
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                        image: DecorationImage(
                          image: NetworkImage(vehicle.images.first),
                          fit: BoxFit.cover,
                          onError: (exception, stackTrace) {
                            // Fallback to icon on error
                          },
                        ),
                      ),
                    )
                  else
                    Center(
                      child: Icon(
                        Icons.directions_car,
                        size: 64,
                        color: Colors.grey[400],
                      ),
                    ),
                  if (!vehicle.available)
                    Positioned(
                      top: 12,
                      right: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.red,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          'Not Available',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            
            // Vehicle Details
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${vehicle.brand} ${vehicle.name}',
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                            if (vehicle.model.isNotEmpty)
                              Text(
                                vehicle.model,
                                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  color: Colors.grey[600],
                                ),
                              ),
                          ],
                        ),
                      ),
                      Text(
                        '\$${vehicle.pricePerHour.toStringAsFixed(0)}/day',
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          color: Theme.of(context).primaryColor,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      _buildSpec(Icons.calendar_today, vehicle.year.toString()),
                      const SizedBox(width: 16),
                      _buildSpec(Icons.local_gas_station, vehicle.fuelType),
                      const SizedBox(width: 16),
                      _buildSpec(Icons.people, '${vehicle.seats} seats'),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      _buildSpec(Icons.settings, vehicle.transmission),
                      const SizedBox(width: 16),
                      _buildSpec(Icons.category, vehicle.type),
                    ],
                  ),
                  if (vehicle.description.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Text(
                      vehicle.description,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Colors.grey[600],
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSpec(IconData icon, String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 16, color: Colors.grey[600]),
        const SizedBox(width: 4),
        Text(
          text,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),
      ],
    );
  }
}

class _VehicleFilterDialog extends StatefulWidget {
  final VehicleSearchFilter? currentFilter;
  final Function(VehicleSearchFilter?) onFilterChanged;

  const _VehicleFilterDialog({
    required this.currentFilter,
    required this.onFilterChanged,
  });

  @override
  State<_VehicleFilterDialog> createState() => _VehicleFilterDialogState();
}

class _VehicleFilterDialogState extends State<_VehicleFilterDialog> {
  late RangeValues _priceRange;
  String? _selectedType;
  String? _selectedFuelType;
  String? _selectedTransmission;
  int? _selectedSeats;

  final List<String> _types = ['Economy', 'Compact', 'Midsize', 'Luxury', 'SUV'];
  final List<String> _fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];
  final List<String> _transmissions = ['Manual', 'Automatic'];
  final List<int> _seats = [2, 4, 5, 7, 8];

  @override
  void initState() {
    super.initState();
    _initializeValues();
  }

  void _initializeValues() {
    final filter = widget.currentFilter;
    _priceRange = RangeValues(
      filter?.priceFrom ?? 30.0,
      filter?.priceTo ?? 200.0,
    );
    _selectedType = filter?.type;
    _selectedFuelType = filter?.fuelType;
    _selectedTransmission = filter?.transmission;
    _selectedSeats = filter?.seatsMin;
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.7,
      maxChildSize: 0.9,
      minChildSize: 0.3,
      expand: false,
      builder: (context, scrollController) {
        return Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Filter Vehicles',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close),
                  ),
                ],
              ),
              
              Expanded(
                child: SingleChildScrollView(
                  controller: scrollController,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 20),
                      
                      // Price Range
                      Text(
                        'Price Range (\$${_priceRange.start.round()} - \$${_priceRange.end.round()})',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 10),
                      RangeSlider(
                        values: _priceRange,
                        min: 10.0,
                        max: 500.0,
                        divisions: 49,
                        labels: RangeLabels(
                          '\$${_priceRange.start.round()}',
                          '\$${_priceRange.end.round()}',
                        ),
                        onChanged: (values) {
                          setState(() {
                            _priceRange = values;
                          });
                        },
                      ),
                      
                      const SizedBox(height: 20),
                      
                      // Vehicle Type
                      Text(
                        'Vehicle Type',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 10),
                      Wrap(
                        spacing: 8,
                        children: _types
                            .map((type) => FilterChip(
                                  label: Text(type),
                                  selected: _selectedType == type,
                                  onSelected: (selected) {
                                    setState(() {
                                      _selectedType = selected ? type : null;
                                    });
                                  },
                                ))
                            .toList(),
                      ),
                      
                      const SizedBox(height: 20),
                      
                      // Fuel Type
                      Text(
                        'Fuel Type',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 10),
                      Wrap(
                        spacing: 8,
                        children: _fuelTypes
                            .map((fuelType) => FilterChip(
                                  label: Text(fuelType),
                                  selected: _selectedFuelType == fuelType,
                                  onSelected: (selected) {
                                    setState(() {
                                      _selectedFuelType = selected ? fuelType : null;
                                    });
                                  },
                                ))
                            .toList(),
                      ),
                      
                      const SizedBox(height: 20),
                      
                      // Transmission
                      Text(
                        'Transmission',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 10),
                      Wrap(
                        spacing: 8,
                        children: _transmissions
                            .map((transmission) => FilterChip(
                                  label: Text(transmission),
                                  selected: _selectedTransmission == transmission,
                                  onSelected: (selected) {
                                    setState(() {
                                      _selectedTransmission = selected ? transmission : null;
                                    });
                                  },
                                ))
                            .toList(),
                      ),
                      
                      const SizedBox(height: 20),
                      
                      // Seats
                      Text(
                        'Number of Seats',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 10),
                      Wrap(
                        spacing: 8,
                        children: _seats
                            .map((seats) => FilterChip(
                                  label: Text('$seats seats'),
                                  selected: _selectedSeats == seats,
                                  onSelected: (selected) {
                                    setState(() {
                                      _selectedSeats = selected ? seats : null;
                                    });
                                  },
                                ))
                            .toList(),
                      ),
                      
                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ),
              
              // Action Buttons
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        widget.onFilterChanged(null);
                        Navigator.pop(context);
                      },
                      child: const Text('Clear Filters'),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        final filter = VehicleSearchFilter(
                          priceFrom: _priceRange.start,
                          priceTo: _priceRange.end,
                          type: _selectedType,
                          fuelType: _selectedFuelType,
                          transmission: _selectedTransmission,
                          seatsMin: _selectedSeats,
                        );
                        widget.onFilterChanged(filter);
                        Navigator.pop(context);
                      },
                      child: const Text('Apply Filters'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
