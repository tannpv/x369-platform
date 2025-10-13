package usecase

import (
	"context"
	"fmt"
	"time"
	"vehicle-service/internal/domain"

	"github.com/google/uuid"
	"github.com/go-playground/validator/v10"
)

type vehicleUseCase struct {
	vehicleRepo domain.VehicleRepository
	validator   *validator.Validate
}

// NewVehicleUseCase creates a new vehicle use case
func NewVehicleUseCase(vehicleRepo domain.VehicleRepository) domain.VehicleUseCase {
	return &vehicleUseCase{
		vehicleRepo: vehicleRepo,
		validator:   validator.New(),
	}
}

func (u *vehicleUseCase) CreateVehicle(ctx context.Context, req *domain.CreateVehicleRequest) (*domain.Vehicle, error) {
	if err := u.validator.Struct(req); err != nil {
		return nil, fmt.Errorf("validation failed: %w", err)
	}

	// Check if vehicle with same license plate already exists
	existingVehicle, _ := u.vehicleRepo.GetByLicensePlate(ctx, req.LicensePlate)
	if existingVehicle != nil {
		return nil, fmt.Errorf("vehicle with license plate %s already exists", req.LicensePlate)
	}

	vehicle := &domain.Vehicle{
		ID:           uuid.New().String(),
		Make:         req.Make,
		Model:        req.Model,
		Year:         req.Year,
		LicensePlate: req.LicensePlate,
		VIN:          req.VIN,
		Color:        req.Color,
		Status:       domain.StatusAvailable,
		Location:     req.Location,
		BatteryLevel: 100, // Default full battery
		FuelLevel:    100, // Default full fuel
		Mileage:      0,   // Default zero mileage for new vehicle
		Features:     req.Features,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := u.vehicleRepo.Create(ctx, vehicle); err != nil {
		return nil, fmt.Errorf("failed to create vehicle: %w", err)
	}

	return vehicle, nil
}

func (u *vehicleUseCase) GetVehicle(ctx context.Context, id string) (*domain.Vehicle, error) {
	if id == "" {
		return nil, fmt.Errorf("vehicle ID is required")
	}

	vehicle, err := u.vehicleRepo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get vehicle: %w", err)
	}

	return vehicle, nil
}

func (u *vehicleUseCase) UpdateVehicle(ctx context.Context, id string, req *domain.UpdateVehicleRequest) (*domain.Vehicle, error) {
	if id == "" {
		return nil, fmt.Errorf("vehicle ID is required")
	}

	// Check if vehicle exists
	_, err := u.vehicleRepo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("vehicle not found: %w", err)
	}

	// Validate battery and fuel levels
	if req.BatteryLevel != nil && (*req.BatteryLevel < 0 || *req.BatteryLevel > 100) {
		return nil, fmt.Errorf("battery level must be between 0 and 100")
	}

	if req.FuelLevel != nil && (*req.FuelLevel < 0 || *req.FuelLevel > 100) {
		return nil, fmt.Errorf("fuel level must be between 0 and 100")
	}

	vehicle, err := u.vehicleRepo.Update(ctx, id, req)
	if err != nil {
		return nil, fmt.Errorf("failed to update vehicle: %w", err)
	}

	return vehicle, nil
}

func (u *vehicleUseCase) DeleteVehicle(ctx context.Context, id string) error {
	if id == "" {
		return fmt.Errorf("vehicle ID is required")
	}

	// Check if vehicle exists
	vehicle, err := u.vehicleRepo.GetByID(ctx, id)
	if err != nil {
		return fmt.Errorf("vehicle not found: %w", err)
	}

	// Don't allow deletion of rented vehicles
	if vehicle.Status == domain.StatusRented {
		return fmt.Errorf("cannot delete vehicle that is currently rented")
	}

	if err := u.vehicleRepo.Delete(ctx, id); err != nil {
		return fmt.Errorf("failed to delete vehicle: %w", err)
	}

	return nil
}

func (u *vehicleUseCase) ListVehicles(ctx context.Context, filter *domain.VehicleFilter) (*domain.VehicleListResponse, error) {
	if filter.Limit <= 0 {
		filter.Limit = 10
	}
	if filter.Limit > 100 {
		filter.Limit = 100
	}
	if filter.Offset < 0 {
		filter.Offset = 0
	}

	vehicles, err := u.vehicleRepo.List(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to list vehicles: %w", err)
	}

	total, err := u.vehicleRepo.Count(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to count vehicles: %w", err)
	}

	return &domain.VehicleListResponse{
		Vehicles: vehicles,
		Total:    total,
		Limit:    filter.Limit,
		Offset:   filter.Offset,
	}, nil
}

func (u *vehicleUseCase) UpdateVehicleLocation(ctx context.Context, id string, location *domain.Location) error {
	if id == "" {
		return fmt.Errorf("vehicle ID is required")
	}

	if location == nil {
		return fmt.Errorf("location is required")
	}

	// Validate location coordinates
	if location.Latitude < -90 || location.Latitude > 90 {
		return fmt.Errorf("latitude must be between -90 and 90")
	}

	if location.Longitude < -180 || location.Longitude > 180 {
		return fmt.Errorf("longitude must be between -180 and 180")
	}

	// Check if vehicle exists
	_, err := u.vehicleRepo.GetByID(ctx, id)
	if err != nil {
		return fmt.Errorf("vehicle not found: %w", err)
	}

	if err := u.vehicleRepo.UpdateLocation(ctx, id, location); err != nil {
		return fmt.Errorf("failed to update vehicle location: %w", err)
	}

	return nil
}

func (u *vehicleUseCase) UpdateVehicleStatus(ctx context.Context, id string, status domain.VehicleStatus) error {
	if id == "" {
		return fmt.Errorf("vehicle ID is required")
	}

	// Validate status
	validStatuses := []domain.VehicleStatus{
		domain.StatusAvailable,
		domain.StatusRented,
		domain.StatusMaintenance,
		domain.StatusOffline,
	}

	isValidStatus := false
	for _, validStatus := range validStatuses {
		if status == validStatus {
			isValidStatus = true
			break
		}
	}

	if !isValidStatus {
		return fmt.Errorf("invalid vehicle status: %s", status)
	}

	// Check if vehicle exists
	_, err := u.vehicleRepo.GetByID(ctx, id)
	if err != nil {
		return fmt.Errorf("vehicle not found: %w", err)
	}

	if err := u.vehicleRepo.UpdateStatus(ctx, id, status); err != nil {
		return fmt.Errorf("failed to update vehicle status: %w", err)
	}

	return nil
}

func (u *vehicleUseCase) GetAvailableVehicles(ctx context.Context, filter *domain.AvailabilityFilter) ([]*domain.Vehicle, error) {
	if filter.Limit <= 0 {
		filter.Limit = 10
	}
	if filter.Limit > 100 {
		filter.Limit = 100
	}
	if filter.Offset < 0 {
		filter.Offset = 0
	}

	// Validate location and radius if provided
	if filter.Location != nil {
		if filter.Location.Latitude < -90 || filter.Location.Latitude > 90 {
			return nil, fmt.Errorf("latitude must be between -90 and 90")
		}
		if filter.Location.Longitude < -180 || filter.Location.Longitude > 180 {
			return nil, fmt.Errorf("longitude must be between -180 and 180")
		}
	}

	if filter.Radius != nil && *filter.Radius <= 0 {
		return nil, fmt.Errorf("radius must be greater than 0")
	}

	vehicles, err := u.vehicleRepo.GetAvailableVehicles(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to get available vehicles: %w", err)
	}

	return vehicles, nil
}

func (u *vehicleUseCase) UpdateVehicleBattery(ctx context.Context, id string, batteryLevel int) error {
	if id == "" {
		return fmt.Errorf("vehicle ID is required")
	}

	if batteryLevel < 0 || batteryLevel > 100 {
		return fmt.Errorf("battery level must be between 0 and 100")
	}

	// Check if vehicle exists
	_, err := u.vehicleRepo.GetByID(ctx, id)
	if err != nil {
		return fmt.Errorf("vehicle not found: %w", err)
	}

	updateReq := &domain.UpdateVehicleRequest{
		BatteryLevel: &batteryLevel,
	}

	_, err = u.vehicleRepo.Update(ctx, id, updateReq)
	if err != nil {
		return fmt.Errorf("failed to update vehicle battery: %w", err)
	}

	return nil
}

func (u *vehicleUseCase) GetStats(ctx context.Context) (*domain.VehicleStats, error) {
	return u.vehicleRepo.GetStats(ctx)
}
