package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"
	"user-service/internal/domain"

	_ "github.com/lib/pq"
)

type postgresUserRepository struct {
	db *sql.DB
}

// NewPostgresUserRepository creates a new PostgreSQL user repository
func NewPostgresUserRepository(db *sql.DB) domain.UserRepository {
	return &postgresUserRepository{db: db}
}

func (r *postgresUserRepository) Create(ctx context.Context, user *domain.User) error {
	query := `
		INSERT INTO users (id, email, password, first_name, last_name, phone, role, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	`
	
	_, err := r.db.ExecContext(ctx, query,
		user.ID, user.Email, user.Password, user.FirstName, user.LastName,
		user.Phone, user.Role, user.Status, user.CreatedAt, user.UpdatedAt,
	)
	
	return err
}

func (r *postgresUserRepository) GetByID(ctx context.Context, id string) (*domain.User, error) {
	query := `
		SELECT id, email, password, first_name, last_name, phone, role, status, created_at, updated_at
		FROM users WHERE id = $1
	`
	
	user := &domain.User{}
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&user.ID, &user.Email, &user.Password, &user.FirstName, &user.LastName,
		&user.Phone, &user.Role, &user.Status, &user.CreatedAt, &user.UpdatedAt,
	)
	
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, err
	}
	
	return user, nil
}

func (r *postgresUserRepository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	query := `
		SELECT id, email, password, first_name, last_name, phone, role, status, created_at, updated_at
		FROM users WHERE email = $1
	`
	
	user := &domain.User{}
	err := r.db.QueryRowContext(ctx, query, email).Scan(
		&user.ID, &user.Email, &user.Password, &user.FirstName, &user.LastName,
		&user.Phone, &user.Role, &user.Status, &user.CreatedAt, &user.UpdatedAt,
	)
	
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, err
	}
	
	return user, nil
}

func (r *postgresUserRepository) Update(ctx context.Context, id string, updates *domain.UpdateUserRequest) (*domain.User, error) {
	setParts := []string{}
	args := []interface{}{}
	argIndex := 1

	if updates.FirstName != nil {
		setParts = append(setParts, fmt.Sprintf("first_name = $%d", argIndex))
		args = append(args, *updates.FirstName)
		argIndex++
	}
	
	if updates.LastName != nil {
		setParts = append(setParts, fmt.Sprintf("last_name = $%d", argIndex))
		args = append(args, *updates.LastName)
		argIndex++
	}
	
	if updates.Phone != nil {
		setParts = append(setParts, fmt.Sprintf("phone = $%d", argIndex))
		args = append(args, *updates.Phone)
		argIndex++
	}
	
	if updates.Status != nil {
		setParts = append(setParts, fmt.Sprintf("status = $%d", argIndex))
		args = append(args, *updates.Status)
		argIndex++
	}

	if len(setParts) == 0 {
		return r.GetByID(ctx, id)
	}

	setParts = append(setParts, fmt.Sprintf("updated_at = $%d", argIndex))
	args = append(args, time.Now())
	argIndex++

	args = append(args, id)

	query := fmt.Sprintf(`
		UPDATE users SET %s WHERE id = $%d
		RETURNING id, email, password, first_name, last_name, phone, role, status, created_at, updated_at
	`, fmt.Sprintf("%s", setParts[0]), argIndex)

	for i := 1; i < len(setParts); i++ {
		query = fmt.Sprintf(`
			UPDATE users SET %s, %s WHERE id = $%d
			RETURNING id, email, password, first_name, last_name, phone, role, status, created_at, updated_at
		`, setParts[0], setParts[i], argIndex)
	}

	user := &domain.User{}
	err := r.db.QueryRowContext(ctx, query, args...).Scan(
		&user.ID, &user.Email, &user.Password, &user.FirstName, &user.LastName,
		&user.Phone, &user.Role, &user.Status, &user.CreatedAt, &user.UpdatedAt,
	)

	return user, err
}

func (r *postgresUserRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM users WHERE id = $1`
	_, err := r.db.ExecContext(ctx, query, id)
	return err
}

func (r *postgresUserRepository) List(ctx context.Context, limit, offset int) ([]*domain.User, error) {
	query := `
		SELECT id, email, password, first_name, last_name, phone, role, status, created_at, updated_at
		FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2
	`
	
	rows, err := r.db.QueryContext(ctx, query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	users := []*domain.User{}
	for rows.Next() {
		user := &domain.User{}
		err := rows.Scan(
			&user.ID, &user.Email, &user.Password, &user.FirstName, &user.LastName,
			&user.Phone, &user.Role, &user.Status, &user.CreatedAt, &user.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

func (r *postgresUserRepository) Count(ctx context.Context) (int64, error) {
	query := `SELECT COUNT(*) FROM users`
	var count int64
	err := r.db.QueryRowContext(ctx, query).Scan(&count)
	return count, err
}

func (r *postgresUserRepository) GetStats(ctx context.Context) (*domain.UserStats, error) {
	var stats domain.UserStats
	
	// Get total users count
	totalQuery := `SELECT COUNT(*) FROM users`
	err := r.db.QueryRowContext(ctx, totalQuery).Scan(&stats.TotalUsers)
	if err != nil {
		return nil, err
	}
	
	// Get active users count
	activeQuery := `SELECT COUNT(*) FROM users WHERE status = 'active'`
	err = r.db.QueryRowContext(ctx, activeQuery).Scan(&stats.ActiveUsers)
	if err != nil {
		return nil, err
	}
	
	return &stats, nil
}
