/**
 * Custom hooks for user management
 */

import { useState, useEffect, useCallback } from 'react'
import { userService } from '../../../services/userService'
import type { 
  User, 
  UserFilters, 
  UserStats, 
  CreateUserPayload, 
  UpdateUserPayload 
} from '../../../shared/types/user'

export const useUsers = (initialFilters?: UserFilters) => {
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<UserFilters>(initialFilters || {})

  const fetchUsers = useCallback(async (page = 1, limit = 20) => {
    try {
      setLoading(true)
      setError(null)
      const response = await userService.getAll(filters, page, limit)
      setUsers(response.data)
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        hasNextPage: response.hasNextPage,
        hasPrevPage: response.hasPrevPage
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [filters])

  const createUser = async (data: CreateUserPayload): Promise<void> => {
    try {
      const response = await userService.create(data)
      setUsers(prev => [...prev, response.data])
      setPagination(prev => ({ ...prev, total: prev.total + 1 }))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create user')
    }
  }

  const updateUser = async (id: string, data: UpdateUserPayload): Promise<void> => {
    try {
      const response = await userService.update(id, data)
      setUsers(prev => prev.map(u => u.id === id ? response.data : u))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update user')
    }
  }

  const deleteUser = async (id: string): Promise<void> => {
    try {
      await userService.delete(id)
      setUsers(prev => prev.filter(u => u.id !== id))
      setPagination(prev => ({ ...prev, total: prev.total - 1 }))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  const updateStatus = async (id: string, status: User['status']): Promise<void> => {
    try {
      await userService.updateStatus(id, status)
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update user status')
    }
  }

  const resetPassword = async (id: string): Promise<string> => {
    try {
      const response = await userService.resetPassword(id)
      return response.data.temporaryPassword
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to reset password')
    }
  }

  const sendVerificationEmail = async (id: string): Promise<void> => {
    try {
      await userService.sendVerificationEmail(id)
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to send verification email')
    }
  }

  const updateFilters = useCallback((newFilters: UserFilters) => {
    setFilters(newFilters)
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      fetchUsers(pagination.page + 1, pagination.limit)
    }
  }, [pagination, fetchUsers])

  const prevPage = useCallback(() => {
    if (pagination.hasPrevPage) {
      fetchUsers(pagination.page - 1, pagination.limit)
    }
  }, [pagination, fetchUsers])

  const goToPage = useCallback((page: number) => {
    fetchUsers(page, pagination.limit)
  }, [pagination.limit, fetchUsers])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users,
    pagination,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refetch: fetchUsers,
    nextPage,
    prevPage,
    goToPage,
    createUser,
    updateUser,
    deleteUser,
    updateStatus,
    resetPassword,
    sendVerificationEmail
  }
}

export const useUserStats = (filters?: UserFilters) => {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await userService.getStats(filters)
      setStats(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user stats')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}
