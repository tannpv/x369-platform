/**
 * Custom hooks for vehicle management
 */

import { useState, useEffect, useCallback } from 'react'
import { vehicleService } from '../../../services/vehicleService'
import type { 
  Vehicle, 
  VehicleFilters, 
  VehicleStats, 
  CreateVehiclePayload, 
  UpdateVehiclePayload 
} from '../../../shared/types/vehicle'

export const useVehicles = (initialFilters?: VehicleFilters) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<VehicleFilters>(initialFilters || {})

  const fetchVehicles = useCallback(async (page = 1, limit = 20) => {
    try {
      setLoading(true)
      setError(null)
      const response = await vehicleService.getAll(filters, page, limit)
      setVehicles(response.data)
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        hasNextPage: response.hasNextPage,
        hasPrevPage: response.hasPrevPage
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vehicles')
    } finally {
      setLoading(false)
    }
  }, [filters])

  const createVehicle = async (data: CreateVehiclePayload): Promise<void> => {
    try {
      const response = await vehicleService.create(data)
      setVehicles(prev => [...prev, response.data])
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create vehicle')
    }
  }

  const updateVehicle = async (id: string, data: UpdateVehiclePayload): Promise<void> => {
    try {
      const response = await vehicleService.update(id, data)
      setVehicles(prev => prev.map(v => v.id === id ? response.data : v))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update vehicle')
    }
  }

  const deleteVehicle = async (id: string): Promise<void> => {
    try {
      await vehicleService.delete(id)
      setVehicles(prev => prev.filter(v => v.id !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete vehicle')
    }
  }

  const updateFilters = (newFilters: Partial<VehicleFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({})
  }

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      fetchVehicles(pagination.page + 1, pagination.limit)
    }
  }, [pagination, fetchVehicles])

  const prevPage = useCallback(() => {
    if (pagination.hasPrevPage) {
      fetchVehicles(pagination.page - 1, pagination.limit)
    }
  }, [pagination, fetchVehicles])

  const goToPage = useCallback((page: number) => {
    fetchVehicles(page, pagination.limit)
  }, [pagination.limit, fetchVehicles])

  return {
    vehicles,
    pagination,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refetch: fetchVehicles,
    nextPage,
    prevPage,
    goToPage,
    createVehicle,
    updateVehicle,
    deleteVehicle
  }
}

export const useVehicleStats = (filters?: VehicleFilters) => {
  const [stats, setStats] = useState<VehicleStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await vehicleService.getStats(filters)
      setStats(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}

export const useVehicleActions = () => {
  const [loading, setLoading] = useState(false)

  const updateStatus = async (id: string, status: Vehicle['status']): Promise<Vehicle> => {
    setLoading(true)
    try {
      const response = await vehicleService.updateStatus(id, status)
      return response.data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  const uploadImage = async (id: string, file: File): Promise<string> => {
    setLoading(true)
    try {
      const response = await vehicleService.uploadImage(id, file)
      return response.data.imageUrl
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setLoading(false)
    }
  }

  const bulkUpdate = async (ids: string[], data: Partial<Vehicle>): Promise<Vehicle[]> => {
    setLoading(true)
    try {
      const response = await vehicleService.bulkUpdate(ids, data)
      return response.data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to bulk update')
    } finally {
      setLoading(false)  
    }
  }

  return {
    loading,
    updateStatus,
    uploadImage,
    bulkUpdate
  }
}
