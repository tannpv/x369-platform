# Feature Extension Guide

This guide provides step-by-step instructions for extending the clean architecture to create new features in the admin frontend.

## 🎯 Creating a New Feature: Users Management

Let's walk through creating a complete Users Management feature following our established architecture.

### Step 1: Create Feature Structure

```bash
mkdir -p src/features/users/{components,hooks,pages}
```

### Step 2: Define Types

Create `src/shared/types/user.ts`:

```typescript
import { BaseEntity } from './common'

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
  address?: Address
}

export type UserRole = 'admin' | 'manager' | 'customer' | 'driver'
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending'

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
  password: string
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  status?: UserStatus
  emailVerified?: boolean
}

export interface UserFilters {
  query?: string
  role?: UserRole
  status?: UserStatus
  emailVerified?: boolean
  dateFrom?: string
  dateTo?: string
}

export interface UserStats {
  total: number
  active: number
  inactive: number
  newThisMonth: number
  byRole: Record<UserRole, number>
}
```

### Step 3: Add Constants

Create `src/shared/constants/user.ts`:

```typescript
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
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  suspended: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800'
} as const
```

### Step 4: Create Service Layer

Create `src/services/userService.ts`:

```typescript
import { ApiService } from './api'
import type { 
  User, 
  CreateUserPayload, 
  UpdateUserPayload, 
  UserFilters, 
  UserStats 
} from '../shared/types/user'
import type { PaginatedResponse } from '../shared/types/common'

export interface IUserService {
  getUsers(filters?: UserFilters, page?: number, limit?: number): Promise<PaginatedResponse<User>>
  getUserById(id: string): Promise<User>
  createUser(data: CreateUserPayload): Promise<User>
  updateUser(id: string, data: UpdateUserPayload): Promise<User>
  deleteUser(id: string): Promise<void>
  getUserStats(): Promise<UserStats>
}

// Real API implementation
export class UserService implements IUserService {
  constructor(private api: ApiService) {}

  async getUsers(filters?: UserFilters, page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    })
    return this.api.get(`/users?${params}`)
  }

  async getUserById(id: string): Promise<User> {
    return this.api.get(`/users/${id}`)
  }

  async createUser(data: CreateUserPayload): Promise<User> {
    return this.api.post('/users', data)
  }

  async updateUser(id: string, data: UpdateUserPayload): Promise<User> {
    return this.api.patch(`/users/${id}`, data)
  }

  async deleteUser(id: string): Promise<void> {
    return this.api.delete(`/users/${id}`)
  }

  async getUserStats(): Promise<UserStats> {
    return this.api.get('/users/stats')
  }
}

// Mock implementation for development
export class MockUserService implements IUserService {
  private users: User[] = [
    {
      id: 'U001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0123',
      role: 'admin',
      status: 'active',
      emailVerified: true,
      lastLogin: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z'
    },
    // ... more mock data
  ]

  async getUsers(filters?: UserFilters, page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    let filteredUsers = [...this.users]
    
    if (filters?.query) {
      filteredUsers = filteredUsers.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(filters.query!.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.query!.toLowerCase())
      )
    }
    
    if (filters?.role) {
      filteredUsers = filteredUsers.filter(user => user.role === filters.role)
    }
    
    if (filters?.status) {
      filteredUsers = filteredUsers.filter(user => user.status === filters.status)
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    return {
      data: paginatedUsers,
      total: filteredUsers.length,
      page,
      limit,
      hasNextPage: endIndex < filteredUsers.length,
      hasPrevPage: page > 1
    }
  }

  async getUserById(id: string): Promise<User> {
    const user = this.users.find(u => u.id === id)
    if (!user) throw new Error('User not found')
    return user
  }

  async createUser(data: CreateUserPayload): Promise<User> {
    const newUser: User = {
      id: `U${String(this.users.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'active',
      emailVerified: false,
      createdAt: new Date().toISOString()
    }
    this.users.push(newUser)
    return newUser
  }

  async updateUser(id: string, data: UpdateUserPayload): Promise<User> {
    const userIndex = this.users.findIndex(u => u.id === id)
    if (userIndex === -1) throw new Error('User not found')
    
    this.users[userIndex] = { ...this.users[userIndex], ...data }
    return this.users[userIndex]
  }

  async deleteUser(id: string): Promise<void> {
    const userIndex = this.users.findIndex(u => u.id === id)
    if (userIndex === -1) throw new Error('User not found')
    this.users.splice(userIndex, 1)
  }

  async getUserStats(): Promise<UserStats> {
    const total = this.users.length
    const active = this.users.filter(u => u.status === 'active').length
    const inactive = this.users.filter(u => u.status === 'inactive').length
    const newThisMonth = this.users.filter(u => {
      const created = new Date(u.createdAt!)
      const now = new Date()
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }).length

    const byRole = this.users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    }, {} as Record<any, number>)

    return { total, active, inactive, newThisMonth, byRole }
  }
}

// Export service instance
export const userService = new MockUserService()
```

### Step 5: Create Custom Hook

Create `src/features/users/hooks/useUsers.ts`:

```typescript
import { useState, useEffect } from 'react'
import { userService } from '../../../services/userService'
import type { User, CreateUserPayload, UpdateUserPayload, UserFilters, UserStats } from '../../../shared/types/user'
import type { PaginatedResponse } from '../../../shared/types/common'

export const useUsers = () => {
  const [users, setUsers] = useState<PaginatedResponse<User>>({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadUsers = async (filters?: UserFilters, page = 1, limit = 10) => {
    try {
      setLoading(true)
      setError(null)
      const response = await userService.getUsers(filters, page, limit)
      setUsers(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await userService.getUserStats()
      setStats(statsData)
    } catch (err) {
      console.error('Failed to load user stats:', err)
    }
  }

  const createUser = async (data: CreateUserPayload) => {
    try {
      setLoading(true)
      await userService.createUser(data)
      await loadUsers() // Refresh list
      await loadStats() // Refresh stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (id: string, data: UpdateUserPayload) => {
    try {
      setLoading(true)
      await userService.updateUser(id, data)
      await loadUsers() // Refresh list
      await loadStats() // Refresh stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id: string) => {
    try {
      setLoading(true)
      await userService.deleteUser(id)
      await loadUsers() // Refresh list
      await loadStats() // Refresh stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
    loadStats()
  }, [])

  return {
    users,
    stats,
    loading,
    error,
    actions: {
      loadUsers,
      loadStats,
      createUser,
      updateUser,
      deleteUser,
      refresh: () => {
        loadUsers()
        loadStats()
      }
    }
  }
}
```

### Step 6: Create Feature Components

Create the main page at `src/features/users/pages/UserManagementPage.tsx`:

```typescript
import React, { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { Button } from '../../../components/ui'
import { useUsers } from '../hooks/useUsers'
// Import other components as created...

const UserManagementPage: React.FC = () => {
  const { users, stats, loading, error, actions } = useUsers()
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    mode: 'create' | 'edit' | 'view'
    user?: User
  }>({
    isOpen: false,
    mode: 'create'
  })

  // Component implementation...
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your platform users and permissions
          </p>
        </div>
        <Button
          onClick={() => setModalState({ isOpen: true, mode: 'create' })}
          icon={PlusIcon}
        >
          Add User
        </Button>
      </div>

      {/* Rest of component */}
    </div>
  )
}

export default UserManagementPage
```

### Step 7: Create Index Files

Create `src/features/users/index.ts`:

```typescript
// Pages
export { default as UserManagementPage } from './pages/UserManagementPage'

// Hooks
export { useUsers } from './hooks/useUsers'

// Components (as they're created)
export * from './components'
```

### Step 8: Update Type Exports

Update `src/shared/types/index.ts`:

```typescript
// Common types
export * from './common'
export * from './vehicle'
export * from './user' // Add this line
```

### Step 9: Update Constants Exports

Update `src/shared/constants/index.ts`:

```typescript
export * from './app'
export * from './vehicle'
export * from './user' // Add this line
```

### Step 10: Add Route

Update `src/App.tsx`:

```typescript
import { UserManagementPage } from './features/users'

// In the Routes section:
<Route path="users" element={<UserManagementPage />} />
```

## 🔄 Repeating for Other Features

Follow the same pattern for:
- **Bookings** (`features/bookings/`)
- **Reports** (`features/reports/`)
- **Settings** (`features/settings/`)

## 📋 Checklist for New Features

- [ ] Create feature directory structure
- [ ] Define types in `shared/types/`
- [ ] Add constants in `shared/constants/`
- [ ] Create service layer with interface
- [ ] Implement custom hooks
- [ ] Build UI components
- [ ] Create main page component
- [ ] Add index files for clean imports
- [ ] Update shared exports
- [ ] Add routing
- [ ] Test functionality

## 🎨 UI Component Patterns

### Consistent Prop Patterns:
```typescript
interface ComponentProps {
  // Data
  data?: any
  // Behavior
  onAction?: (param: any) => void
  // UI State
  loading?: boolean
  disabled?: boolean
  // Styling
  className?: string
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}
```

### Consistent Hook Patterns:
```typescript
export const useFeature = () => {
  return {
    // Data
    data,
    loading,
    error,
    // Actions
    actions: {
      load,
      create,
      update,
      delete,
      refresh
    }
  }
}
```

This pattern ensures consistency across all features and makes the codebase predictable and maintainable.
