package domain

import "context"

// UserRepository defines the interface for user data access
type UserRepository interface {
	Create(ctx context.Context, user *User) error
	GetByID(ctx context.Context, id string) (*User, error)
	GetByEmail(ctx context.Context, email string) (*User, error)
	Update(ctx context.Context, id string, updates *UpdateUserRequest) (*User, error)
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, limit, offset int) ([]*User, error)
	Count(ctx context.Context) (int64, error)
	GetStats(ctx context.Context) (*UserStats, error)
}

// UserUsecase defines the interface for user business logic
type UserUsecase interface {
	Create(ctx context.Context, req *CreateUserRequest) (*User, error)
	GetByID(ctx context.Context, id string) (*User, error)
	Update(ctx context.Context, id string, req *UpdateUserRequest) (*User, error)
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, limit, offset int) ([]*User, int64, error)
	Login(ctx context.Context, req *LoginRequest) (*LoginResponse, error)
	ValidateToken(ctx context.Context, token string) (*User, error)
	GetStats(ctx context.Context) (*UserStats, error)
}
