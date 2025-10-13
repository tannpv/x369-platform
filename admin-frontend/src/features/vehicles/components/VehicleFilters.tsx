import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { Input, Select, Button } from '../../../components/ui'
import { VEHICLE_TYPES, VEHICLE_STATUSES } from '../../../shared/constants/vehicle'
import type { VehicleFilters } from '../../../shared/types/vehicle'
import type { SelectOption } from '../../../shared/types/common'

interface VehicleFiltersProps {
  filters: VehicleFilters
  onFiltersChange: (filters: Partial<VehicleFilters>) => void
  onClearFilters: () => void
  className?: string
}

const VehicleFiltersComponent: React.FC<VehicleFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className
}) => {
  const statusOptions: SelectOption[] = [
    { value: 'all', label: 'All Status' },
    ...VEHICLE_STATUSES.map(status => ({ value: status, label: status }))
  ]

  const typeOptions: SelectOption[] = [
    { value: 'all', label: 'All Types' },
    ...VEHICLE_TYPES.map(type => ({ value: type, label: type }))
  ]

  const hasActiveFilters = filters.query || 
    (filters.status && filters.status !== 'all') || 
    (filters.type && filters.type !== 'all')

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className || ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <FunnelIcon className="w-5 h-5 mr-2" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Search vehicles..."
          value={filters.query || ''}
          onChange={(e) => onFiltersChange({ query: e.target.value })}
          leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
        />

        <Select
          placeholder="Filter by status"
          value={filters.status || 'all'}
          onChange={(e) => onFiltersChange({ status: e.target.value as any })}
          options={statusOptions}
        />

        <Select
          placeholder="Filter by type"
          value={filters.type || 'all'}
          onChange={(e) => onFiltersChange({ type: e.target.value as any })}
          options={typeOptions}
        />
      </div>
    </div>
  )
}

export default VehicleFiltersComponent
