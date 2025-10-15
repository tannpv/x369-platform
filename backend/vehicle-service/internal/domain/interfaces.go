package domain

import "context"

// VehicleRepository defines the interface for vehicle data operations
type VehicleRepository interface {
	Create(ctx context.Context, vehicle *Vehicle) error
	GetByID(ctx context.Context, id string) (*Vehicle, error)
	GetByLicensePlate(ctx context.Context, licensePlate string) (*Vehicle, error)
	Update(ctx context.Context, id string, updates *UpdateVehicleRequest) (*Vehicle, error)
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, filter *VehicleFilter) ([]*Vehicle, error)
	Count(ctx context.Context, filter *VehicleFilter) (int64, error)
	UpdateLocation(ctx context.Context, id string, location *Location) error
	UpdateStatus(ctx context.Context, id string, status VehicleStatus) error
	GetAvailableVehicles(ctx context.Context, filter *AvailabilityFilter) ([]*Vehicle, error)
	GetStats(ctx context.Context) (*VehicleStats, error)
}

// VehicleUseCase defines the interface for vehicle business logic
type VehicleUseCase interface {
	CreateVehicle(ctx context.Context, req *CreateVehicleRequest) (*Vehicle, error)
	GetVehicle(ctx context.Context, id string) (*Vehicle, error)
	UpdateVehicle(ctx context.Context, id string, req *UpdateVehicleRequest) (*Vehicle, error)
	DeleteVehicle(ctx context.Context, id string) error
	ListVehicles(ctx context.Context, filter *VehicleFilter) (*VehicleListResponse, error)
	UpdateVehicleLocation(ctx context.Context, id string, location *Location) error
	UpdateVehicleStatus(ctx context.Context, id string, status VehicleStatus) error
	GetAvailableVehicles(ctx context.Context, filter *AvailabilityFilter) ([]*Vehicle, error)
	UpdateVehicleBattery(ctx context.Context, id string, batteryLevel int) error
	GetStats(ctx context.Context) (*VehicleStats, error)
}

// VehicleFilter represents filters for vehicle queries
type VehicleFilter struct {
	Status   *VehicleStatus `json:"status,omitempty"`
	Make     *string        `json:"make,omitempty"`
	Model    *string        `json:"model,omitempty"`
	Year     *int           `json:"year,omitempty"`
	MinYear  *int           `json:"min_year,omitempty"`
	MaxYear  *int           `json:"max_year,omitempty"`
	Location *Location      `json:"location,omitempty"`
	Radius   *float64       `json:"radius,omitempty"` // in kilometers
	Limit    int            `json:"limit"`
	Offset   int            `json:"offset"`
}

// AvailabilityFilter represents filters for available vehicles
type AvailabilityFilter struct {
	Location      *Location `json:"location,omitempty"`
	Radius        *float64  `json:"radius,omitempty"` // in kilometers
	MinBattery    *int      `json:"min_battery,omitempty"`
	RequiredSeats *int      `json:"required_seats,omitempty"`
	Features      []string  `json:"features,omitempty"`
	Limit         int       `json:"limit"`
	Offset        int       `json:"offset"`
}

// VehicleListResponse represents the response for vehicle list
type VehicleListResponse struct {
	Vehicles []*Vehicle `json:"vehicles"`
	Total    int64      `json:"total"`
	Limit    int        `json:"limit"`
	Offset   int        `json:"offset"`
}

// VehicleStats represents the statistics of vehicles
type VehicleStats struct {
	TotalVehicles       int64 `json:"totalVehicles"`
	AvailableVehicles   int64 `json:"availableVehicles"`
	InUseVehicles       int64 `json:"inUseVehicles"`
	MaintenanceVehicles int64 `json:"maintenanceVehicles"`
}
