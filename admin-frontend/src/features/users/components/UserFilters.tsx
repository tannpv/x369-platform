import React from 'react'
import { Input, Select, Button } from '../../../components/ui'
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from '../../../shared/constants/user'
import type { UserFilters } from '../../../shared/types/user'
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface UserFiltersComponentProps {
  filters: UserFilters
  onFiltersChange: (filters: UserFilters) => void
  onClearFilters: () => void
}

const UserFiltersComponent: React.FC<UserFiltersComponentProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== 'all'
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            leftIcon={<XMarkIcon className="h-4 w-4" />}
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Search users..."
          value={filters.query || ''}
          onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })}
          leftIcon={<MagnifyingGlassIcon className="h-4 w-4" />}
        />

        <Select
          value={filters.role || 'all'}
          onChange={(e) => onFiltersChange({ ...filters, role: e.target.value as any })}
          options={[
            { value: 'all', label: 'All Roles' },
            ...USER_ROLE_OPTIONS
          ]}
        />

        <Select
          value={filters.status || 'all'}
          onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as any })}
          options={[
            { value: 'all', label: 'All Statuses' },
            ...USER_STATUS_OPTIONS
          ]}
        />

        <Select
          value={filters.emailVerified === undefined ? 'all' : filters.emailVerified ? 'verified' : 'unverified'}
          onChange={(e) => {
            const value = e.target.value
            const emailVerified = value === 'all' ? undefined : value === 'verified'
            onFiltersChange({ ...filters, emailVerified })
          }}
          options={[
            { value: 'all', label: 'All Users' },
            { value: 'verified', label: 'Email Verified' },
            { value: 'unverified', label: 'Email Unverified' }
          ]}
        />
      </div>
    </div>
  )
}

export default UserFiltersComponent
