package domain

import (
	"time"
)

// User represents a user in the system
type User struct {
	ID        string     `json:"id" db:"id"`
	Email     string     `json:"email" db:"email"`
	Password  string     `json:"-" db:"password"` // Never expose password in JSON
	FirstName string     `json:"first_name" db:"first_name"`
	LastName  string     `json:"last_name" db:"last_name"`
	Phone     string     `json:"phone" db:"phone"`
	Role      UserRole   `json:"role" db:"role"`
	Status    UserStatus `json:"status" db:"status"`
	CreatedAt time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt time.Time  `json:"updated_at" db:"updated_at"`
}

// UserRole represents user roles
type UserRole string

const (
	RoleCustomer UserRole = "customer"
	RoleAdmin    UserRole = "admin"
)

// UserStatus represents user status
type UserStatus string

const (
	StatusActive    UserStatus = "active"
	StatusInactive  UserStatus = "inactive"
	StatusSuspended UserStatus = "suspended"
)

// CreateUserRequest represents the request to create a user
type CreateUserRequest struct {
	Email     string   `json:"email" validate:"required,email"`
	Password  string   `json:"password" validate:"required,min=8"`
	FirstName string   `json:"first_name" validate:"required"`
	LastName  string   `json:"last_name" validate:"required"`
	Phone     string   `json:"phone" validate:"required"`
	Role      UserRole `json:"role" validate:"required,oneof=customer admin"`
}

// UpdateUserRequest represents the request to update a user
type UpdateUserRequest struct {
	FirstName *string     `json:"first_name,omitempty"`
	LastName  *string     `json:"last_name,omitempty"`
	Phone     *string     `json:"phone,omitempty"`
	Status    *UserStatus `json:"status,omitempty"`
}

// LoginRequest represents login credentials
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

// LoginResponse represents login response
type LoginResponse struct {
	User         User   `json:"user"`
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

// UserStats represents user statistics
type UserStats struct {
	TotalUsers  int64 `json:"totalUsers"`
	ActiveUsers int64 `json:"activeUsers"`
}
