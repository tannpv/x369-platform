package domain

import (
	"time"
)

// Notification represents a notification in the system
type Notification struct {
	ID        string             `json:"id" db:"id"`
	UserID    string             `json:"user_id" db:"user_id"`
	Type      NotificationType   `json:"type" db:"type"`
	Title     string             `json:"title" db:"title"`
	Message   string             `json:"message" db:"message"`
	Status    NotificationStatus `json:"status" db:"status"`
	Priority  NotificationPriority `json:"priority" db:"priority"`
	Data      map[string]interface{} `json:"data,omitempty" db:"data"`
	ReadAt    *time.Time         `json:"read_at,omitempty" db:"read_at"`
	SentAt    *time.Time         `json:"sent_at,omitempty" db:"sent_at"`
	CreatedAt time.Time          `json:"created_at" db:"created_at"`
	UpdatedAt time.Time          `json:"updated_at" db:"updated_at"`
}

// NotificationType represents the type of notification
type NotificationType string

const (
	TypeBookingCreated   NotificationType = "booking_created"
	TypeBookingConfirmed NotificationType = "booking_confirmed"
	TypeBookingStarted   NotificationType = "booking_started"
	TypeBookingCompleted NotificationType = "booking_completed"
	TypeBookingCancelled NotificationType = "booking_cancelled"
	TypeVehicleAssigned  NotificationType = "vehicle_assigned"
	TypePaymentProcessed NotificationType = "payment_processed"
	TypeSystemAlert      NotificationType = "system_alert"
	TypePromotion        NotificationType = "promotion"
)

// NotificationStatus represents the status of a notification
type NotificationStatus string

const (
	StatusPending   NotificationStatus = "pending"
	StatusSent      NotificationStatus = "sent"
	StatusDelivered NotificationStatus = "delivered"
	StatusRead      NotificationStatus = "read"
	StatusFailed    NotificationStatus = "failed"
)

// NotificationPriority represents the priority of a notification
type NotificationPriority string

const (
	PriorityLow    NotificationPriority = "low"
	PriorityNormal NotificationPriority = "normal"
	PriorityHigh   NotificationPriority = "high"
	PriorityUrgent NotificationPriority = "urgent"
)

// CreateNotificationRequest represents the request to create a notification
type CreateNotificationRequest struct {
	UserID   string                 `json:"user_id" validate:"required"`
	Type     NotificationType       `json:"type" validate:"required"`
	Title    string                 `json:"title" validate:"required"`
	Message  string                 `json:"message" validate:"required"`
	Priority NotificationPriority   `json:"priority"`
	Data     map[string]interface{} `json:"data,omitempty"`
}

// UpdateNotificationRequest represents the request to update a notification
type UpdateNotificationRequest struct {
	Status *NotificationStatus `json:"status,omitempty"`
	ReadAt *time.Time          `json:"read_at,omitempty"`
	SentAt *time.Time          `json:"sent_at,omitempty"`
}

// NotificationFilter represents filters for notification queries
type NotificationFilter struct {
	UserID   *string             `json:"user_id,omitempty"`
	Type     *NotificationType   `json:"type,omitempty"`
	Status   *NotificationStatus `json:"status,omitempty"`
	Priority *NotificationPriority `json:"priority,omitempty"`
	Unread   *bool               `json:"unread,omitempty"`
	Limit    int                 `json:"limit"`
	Offset   int                 `json:"offset"`
}

// NotificationListResponse represents the response for notification list
type NotificationListResponse struct {
	Notifications []*Notification `json:"notifications"`
	Total         int64           `json:"total"`
	Unread        int64           `json:"unread"`
	Limit         int             `json:"limit"`
	Offset        int             `json:"offset"`
}

// NotificationStats represents notification statistics
type NotificationStats struct {
	TotalNotifications int64 `json:"total_notifications"`
	UnreadCount        int64 `json:"unread_count"`
	PendingCount       int64 `json:"pending_count"`
	SentCount          int64 `json:"sent_count"`
	FailedCount        int64 `json:"failed_count"`
}

// NotificationTemplate represents a notification template
type NotificationTemplate struct {
	ID       string           `json:"id" db:"id"`
	Type     NotificationType `json:"type" db:"type"`
	Title    string           `json:"title" db:"title"`
	Message  string           `json:"message" db:"message"`
	Priority NotificationPriority `json:"priority" db:"priority"`
	Active   bool             `json:"active" db:"active"`
	CreatedAt time.Time       `json:"created_at" db:"created_at"`
	UpdatedAt time.Time       `json:"updated_at" db:"updated_at"`
}
