import { useState } from 'react'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  TruckIcon,
  MapPinIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import VehicleModal from '../components/VehicleModal'

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  type: 'Sedan' | 'SUV' | 'Hatchback' | 'Coupe' | 'Convertible' | 'Truck' | 'Van'
  fuelType: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid'
  transmission: 'Manual' | 'Automatic' | 'CVT'
  dailyRate: number
  status: 'Available' | 'Rented' | 'Maintenance' | 'Reserved'
  licensePlate: string
  color: string
  seats: number
  mileage: number
  features: string[]
  image: string
  description: string
  location: string
  // Additional fields for display
  lastService?: string
  nextService?: string
  rating?: number
  totalBookings?: number
  revenue?: number
}

const mockVehicles: Vehicle[] = [
  {
    id: 'V001',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    type: 'Sedan',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    licensePlate: 'ABC-123',
    color: 'Silver',
    seats: 5,
    mileage: 15420,
    status: 'Available',
    dailyRate: 45,
    location: 'Downtown',
    features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'Backup Camera'],
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
    description: 'Well-maintained sedan perfect for city driving',
    lastService: '2024-09-15',
    nextService: '2024-12-15',
    rating: 4.8,
    totalBookings: 127,
    revenue: 5715
  },
  {
    id: 'V002',
    make: 'Honda',
    model: 'CR-V',
    year: 2022,
    type: 'SUV',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    licensePlate: 'XYZ-789',
    color: 'Blue',
    seats: 5,
    mileage: 28340,
    status: 'Rented',
    dailyRate: 65,
    location: 'Airport',
    features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'Backup Camera', 'All-Wheel Drive'],
    image: 'https://images.unsplash.com/photo-1581274736640-a7c5a994c3b2?w=400',
    description: 'Spacious SUV perfect for family trips and adventures',
    lastService: '2024-08-20',
    nextService: '2024-11-20',
    rating: 4.6,
    totalBookings: 89,
    revenue: 5785
  },
  {
    id: 'V003',
    make: 'BMW',
    model: 'X5',
    year: 2024,
    type: 'SUV',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    licensePlate: 'LUX-456',
    color: 'Black',
    seats: 7,
    mileage: 8200,
    status: 'Available',
    dailyRate: 120,
    location: 'City Center',
    features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'Leather Seats', 'Sunroof', 'Heated Seats'],
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
    description: 'Luxury SUV with premium features and excellent performance',
    lastService: '2024-10-01',
    nextService: '2025-01-01',
    rating: 4.9,
    totalBookings: 45,
    revenue: 5400
  },
  {
    id: 'V004',
    make: 'Ford',
    model: 'Transit',
    year: 2021,
    type: 'Van',
    fuelType: 'Diesel',
    transmission: 'Manual',
    licensePlate: 'VAN-321',
    color: 'White',
    seats: 12,
    mileage: 45600,
    status: 'Maintenance',
    dailyRate: 80,
    location: 'Workshop',
    features: ['Air Conditioning', 'GPS Navigation', 'USB Charging'],
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400',
    description: 'Commercial van ideal for group transportation and cargo',
    lastService: '2024-10-10',
    nextService: '2024-10-20',
    rating: 4.3,
    totalBookings: 156,
    revenue: 12480
  },
  {
    id: 'V005',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    type: 'Sedan',
    fuelType: 'Electric',
    transmission: 'Automatic',
    licensePlate: 'EV-555',
    color: 'Red',
    seats: 5,
    mileage: 12300,
    status: 'Available',
    dailyRate: 85,
    location: 'Mall Plaza',
    features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'Autopilot', 'Premium Sound'],
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400',
    description: 'Electric sedan with cutting-edge technology and zero emissions',
    lastService: '2024-09-25',
    nextService: '2024-12-25',
    rating: 4.7,
    totalBookings: 78,
    revenue: 6630
  },
  {
    id: 'V006',
    make: 'Chevrolet',
    model: 'Malibu',
    year: 2022,
    type: 'Sedan',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    licensePlate: 'CHV-999',
    color: 'Gray',
    seats: 5,
    mileage: 22100,
    status: 'Reserved',
    dailyRate: 50,
    location: 'Depot',
    features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'Backup Camera'],
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400',
    description: 'Reliable and economical sedan for everyday use',
    lastService: '2024-07-30',
    nextService: '2024-10-30',
    rating: 4.4,
    totalBookings: 203,
    revenue: 10150
  }
]

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add')
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(undefined)

  // CRUD functions
  const handleAddVehicle = () => {
    setModalMode('add')
    setSelectedVehicle(undefined)
    setShowModal(true)
  }

  const handleEditVehicle = (vehicle: Vehicle) => {
    setModalMode('edit')
    setSelectedVehicle(vehicle)
    setShowModal(true)
  }

  const handleViewVehicle = (vehicle: Vehicle) => {
    setModalMode('view')
    setSelectedVehicle(vehicle)
    setShowModal(true)
  }

  const handleDeleteVehicle = (vehicleId: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(prev => prev.filter(v => v.id !== vehicleId))
    }
  }

  const handleSaveVehicle = (vehicleData: Partial<Vehicle>) => {
    if (modalMode === 'add') {
      const newVehicle: Vehicle = {
        ...vehicleData as Vehicle,
        id: `V${String(vehicles.length + 1).padStart(3, '0')}`,
        rating: 0,
        totalBookings: 0,
        revenue: 0
      }
      setVehicles(prev => [...prev, newVehicle])
    } else if (modalMode === 'edit' && selectedVehicle) {
      setVehicles(prev => prev.map(v => 
        v.id === selectedVehicle.id ? { ...v, ...vehicleData } : v
      ))
    }
    setShowModal(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return { color: 'var(--bs-success)', bg: 'rgba(19, 222, 185, 0.1)' }
      case 'rented':
        return { color: 'var(--bs-primary)', bg: 'rgba(93, 135, 255, 0.1)' }
      case 'maintenance':
        return { color: 'var(--bs-warning)', bg: 'rgba(255, 174, 31, 0.1)' }
      case 'unavailable':
        return { color: 'var(--bs-danger)', bg: 'rgba(250, 137, 107, 0.1)' }
      default:
        return { color: 'var(--bs-gray-500)', bg: 'rgba(90, 106, 133, 0.1)' }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircleIcon className="h-4 w-4" />
      case 'rented':
        return <ClockIcon className="h-4 w-4" />
      case 'maintenance':
        return <WrenchScrewdriverIcon className="h-4 w-4" />
      case 'unavailable':
        return <XCircleIcon className="h-4 w-4" />
      default:
        return <ClockIcon className="h-4 w-4" />
    }
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    const matchesType = typeFilter === 'all' || vehicle.type.toLowerCase().includes(typeFilter.toLowerCase())
    
    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'Available').length,
    rented: vehicles.filter(v => v.status === 'Rented').length,
    maintenance: vehicles.filter(v => v.status === 'Maintenance').length,
    totalRevenue: vehicles.reduce((sum, v) => sum + (v.revenue || 0), 0)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--bs-body-color)' }}>
            Vehicle Management
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--bs-gray-500)' }}>
            Manage your vehicle fleet efficiently
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="modernize-btn px-4 py-2 border rounded-lg transition-colors"
            style={{ 
              borderColor: 'var(--bs-border-color)',
              color: 'var(--bs-body-color)'
            }}
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </button>
          <button
            onClick={handleAddVehicle}
            className="modernize-btn modernize-btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="modernize-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bs-primary)' }}>
              <TruckIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm" style={{ color: 'var(--bs-gray-500)' }}>Total Vehicles</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--bs-body-color)' }}>
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="modernize-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bs-success)' }}>
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm" style={{ color: 'var(--bs-gray-500)' }}>Available</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--bs-body-color)' }}>
                {stats.available}
              </p>
            </div>
          </div>
        </div>

        <div className="modernize-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bs-secondary)' }}>
              <ClockIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm" style={{ color: 'var(--bs-gray-500)' }}>Rented</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--bs-body-color)' }}>
                {stats.rented}
              </p>
            </div>
          </div>
        </div>

        <div className="modernize-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bs-warning)' }}>
              <WrenchScrewdriverIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm" style={{ color: 'var(--bs-gray-500)' }}>Maintenance</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--bs-body-color)' }}>
                {stats.maintenance}
              </p>
            </div>
          </div>
        </div>

        <div className="modernize-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bs-danger)' }}>
              <CurrencyDollarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm" style={{ color: 'var(--bs-gray-500)' }}>Revenue</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--bs-body-color)' }}>
                ${stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="modernize-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" 
                                   style={{ color: 'var(--bs-gray-500)' }} />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: 'var(--bs-border-color)',
                  borderRadius: 'var(--bs-border-radius)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--bs-primary)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--bs-border-color)'
                }}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ 
                borderColor: 'var(--bs-border-color)',
                borderRadius: 'var(--bs-border-radius)'
              }}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
              <option value="unavailable">Unavailable</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ 
                borderColor: 'var(--bs-border-color)',
                borderRadius: 'var(--bs-border-radius)'
              }}
            >
              <option value="all">All Types</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="van">Van</option>
              <option value="electric">Electric</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-4 w-4" style={{ color: 'var(--bs-gray-500)' }} />
            <span className="text-sm" style={{ color: 'var(--bs-gray-500)' }}>
              {filteredVehicles.length} of {vehicles.length} vehicles
            </span>
          </div>
        </div>
      </div>

      {/* Vehicle Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => {
            const statusStyle = getStatusColor(vehicle.status)
            return (
              <div key={vehicle.id} className="modernize-card overflow-hidden">
                {/* Vehicle Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <TruckIcon className="h-16 w-16 mx-auto mb-2" style={{ color: 'var(--bs-gray-400)' }} />
                    <p className="text-sm font-medium" style={{ color: 'var(--bs-gray-500)' }}>
                      {vehicle.make} {vehicle.model}
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--bs-body-color)' }}>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--bs-gray-500)' }}>
                        {vehicle.licensePlate} • {vehicle.color} • {vehicle.type}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <EllipsisHorizontalIcon className="h-4 w-4" style={{ color: 'var(--bs-gray-500)' }} />
                      </button>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between mb-4">
                    <span 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      style={{ color: statusStyle.color, backgroundColor: statusStyle.bg }}
                    >
                      {getStatusIcon(vehicle.status)}
                      <span className="ml-1 capitalize">{vehicle.status}</span>
                    </span>
                    <div className="flex items-center space-x-1">
                      <StarIcon className="h-4 w-4 fill-current" style={{ color: 'var(--bs-warning)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--bs-body-color)' }}>
                        {vehicle.rating}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--bs-gray-500)' }}>Daily Rate:</span>
                      <span className="font-semibold" style={{ color: 'var(--bs-body-color)' }}>
                        ${vehicle.dailyRate}/day
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--bs-gray-500)' }}>Mileage:</span>
                      <span style={{ color: 'var(--bs-body-color)' }}>
                        {vehicle.mileage.toLocaleString()} miles
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--bs-gray-500)' }}>Location:</span>
                      <span style={{ color: 'var(--bs-body-color)' }}>
                        {vehicle.location}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--bs-gray-500)' }}>Revenue:</span>
                      <span className="font-semibold" style={{ color: 'var(--bs-success)' }}>
                        ${vehicle.revenue?.toLocaleString() || '0'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewVehicle(vehicle)}
                      className="flex-1 modernize-btn px-3 py-2 border rounded-lg text-sm transition-colors hover:bg-gray-50"
                      style={{ borderColor: 'var(--bs-border-color)', color: 'var(--bs-body-color)' }}>
                      <EyeIcon className="h-4 w-4 inline mr-1" />
                      View
                    </button>
                    <button 
                      onClick={() => handleEditVehicle(vehicle)}
                      className="flex-1 modernize-btn px-3 py-2 border rounded-lg text-sm transition-colors hover:bg-gray-50"
                      style={{ borderColor: 'var(--bs-border-color)', color: 'var(--bs-body-color)' }}>
                      <PencilIcon className="h-4 w-4 inline mr-1" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List View */
        <div className="modernize-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: 'var(--bs-light)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                      style={{ color: 'var(--bs-gray-500)' }}>
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                      style={{ color: 'var(--bs-gray-500)' }}>
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                      style={{ color: 'var(--bs-gray-500)' }}>
                    Daily Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                      style={{ color: 'var(--bs-gray-500)' }}>
                    Mileage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                      style={{ color: 'var(--bs-gray-500)' }}>
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" 
                      style={{ color: 'var(--bs-gray-500)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--bs-border-color)' }}>
                {filteredVehicles.map((vehicle) => {
                  const statusStyle = getStatusColor(vehicle.status)
                  return (
                    <tr key={vehicle.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-lg flex items-center justify-center"
                                 style={{ backgroundColor: 'var(--bs-light)' }}>
                              <TruckIcon className="h-5 w-5" style={{ color: 'var(--bs-primary)' }} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium" style={{ color: 'var(--bs-body-color)' }}>
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </div>
                            <div className="text-sm" style={{ color: 'var(--bs-gray-500)' }}>
                              {vehicle.licensePlate} • {vehicle.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          style={{ color: statusStyle.color, backgroundColor: statusStyle.bg }}
                        >
                          {getStatusIcon(vehicle.status)}
                          <span className="ml-1 capitalize">{vehicle.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--bs-body-color)' }}>
                        ${vehicle.dailyRate}/day
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--bs-body-color)' }}>
                        {vehicle.mileage.toLocaleString()} mi
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: 'var(--bs-success)' }}>
                        ${vehicle.revenue?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewVehicle(vehicle)}
                            className="p-1 hover:bg-gray-100 rounded" title="View">
                            <EyeIcon className="h-4 w-4" style={{ color: 'var(--bs-primary)' }} />
                          </button>
                          <button 
                            onClick={() => handleEditVehicle(vehicle)}
                            className="p-1 hover:bg-gray-100 rounded" title="Edit">
                            <PencilIcon className="h-4 w-4" style={{ color: 'var(--bs-warning)' }} />
                          </button>
                          <button 
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                            className="p-1 hover:bg-gray-100 rounded" title="Delete">
                            <TrashIcon className="h-4 w-4" style={{ color: 'var(--bs-danger)' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredVehicles.length === 0 && (
        <div className="modernize-card p-12 text-center">
          <TruckIcon className="mx-auto h-12 w-12 mb-4" style={{ color: 'var(--bs-gray-400)' }} />
          <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--bs-body-color)' }}>
            No vehicles found
          </h3>
          <p className="text-sm mb-6" style={{ color: 'var(--bs-gray-500)' }}>
            Try adjusting your search or filter criteria.
          </p>
          <button 
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('all')
              setTypeFilter('all')
            }}
            className="modernize-btn modernize-btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Vehicle Modal */}
      <VehicleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mode={modalMode}
        vehicle={selectedVehicle}
        onSave={handleSaveVehicle}
      />
    </div>
  )
}
