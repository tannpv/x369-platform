/**
 * Vehicle service for API operations
 */

import { apiService } from './api'
import type { ApiResponse, PaginatedResponse } from '../shared/types/common'
import type { 
  Vehicle, 
  VehicleFilters, 
  VehicleStats, 
  CreateVehiclePayload, 
  UpdateVehiclePayload
} from '../shared/types/vehicle'
import { vehicleSeedData } from '../shared/data/vehicleSeedData'

export class VehicleService {
  private endpoint = '/vehicles'

  async getAll(filters?: VehicleFilters): Promise<PaginatedResponse<Vehicle>> {
    return apiService.getPaginated<Vehicle>(this.endpoint, filters)
  }

  async getById(id: string): Promise<ApiResponse<Vehicle>> {
    return apiService.getById<Vehicle>(this.endpoint, id)
  }

  async create(data: CreateVehiclePayload): Promise<ApiResponse<Vehicle>> {
    return apiService.create<Vehicle>(this.endpoint, data)
  }

  async update(id: string, data: UpdateVehiclePayload): Promise<ApiResponse<Vehicle>> {
    return apiService.update<Vehicle>(this.endpoint, id, data)
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.remove<void>(this.endpoint, id)
  }

  async getStats(filters?: VehicleFilters): Promise<ApiResponse<VehicleStats>> {
    return apiService.get<ApiResponse<VehicleStats>>(`${this.endpoint}/stats`, filters)
  }

  async updateStatus(id: string, status: Vehicle['status']): Promise<ApiResponse<Vehicle>> {
    return apiService.patch<ApiResponse<Vehicle>>(`${this.endpoint}/${id}/status`, { status })
  }

  async bulkUpdate(ids: string[], data: Partial<Vehicle>): Promise<ApiResponse<Vehicle[]>> {
    return apiService.post<ApiResponse<Vehicle[]>>(`${this.endpoint}/bulk-update`, { ids, data })
  }

  async uploadImage(id: string, file: File): Promise<ApiResponse<{ imageUrl: string }>> {
    const formData = new FormData()
    formData.append('image', file)
    
    // For file uploads, we need to use a different content type
    const response = await fetch(`${apiService['baseURL']}${this.endpoint}/${id}/image`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    return response.json()
  }
}

// Mock service for development  
export class MockVehicleService {
  private vehicles: Vehicle[] = [...vehicleSeedData]

  async getAll(filters?: VehicleFilters, page = 1, limit = 20): Promise<PaginatedResponse<Vehicle>> {
    let filteredVehicles = [...this.vehicles]

    // Apply filters
    if (filters?.query) {
      const query = filters.query.toLowerCase()
      filteredVehicles = filteredVehicles.filter(v => 
        v.make.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query) ||
        v.licensePlate.toLowerCase().includes(query) ||
        v.vin?.toLowerCase().includes(query) ||
        v.color.toLowerCase().includes(query)
      )
    }

    if (filters?.status && filters.status !== 'all') {
      filteredVehicles = filteredVehicles.filter(v => v.status === filters.status)
    }

    if (filters?.type && filters.type !== 'all') {
      filteredVehicles = filteredVehicles.filter(v => v.type === filters.type)
    }

    if (filters?.fuelType && filters.fuelType !== 'all') {
      filteredVehicles = filteredVehicles.filter(v => v.fuelType === filters.fuelType)
    }

    if (filters?.make && filters.make !== 'all') {
      filteredVehicles = filteredVehicles.filter(v => v.make === filters.make)
    }

    if (filters?.yearFrom) {
      filteredVehicles = filteredVehicles.filter(v => v.year >= parseInt(filters.yearFrom!))
    }

    if (filters?.yearTo) {
      filteredVehicles = filteredVehicles.filter(v => v.year <= parseInt(filters.yearTo!))
    }

    if (filters?.priceFrom) {
      filteredVehicles = filteredVehicles.filter(v => v.dailyRate >= parseFloat(filters.priceFrom!))
    }

    if (filters?.priceTo) {
      filteredVehicles = filteredVehicles.filter(v => v.dailyRate <= parseFloat(filters.priceTo!))
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex)

    return {
      data: paginatedVehicles,
      total: filteredVehicles.length,
      page,
      limit,
      hasNextPage: endIndex < filteredVehicles.length,
      hasPrevPage: page > 1
    }
  }

  async getById(id: string): Promise<ApiResponse<Vehicle>> {
    const vehicle = this.vehicles.find(v => v.id === id)
    if (!vehicle) {
      throw new Error('Vehicle not found')
    }
    
    return {
      success: true,
      data: vehicle
    }
  }

  // Helper function to generate VIN (Vehicle Identification Number)
  private generateVIN(): string {
    const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789'
    let vin = ''
    for (let i = 0; i < 17; i++) {
      vin += chars[Math.floor(Math.random() * chars.length)]
    }
    return vin
  }

  async create(data: CreateVehiclePayload): Promise<ApiResponse<Vehicle>> {
    const newVehicle: Vehicle = {
      ...data,
      id: `V${String(this.vehicles.length + 1).padStart(3, '0')}`,
      vin: this.generateVIN(),
      rating: 0,
      totalBookings: 0,
      revenue: 0,
      createdAt: new Date().toISOString()
    }
    
    this.vehicles.push(newVehicle)
    
    return {
      success: true,
      data: newVehicle
    }
  }

  async update(id: string, data: UpdateVehiclePayload): Promise<ApiResponse<Vehicle>> {
    const index = this.vehicles.findIndex(v => v.id === id)
    if (index === -1) {
      throw new Error('Vehicle not found')
    }
    
    this.vehicles[index] = { ...this.vehicles[index], ...data }
    
    return {
      success: true,
      data: this.vehicles[index]
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const index = this.vehicles.findIndex(v => v.id === id)
    if (index === -1) {
      throw new Error('Vehicle not found')
    }
    
    this.vehicles.splice(index, 1)
    
    return {
      success: true,
      data: undefined
    }
  }

  async getStats(): Promise<ApiResponse<VehicleStats>> {
    // Use pre-calculated stats from seed data, but recalculate based on current vehicle state
    const stats: VehicleStats = {
      total: this.vehicles.length,
      available: this.vehicles.filter(v => v.status === 'Available').length,
      rented: this.vehicles.filter(v => v.status === 'Rented').length,
      maintenance: this.vehicles.filter(v => v.status === 'Maintenance').length,
      reserved: this.vehicles.filter(v => v.status === 'Reserved').length,
      totalRevenue: this.vehicles.reduce((sum, v) => sum + (v.revenue || 0), 0),
      averageRating: Number((this.vehicles.reduce((sum, v) => sum + (v.rating || 0), 0) / this.vehicles.length).toFixed(1))
    }
    
    return {
      success: true,
      data: stats
    }
  }

  async updateStatus(id: string, status: Vehicle['status']): Promise<ApiResponse<Vehicle>> {
    return this.update(id, { id, status })
  }

  async bulkUpdate(ids: string[], data: Partial<Vehicle>): Promise<ApiResponse<Vehicle[]>> {
    const updatedVehicles: Vehicle[] = []
    
    for (const id of ids) {
      const result = await this.update(id, { ...data, id })
      updatedVehicles.push(result.data)
    }
    
    return {
      success: true,
      data: updatedVehicles
    }
  }

  async uploadImage(id: string, file: File): Promise<ApiResponse<{ imageUrl: string }>> {
    // Mock implementation - in real app, this would upload to cloud storage
    const imageUrl = URL.createObjectURL(file)
    
    await this.update(id, { id, image: imageUrl })
    
    return {
      success: true,
      data: { imageUrl }
    }
  }
}

// Export the appropriate service based on environment
export const vehicleService = import.meta.env.DEV 
  ? new MockVehicleService() 
  : new VehicleService()
