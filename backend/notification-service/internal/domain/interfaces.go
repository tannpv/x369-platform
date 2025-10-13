package domain

import (
	"context"
)

// NotificationRepository defines the interface for notification data operations
type NotificationRepository interface {
	Create(ctx context.Context, notification *Notification) error
	GetByID(ctx context.Context, id string) (*Notification, error)
	Update(ctx context.Context, id string, updates *UpdateNotificationRequest) (*Notification, error)
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, filter *NotificationFilter) ([]*Notification, error)
	Count(ctx context.Context, filter *NotificationFilter) (int64, error)
	GetByUserID(ctx context.Context, userID string, limit, offset int) ([]*Notification, error)
	GetUnreadByUserID(ctx context.Context, userID string) ([]*Notification, error)
	MarkAsRead(ctx context.Context, id string, userID string) error
	MarkAllAsRead(ctx context.Context, userID string) error
	GetPendingNotifications(ctx context.Context, limit int) ([]*Notification, error)
	GetStats(ctx context.Context, userID *string) (*NotificationStats, error)
}

// NotificationUseCase defines the interface for notification business logic
type NotificationUseCase interface {
	CreateNotification(ctx context.Context, req *CreateNotificationRequest) (*Notification, error)
	GetNotification(ctx context.Context, id string) (*Notification, error)
	UpdateNotification(ctx context.Context, id string, req *UpdateNotificationRequest) (*Notification, error)
	DeleteNotification(ctx context.Context, id string) error
	ListNotifications(ctx context.Context, filter *NotificationFilter) (*NotificationListResponse, error)
	GetUserNotifications(ctx context.Context, userID string, limit, offset int) ([]*Notification, error)
	GetUnreadNotifications(ctx context.Context, userID string) ([]*Notification, error)
	MarkAsRead(ctx context.Context, id string, userID string) error
	MarkAllAsRead(ctx context.Context, userID string) error
	SendPendingNotifications(ctx context.Context) error
	GetNotificationStats(ctx context.Context, userID *string) (*NotificationStats, error)
}

// NotificationSender defines the interface for sending notifications
type NotificationSender interface {
	SendEmail(ctx context.Context, to, subject, body string) error
	SendSMS(ctx context.Context, to, message string) error
	SendPush(ctx context.Context, userID, title, message string, data map[string]interface{}) error
}

// TemplateRepository defines the interface for template operations
type TemplateRepository interface {
	GetByType(ctx context.Context, notificationType NotificationType) (*NotificationTemplate, error)
	List(ctx context.Context) ([]*NotificationTemplate, error)
	Create(ctx context.Context, template *NotificationTemplate) error
	Update(ctx context.Context, id string, template *NotificationTemplate) error
}

// UserService defines the interface for user service integration
type UserService interface {
	GetUser(ctx context.Context, userID string) (*User, error)
	GetUserPreferences(ctx context.Context, userID string) (*UserPreferences, error)
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

// UserPreferences represents user notification preferences
type UserPreferences struct {
	UserID        string `json:"user_id"`
	EmailEnabled  bool   `json:"email_enabled"`
	SMSEnabled    bool   `json:"sms_enabled"`
	PushEnabled   bool   `json:"push_enabled"`
}

// BookingEvent represents a booking event for notifications
type BookingEvent struct {
	BookingID string                 `json:"booking_id"`
	UserID    string                 `json:"user_id"`
	VehicleID string                 `json:"vehicle_id"`
	Type      NotificationType       `json:"type"`
	Data      map[string]interface{} `json:"data"`
}
