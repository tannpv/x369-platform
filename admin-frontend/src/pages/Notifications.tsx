import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, BellIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { notificationApi } from '../shared/api/services';
import Card from '../shared/components/Card';
import Table, { TableActions } from '../shared/components/Table';
import { PageLoading } from '../shared/components/LoadingSpinner';
import NotificationModal from '../components/NotificationModal';
import type { Notification } from '../shared/types/api';

export default function Notifications() {
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 20;

  const queryClient = useQueryClient();

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications', page, limit],
    queryFn: () => notificationApi.getNotifications(undefined, limit, page * limit),
  });

  const { data: notificationStats } = useQuery({
    queryKey: ['notification-stats'],
    queryFn: () => notificationApi.getNotificationStats(),
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
    },
  });

  const sendPendingMutation = useMutation({
    mutationFn: notificationApi.sendPendingNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
    },
  });

  const handleMarkAsRead = (notification: Notification) => {
    markAsReadMutation.mutate(notification.id);
  };

  const handleSendPending = () => {
    if (window.confirm('Send all pending notifications?')) {
      sendPendingMutation.mutate();
    }
  };

  const getStatusColor = (status: Notification['status']) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityIcon = (priority: Notification['priority']) => {
    if (priority === 'urgent' || priority === 'high') {
      return <ExclamationTriangleIcon className="h-4 w-4" />;
    }
    return <BellIcon className="h-4 w-4" />;
  };

  const columns = [
    {
      key: 'type' as keyof Notification,
      header: 'Type',
      render: (type: string, notification: Notification) => (
        <div className="flex items-center">
          <div className={`p-1 rounded ${getPriorityColor(notification.priority)}`}>
            {getPriorityIcon(notification.priority)}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-900">{type}</span>
        </div>
      ),
    },
    {
      key: 'title' as keyof Notification,
      header: 'Title',
      render: (title: string) => (
        <div className="text-sm font-medium text-gray-900 max-w-48 truncate" title={title}>
          {title}
        </div>
      ),
    },
    {
      key: 'message' as keyof Notification,
      header: 'Message',
      render: (message: string) => (
        <div className="text-sm text-gray-600 max-w-64 truncate" title={message}>
          {message}
        </div>
      ),
    },
    {
      key: 'userId' as keyof Notification,
      header: 'User ID',
      render: (userId: string) => (
        <span className="font-mono text-sm text-gray-600">{userId.slice(0, 8)}...</span>
      ),
    },
    {
      key: 'priority' as keyof Notification,
      header: 'Priority',
      render: (priority: Notification['priority']) => (
        <span className={`text-sm font-medium ${getPriorityColor(priority)}`}>
          {priority.toUpperCase()}
        </span>
      ),
    },
    {
      key: 'status' as keyof Notification,
      header: 'Status',
      render: (status: Notification['status']) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
          {status}
        </span>
      ),
    },
    {
      key: 'createdAt' as keyof Notification,
      header: 'Created',
      render: (createdAt: string) => (
        <div className="text-sm text-gray-600">
          {format(new Date(createdAt), 'MMM dd, HH:mm')}
        </div>
      ),
    },
    {
      key: 'actions' as keyof Notification,
      header: 'Actions',
      render: (_: any, notification: Notification) => (
        <TableActions>
          {notification.status === 'delivered' && !notification.readAt && (
            <button
              onClick={() => handleMarkAsRead(notification)}
              className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 border border-blue-300 rounded hover:bg-blue-50"
              disabled={markAsReadMutation.isPending}
            >
              Mark Read
            </button>
          )}
        </TableActions>
      ),
    },
  ];

  if (isLoading) return <PageLoading />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-2">Manage user notifications and messaging</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSendPending}
            className="bg-warning hover:bg-warning/90 text-warning-foreground px-6 py-3 rounded-lg hover:shadow-lg flex items-center space-x-2 transition-all duration-200 border border-warning/20 font-medium"
            disabled={sendPendingMutation.isPending}
          >
            <BellIcon className="h-5 w-5" />
            <span>Send Pending</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Notification</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {notificationStats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{notificationStats.totalNotifications}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{notificationStats.pendingCount}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{notificationStats.sentCount}</p>
              <p className="text-sm text-gray-600">Sent</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{notificationStats.unreadCount}</p>
              <p className="text-sm text-gray-600">Unread</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{notificationStats.failedCount}</p>
              <p className="text-sm text-gray-600">Failed</p>
            </div>
          </Card>
        </div>
      )}

      {/* Notifications Table */}
      <Card>
        <Table
          data={notificationsData?.data || []}
          columns={columns}
          loading={isLoading}
          emptyMessage="No notifications found."
        />
        
        {notificationsData && notificationsData.total > limit && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Showing {page * limit + 1} to {Math.min((page + 1) * limit, notificationsData.total)} of {notificationsData.total} notifications
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={(page + 1) * limit >= notificationsData.total}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {showModal && (
        <NotificationModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notification-stats'] });
          }}
        />
      )}
    </div>
  );
}
