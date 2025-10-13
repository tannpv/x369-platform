import type { BaseEntity } from './common'

export type VehicleStatus = 'Available' | 'Rented' | 'Maintenance' | 'Reserved'
export type VehicleType = 'Sedan' | 'SUV' | 'Hatchback' | 'Coupe' | 'Convertible' | 'Truck' | 'Van'
export type FuelType = 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid'
export type TransmissionType = 'Manual' | 'Automatic' | 'CVT'

export interface Vehicle extends BaseEntity {
  make: string
  model: string
  year: number
  type: VehicleType
  fuelType: FuelType
  transmission: TransmissionType
  licensePlate: string
  vin: string // Added VIN field
  color: string
  seats: number
  mileage: number
  dailyRate: number
  status: VehicleStatus
  features: string[]
  image: string
  description: string
  location: string
  // Analytics data
  rating?: number
  totalBookings?: number
  revenue?: number
  lastService?: string
  nextService?: string
}

export interface VehicleFilters {
  query?: string
  status?: VehicleStatus | 'all'
  type?: VehicleType | 'all'
  fuelType?: FuelType | 'all'
  make?: string | 'all'
  yearFrom?: string
  yearTo?: string
  priceFrom?: string
  priceTo?: string
  minRate?: number
  maxRate?: number
  location?: string
  availableFrom?: string
  availableTo?: string
}

export interface VehicleStats {
  total: number
  available: number
  rented: number
  maintenance: number
  reserved: number
  totalRevenue: number
  averageRating: number
}

export interface CreateVehiclePayload {
  make: string
  model: string
  year: number
  type: VehicleType
  fuelType: FuelType
  transmission: TransmissionType
  licensePlate: string
  color: string
  seats: number
  mileage: number
  dailyRate: number
  status: VehicleStatus
  features: string[]
  image: string
  description: string
  location: string
}

export interface UpdateVehiclePayload extends Partial<CreateVehiclePayload> {
  id: string
}
