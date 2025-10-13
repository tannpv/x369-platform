package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"strings"
	"time"
	"vehicle-service/internal/domain"

	_ "github.com/lib/pq"
)

type postgresVehicleRepository struct {
	db *sql.DB
}

// NewPostgresVehicleRepository creates a new PostgreSQL vehicle repository
func NewPostgresVehicleRepository(db *sql.DB) domain.VehicleRepository {
	return &postgresVehicleRepository{db: db}
}

func (r *postgresVehicleRepository) Create(ctx context.Context, vehicle *domain.Vehicle) error {
	featuresJSON, err := json.Marshal(vehicle.Features)
	if err != nil {
		return fmt.Errorf("failed to marshal features: %w", err)
	}

	query := `
		INSERT INTO vehicles (
			id, make, model, year, license_plate, vin, color, status,
			latitude, longitude, address, battery_level, fuel_level, 
			mileage, features, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
	`
	
	_, err = r.db.ExecContext(ctx, query,
		vehicle.ID, vehicle.Make, vehicle.Model, vehicle.Year, vehicle.LicensePlate,
		vehicle.VIN, vehicle.Color, vehicle.Status, vehicle.Location.Latitude,
		vehicle.Location.Longitude, vehicle.Location.Address, vehicle.BatteryLevel,
		vehicle.FuelLevel, vehicle.Mileage, featuresJSON, vehicle.CreatedAt, vehicle.UpdatedAt,
	)
	
	return err
}

func (r *postgresVehicleRepository) GetByID(ctx context.Context, id string) (*domain.Vehicle, error) {
	query := `
		SELECT id, make, model, year, license_plate, vin, color, status,
			   latitude, longitude, address, battery_level, fuel_level,
			   mileage, features, created_at, updated_at
		FROM vehicles WHERE id = $1
	`
	
	vehicle := &domain.Vehicle{}
	var featuresJSON []byte
	
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&vehicle.ID, &vehicle.Make, &vehicle.Model, &vehicle.Year, &vehicle.LicensePlate,
		&vehicle.VIN, &vehicle.Color, &vehicle.Status, &vehicle.Location.Latitude,
		&vehicle.Location.Longitude, &vehicle.Location.Address, &vehicle.BatteryLevel,
		&vehicle.FuelLevel, &vehicle.Mileage, &featuresJSON, &vehicle.CreatedAt, &vehicle.UpdatedAt,
	)
	
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("vehicle not found")
		}
		return nil, err
	}
	
	if err := json.Unmarshal(featuresJSON, &vehicle.Features); err != nil {
		return nil, fmt.Errorf("failed to unmarshal features: %w", err)
	}
	
	return vehicle, nil
}

func (r *postgresVehicleRepository) GetByLicensePlate(ctx context.Context, licensePlate string) (*domain.Vehicle, error) {
	query := `
		SELECT id, make, model, year, license_plate, vin, color, status,
			   latitude, longitude, address, battery_level, fuel_level,
			   mileage, features, created_at, updated_at
		FROM vehicles WHERE license_plate = $1
	`
	
	vehicle := &domain.Vehicle{}
	var featuresJSON []byte
	
	err := r.db.QueryRowContext(ctx, query, licensePlate).Scan(
		&vehicle.ID, &vehicle.Make, &vehicle.Model, &vehicle.Year, &vehicle.LicensePlate,
		&vehicle.VIN, &vehicle.Color, &vehicle.Status, &vehicle.Location.Latitude,
		&vehicle.Location.Longitude, &vehicle.Location.Address, &vehicle.BatteryLevel,
		&vehicle.FuelLevel, &vehicle.Mileage, &featuresJSON, &vehicle.CreatedAt, &vehicle.UpdatedAt,
	)
	
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("vehicle not found")
		}
		return nil, err
	}
	
	if err := json.Unmarshal(featuresJSON, &vehicle.Features); err != nil {
		return nil, fmt.Errorf("failed to unmarshal features: %w", err)
	}
	
	return vehicle, nil
}

func (r *postgresVehicleRepository) Update(ctx context.Context, id string, updates *domain.UpdateVehicleRequest) (*domain.Vehicle, error) {
	setParts := []string{}
	args := []interface{}{}
	argIndex := 1

	if updates.Make != nil {
		setParts = append(setParts, fmt.Sprintf("make = $%d", argIndex))
		args = append(args, *updates.Make)
		argIndex++
	}
	
	if updates.Model != nil {
		setParts = append(setParts, fmt.Sprintf("model = $%d", argIndex))
		args = append(args, *updates.Model)
		argIndex++
	}
	
	if updates.Year != nil {
		setParts = append(setParts, fmt.Sprintf("year = $%d", argIndex))
		args = append(args, *updates.Year)
		argIndex++
	}
	
	if updates.Color != nil {
		setParts = append(setParts, fmt.Sprintf("color = $%d", argIndex))
		args = append(args, *updates.Color)
		argIndex++
	}
	
	if updates.Status != nil {
		setParts = append(setParts, fmt.Sprintf("status = $%d", argIndex))
		args = append(args, *updates.Status)
		argIndex++
	}
	
	if updates.BatteryLevel != nil {
		setParts = append(setParts, fmt.Sprintf("battery_level = $%d", argIndex))
		args = append(args, *updates.BatteryLevel)
		argIndex++
	}
	
	if updates.FuelLevel != nil {
		setParts = append(setParts, fmt.Sprintf("fuel_level = $%d", argIndex))
		args = append(args, *updates.FuelLevel)
		argIndex++
	}
	
	if updates.Mileage != nil {
		setParts = append(setParts, fmt.Sprintf("mileage = $%d", argIndex))
		args = append(args, *updates.Mileage)
		argIndex++
	}
	
	if updates.Features != nil {
		featuresJSON, err := json.Marshal(updates.Features)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal features: %w", err)
		}
		setParts = append(setParts, fmt.Sprintf("features = $%d", argIndex))
		args = append(args, featuresJSON)
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
		UPDATE vehicles SET %s WHERE id = $%d
		RETURNING id, make, model, year, license_plate, vin, color, status,
				  latitude, longitude, address, battery_level, fuel_level,
				  mileage, features, created_at, updated_at
	`, strings.Join(setParts, ", "), argIndex)

	vehicle := &domain.Vehicle{}
	var featuresJSON []byte
	
	err := r.db.QueryRowContext(ctx, query, args...).Scan(
		&vehicle.ID, &vehicle.Make, &vehicle.Model, &vehicle.Year, &vehicle.LicensePlate,
		&vehicle.VIN, &vehicle.Color, &vehicle.Status, &vehicle.Location.Latitude,
		&vehicle.Location.Longitude, &vehicle.Location.Address, &vehicle.BatteryLevel,
		&vehicle.FuelLevel, &vehicle.Mileage, &featuresJSON, &vehicle.CreatedAt, &vehicle.UpdatedAt,
	)
	
	if err != nil {
		return nil, err
	}
	
	if err := json.Unmarshal(featuresJSON, &vehicle.Features); err != nil {
		return nil, fmt.Errorf("failed to unmarshal features: %w", err)
	}

	return vehicle, nil
}

func (r *postgresVehicleRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM vehicles WHERE id = $1`
	_, err := r.db.ExecContext(ctx, query, id)
	return err
}

func (r *postgresVehicleRepository) List(ctx context.Context, filter *domain.VehicleFilter) ([]*domain.Vehicle, error) {
	whereConditions := []string{}
	args := []interface{}{}
	argIndex := 1

	if filter.Status != nil {
		whereConditions = append(whereConditions, fmt.Sprintf("status = $%d", argIndex))
		args = append(args, *filter.Status)
		argIndex++
	}
	
	if filter.Make != nil {
		whereConditions = append(whereConditions, fmt.Sprintf("make ILIKE $%d", argIndex))
		args = append(args, "%"+*filter.Make+"%")
		argIndex++
	}
	
	if filter.Model != nil {
		whereConditions = append(whereConditions, fmt.Sprintf("model ILIKE $%d", argIndex))
		args = append(args, "%"+*filter.Model+"%")
		argIndex++
	}
	
	if filter.Year != nil {
		whereConditions = append(whereConditions, fmt.Sprintf("year = $%d", argIndex))
		args = append(args, *filter.Year)
		argIndex++
	}
	
	if filter.MinYear != nil {
		whereConditions = append(whereConditions, fmt.Sprintf("year >= $%d", argIndex))
		args = append(args, *filter.MinYear)
		argIndex++
	}
	
	if filter.MaxYear != nil {
		whereConditions = append(whereConditions, fmt.Sprintf("year <= $%d", argIndex))
		args = append(args, *filter.MaxYear)
		argIndex++
	}

	query := `
		SELECT id, make, model, year, license_plate, vin, color, status,
			   latitude, longitude, address, battery_level, fuel_level,
			   mileage, features, created_at, updated_at
		FROM vehicles
	`
	
	if len(whereConditions) > 0 {
		query += " WHERE " + strings.Join(whereConditions, " AND ")
	}
	
	query += fmt.Sprintf(" ORDER BY created_at DESC LIMIT $%d OFFSET $%d", argIndex, argIndex+1)
	args = append(args, filter.Limit, filter.Offset)
	
	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	vehicles := []*domain.Vehicle{}
	for rows.Next() {
		vehicle := &domain.Vehicle{}
		var featuresJSON []byte
		
		err := rows.Scan(
			&vehicle.ID, &vehicle.Make, &vehicle.Model, &vehicle.Year, &vehicle.LicensePlate,
			&vehicle.VIN, &vehicle.Color, &vehicle.Status, &vehicle.Location.Latitude,
			&vehicle.Location.Longitude, &vehicle.Location.Address, &vehicle.BatteryLevel,
			&vehicle.FuelLevel, &vehicle.Mileage, &featuresJSON, &vehicle.CreatedAt, &vehicle.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		
		if err := json.Unmarshal(featuresJSON, &vehicle.Features); err != nil {
			return nil, fmt.Errorf("failed to unmarshal features: %w", err)
		}
		
		vehicles = append(vehicles, vehicle)
	}

	return vehicles, nil
}

func (r *postgresVehicleRepository) Count(ctx context.Context, filter *domain.VehicleFilter) (int64, error) {
	whereConditions := []string{}
	args := []interface{}{}
	argIndex := 1

	if filter.Status != nil {
		whereConditions = append(whereConditions, fmt.Sprintf("status = $%d", argIndex))
		args = append(args, *filter.Status)
		argIndex++
	}
	
	if filter.Make != nil {
		whereConditions = append(whereConditions, fmt.Sprintf("make ILIKE $%d", argIndex))
		args = append(args, "%"+*filter.Make+"%")
		argIndex++
	}
	
	if filter.Model != nil {
		whereConditions = append(whereConditions, fmt.Sprintf("model ILIKE $%d", argIndex))
		args = append(args, "%"+*filter.Model+"%")
		argIndex++
	}
	
	if filter.Year != nil {
		whereConditions = append(whereConditions, fmt.Sprintf("year = $%d", argIndex))
		args = append(args, *filter.Year)
		argIndex++
	}

	query := "SELECT COUNT(*) FROM vehicles"
	
	if len(whereConditions) > 0 {
		query += " WHERE " + strings.Join(whereConditions, " AND ")
	}
	
	var count int64
	err := r.db.QueryRowContext(ctx, query, args...).Scan(&count)
	return count, err
}

func (r *postgresVehicleRepository) UpdateLocation(ctx context.Context, id string, location *domain.Location) error {
	query := `
		UPDATE vehicles 
		SET latitude = $1, longitude = $2, address = $3, updated_at = $4 
		WHERE id = $5
	`
	
	_, err := r.db.ExecContext(ctx, query, 
		location.Latitude, location.Longitude, location.Address, time.Now(), id)
	
	return err
}

func (r *postgresVehicleRepository) UpdateStatus(ctx context.Context, id string, status domain.VehicleStatus) error {
	query := `UPDATE vehicles SET status = $1, updated_at = $2 WHERE id = $3`
	_, err := r.db.ExecContext(ctx, query, status, time.Now(), id)
	return err
}

func (r *postgresVehicleRepository) GetAvailableVehicles(ctx context.Context, filter *domain.AvailabilityFilter) ([]*domain.Vehicle, error) {
	whereConditions := []string{"status = 'available'"}
	args := []interface{}{}
	argIndex := 1

	if filter.MinBattery != nil {
		whereConditions = append(whereConditions, fmt.Sprintf("battery_level >= $%d", argIndex))
		args = append(args, *filter.MinBattery)
		argIndex++
	}

	// Add location-based filtering if needed
	if filter.Location != nil && filter.Radius != nil {
		// Using Haversine formula for distance calculation
		whereConditions = append(whereConditions, fmt.Sprintf(`
			(6371 * acos(cos(radians($%d)) * cos(radians(latitude)) * 
			cos(radians(longitude) - radians($%d)) + sin(radians($%d)) * 
			sin(radians(latitude)))) <= $%d`, argIndex, argIndex+1, argIndex, argIndex+2))
		args = append(args, filter.Location.Latitude, filter.Location.Longitude, filter.Location.Latitude, *filter.Radius)
		argIndex += 3
	}

	query := `
		SELECT id, make, model, year, license_plate, vin, color, status,
			   latitude, longitude, address, battery_level, fuel_level,
			   mileage, features, created_at, updated_at
		FROM vehicles
		WHERE ` + strings.Join(whereConditions, " AND ") +
		fmt.Sprintf(" ORDER BY created_at DESC LIMIT $%d OFFSET $%d", argIndex, argIndex+1)
	
	args = append(args, filter.Limit, filter.Offset)
	
	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	vehicles := []*domain.Vehicle{}
	for rows.Next() {
		vehicle := &domain.Vehicle{}
		var featuresJSON []byte
		
		err := rows.Scan(
			&vehicle.ID, &vehicle.Make, &vehicle.Model, &vehicle.Year, &vehicle.LicensePlate,
			&vehicle.VIN, &vehicle.Color, &vehicle.Status, &vehicle.Location.Latitude,
			&vehicle.Location.Longitude, &vehicle.Location.Address, &vehicle.BatteryLevel,
			&vehicle.FuelLevel, &vehicle.Mileage, &featuresJSON, &vehicle.CreatedAt, &vehicle.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		
		if err := json.Unmarshal(featuresJSON, &vehicle.Features); err != nil {
			return nil, fmt.Errorf("failed to unmarshal features: %w", err)
		}
		
		vehicles = append(vehicles, vehicle)
	}

	return vehicles, nil
}

func (r *postgresVehicleRepository) GetStats(ctx context.Context) (*domain.VehicleStats, error) {
	stats := &domain.VehicleStats{}
	
	// Get total vehicles count
	err := r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM vehicles").Scan(&stats.TotalVehicles)
	if err != nil {
		return nil, fmt.Errorf("failed to get total vehicles: %w", err)
	}
	
	// Get available vehicles count
	err = r.db.QueryRowContext(ctx, 
		"SELECT COUNT(*) FROM vehicles WHERE status = 'available'").Scan(&stats.AvailableVehicles)
	if err != nil {
		return nil, fmt.Errorf("failed to get available vehicles: %w", err)
	}
	
	// Get in-use vehicles count (rented)
	err = r.db.QueryRowContext(ctx, 
		"SELECT COUNT(*) FROM vehicles WHERE status = 'rented'").Scan(&stats.InUseVehicles)
	if err != nil {
		return nil, fmt.Errorf("failed to get in-use vehicles: %w", err)
	}
	
	// Get maintenance vehicles count
	err = r.db.QueryRowContext(ctx, 
		"SELECT COUNT(*) FROM vehicles WHERE status = 'maintenance'").Scan(&stats.MaintenanceVehicles)
	if err != nil {
		return nil, fmt.Errorf("failed to get maintenance vehicles: %w", err)
	}
	
	return stats, nil
}
