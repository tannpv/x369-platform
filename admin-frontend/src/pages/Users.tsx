import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, PencilIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { userApi } from '../shared/api/services';
import Card from '../shared/components/Card';
import Table, { TableActions } from '../shared/components/Table';
import { PageLoading } from '../shared/components/LoadingSpinner';
import UserModal from '../components/UserModal';
import type { User } from '../shared/types/api';

export default function Users() {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [page, setPage] = useState(0);
  const limit = 10;

  const queryClient = useQueryClient();

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => userApi.getUsers(limit, page * limit),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      userApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleStatusChange = (user: User, newStatus: User['status']) => {
    updateUserMutation.mutate({ id: user.id, data: { status: newStatus } });
  };

  const handleDelete = (user: User) => {
    if (window.confirm(`Are you sure you want to delete user ${user.firstName} ${user.lastName}?`)) {
      deleteUserMutation.mutate(user.id);
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success border border-success/20';
      case 'inactive': return 'bg-muted/50 text-muted-foreground border border-border';
      case 'suspended': return 'bg-destructive/10 text-destructive border border-destructive/20';
      default: return 'bg-muted/50 text-muted-foreground border border-border';
    }
  };

  const columns = [
    {
      key: 'firstName' as keyof User,
      header: 'User',
      render: (_: any, user: User) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
              <UserIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-foreground">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone' as keyof User,
      header: 'Phone',
      render: (phone: string) => (
        <span className="text-sm text-foreground font-medium">{phone}</span>
      ),
    },
    {
      key: 'status' as keyof User,
      header: 'Status',
      render: (status: User['status']) => (
        <span className={`inline-flex px-3 py-1.5 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      key: 'createdAt' as keyof User,
      header: 'Created',
      render: (createdAt: string) => (
        <div className="text-sm text-foreground font-medium">
          {format(new Date(createdAt), 'MMM dd, yyyy')}
        </div>
      ),
    },
    {
      key: 'updatedAt' as keyof User,
      header: 'Last Updated',
      render: (updatedAt: string) => (
        <div className="text-sm text-muted-foreground">
          {format(new Date(updatedAt), 'MMM dd, yyyy')}
        </div>
      ),
    },
    {
      key: 'actions' as keyof User,
      header: 'Actions',
      render: (_: any, user: User) => (
        <TableActions>
          <select
            value={user.status}
            onChange={(e) => handleStatusChange(user, e.target.value as User['status'])}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            disabled={updateUserMutation.isPending}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <button
            onClick={() => handleEdit(user)}
            className="text-primary hover:text-primary/80 p-2 rounded-lg hover:bg-primary/10 transition-colors"
            title="Edit user"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(user)}
            className="text-destructive hover:text-destructive/80 p-2 rounded-lg hover:bg-destructive/10 transition-colors"
            title="Delete user"
            disabled={deleteUserMutation.isPending}
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </TableActions>
      ),
    },
  ];

  if (isLoading) return <PageLoading />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Users</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage platform users and their accounts</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg hover:shadow-lg flex items-center space-x-2 transition-all duration-200 border border-primary/20"
        >
          <PlusIcon className="h-5 w-5" />
          <span className="font-medium">Add User</span>
        </button>
      </div>

      <Card>
        <Table
          data={usersData?.data || []}
          columns={columns}
          loading={isLoading}
          emptyMessage="No users found. Add your first user to get started."
        />
        
        {usersData && usersData.total > limit && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {page * limit + 1} to {Math.min((page + 1) * limit, usersData.total)} of {usersData.total} users
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={(page + 1) * limit >= usersData.total}
                className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {showModal && (
        <UserModal
          user={editingUser}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            queryClient.invalidateQueries({ queryKey: ['users'] });
          }}
        />
      )}
    </div>
  );
}
