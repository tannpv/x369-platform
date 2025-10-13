import React from 'react'
import { Button } from '../../../components/ui'
import { USER_ROLE_COLORS, USER_STATUS_COLORS } from '../../../shared/constants/user'
import type { User } from '../../../shared/types/user'
import { 
  EllipsisHorizontalIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  KeyIcon,
  EnvelopeIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'
import { formatDate } from '../../../shared/utils/helpers'

interface UserCardProps {
  user: User
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onView: (user: User) => void
  onResetPassword: (user: User) => void
  onSendVerification: (user: User) => void
  onUpdateStatus: (user: User, status: User['status']) => void
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onView,
  onResetPassword,
  onSendVerification,
  onUpdateStatus
}) => {
  const [showActions, setShowActions] = React.useState(false)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      {/* User Avatar and Basic Info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                  {user.firstName[0]}{user.lastName[0]}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            {user.phone && (
              <p className="text-sm text-gray-500 dark:text-gray-500">{user.phone}</p>
            )}
          </div>
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowActions(!showActions)}
          >
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </Button>
          
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <div className="py-1">
                <button
                  onClick={() => { onView(user); setShowActions(false) }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => { onEdit(user); setShowActions(false) }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <PencilIcon className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => { onResetPassword(user); setShowActions(false) }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <KeyIcon className="h-4 w-4" />
                  <span>Reset Password</span>
                </button>
                {!user.emailVerified && (
                  <button
                    onClick={() => { onSendVerification(user); setShowActions(false) }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <EnvelopeIcon className="h-4 w-4" />
                    <span>Send Verification</span>
                  </button>
                )}
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={() => { onDelete(user); setShowActions(false) }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role and Status Badges */}
      <div className="flex items-center space-x-2 mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${USER_ROLE_COLORS[user.role]}`}>
          {user.role}
        </span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${USER_STATUS_COLORS[user.status]}`}>
          {user.status}
        </span>
        {user.emailVerified && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            <CheckBadgeIcon className="h-3 w-3 mr-1" />
            Verified
          </span>
        )}
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.totalBookings || 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Bookings</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${(user.totalSpent || 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Spent</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.rating || 0}/5
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
        </div>
      </div>

      {/* Last Login */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {user.lastLogin ? (
            <>Last login: {formatDate(user.lastLogin)}</>
          ) : (
            'Never logged in'
          )}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Member since: {formatDate(user.memberSince || user.createdAt!)}
        </p>
      </div>
    </div>
  )
}

export default UserCard
