import type { UserRole, UserStatus } from '../types/user'
import type { SelectOption } from '../types/common'

export const USER_ROLES: Record<UserRole, string> = {
  admin: 'Administrator',
  manager: 'Manager', 
  customer: 'Customer',
  driver: 'Driver'
} as const

export const USER_STATUSES: Record<UserStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended',
  pending: 'Pending Verification'
} as const

export const USER_ROLE_OPTIONS: SelectOption[] = [
  { value: 'admin', label: 'Administrator' },
  { value: 'manager', label: 'Manager' },
  { value: 'customer', label: 'Customer' },
  { value: 'driver', label: 'Driver' }
]

export const USER_STATUS_OPTIONS: SelectOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'pending', label: 'Pending' }
]

export const USER_STATUS_COLORS: Record<UserStatus, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  suspended: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
} as const

export const USER_ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
  manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  customer: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  driver: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
} as const
