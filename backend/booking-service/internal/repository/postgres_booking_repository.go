package repository

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	"booking-service/internal/domain"
	"github.com/jmoiron/sqlx"
	"github.com/google/uuid"
)

type postgresBookingRepository struct {
	db *sqlx.DB
}

func NewPostgresBookingRepository(db *sqlx.DB) domain.BookingRepository {
	return &postgresBookingRepository{
		db: db,
	}
}

func (r *postgresBookingRepository) Create(ctx context.Context, booking *domain.Booking) error {
	booking.ID = uuid.New().String()
	booking.CreatedAt = time.Now()
	booking.UpdatedAt = time.Now()

	query := `
		INSERT INTO bookings (
			id, user_id, vehicle_id, status, start_time, end_time,
			pickup_latitude, pickup_longitude, pickup_address,
			dropoff_latitude, dropoff_longitude, dropoff_address,
			distance, duration, cost, created_at, updated_at
		) VALUES (
			:id, :user_id, :vehicle_id, :status, :start_time, :end_time,
			:pickup_latitude, :pickup_longitude, :pickup_address,
			:dropoff_latitude, :dropoff_longitude, :dropoff_address,
			:distance, :duration, :cost, :created_at, :updated_at
		)`

	_, err := r.db.NamedExecContext(ctx, query, booking)
	return err
}

func (r *postgresBookingRepository) GetByID(ctx context.Context, id string) (*domain.Booking, error) {
	var booking domain.Booking
	query := `
		SELECT id, user_id, vehicle_id, status, start_time, end_time,
			   pickup_latitude, pickup_longitude, pickup_address,
			   dropoff_latitude, dropoff_longitude, dropoff_address,
			   distance, duration, cost, created_at, updated_at
		FROM bookings 
		WHERE id = $1`

	err := r.db.GetContext(ctx, &booking, query, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("booking not found")
		}
		return nil, err
	}

	return &booking, nil
}

func (r *postgresBookingRepository) Update(ctx context.Context, id string, updates *domain.UpdateBookingRequest) (*domain.Booking, error) {
	setParts := []string{}
	args := map[string]interface{}{"id": id, "updated_at": time.Now()}

	if updates.Status != nil {
		setParts = append(setParts, "status = :status")
		args["status"] = *updates.Status
	}
	if updates.EndTime != nil {
		setParts = append(setParts, "end_time = :end_time")
		args["end_time"] = *updates.EndTime
	}
	if updates.DropoffLat != nil {
		setParts = append(setParts, "dropoff_latitude = :dropoff_latitude")
		args["dropoff_latitude"] = *updates.DropoffLat
	}
	if updates.DropoffLng != nil {
		setParts = append(setParts, "dropoff_longitude = :dropoff_longitude")
		args["dropoff_longitude"] = *updates.DropoffLng
	}
	if updates.DropoffAddr != nil {
		setParts = append(setParts, "dropoff_address = :dropoff_address")
		args["dropoff_address"] = *updates.DropoffAddr
	}
	if updates.Distance != nil {
		setParts = append(setParts, "distance = :distance")
		args["distance"] = *updates.Distance
	}
	if updates.Duration != nil {
		setParts = append(setParts, "duration = :duration")
		args["duration"] = *updates.Duration
	}
	if updates.Cost != nil {
		setParts = append(setParts, "cost = :cost")
		args["cost"] = *updates.Cost
	}

	if len(setParts) == 0 {
		return r.GetByID(ctx, id)
	}

	setParts = append(setParts, "updated_at = :updated_at")
	query := fmt.Sprintf("UPDATE bookings SET %s WHERE id = :id", strings.Join(setParts, ", "))

	_, err := r.db.NamedExecContext(ctx, query, args)
	if err != nil {
		return nil, err
	}

	return r.GetByID(ctx, id)
}

func (r *postgresBookingRepository) Delete(ctx context.Context, id string) error {
	query := "DELETE FROM bookings WHERE id = $1"
	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("booking not found")
	}

	return nil
}

func (r *postgresBookingRepository) List(ctx context.Context, filter *domain.BookingFilter) ([]*domain.Booking, error) {
	whereParts := []string{}
	args := map[string]interface{}{}

	if filter.UserID != nil {
		whereParts = append(whereParts, "user_id = :user_id")
		args["user_id"] = *filter.UserID
	}
	if filter.VehicleID != nil {
		whereParts = append(whereParts, "vehicle_id = :vehicle_id")
		args["vehicle_id"] = *filter.VehicleID
	}
	if filter.Status != nil {
		whereParts = append(whereParts, "status = :status")
		args["status"] = *filter.Status
	}
	if filter.StartDate != nil {
		whereParts = append(whereParts, "start_time >= :start_date")
		args["start_date"] = *filter.StartDate
	}
	if filter.EndDate != nil {
		whereParts = append(whereParts, "start_time <= :end_date")
		args["end_date"] = *filter.EndDate
	}

	whereClause := ""
	if len(whereParts) > 0 {
		whereClause = "WHERE " + strings.Join(whereParts, " AND ")
	}

	args["limit"] = filter.Limit
	args["offset"] = filter.Offset

	query := fmt.Sprintf(`
		SELECT id, user_id, vehicle_id, status, start_time, end_time,
			   pickup_latitude, pickup_longitude, pickup_address,
			   dropoff_latitude, dropoff_longitude, dropoff_address,
			   distance, duration, cost, created_at, updated_at
		FROM bookings %s
		ORDER BY created_at DESC
		LIMIT :limit OFFSET :offset`, whereClause)

	var bookings []*domain.Booking
	rows, err := r.db.NamedQueryContext(ctx, query, args)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var booking domain.Booking
		err := rows.StructScan(&booking)
		if err != nil {
			return nil, err
		}
		bookings = append(bookings, &booking)
	}

	return bookings, nil
}

func (r *postgresBookingRepository) Count(ctx context.Context, filter *domain.BookingFilter) (int64, error) {
	whereParts := []string{}
	args := map[string]interface{}{}

	if filter.UserID != nil {
		whereParts = append(whereParts, "user_id = :user_id")
		args["user_id"] = *filter.UserID
	}
	if filter.VehicleID != nil {
		whereParts = append(whereParts, "vehicle_id = :vehicle_id")
		args["vehicle_id"] = *filter.VehicleID
	}
	if filter.Status != nil {
		whereParts = append(whereParts, "status = :status")
		args["status"] = *filter.Status
	}
	if filter.StartDate != nil {
		whereParts = append(whereParts, "start_time >= :start_date")
		args["start_date"] = *filter.StartDate
	}
	if filter.EndDate != nil {
		whereParts = append(whereParts, "start_time <= :end_date")
		args["end_date"] = *filter.EndDate
	}

	whereClause := ""
	if len(whereParts) > 0 {
		whereClause = "WHERE " + strings.Join(whereParts, " AND ")
	}

	query := fmt.Sprintf("SELECT COUNT(*) FROM bookings %s", whereClause)

	var count int64
	row := r.db.QueryRowxContext(ctx, query, args)
	err := row.Scan(&count)
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (r *postgresBookingRepository) GetByUserID(ctx context.Context, userID string, limit, offset int) ([]*domain.Booking, error) {
	query := `
		SELECT id, user_id, vehicle_id, status, start_time, end_time,
			   pickup_latitude, pickup_longitude, pickup_address,
			   dropoff_latitude, dropoff_longitude, dropoff_address,
			   distance, duration, cost, created_at, updated_at
		FROM bookings 
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`

	var bookings []*domain.Booking
	err := r.db.SelectContext(ctx, &bookings, query, userID, limit, offset)
	return bookings, err
}

func (r *postgresBookingRepository) GetByVehicleID(ctx context.Context, vehicleID string, limit, offset int) ([]*domain.Booking, error) {
	query := `
		SELECT id, user_id, vehicle_id, status, start_time, end_time,
			   pickup_latitude, pickup_longitude, pickup_address,
			   dropoff_latitude, dropoff_longitude, dropoff_address,
			   distance, duration, cost, created_at, updated_at
		FROM bookings 
		WHERE vehicle_id = $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`

	var bookings []*domain.Booking
	err := r.db.SelectContext(ctx, &bookings, query, vehicleID, limit, offset)
	return bookings, err
}

func (r *postgresBookingRepository) GetActiveBookings(ctx context.Context) ([]*domain.Booking, error) {
	query := `
		SELECT id, user_id, vehicle_id, status, start_time, end_time,
			   pickup_latitude, pickup_longitude, pickup_address,
			   dropoff_latitude, dropoff_longitude, dropoff_address,
			   distance, duration, cost, created_at, updated_at
		FROM bookings 
		WHERE status IN ('confirmed', 'active')
		ORDER BY start_time ASC`

	var bookings []*domain.Booking
	err := r.db.SelectContext(ctx, &bookings, query)
	return bookings, err
}

func (r *postgresBookingRepository) GetStats(ctx context.Context, userID *string) (*domain.BookingStats, error) {
	whereClause := ""
	args := []interface{}{}
	if userID != nil {
		whereClause = "WHERE user_id = $1"
		args = append(args, *userID)
	}

	query := fmt.Sprintf(`
		SELECT 
			COUNT(*) as total_bookings,
			COUNT(CASE WHEN status = 'active' THEN 1 END) as active_bookings,
			COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings,
			COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings,
			COALESCE(SUM(cost), 0) as total_revenue,
			COALESCE(AVG(distance), 0) as average_distance,
			COALESCE(AVG(duration), 0) as average_duration
		FROM bookings %s`, whereClause)

	var stats domain.BookingStats
	err := r.db.GetContext(ctx, &stats, query, args...)
	return &stats, err
}
