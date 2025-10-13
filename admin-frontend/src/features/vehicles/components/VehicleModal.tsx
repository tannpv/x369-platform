import { useState, useEffect } from 'react'
import { Modal, Button, Input, Select } from '../../../components/ui'
import { VEHICLE_TYPES, FUEL_TYPES, TRANSMISSION_TYPES, VEHICLE_STATUSES, VEHICLE_FEATURES } from '../../../shared/constants/vehicle'

import type { Vehicle, CreateVehiclePayload, UpdateVehiclePayload } from '../../../shared/types/vehicle'
import type { SelectOption } from '../../../shared/types/common'

interface VehicleModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'add' | 'edit' | 'view'
  vehicle?: Vehicle
  onSave?: (data: CreateVehiclePayload | UpdateVehiclePayload) => Promise<void>
}

const VehicleModal: React.FC<VehicleModalProps> = ({
  isOpen,
  onClose,
  mode,
  vehicle,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Vehicle>>({})
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(false)

  const isReadOnly = mode === 'view'
  const title = mode === 'add' ? 'Add New Vehicle' : mode === 'edit' ? 'Edit Vehicle' : 'Vehicle Details'

  // Initialize form data
  useEffect(() => {
    if (vehicle && mode !== 'add') {
      setFormData(vehicle)
      setSelectedFeatures(vehicle.features || [])
    } else {
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        type: 'Sedan',
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        licensePlate: '',
        color: '',
        seats: 5,
        mileage: 0,
        dailyRate: 0,
        status: 'Available',
        location: 'Main Branch',
        image: '',
        description: ''
      })
      setSelectedFeatures([])
    }
    setErrors({})
  }, [vehicle, mode, isOpen])

  const typeOptions: SelectOption[] = VEHICLE_TYPES.map(type => ({ value: type, label: type }))
  const fuelOptions: SelectOption[] = FUEL_TYPES.map(fuel => ({ value: fuel, label: fuel }))
  const transmissionOptions: SelectOption[] = TRANSMISSION_TYPES.map(trans => ({ value: trans, label: trans }))
  const statusOptions: SelectOption[] = VEHICLE_STATUSES.map(status => ({ value: status, label: status }))

  const handleInputChange = (field: keyof Vehicle, value: any) => {
    if (isReadOnly) return
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: [] }))
    }
  }

  const handleFeatureToggle = (feature: string) => {
    if (isReadOnly) return
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  const validateFormData = () => {
    const newErrors: Record<string, string[]> = {}
    let isValid = true

    // Required fields validation
    if (!formData.make || formData.make.length < 2) {
      newErrors.make = ['Make must be at least 2 characters']
      isValid = false
    }

    if (!formData.model || formData.model.length < 2) {
      newErrors.model = ['Model must be at least 2 characters']  
      isValid = false
    }

    if (!formData.year || formData.year < 1990 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = [`Year must be between 1990 and ${new Date().getFullYear() + 1}`]
      isValid = false
    }

    if (!formData.licensePlate || formData.licensePlate.length < 3) {
      newErrors.licensePlate = ['License plate must be at least 3 characters']
      isValid = false
    }

    if (formData.dailyRate === undefined || formData.dailyRate < 0) {
      newErrors.dailyRate = ['Daily rate must be 0 or greater']
      isValid = false
    }

    if (!formData.seats || formData.seats < 2 || formData.seats > 15) {
      newErrors.seats = ['Seats must be between 2 and 15']
      isValid = false
    }

    if (formData.mileage === undefined || formData.mileage < 0) {
      newErrors.mileage = ['Mileage must be 0 or greater']
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isReadOnly || !onSave) return

    if (!validateFormData()) return

    setLoading(true)
    try {
      const payload = {
        ...formData,
        features: selectedFeatures,
        ...(mode === 'edit' && { id: vehicle?.id })
      } as CreateVehiclePayload | UpdateVehiclePayload

      await onSave(payload)
      onClose()
    } catch (error) {
      console.error('Failed to save vehicle:', error)
      // You could add a toast notification here
    } finally {
      setLoading(false)
    }
  }

  const footer = !isReadOnly ? (
    <>
      <Button
        variant="ghost"
        onClick={onClose}
        disabled={loading}
      >
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        loading={loading}
        disabled={loading}
      >
        {mode === 'add' ? 'Add Vehicle' : 'Save Changes'}
      </Button>
    </>
  ) : (
    <Button onClick={onClose}>Close</Button>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="xl"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Make"
              required
              value={formData.make || ''}
              onChange={(e) => handleInputChange('make', e.target.value)}
              disabled={isReadOnly}
              error={errors.make?.[0]}
            />
            <Input
              label="Model"
              required
              value={formData.model || ''}
              onChange={(e) => handleInputChange('model', e.target.value)}
              disabled={isReadOnly}
              error={errors.model?.[0]}
            />
            <Input
              label="Year"
              type="number"
              required
              value={formData.year || ''}
              onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
              disabled={isReadOnly}
              error={errors.year?.[0]}
            />
            <Select
              label="Type"
              required
              value={formData.type || ''}
              onChange={(e) => handleInputChange('type', e.target.value)}
              options={typeOptions}
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Fuel Type"
              value={formData.fuelType || ''}
              onChange={(e) => handleInputChange('fuelType', e.target.value)}
              options={fuelOptions}
              disabled={isReadOnly}
            />
            <Select
              label="Transmission"
              value={formData.transmission || ''}
              onChange={(e) => handleInputChange('transmission', e.target.value)}
              options={transmissionOptions}
              disabled={isReadOnly}
            />
            <Input
              label="Seats"
              type="number"
              required
              value={formData.seats || ''}
              onChange={(e) => handleInputChange('seats', parseInt(e.target.value))}
              disabled={isReadOnly}
              error={errors.seats?.[0]}
            />
            <Input
              label="Mileage"
              type="number"
              required
              value={formData.mileage || ''}
              onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
              disabled={isReadOnly}
              error={errors.mileage?.[0]}
            />
          </div>
        </div>

        {/* Rental Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Rental Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Daily Rate ($)"
              type="number"
              step="0.01"
              required
              value={formData.dailyRate || ''}
              onChange={(e) => handleInputChange('dailyRate', parseFloat(e.target.value))}
              disabled={isReadOnly}
              error={errors.dailyRate?.[0]}
            />
            <Select
              label="Status"
              value={formData.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value)}
              options={statusOptions}
              disabled={isReadOnly}
            />
            <Input
              label="License Plate"
              required
              value={formData.licensePlate || ''}
              onChange={(e) => handleInputChange('licensePlate', e.target.value)}
              disabled={isReadOnly}
              error={errors.licensePlate?.[0]}
            />
            <Input
              label="Color"
              value={formData.color || ''}
              onChange={(e) => handleInputChange('color', e.target.value)}
              disabled={isReadOnly}
            />
          </div>
          <div className="mt-4">
            <Input
              label="Location"
              value={formData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* Features */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
            {VEHICLE_FEATURES.map(feature => (
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

        {/* Image and Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Image URL"
              value={formData.image || ''}
              onChange={(e) => handleInputChange('image', e.target.value)}
              disabled={isReadOnly}
              placeholder="https://example.com/image.jpg"
            />
            {formData.image && (
              <div className="mt-2">
                <img
                  src={formData.image}
                  alt="Vehicle preview"
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isReadOnly}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="Vehicle description, condition notes, etc."
            />
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default VehicleModal
