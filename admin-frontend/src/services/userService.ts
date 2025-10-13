/**
 * User service for API operations
 */

import { apiService } from './api'
import type { ApiResponse, PaginatedResponse } from '../shared/types/common'
import type { 
  User, 
  UserFilters, 
  UserStats, 
  CreateUserPayload, 
  UpdateUserPayload
} from '../shared/types/user'

export class UserService {
  async getAll(filters?: UserFilters, page = 1, limit = 20): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    
    return apiService.get(`/users?${params}`)
  }

  async getById(id: string): Promise<ApiResponse<User>> {
    return apiService.get(`/users/${id}`)
  }

  async create(data: CreateUserPayload): Promise<ApiResponse<User>> {
    return apiService.post('/users', data)
  }

  async update(id: string, data: UpdateUserPayload): Promise<ApiResponse<User>> {
    return apiService.patch(`/users/${id}`, data)
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiService.delete(`/users/${id}`)
  }

  async getStats(filters?: UserFilters): Promise<ApiResponse<UserStats>> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    return apiService.get(`/users/stats?${params}`)
  }

  async updateStatus(id: string, status: User['status']): Promise<ApiResponse<User>> {
    return this.update(id, { status })
  }

  async resetPassword(id: string): Promise<ApiResponse<{ temporaryPassword: string }>> {
    return apiService.post(`/users/${id}/reset-password`)
  }

  async sendVerificationEmail(id: string): Promise<ApiResponse<void>> {
    return apiService.post(`/users/${id}/send-verification`)
  }

  async bulkUpdate(ids: string[], data: Partial<User>): Promise<ApiResponse<User[]>> {
    return apiService.patch('/users/bulk', { ids, data })
  }

  async bulkDelete(ids: string[]): Promise<ApiResponse<void>> {
    return apiService.post('/users/bulk-delete', { ids })
  }
}

import { USER_SEED_DATA, getUserStats as getSeedUserStats } from '../shared/data/userSeedData'

// Mock service for development
export class MockUserService {
  private users: User[] = [...USER_SEED_DATA]

  async getAll(filters?: UserFilters, page = 1, limit = 20): Promise<PaginatedResponse<User>> {
    let filteredUsers = [...this.users]

    // Apply filters
    if (filters?.query) {
      const query = filters.query.toLowerCase()
      filteredUsers = filteredUsers.filter(u => 
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.phone?.toLowerCase().includes(query)
      )
    }

    if (filters?.role && filters.role !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.role === filters.role)
    }

    if (filters?.status && filters.status !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.status === filters.status)
    }

    if (filters?.emailVerified !== undefined) {
      filteredUsers = filteredUsers.filter(u => u.emailVerified === filters.emailVerified)
    }

    // Apply pagination
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

  async getById(id: string): Promise<ApiResponse<User>> {
    const user = this.users.find(u => u.id === id)
    if (!user) {
      throw new Error('User not found')
    }
    
    return {
      success: true,
      data: user
    }
  }

  async create(data: CreateUserPayload): Promise<ApiResponse<User>> {
    const newUser: User = {
      ...data,
      id: `U${String(this.users.length + 1).padStart(3, '0')}`,
      status: 'pending',
      emailVerified: false,
      totalBookings: 0,
      totalSpent: 0,
      rating: 0,
      memberSince: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      avatar: `https://images.unsplash.com/photo-1${Math.floor(Math.random() * 900000000) + 400000000}?w=100&h=100&fit=crop&auto=format&q=80`
    }
    
    this.users.push(newUser)
    
    return {
      success: true,
      data: newUser
    }
  }

  async update(id: string, data: UpdateUserPayload): Promise<ApiResponse<User>> {
    const userIndex = this.users.findIndex(u => u.id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    this.users[userIndex] = { ...this.users[userIndex], ...data, updatedAt: new Date().toISOString() }
    
    return {
      success: true,
      data: this.users[userIndex]
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const userIndex = this.users.findIndex(u => u.id === id)
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    this.users.splice(userIndex, 1)
    
    return {
      success: true,
      data: undefined
    }
  }

  async getStats(): Promise<ApiResponse<UserStats>> {
    const stats = getSeedUserStats()
    return {
      success: true,
      data: stats
    }
  }

  async updateStatus(id: string, status: User['status']): Promise<ApiResponse<User>> {
    return this.update(id, { status })
  }

  async resetPassword(id: string): Promise<ApiResponse<{ temporaryPassword: string }>> {
    // Mock implementation
    console.log(`Password reset for user ${id}`)
    return {
      success: true,
      data: { temporaryPassword: 'temp-' + Math.random().toString(36).substr(2, 8) }
    }
  }

  async sendVerificationEmail(id: string): Promise<ApiResponse<void>> {
    // Mock implementation
    console.log(`Verification email sent to user ${id}`)
    return {
      success: true,
      data: undefined
    }
  }

  async bulkUpdate(ids: string[], data: Partial<User>): Promise<ApiResponse<User[]>> {
    const updatedUsers: User[] = []
    
    for (const id of ids) {
      const userIndex = this.users.findIndex(u => u.id === id)
      if (userIndex !== -1) {
        this.users[userIndex] = { ...this.users[userIndex], ...data, updatedAt: new Date().toISOString() }
        updatedUsers.push(this.users[userIndex])
      }
    }
    
    return {
      success: true,
      data: updatedUsers
    }
  }

  async bulkDelete(ids: string[]): Promise<ApiResponse<void>> {
    this.users = this.users.filter(u => !ids.includes(u.id))
    
    return {
      success: true,
      data: undefined
    }
  }
}

// Export the appropriate service based on environment
export const userService = import.meta.env.DEV 
  ? new MockUserService() 
  : new UserService()
