package usecase

import (
	"context"
	"fmt"
	"time"

	"notification-service/internal/domain"
)

type notificationUseCase struct {
	notificationRepo   domain.NotificationRepository
	notificationSender domain.NotificationSender
	userService        domain.UserService
}

func NewNotificationUseCase(
	notificationRepo domain.NotificationRepository,
	notificationSender domain.NotificationSender,
	userService domain.UserService,
) domain.NotificationUseCase {
	return &notificationUseCase{
		notificationRepo:   notificationRepo,
		notificationSender: notificationSender,
		userService:        userService,
	}
}

func (u *notificationUseCase) CreateNotification(ctx context.Context, req *domain.CreateNotificationRequest) (*domain.Notification, error) {
	// Validate user exists
	_, err := u.userService.GetUser(ctx, req.UserID)
	if err != nil {
		return nil, fmt.Errorf("invalid user: %w", err)
	}

	// Set default priority
	if req.Priority == "" {
		req.Priority = domain.PriorityNormal
	}

	// Create notification
	notification := &domain.Notification{
		UserID:   req.UserID,
		Type:     req.Type,
		Title:    req.Title,
		Message:  req.Message,
		Priority: req.Priority,
		Data:     req.Data,
		Status:   domain.StatusPending,
	}

	err = u.notificationRepo.Create(ctx, notification)
	if err != nil {
		return nil, fmt.Errorf("failed to create notification: %w", err)
	}

	// Try to send immediately for high priority notifications
	if req.Priority == domain.PriorityHigh || req.Priority == domain.PriorityUrgent {
		go u.sendNotification(context.Background(), notification)
	}

	return notification, nil
}

func (u *notificationUseCase) GetNotification(ctx context.Context, id string) (*domain.Notification, error) {
	return u.notificationRepo.GetByID(ctx, id)
}

func (u *notificationUseCase) UpdateNotification(ctx context.Context, id string, req *domain.UpdateNotificationRequest) (*domain.Notification, error) {
	// Check if notification exists
	_, err := u.notificationRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return u.notificationRepo.Update(ctx, id, req)
}

func (u *notificationUseCase) DeleteNotification(ctx context.Context, id string) error {
	return u.notificationRepo.Delete(ctx, id)
}

func (u *notificationUseCase) ListNotifications(ctx context.Context, filter *domain.NotificationFilter) (*domain.NotificationListResponse, error) {
	// Set default pagination
	if filter.Limit <= 0 {
		filter.Limit = 20
	}
	if filter.Limit > 100 {
		filter.Limit = 100
	}

	notifications, err := u.notificationRepo.List(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to list notifications: %w", err)
	}

	total, err := u.notificationRepo.Count(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to count notifications: %w", err)
	}

	// Count unread notifications for the user
	var unread int64
	if filter.UserID != nil {
		unreadFilter := &domain.NotificationFilter{
			UserID: filter.UserID,
			Unread: &[]bool{true}[0],
		}
		unread, _ = u.notificationRepo.Count(ctx, unreadFilter)
	}

	return &domain.NotificationListResponse{
		Notifications: notifications,
		Total:         total,
		Unread:        unread,
		Limit:         filter.Limit,
		Offset:        filter.Offset,
	}, nil
}

func (u *notificationUseCase) GetUserNotifications(ctx context.Context, userID string, limit, offset int) ([]*domain.Notification, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}

	return u.notificationRepo.GetByUserID(ctx, userID, limit, offset)
}

func (u *notificationUseCase) GetUnreadNotifications(ctx context.Context, userID string) ([]*domain.Notification, error) {
	return u.notificationRepo.GetUnreadByUserID(ctx, userID)
}

func (u *notificationUseCase) MarkAsRead(ctx context.Context, id, userID string) error {
	return u.notificationRepo.MarkAsRead(ctx, id, userID)
}

func (u *notificationUseCase) MarkAllAsRead(ctx context.Context, userID string) error {
	return u.notificationRepo.MarkAllAsRead(ctx, userID)
}

func (u *notificationUseCase) SendPendingNotifications(ctx context.Context) error {
	// Get pending notifications
	notifications, err := u.notificationRepo.GetPendingNotifications(ctx, 100)
	if err != nil {
		return fmt.Errorf("failed to get pending notifications: %w", err)
	}

	// Send each notification
	for _, notification := range notifications {
		go u.sendNotification(ctx, notification)
	}

	return nil
}

func (u *notificationUseCase) GetNotificationStats(ctx context.Context, userID *string) (*domain.NotificationStats, error) {
	return u.notificationRepo.GetStats(ctx, userID)
}

func (u *notificationUseCase) sendNotification(ctx context.Context, notification *domain.Notification) {
	// Get user details
	user, err := u.userService.GetUser(ctx, notification.UserID)
	if err != nil {
		u.markAsFailed(ctx, notification.ID, fmt.Sprintf("failed to get user: %v", err))
		return
	}

	// Get user preferences
	preferences, err := u.userService.GetUserPreferences(ctx, notification.UserID)
	if err != nil {
		// Default to all enabled if preferences not found
		preferences = &domain.UserPreferences{
			UserID:       notification.UserID,
			EmailEnabled: true,
			SMSEnabled:   true,
			PushEnabled:  true,
		}
	}

	// Send notification based on preferences and priority
	sent := false

	// Always send urgent notifications
	if notification.Priority == domain.PriorityUrgent {
		// Try email
		if user.Email != "" {
			err = u.notificationSender.SendEmail(ctx, user.Email, notification.Title, notification.Message)
			if err == nil {
				sent = true
			}
		}

		// Try SMS for urgent notifications
		if user.Phone != "" {
			err = u.notificationSender.SendSMS(ctx, user.Phone, notification.Message)
			if err == nil {
				sent = true
			}
		}

		// Try push notification
		err = u.notificationSender.SendPush(ctx, notification.UserID, notification.Title, notification.Message, notification.Data)
		if err == nil {
			sent = true
		}
	} else {
		// Send based on user preferences
		if preferences.EmailEnabled && user.Email != "" {
			err = u.notificationSender.SendEmail(ctx, user.Email, notification.Title, notification.Message)
			if err == nil {
				sent = true
			}
		}

		if preferences.PushEnabled {
			err = u.notificationSender.SendPush(ctx, notification.UserID, notification.Title, notification.Message, notification.Data)
			if err == nil {
				sent = true
			}
		}

		// Send SMS only for high priority if enabled
		if preferences.SMSEnabled && notification.Priority == domain.PriorityHigh && user.Phone != "" {
			err = u.notificationSender.SendSMS(ctx, user.Phone, notification.Message)
			if err == nil {
				sent = true
			}
		}
	}

	// Update notification status
	if sent {
		sentAt := time.Now()
		updates := &domain.UpdateNotificationRequest{
			Status: &[]domain.NotificationStatus{domain.StatusSent}[0],
			SentAt: &sentAt,
		}
		u.notificationRepo.Update(ctx, notification.ID, updates)
	} else {
		u.markAsFailed(ctx, notification.ID, "failed to send through any channel")
	}
}

func (u *notificationUseCase) markAsFailed(ctx context.Context, notificationID, reason string) {
	failed := domain.StatusFailed
	updates := &domain.UpdateNotificationRequest{
		Status: &failed,
	}
	u.notificationRepo.Update(ctx, notificationID, updates)
	// Log the failure reason
	fmt.Printf("Notification %s failed: %s\n", notificationID, reason)
}
