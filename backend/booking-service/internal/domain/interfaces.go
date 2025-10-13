package domain

import (
	"context"
	"time"
)

// BookingRepository defines the interface for booking data operations
type BookingRepository interface {
	Create(ctx context.Context, booking *Booking) error
	GetByID(ctx context.Context, id string) (*Booking, error)
	Update(ctx context.Context, id string, updates *UpdateBookingRequest) (*Booking, error)
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, filter *BookingFilter) ([]*Booking, error)
	Count(ctx context.Context, filter *BookingFilter) (int64, error)
	GetByUserID(ctx context.Context, userID string, limit, offset int) ([]*Booking, error)
	GetByVehicleID(ctx context.Context, vehicleID string, limit, offset int) ([]*Booking, error)
	GetActiveBookings(ctx context.Context) ([]*Booking, error)
	GetStats(ctx context.Context, userID *string) (*BookingStats, error)
}

// BookingUseCase defines the interface for booking business logic
type BookingUseCase interface {
	CreateBooking(ctx context.Context, req *CreateBookingRequest) (*Booking, error)
	GetBooking(ctx context.Context, id string) (*Booking, error)
	UpdateBooking(ctx context.Context, id string, req *UpdateBookingRequest) (*Booking, error)
	CancelBooking(ctx context.Context, id string, userID string) error
	StartBooking(ctx context.Context, id string, userID string) error
	CompleteBooking(ctx context.Context, id string, userID string, req *CompleteBookingRequest) error
	ListBookings(ctx context.Context, filter *BookingFilter) (*BookingListResponse, error)
	GetUserBookings(ctx context.Context, userID string, limit, offset int) ([]*Booking, error)
	GetVehicleBookings(ctx context.Context, vehicleID string, limit, offset int) ([]*Booking, error)
	GetActiveBookings(ctx context.Context) ([]*Booking, error)
	GetBookingStats(ctx context.Context, userID *string) (*BookingStats, error)
}

// VehicleService defines the interface for vehicle service integration
type VehicleService interface {
	GetVehicle(ctx context.Context, vehicleID string) (*Vehicle, error)
	UpdateVehicleStatus(ctx context.Context, vehicleID string, status string) error
	IsVehicleAvailable(ctx context.Context, vehicleID string, startTime time.Time) (bool, error)
}

// UserService defines the interface for user service integration
type UserService interface {
	GetUser(ctx context.Context, userID string) (*User, error)
	ValidateUser(ctx context.Context, userID string) error
}

// CompleteBookingRequest represents the request to complete a booking
type CompleteBookingRequest struct {
	DropoffLat  *float64 `json:"dropoff_latitude,omitempty"`
	DropoffLng  *float64 `json:"dropoff_longitude,omitempty"`
	DropoffAddr *string  `json:"dropoff_address,omitempty"`
	Distance    *float64 `json:"distance,omitempty"`
	Duration    *int     `json:"duration,omitempty"`
}

// Vehicle represents a vehicle from the vehicle service
type Vehicle struct {
	ID           string  `json:"id"`
	Make         string  `json:"make"`
	Model        string  `json:"model"`
	Year         int     `json:"year"`
	LicensePlate string  `json:"license_plate"`
	Status       string  `json:"status"`
	Latitude     float64 `json:"latitude"`
	Longitude    float64 `json:"longitude"`
}

// User represents a user from the user service
type User struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Phone     string `json:"phone"`
	Status    string `json:"status"`
}
