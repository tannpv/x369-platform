import { useState, useEffect } from 'react'
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline'

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
}

interface VehicleModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'add' | 'edit' | 'view'
  vehicle?: Vehicle
  onSave?: (vehicle: Partial<Vehicle>) => void
}

const defaultVehicle: Partial<Vehicle> = {
  make: '',
  model: '',
  year: new Date().getFullYear(),
  type: 'Sedan',
  fuelType: 'Gasoline',
  transmission: 'Automatic',
  dailyRate: 0,
  status: 'Available',
  licensePlate: '',
  color: '',
  seats: 5,
  mileage: 0,
  features: [],
  image: '',
  description: '',
  location: 'Main Branch'
}

const vehicleTypes = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Truck', 'Van']
const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid']
const transmissionTypes = ['Manual', 'Automatic', 'CVT']
const statusOptions = ['Available', 'Rented', 'Maintenance', 'Reserved']
const availableFeatures = [
  'Air Conditioning', 'GPS Navigation', 'Bluetooth', 'USB Charging',
  'Backup Camera', 'Parking Sensors', 'Leather Seats', 'Sunroof',
  'Heated Seats', 'Cruise Control', 'Lane Assist', 'Emergency Brake'
]

export default function VehicleModal({ isOpen, onClose, mode, vehicle, onSave }: VehicleModalProps) {
  const [formData, setFormData] = useState<Partial<Vehicle>>(defaultVehicle)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  useEffect(() => {
    if (vehicle && mode !== 'add') {
      setFormData(vehicle)
      setSelectedFeatures(vehicle.features || [])
    } else {
      setFormData(defaultVehicle)
      setSelectedFeatures([])
    }
  }, [vehicle, mode, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSave && mode !== 'view') {
      const vehicleData = {
        ...formData,
        features: selectedFeatures,
        id: mode === 'add' ? `vehicle-${Date.now()}` : formData.id
      }
      onSave(vehicleData)
      onClose()
    }
  }

  const handleFeatureToggle = (feature: string) => {
    if (mode === 'view') return
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  const handleInputChange = (field: keyof Vehicle, value: any) => {
    if (mode === 'view') return
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  const isReadOnly = mode === 'view'
  const title = mode === 'add' ? 'Add New Vehicle' : mode === 'edit' ? 'Edit Vehicle' : 'Vehicle Details'

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                      <input
                        type="text"
                        value={formData.make || ''}
                        onChange={(e) => handleInputChange('make', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        required={!isReadOnly}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                      <input
                        type="text"
                        value={formData.model || ''}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        required={!isReadOnly}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <input
                        type="number"
                        value={formData.year || ''}
                        onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                        disabled={isReadOnly}
                        min="1990"
                        max={new Date().getFullYear() + 1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        required={!isReadOnly}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={formData.type || ''}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        required={!isReadOnly}
                      >
                        {vehicleTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Technical Specs */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Technical Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                      <select
                        value={formData.fuelType || ''}
                        onChange={(e) => handleInputChange('fuelType', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      >
                        {fuelTypes.map(fuel => (
                          <option key={fuel} value={fuel}>{fuel}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                      <select
                        value={formData.transmission || ''}
                        onChange={(e) => handleInputChange('transmission', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      >
                        {transmissionTypes.map(trans => (
                          <option key={trans} value={trans}>{trans}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                      <input
                        type="number"
                        value={formData.seats || ''}
                        onChange={(e) => handleInputChange('seats', parseInt(e.target.value))}
                        disabled={isReadOnly}
                        min="2"
                        max="15"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
                      <input
                        type="number"
                        value={formData.mileage || ''}
                        onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                        disabled={isReadOnly}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Rental Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Rental Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate ($)</label>
                      <input
                        type="number"
                        value={formData.dailyRate || ''}
                        onChange={(e) => handleInputChange('dailyRate', parseFloat(e.target.value))}
                        disabled={isReadOnly}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        required={!isReadOnly}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={formData.status || ''}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                      <input
                        type="text"
                        value={formData.licensePlate || ''}
                        onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        required={!isReadOnly}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                      <input
                        type="text"
                        value={formData.color || ''}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        disabled={isReadOnly}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {/* Features */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Features</h3>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {availableFeatures.map(feature => (
                      <label key={feature} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFeatures.includes(feature)}
                          onChange={() => handleFeatureToggle(feature)}
                          disabled={isReadOnly}
                          className="mr-2 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                        />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Image */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Image</h3>
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={formData.image || ''}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      disabled={isReadOnly}
                      placeholder="Vehicle image URL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                    {formData.image ? (
                      <div className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={formData.image} 
                          alt="Vehicle preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                            if (nextElement) nextElement.style.display = 'flex'
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 hidden">
                          <PhotoIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <PhotoIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={isReadOnly}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="Vehicle description, condition notes, etc."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isReadOnly ? 'Close' : 'Cancel'}
              </button>
              {!isReadOnly && (
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {mode === 'add' ? 'Add Vehicle' : 'Save Changes'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
