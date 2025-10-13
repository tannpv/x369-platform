package repository

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"
	"encoding/json"

	"notification-service/internal/domain"
	"github.com/jmoiron/sqlx"
	"github.com/google/uuid"
)

type postgresNotificationRepository struct {
	db *sqlx.DB
}

func NewPostgresNotificationRepository(db *sqlx.DB) domain.NotificationRepository {
	return &postgresNotificationRepository{
		db: db,
	}
}

func (r *postgresNotificationRepository) Create(ctx context.Context, notification *domain.Notification) error {
	notification.ID = uuid.New().String()
	notification.CreatedAt = time.Now()
	notification.UpdatedAt = time.Now()

	// Set default priority if not specified
	if notification.Priority == "" {
		notification.Priority = domain.PriorityNormal
	}

	// Set default status if not specified
	if notification.Status == "" {
		notification.Status = domain.StatusPending
	}

	// Convert data to JSON
	var dataJSON []byte
	var err error
	if notification.Data != nil {
		dataJSON, err = json.Marshal(notification.Data)
		if err != nil {
			return fmt.Errorf("failed to marshal notification data: %w", err)
		}
	}

	query := `
		INSERT INTO notifications (
			id, user_id, type, title, message, status, priority, data,
			read_at, sent_at, created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
		)`

	_, err = r.db.ExecContext(ctx, query,
		notification.ID, notification.UserID, notification.Type,
		notification.Title, notification.Message, notification.Status,
		notification.Priority, dataJSON, notification.ReadAt,
		notification.SentAt, notification.CreatedAt, notification.UpdatedAt)

	return err
}

func (r *postgresNotificationRepository) GetByID(ctx context.Context, id string) (*domain.Notification, error) {
	query := `
		SELECT id, user_id, type, title, message, status, priority, data,
			   read_at, sent_at, created_at, updated_at
		FROM notifications 
		WHERE id = $1`

	row := r.db.QueryRowContext(ctx, query, id)

	var notification domain.Notification
	var dataJSON []byte

	err := row.Scan(
		&notification.ID, &notification.UserID, &notification.Type,
		&notification.Title, &notification.Message, &notification.Status,
		&notification.Priority, &dataJSON, &notification.ReadAt,
		&notification.SentAt, &notification.CreatedAt, &notification.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("notification not found")
		}
		return nil, err
	}

	// Unmarshal data JSON
	if dataJSON != nil {
		err = json.Unmarshal(dataJSON, &notification.Data)
		if err != nil {
			return nil, fmt.Errorf("failed to unmarshal notification data: %w", err)
		}
	}

	return &notification, nil
}

func (r *postgresNotificationRepository) Update(ctx context.Context, id string, updates *domain.UpdateNotificationRequest) (*domain.Notification, error) {
	setParts := []string{}
	args := []interface{}{id}
	argIndex := 2

	if updates.Status != nil {
		setParts = append(setParts, fmt.Sprintf("status = $%d", argIndex))
		args = append(args, *updates.Status)
		argIndex++
	}
	if updates.ReadAt != nil {
		setParts = append(setParts, fmt.Sprintf("read_at = $%d", argIndex))
		args = append(args, *updates.ReadAt)
		argIndex++
	}
	if updates.SentAt != nil {
		setParts = append(setParts, fmt.Sprintf("sent_at = $%d", argIndex))
		args = append(args, *updates.SentAt)
		argIndex++
	}

	if len(setParts) == 0 {
		return r.GetByID(ctx, id)
	}

	setParts = append(setParts, fmt.Sprintf("updated_at = $%d", argIndex))
	args = append(args, time.Now())

	query := fmt.Sprintf("UPDATE notifications SET %s WHERE id = $1", strings.Join(setParts, ", "))

	_, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}

	return r.GetByID(ctx, id)
}

func (r *postgresNotificationRepository) Delete(ctx context.Context, id string) error {
	query := "DELETE FROM notifications WHERE id = $1"
	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("notification not found")
	}

	return nil
}

func (r *postgresNotificationRepository) List(ctx context.Context, filter *domain.NotificationFilter) ([]*domain.Notification, error) {
	whereParts := []string{}
	args := []interface{}{}
	argIndex := 1

	if filter.UserID != nil {
		whereParts = append(whereParts, fmt.Sprintf("user_id = $%d", argIndex))
		args = append(args, *filter.UserID)
		argIndex++
	}
	if filter.Type != nil {
		whereParts = append(whereParts, fmt.Sprintf("type = $%d", argIndex))
		args = append(args, *filter.Type)
		argIndex++
	}
	if filter.Status != nil {
		whereParts = append(whereParts, fmt.Sprintf("status = $%d", argIndex))
		args = append(args, *filter.Status)
		argIndex++
	}
	if filter.Priority != nil {
		whereParts = append(whereParts, fmt.Sprintf("priority = $%d", argIndex))
		args = append(args, *filter.Priority)
		argIndex++
	}
	if filter.Unread != nil && *filter.Unread {
		whereParts = append(whereParts, "read_at IS NULL")
	}

	whereClause := ""
	if len(whereParts) > 0 {
		whereClause = "WHERE " + strings.Join(whereParts, " AND ")
	}

	args = append(args, filter.Limit, filter.Offset)
	limitClause := fmt.Sprintf("LIMIT $%d OFFSET $%d", argIndex, argIndex+1)

	query := fmt.Sprintf(`
		SELECT id, user_id, type, title, message, status, priority, data,
			   read_at, sent_at, created_at, updated_at
		FROM notifications %s
		ORDER BY created_at DESC
		%s`, whereClause, limitClause)

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notifications []*domain.Notification
	for rows.Next() {
		var notification domain.Notification
		var dataJSON []byte

		err := rows.Scan(
			&notification.ID, &notification.UserID, &notification.Type,
			&notification.Title, &notification.Message, &notification.Status,
			&notification.Priority, &dataJSON, &notification.ReadAt,
			&notification.SentAt, &notification.CreatedAt, &notification.UpdatedAt)

		if err != nil {
			return nil, err
		}

		// Unmarshal data JSON
		if dataJSON != nil {
			err = json.Unmarshal(dataJSON, &notification.Data)
			if err != nil {
				return nil, fmt.Errorf("failed to unmarshal notification data: %w", err)
			}
		}

		notifications = append(notifications, &notification)
	}

	return notifications, nil
}

func (r *postgresNotificationRepository) Count(ctx context.Context, filter *domain.NotificationFilter) (int64, error) {
	whereParts := []string{}
	args := []interface{}{}
	argIndex := 1

	if filter.UserID != nil {
		whereParts = append(whereParts, fmt.Sprintf("user_id = $%d", argIndex))
		args = append(args, *filter.UserID)
		argIndex++
	}
	if filter.Type != nil {
		whereParts = append(whereParts, fmt.Sprintf("type = $%d", argIndex))
		args = append(args, *filter.Type)
		argIndex++
	}
	if filter.Status != nil {
		whereParts = append(whereParts, fmt.Sprintf("status = $%d", argIndex))
		args = append(args, *filter.Status)
		argIndex++
	}
	if filter.Priority != nil {
		whereParts = append(whereParts, fmt.Sprintf("priority = $%d", argIndex))
		args = append(args, *filter.Priority)
		argIndex++
	}
	if filter.Unread != nil && *filter.Unread {
		whereParts = append(whereParts, "read_at IS NULL")
	}

	whereClause := ""
	if len(whereParts) > 0 {
		whereClause = "WHERE " + strings.Join(whereParts, " AND ")
	}

	query := fmt.Sprintf("SELECT COUNT(*) FROM notifications %s", whereClause)

	var count int64
	err := r.db.QueryRowContext(ctx, query, args...).Scan(&count)
	return count, err
}

func (r *postgresNotificationRepository) GetByUserID(ctx context.Context, userID string, limit, offset int) ([]*domain.Notification, error) {
	filter := &domain.NotificationFilter{
		UserID: &userID,
		Limit:  limit,
		Offset: offset,
	}
	return r.List(ctx, filter)
}

func (r *postgresNotificationRepository) GetUnreadByUserID(ctx context.Context, userID string) ([]*domain.Notification, error) {
	unread := true
	filter := &domain.NotificationFilter{
		UserID: &userID,
		Unread: &unread,
		Limit:  100, // Default limit for unread
		Offset: 0,
	}
	return r.List(ctx, filter)
}

func (r *postgresNotificationRepository) MarkAsRead(ctx context.Context, id, userID string) error {
	readAt := time.Now()
	updates := &domain.UpdateNotificationRequest{
		ReadAt: &readAt,
		Status: &[]domain.NotificationStatus{domain.StatusRead}[0],
	}

	// Verify ownership
	notification, err := r.GetByID(ctx, id)
	if err != nil {
		return err
	}
	if notification.UserID != userID {
		return fmt.Errorf("unauthorized: notification does not belong to user")
	}

	_, err = r.Update(ctx, id, updates)
	return err
}

func (r *postgresNotificationRepository) MarkAllAsRead(ctx context.Context, userID string) error {
	query := `
		UPDATE notifications 
		SET read_at = $1, status = $2, updated_at = $3
		WHERE user_id = $4 AND read_at IS NULL`

	now := time.Now()
	_, err := r.db.ExecContext(ctx, query, now, domain.StatusRead, now, userID)
	return err
}

func (r *postgresNotificationRepository) GetPendingNotifications(ctx context.Context, limit int) ([]*domain.Notification, error) {
	pending := domain.StatusPending
	filter := &domain.NotificationFilter{
		Status: &pending,
		Limit:  limit,
		Offset: 0,
	}
	return r.List(ctx, filter)
}

func (r *postgresNotificationRepository) GetStats(ctx context.Context, userID *string) (*domain.NotificationStats, error) {
	whereClause := ""
	args := []interface{}{}
	if userID != nil {
		whereClause = "WHERE user_id = $1"
		args = append(args, *userID)
	}

	query := fmt.Sprintf(`
		SELECT 
			COUNT(*) as total_notifications,
			COUNT(CASE WHEN read_at IS NULL THEN 1 END) as unread_count,
			COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
			COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_count,
			COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count
		FROM notifications %s`, whereClause)

	var stats domain.NotificationStats
	err := r.db.QueryRowContext(ctx, query, args...).Scan(
		&stats.TotalNotifications, &stats.UnreadCount,
		&stats.PendingCount, &stats.SentCount, &stats.FailedCount)

	return &stats, err
}
