import React, { useState } from 'react'
import { PlusIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline'
import { Button } from '../../../components/ui'
import { useUsers } from '../hooks/useUsers'
import { UserStatsGrid, UserFilters as UserFiltersComponent, UserCard, UserModal } from '../components'
import type { User, CreateUserPayload, UpdateUserPayload } from '../../../shared/types/user'
import type { ViewMode } from '../../../shared/types/common'

const UserManagementPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    mode: 'create' | 'edit' | 'view'
    user?: User
  }>({
    isOpen: false,
    mode: 'create'
  })

  const {
    users,
    pagination,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refetch,
    nextPage,
    prevPage,
    goToPage,
    createUser,
    updateUser,
    deleteUser,
    updateStatus,
    resetPassword,
    sendVerificationEmail
  } = useUsers()

  const handleCreateUser = async (data: CreateUserPayload) => {
    try {
      await createUser(data)
      setModalState({ isOpen: false, mode: 'create' })
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }

  const handleUpdateUser = async (id: string, data: UpdateUserPayload) => {
    try {
      await updateUser(id, data)
      setModalState({ isOpen: false, mode: 'edit' })
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  const handleModalSubmit = async (data: CreateUserPayload | UpdateUserPayload) => {
    if (modalState.mode === 'create') {
      await handleCreateUser(data as CreateUserPayload)
    } else if (modalState.mode === 'edit' && modalState.user) {
      await handleUpdateUser(modalState.user.id, data as UpdateUserPayload)
    }
  }

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      try {
        await deleteUser(user.id)
      } catch (error) {
        console.error('Failed to delete user:', error)
      }
    }
  }

  const handleResetPassword = async (user: User) => {
    if (window.confirm(`Reset password for ${user.firstName} ${user.lastName}?`)) {
      try {
        const tempPassword = await resetPassword(user.id)
        alert(`Temporary password: ${tempPassword}`)
      } catch (error) {
        console.error('Failed to reset password:', error)
      }
    }
  }

  const handleSendVerification = async (user: User) => {
    try {
      await sendVerificationEmail(user.id)
      alert(`Verification email sent to ${user.email}`)
    } catch (error) {
      console.error('Failed to send verification email:', error)
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    )
  }

  const hasResults = users.length > 0
  const hasActiveFilters = filters.query || 
    (filters.status && filters.status !== 'all') || 
    (filters.role && filters.role !== 'all') ||
    filters.emailVerified !== undefined

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your platform users and their permissions
          </p>
        </div>
        <Button
          onClick={() => setModalState({ isOpen: true, mode: 'create' })}
          leftIcon={<PlusIcon className="h-4 w-4" />}
        >
          Add User
        </Button>
      </div>

      {/* Stats Grid */}
      <UserStatsGrid filters={filters} />

      {/* Filters */}
      <UserFiltersComponent
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
      />

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            leftIcon={<Squares2X2Icon className="h-4 w-4" />}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            leftIcon={<ListBulletIcon className="h-4 w-4" />}
          >
            List
          </Button>
        </div>
        
        {pagination.total > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
          </p>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : !hasResults ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {hasActiveFilters ? 'No users match your filters' : 'No users found'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {hasActiveFilters
              ? 'Try adjusting your search criteria or clearing filters.'
              : 'Get started by adding your first user to the platform.'
            }
          </p>
          {hasActiveFilters ? (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          ) : (
            <Button onClick={() => setModalState({ isOpen: true, mode: 'create' })}>
              Add First User
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* User Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onEdit={(user) => setModalState({ isOpen: true, mode: 'edit', user })}
                onDelete={handleDeleteUser}
                onView={(user) => setModalState({ isOpen: true, mode: 'view', user })}
                onResetPassword={handleResetPassword}
                onSendVerification={handleSendVerification}
                onUpdateStatus={(user, status) => updateStatus(user.id, status)}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.limit)) }, (_, i) => {
                  const pageNumber = i + 1
                  return (
                    <Button
                      key={pageNumber}
                      variant={pagination.page === pageNumber ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => goToPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}

      <UserModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: 'create' })}
        onSubmit={handleModalSubmit}
        mode={modalState.mode}
        user={modalState.user}
        loading={loading}
      />
    </div>
  )
}

export default UserManagementPage
