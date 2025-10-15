package domain

import (
	"time"
)

// Booking represents a vehicle booking in the system
type Booking struct {
	ID          string        `json:"id" db:"id"`
	UserID      string        `json:"user_id" db:"user_id"`
	VehicleID   string        `json:"vehicle_id" db:"vehicle_id"`
	Status      BookingStatus `json:"status" db:"status"`
	StartTime   time.Time     `json:"start_time" db:"start_time"`
	EndTime     *time.Time    `json:"end_time,omitempty" db:"end_time"`
	PickupLat   float64       `json:"pickup_latitude" db:"pickup_latitude"`
	PickupLng   float64       `json:"pickup_longitude" db:"pickup_longitude"`
	PickupAddr  string        `json:"pickup_address" db:"pickup_address"`
	DropoffLat  *float64      `json:"dropoff_latitude,omitempty" db:"dropoff_latitude"`
	DropoffLng  *float64      `json:"dropoff_longitude,omitempty" db:"dropoff_longitude"`
	DropoffAddr *string       `json:"dropoff_address,omitempty" db:"dropoff_address"`
	Distance    *float64      `json:"distance,omitempty" db:"distance"` // in kilometers
	Duration    *int          `json:"duration,omitempty" db:"duration"` // in minutes
	Cost        *float64      `json:"cost,omitempty" db:"cost"`
	CreatedAt   time.Time     `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time     `json:"updated_at" db:"updated_at"`
}

// BookingStatus represents booking status
type BookingStatus string

const (
	StatusPending   BookingStatus = "pending"
	StatusConfirmed BookingStatus = "confirmed"
	StatusActive    BookingStatus = "active"
	StatusCompleted BookingStatus = "completed"
	StatusCancelled BookingStatus = "cancelled"
)

// CreateBookingRequest represents the request to create a booking
type CreateBookingRequest struct {
	UserID      string    `json:"user_id" validate:"required"`
	VehicleID   string    `json:"vehicle_id" validate:"required"`
	StartTime   time.Time `json:"start_time" validate:"required"`
	PickupLat   float64   `json:"pickup_latitude" validate:"required,min=-90,max=90"`
	PickupLng   float64   `json:"pickup_longitude" validate:"required,min=-180,max=180"`
	PickupAddr  string    `json:"pickup_address" validate:"required"`
	DropoffLat  *float64  `json:"dropoff_latitude,omitempty" validate:"omitempty,min=-90,max=90"`
	DropoffLng  *float64  `json:"dropoff_longitude,omitempty" validate:"omitempty,min=-180,max=180"`
	DropoffAddr *string   `json:"dropoff_address,omitempty"`
}

// UpdateBookingRequest represents the request to update a booking
type UpdateBookingRequest struct {
	Status      *BookingStatus `json:"status,omitempty"`
	EndTime     *time.Time     `json:"end_time,omitempty"`
	DropoffLat  *float64       `json:"dropoff_latitude,omitempty"`
	DropoffLng  *float64       `json:"dropoff_longitude,omitempty"`
	DropoffAddr *string        `json:"dropoff_address,omitempty"`
	Distance    *float64       `json:"distance,omitempty"`
	Duration    *int           `json:"duration,omitempty"`
	Cost        *float64       `json:"cost,omitempty"`
}

// BookingFilter represents filters for booking queries
type BookingFilter struct {
	UserID    *string        `json:"user_id,omitempty"`
	VehicleID *string        `json:"vehicle_id,omitempty"`
	Status    *BookingStatus `json:"status,omitempty"`
	StartDate *time.Time     `json:"start_date,omitempty"`
	EndDate   *time.Time     `json:"end_date,omitempty"`
	Limit     int            `json:"limit"`
	Offset    int            `json:"offset"`
}

// BookingListResponse represents the response for booking list
type BookingListResponse struct {
	Bookings []*Booking `json:"bookings"`
	Total    int64      `json:"total"`
	Limit    int        `json:"limit"`
	Offset   int        `json:"offset"`
}

// BookingStats represents booking statistics
type BookingStats struct {
	TotalBookings     int64   `json:"totalBookings" db:"total_bookings"`
	ActiveBookings    int64   `json:"activeBookings" db:"active_bookings"`
	CompletedBookings int64   `json:"completedBookings" db:"completed_bookings"`
	CancelledBookings int64   `json:"cancelledBookings" db:"cancelled_bookings"`
	TotalRevenue      float64 `json:"totalRevenue" db:"total_revenue"`
	AverageDistance   float64 `json:"averageDistance" db:"average_distance"`
	AverageDuration   float64 `json:"averageDuration" db:"average_duration"`
}
