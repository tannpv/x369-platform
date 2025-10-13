package domain

import (
	"time"
)

// Vehicle represents a vehicle in the system
type Vehicle struct {
	ID           string        `json:"id" db:"id"`
	Make         string        `json:"make" db:"make"`
	Model        string        `json:"model" db:"model"`
	Year         int           `json:"year" db:"year"`
	LicensePlate string        `json:"license_plate" db:"license_plate"`
	VIN          string        `json:"vin" db:"vin"`
	Color        string        `json:"color" db:"color"`
	Status       VehicleStatus `json:"status" db:"status"`
	Location     Location      `json:"location"`
	BatteryLevel int           `json:"battery_level" db:"battery_level"` // For electric vehicles
	FuelLevel    int           `json:"fuel_level" db:"fuel_level"`       // For gas vehicles
	Mileage      int           `json:"mileage" db:"mileage"`
	Features     []string      `json:"features"`
	CreatedAt    time.Time     `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time     `json:"updated_at" db:"updated_at"`
}

// VehicleStatus represents vehicle status
type VehicleStatus string

const (
	StatusAvailable   VehicleStatus = "available"
	StatusRented      VehicleStatus = "rented"
	StatusMaintenance VehicleStatus = "maintenance"
	StatusOffline     VehicleStatus = "offline"
)

// Location represents GPS coordinates
type Location struct {
	Latitude  float64 `json:"latitude" db:"latitude"`
	Longitude float64 `json:"longitude" db:"longitude"`
	Address   string  `json:"address" db:"address"`
}

// CreateVehicleRequest represents the request to create a vehicle
type CreateVehicleRequest struct {
	Make         string    `json:"make" validate:"required"`
	Model        string    `json:"model" validate:"required"`
	Year         int       `json:"year" validate:"required,min=1900,max=2030"`
	LicensePlate string    `json:"license_plate" validate:"required"`
	VIN          string    `json:"vin" validate:"required"`
	Color        string    `json:"color" validate:"required"`
	Location     Location  `json:"location" validate:"required"`
	Features     []string  `json:"features"`
}

// UpdateVehicleRequest represents the request to update a vehicle
type UpdateVehicleRequest struct {
	Make         *string        `json:"make,omitempty"`
	Model        *string        `json:"model,omitempty"`
	Year         *int           `json:"year,omitempty"`
	Color        *string        `json:"color,omitempty"`
	Status       *VehicleStatus `json:"status,omitempty"`
	Location     *Location      `json:"location,omitempty"`
	BatteryLevel *int           `json:"battery_level,omitempty"`
	FuelLevel    *int           `json:"fuel_level,omitempty"`
	Mileage      *int           `json:"mileage,omitempty"`
	Features     []string       `json:"features,omitempty"`
}

// VehicleSearchRequest represents search criteria
type VehicleSearchRequest struct {
	Status    *VehicleStatus `json:"status,omitempty"`
	Make      *string        `json:"make,omitempty"`
	Model     *string        `json:"model,omitempty"`
	YearFrom  *int           `json:"year_from,omitempty"`
	YearTo    *int           `json:"year_to,omitempty"`
	Latitude  *float64       `json:"latitude,omitempty"`
	Longitude *float64       `json:"longitude,omitempty"`
	Radius    *float64       `json:"radius,omitempty"` // in kilometers
}
