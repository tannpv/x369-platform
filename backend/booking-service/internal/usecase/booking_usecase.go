package usecase

import (
	"context"
	"fmt"
	"time"

	"booking-service/internal/domain"
)

type bookingUseCase struct {
	bookingRepo    domain.BookingRepository
	vehicleService domain.VehicleService
	userService    domain.UserService
}

func NewBookingUseCase(
	bookingRepo domain.BookingRepository,
	vehicleService domain.VehicleService,
	userService domain.UserService,
) domain.BookingUseCase {
	return &bookingUseCase{
		bookingRepo:    bookingRepo,
		vehicleService: vehicleService,
		userService:    userService,
	}
}

func (u *bookingUseCase) CreateBooking(ctx context.Context, req *domain.CreateBookingRequest) (*domain.Booking, error) {
	// Validate user
	err := u.userService.ValidateUser(ctx, req.UserID)
	if err != nil {
		return nil, fmt.Errorf("invalid user: %w", err)
	}

	// Check vehicle availability
	available, err := u.vehicleService.IsVehicleAvailable(ctx, req.VehicleID, req.StartTime)
	if err != nil {
		return nil, fmt.Errorf("failed to check vehicle availability: %w", err)
	}
	if !available {
		return nil, fmt.Errorf("vehicle is not available at the requested time")
	}

	// Create booking
	booking := &domain.Booking{
		UserID:      req.UserID,
		VehicleID:   req.VehicleID,
		Status:      domain.StatusPending,
		StartTime:   req.StartTime,
		PickupLat:   req.PickupLat,
		PickupLng:   req.PickupLng,
		PickupAddr:  req.PickupAddr,
		DropoffLat:  req.DropoffLat,
		DropoffLng:  req.DropoffLng,
		DropoffAddr: req.DropoffAddr,
	}

	err = u.bookingRepo.Create(ctx, booking)
	if err != nil {
		return nil, fmt.Errorf("failed to create booking: %w", err)
	}

	return booking, nil
}

func (u *bookingUseCase) GetBooking(ctx context.Context, id string) (*domain.Booking, error) {
	return u.bookingRepo.GetByID(ctx, id)
}

func (u *bookingUseCase) UpdateBooking(ctx context.Context, id string, req *domain.UpdateBookingRequest) (*domain.Booking, error) {
	// Check if booking exists
	_, err := u.bookingRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return u.bookingRepo.Update(ctx, id, req)
}

func (u *bookingUseCase) CancelBooking(ctx context.Context, id string, userID string) error {
	// Get booking
	booking, err := u.bookingRepo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	// Check ownership
	if booking.UserID != userID {
		return fmt.Errorf("unauthorized: booking does not belong to user")
	}

	// Check if cancellation is allowed
	if booking.Status == domain.StatusCompleted || booking.Status == domain.StatusCancelled {
		return fmt.Errorf("cannot cancel booking with status: %s", booking.Status)
	}

	// Update status
	updates := &domain.UpdateBookingRequest{
		Status: &[]domain.BookingStatus{domain.StatusCancelled}[0],
	}

	_, err = u.bookingRepo.Update(ctx, id, updates)
	if err != nil {
		return fmt.Errorf("failed to cancel booking: %w", err)
	}

	// Update vehicle status
	err = u.vehicleService.UpdateVehicleStatus(ctx, booking.VehicleID, "available")
	if err != nil {
		// Log error but don't fail the cancellation
		fmt.Printf("Warning: failed to update vehicle status: %v\n", err)
	}

	return nil
}

func (u *bookingUseCase) StartBooking(ctx context.Context, id string, userID string) error {
	// Get booking
	booking, err := u.bookingRepo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	// Check ownership
	if booking.UserID != userID {
		return fmt.Errorf("unauthorized: booking does not belong to user")
	}

	// Check if start is allowed
	if booking.Status != domain.StatusConfirmed {
		return fmt.Errorf("cannot start booking with status: %s", booking.Status)
	}

	// Check if start time has arrived
	if time.Now().Before(booking.StartTime) {
		return fmt.Errorf("booking cannot be started before scheduled time")
	}

	// Update status
	updates := &domain.UpdateBookingRequest{
		Status: &[]domain.BookingStatus{domain.StatusActive}[0],
	}

	_, err = u.bookingRepo.Update(ctx, id, updates)
	if err != nil {
		return fmt.Errorf("failed to start booking: %w", err)
	}

	// Update vehicle status
	err = u.vehicleService.UpdateVehicleStatus(ctx, booking.VehicleID, "in_use")
	if err != nil {
		// Log error but don't fail the start
		fmt.Printf("Warning: failed to update vehicle status: %v\n", err)
	}

	return nil
}

func (u *bookingUseCase) CompleteBooking(ctx context.Context, id string, userID string, req *domain.CompleteBookingRequest) error {
	// Get booking
	booking, err := u.bookingRepo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	// Check ownership
	if booking.UserID != userID {
		return fmt.Errorf("unauthorized: booking does not belong to user")
	}

	// Check if completion is allowed
	if booking.Status != domain.StatusActive {
		return fmt.Errorf("cannot complete booking with status: %s", booking.Status)
	}

	// Calculate cost if not provided
	cost := req.Distance
	if cost != nil && *cost > 0 {
		// Simple pricing: $1.50 per km + $0.25 per minute
		baseCost := *cost * 1.50
		if req.Duration != nil && *req.Duration > 0 {
			baseCost += float64(*req.Duration) * 0.25
		}
		cost = &baseCost
	}

	// Update booking
	endTime := time.Now()
	updates := &domain.UpdateBookingRequest{
		Status:      &[]domain.BookingStatus{domain.StatusCompleted}[0],
		EndTime:     &endTime,
		DropoffLat:  req.DropoffLat,
		DropoffLng:  req.DropoffLng,
		DropoffAddr: req.DropoffAddr,
		Distance:    req.Distance,
		Duration:    req.Duration,
		Cost:        cost,
	}

	_, err = u.bookingRepo.Update(ctx, id, updates)
	if err != nil {
		return fmt.Errorf("failed to complete booking: %w", err)
	}

	// Update vehicle status
	err = u.vehicleService.UpdateVehicleStatus(ctx, booking.VehicleID, "available")
	if err != nil {
		// Log error but don't fail the completion
		fmt.Printf("Warning: failed to update vehicle status: %v\n", err)
	}

	return nil
}

func (u *bookingUseCase) ListBookings(ctx context.Context, filter *domain.BookingFilter) (*domain.BookingListResponse, error) {
	// Set default pagination
	if filter.Limit <= 0 {
		filter.Limit = 10
	}
	if filter.Limit > 100 {
		filter.Limit = 100
	}

	bookings, err := u.bookingRepo.List(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to list bookings: %w", err)
	}

	total, err := u.bookingRepo.Count(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to count bookings: %w", err)
	}

	return &domain.BookingListResponse{
		Bookings: bookings,
		Total:    total,
		Limit:    filter.Limit,
		Offset:   filter.Offset,
	}, nil
}

func (u *bookingUseCase) GetUserBookings(ctx context.Context, userID string, limit, offset int) ([]*domain.Booking, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}

	return u.bookingRepo.GetByUserID(ctx, userID, limit, offset)
}

func (u *bookingUseCase) GetVehicleBookings(ctx context.Context, vehicleID string, limit, offset int) ([]*domain.Booking, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}

	return u.bookingRepo.GetByVehicleID(ctx, vehicleID, limit, offset)
}

func (u *bookingUseCase) GetActiveBookings(ctx context.Context) ([]*domain.Booking, error) {
	return u.bookingRepo.GetActiveBookings(ctx)
}

func (u *bookingUseCase) GetBookingStats(ctx context.Context, userID *string) (*domain.BookingStats, error) {
	return u.bookingRepo.GetStats(ctx, userID)
}
