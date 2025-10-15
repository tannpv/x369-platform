import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, PencilIcon, TrashIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { vehicleApi } from '../shared/api/services';
import Card from '../shared/components/Card';
import Table, { TableActions } from '../shared/components/Table';
import { PageLoading } from '../shared/components/LoadingSpinner';
import VehicleModal from '../components/VehicleModal';
import type { Vehicle } from '../shared/types/api';

export default function Vehicles() {
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [page, setPage] = useState(0);
  const limit = 10;

  const queryClient = useQueryClient();

  const { data: vehiclesData, isLoading } = useQuery({
    queryKey: ['vehicles', page, limit],
    queryFn: () => vehicleApi.getVehicles(limit, page * limit),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Vehicle['status'] }) =>
      vehicleApi.updateVehicleStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const deleteVehicleMutation = useMutation({
    mutationFn: vehicleApi.deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingVehicle(null);
    setShowModal(true);
  };

  const handleStatusChange = (vehicle: Vehicle, newStatus: Vehicle['status']) => {
    updateStatusMutation.mutate({ id: vehicle.id, status: newStatus });
  };

  const handleDelete = (vehicle: Vehicle) => {
    if (window.confirm(`Are you sure you want to delete vehicle ${vehicle.make} ${vehicle.model}?`)) {
      deleteVehicleMutation.mutate(vehicle.id);
    }
  };

  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'available': return 'bg-success/10 text-success border border-success/20';
      case 'in_use': return 'bg-primary/10 text-primary border border-primary/20';
      case 'maintenance': return 'bg-warning/10 text-warning border border-warning/20';
      case 'offline': return 'bg-destructive/10 text-destructive border border-destructive/20';
      default: return 'bg-muted/50 text-muted-foreground border border-border';
    }
  };

  const columns = [
    {
      key: 'make' as keyof Vehicle,
      header: 'Vehicle',
      render: (_: any, vehicle: Vehicle) => (
        <div>
          <div className="font-semibold text-foreground">
            {vehicle.make} {vehicle.model}
          </div>
          <div className="text-sm text-muted-foreground">{vehicle.year}</div>
        </div>
      ),
    },
    {
      key: 'licensePlate' as keyof Vehicle,
      header: 'License Plate',
      render: (value: string) => (
        <span className="font-mono text-sm bg-muted/50 text-foreground px-3 py-1.5 rounded-lg border border-border">
          {value}
        </span>
      ),
    },
    {
      key: 'status' as keyof Vehicle,
      header: 'Status',
      render: (status: Vehicle['status']) => (
        <span className={`inline-flex px-3 py-1.5 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
          {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
        </span>
      ),
    },
    {
      key: 'batteryLevel' as keyof Vehicle,
      header: 'Battery',
      render: (batteryLevel: number | undefined) => (
        <div className="flex items-center">
          <div className="w-20 bg-muted/50 rounded-full h-2.5 border border-border">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${
                (batteryLevel || 0) > 50 ? 'bg-success' : 
                (batteryLevel || 0) > 20 ? 'bg-warning' : 'bg-destructive'
              }`}
              style={{ width: `${batteryLevel || 0}%` }}
            ></div>
          </div>
          <span className="ml-3 text-sm text-foreground font-medium">{batteryLevel || 0}%</span>
        </div>
      ),
    },
    {
      key: 'mileage' as keyof Vehicle,
      header: 'Mileage',
      render: (mileage: number) => (
        <span className="text-sm font-medium text-foreground">
          {mileage.toLocaleString()} mi
        </span>
      ),
    },
    {
      key: 'latitude' as keyof Vehicle,
      header: 'Location',
      render: (_: any, vehicle: Vehicle) => (
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPinIcon className="h-4 w-4 mr-2 text-primary" />
          <span className="font-mono">
            {vehicle.latitude.toFixed(4)}, {vehicle.longitude.toFixed(4)}
          </span>
        </div>
      ),
    },
    {
      key: 'actions' as keyof Vehicle,
      header: 'Actions',
      render: (_: any, vehicle: Vehicle) => (
        <TableActions>
          <select
            value={vehicle.status}
            onChange={(e) => handleStatusChange(vehicle, e.target.value as Vehicle['status'])}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            disabled={updateStatusMutation.isPending}
          >
            <option value="available">Available</option>
            <option value="in_use">In Use</option>
            <option value="maintenance">Maintenance</option>
            <option value="offline">Offline</option>
          </select>
          <button
            onClick={() => handleEdit(vehicle)}
            className="text-primary hover:text-primary/80 p-2 rounded-lg hover:bg-primary/10 transition-colors"
            title="Edit vehicle"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(vehicle)}
            className="text-destructive hover:text-destructive/80 p-2 rounded-lg hover:bg-destructive/10 transition-colors"
            title="Delete vehicle"
            disabled={deleteVehicleMutation.isPending}
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Vehicles</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your fleet of self-driving vehicles</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg hover:shadow-lg flex items-center space-x-2 transition-all duration-200 border border-primary/20"
        >
          <PlusIcon className="h-5 w-5" />
          <span className="font-medium">Add Vehicle</span>
        </button>
      </div>

      <Card>
        <Table
          data={vehiclesData?.data || []}
          columns={columns}
          loading={isLoading}
          emptyMessage="No vehicles found. Add your first vehicle to get started."
        />
        
        {vehiclesData && vehiclesData.total > limit && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {page * limit + 1} to {Math.min((page + 1) * limit, vehiclesData.total)} of {vehiclesData.total} vehicles
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
                disabled={(page + 1) * limit >= vehiclesData.total}
                className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {showModal && (
        <VehicleModal
          vehicle={editingVehicle}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
          }}
        />
      )}
    </div>
  );
}
