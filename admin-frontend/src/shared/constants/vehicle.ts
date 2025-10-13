import type { VehicleType, FuelType, TransmissionType, VehicleStatus } from '../types/vehicle'

// Vehicle-related constants
export const VEHICLE_TYPES: VehicleType[] = [
  'Sedan',
  'SUV', 
  'Hatchback',
  'Coupe',
  'Convertible',
  'Truck',
  'Van'
]

export const FUEL_TYPES: FuelType[] = [
  'Gasoline',
  'Diesel',
  'Electric',
  'Hybrid'
]

export const TRANSMISSION_TYPES: TransmissionType[] = [
  'Manual',
  'Automatic',
  'CVT'
]

export const VEHICLE_STATUSES: VehicleStatus[] = [
  'Available',
  'Rented',
  'Maintenance',
  'Reserved'
]

export const VEHICLE_FEATURES = [
  'Air Conditioning',
  'GPS Navigation',
  'Bluetooth',
  'USB Charging',
  'Backup Camera',
  'Parking Sensors',
  'Leather Seats',
  'Sunroof',
  'Heated Seats',
  'Cruise Control',
  'Lane Assist',
  'Emergency Brake',
  'All-Wheel Drive',
  'Premium Sound',
  'Autopilot'
] as const

// Status colors for consistent theming
export const STATUS_COLORS = {
  Available: {
    bg: 'rgba(19, 222, 185, 0.1)',
    text: 'var(--bs-success)',
    border: 'rgba(19, 222, 185, 0.3)'
  },
  Rented: {
    bg: 'rgba(255, 174, 31, 0.1)',
    text: 'var(--bs-warning)',
    border: 'rgba(255, 174, 31, 0.3)'
  },
  Maintenance: {
    bg: 'rgba(250, 137, 107, 0.1)',
    text: 'var(--bs-danger)',
    border: 'rgba(250, 137, 107, 0.3)'
  },
  Reserved: {
    bg: 'rgba(93, 135, 255, 0.1)',
    text: 'var(--bs-primary)',
    border: 'rgba(93, 135, 255, 0.3)'
  }
} as const

// Table configuration
export const VEHICLES_TABLE_COLUMNS = [
  { key: 'image', label: '', sortable: false, width: '60px' },
  { key: 'make', label: 'Make', sortable: true },
  { key: 'model', label: 'Model', sortable: true },
  { key: 'year', label: 'Year', sortable: true, width: '80px' },
  { key: 'type', label: 'Type', sortable: true, width: '100px' },
  { key: 'status', label: 'Status', sortable: true, width: '120px' },
  { key: 'dailyRate', label: 'Rate/Day', sortable: true, width: '100px' },
  { key: 'mileage', label: 'Mileage', sortable: true, width: '100px' },
  { key: 'revenue', label: 'Revenue', sortable: true, width: '100px' },
  { key: 'actions', label: 'Actions', sortable: false, width: '120px' }
] as const
