import type { BaseEntity } from './common'

export type UserRole = 'admin' | 'manager' | 'customer' | 'driver'
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending'

export interface User extends BaseEntity {
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: UserRole
  status: UserStatus
  avatar?: string
  lastLogin?: string
  emailVerified: boolean
  dateOfBirth?: string
  address?: Address
  // Analytics data
  totalBookings?: number
  totalSpent?: number
  rating?: number
  memberSince?: string
}

export interface UserProfile {
  dateOfBirth?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  licenseNumber?: string
  licenseExpiry?: string
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface CreateUserPayload {
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: UserRole
  status?: UserStatus
  password?: string // Optional for admin creation, will be auto-generated
  dateOfBirth?: string
  address?: Address
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  status?: UserStatus
  emailVerified?: boolean
}

export interface UserFilters {
  query?: string
  role?: UserRole | 'all'
  status?: UserStatus | 'all'
  emailVerified?: boolean
  registeredFrom?: string
  registeredTo?: string
  lastLoginFrom?: string
  lastLoginTo?: string
}

export interface UserStats {
  total: number
  active: number
  inactive: number
  suspended: number
  pending: number
  newThisMonth: number
  totalRevenue: number
  averageRating: number
  byRole: Record<UserRole, number>
}
