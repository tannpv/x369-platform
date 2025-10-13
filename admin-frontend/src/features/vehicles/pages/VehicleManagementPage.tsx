import { useState } from 'react'
import { PlusIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline'
import { Button } from '../../../components/ui'
import { useVehicles } from '../hooks/useVehicles'
import VehicleStatsGrid from '../components/VehicleStatsGrid'
import VehicleFilters from '../components/VehicleFilters'
import VehicleCard from '../components/VehicleCard'
import VehicleTable from '../components/VehicleTable'
import VehicleModal from '../components/VehicleModal'
import type { Vehicle, CreateVehiclePayload, UpdateVehiclePayload } from '../../../shared/types/vehicle'
import type { ViewMode } from '../../../shared/types/common'

const VehicleManagementPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    mode: 'add' | 'edit' | 'view'
    vehicle?: Vehicle
  }>({
    isOpen: false,
    mode: 'add'
  })

  const {
    vehicles,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refetch,
    createVehicle,
    updateVehicle,
    deleteVehicle
  } = useVehicles()

  const handleAddVehicle = () => {
    setModalState({
      isOpen: true,
      mode: 'add'
    })
  }

  const handleViewVehicle = (vehicle: Vehicle) => {
    setModalState({
      isOpen: true,
      mode: 'view',
      vehicle
    })
  }

  const handleEditVehicle = (vehicle: Vehicle) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      vehicle
    })
  }

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle(vehicleId)
      } catch (error) {
        console.error('Failed to delete vehicle:', error)
        // You could add a toast notification here
      }
    }
  }

  const handleSaveVehicle = async (data: CreateVehiclePayload | UpdateVehiclePayload) => {
    try {
      if (modalState.mode === 'add') {
        await createVehicle(data as CreateVehiclePayload)
      } else if (modalState.mode === 'edit' && 'id' in data) {
        await updateVehicle(data.id, data as UpdateVehiclePayload)
      }
    } catch (error) {
      throw error // Re-throw to let modal handle it
    }
  }

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: 'add'
    })
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    )
  }

  const hasResults = vehicles.length > 0
  const hasActiveFilters = filters.query || 
    (filters.status && filters.status !== 'all') || 
    (filters.type && filters.type !== 'all')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
          <p className="text-gray-600">Manage your vehicle fleet and track performance</p>
        </div>
        <Button
          onClick={handleAddVehicle}
          leftIcon={<PlusIcon className="w-5 h-5" />}
        >
          Add Vehicle
        </Button>
      </div>

      {/* Stats Grid */}
      <VehicleStatsGrid filters={filters} />

      {/* Filters */}
      <VehicleFilters
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
      />

      {/* View Mode Controls */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">
            {loading ? 'Loading...' : `${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''}`}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? (
        hasResults ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onView={handleViewVehicle}
                onEdit={handleEditVehicle}
                onDelete={handleDeleteVehicle}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hasActiveFilters ? 'No vehicles match your filters' : 'No vehicles yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {hasActiveFilters 
                ? 'Try adjusting your search criteria or clear all filters.' 
                : 'Get started by adding your first vehicle to the fleet.'}
            </p>
            {hasActiveFilters ? (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            ) : (
              <Button onClick={handleAddVehicle}>
                Add Your First Vehicle
              </Button>
            )}
          </div>
        )
      ) : (
        <VehicleTable
          vehicles={vehicles}
          onView={handleViewVehicle}
          onEdit={handleEditVehicle}
          onDelete={handleDeleteVehicle}
          loading={loading}
        />
      )}

      {/* Vehicle Modal */}
      <VehicleModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        mode={modalState.mode}
        vehicle={modalState.vehicle}
        onSave={handleSaveVehicle}
      />
    </div>
  )
}

export default VehicleManagementPage
