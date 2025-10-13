import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button } from '../../../components/ui'
import { STATUS_COLORS } from '../../../shared/constants/vehicle'
import { formatCurrency, formatNumber } from '../../../shared/utils'
import type { Vehicle } from '../../../shared/types/vehicle'

interface VehicleCardProps {
  vehicle: Vehicle
  onView: (vehicle: Vehicle) => void
  onEdit: (vehicle: Vehicle) => void
  onDelete: (vehicleId: string) => void
  className?: string
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onView,
  onEdit,
  onDelete,
  className
}) => {
  const statusColor = STATUS_COLORS[vehicle.status]

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${className || ''}`}>
      {/* Image */}
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {vehicle.image ? (
          <img
            src={vehicle.image}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              const parent = e.currentTarget.parentElement
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-gray-100">
                    <div class="text-center">
                      <div class="text-4xl mb-2">🚗</div>
                      <p class="text-sm text-gray-500">No Image</p>
                    </div>
                  </div>
                `
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🚗</div>
              <p className="text-sm text-gray-500">No Image</p>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div 
          className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium border"
          style={{
            backgroundColor: statusColor.bg,
            color: statusColor.text,
            borderColor: statusColor.border
          }}
        >
          {vehicle.status}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-sm text-gray-500">
            {vehicle.type} • {vehicle.fuelType} • {vehicle.transmission}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">License Plate:</span>
            <span className="font-medium text-gray-900">{vehicle.licensePlate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Daily Rate:</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(vehicle.dailyRate)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Mileage:</span>
            <span className="font-medium text-gray-900">
              {formatNumber(vehicle.mileage)} mi
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Location:</span>
            <span className="font-medium text-gray-900">{vehicle.location}</span>
          </div>
          {vehicle.revenue && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Revenue:</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(vehicle.revenue)}
              </span>
            </div>
          )}
        </div>

        {/* Features */}
        {vehicle.features && vehicle.features.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Features:</p>
            <div className="flex flex-wrap gap-1">
              {vehicle.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                >
                  {feature}
                </span>
              ))}
              {vehicle.features.length > 3 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-full">
                  +{vehicle.features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(vehicle)}
            leftIcon={<EyeIcon className="w-4 h-4" />}
            className="flex-1"
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(vehicle)}
            leftIcon={<PencilIcon className="w-4 h-4" />}
            className="flex-1"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(vehicle.id)}
            leftIcon={<TrashIcon className="w-4 h-4" />}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

export default VehicleCard
