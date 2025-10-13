.PHONY: help build run test clean docker-build docker-up docker-down

# Default target
help:
	@echo "Available commands:"
	@echo "  build       - Build all services"
	@echo "  run         - Run services locally"
	@echo "  test        - Run tests"
	@echo "  clean       - Clean build artifacts"
	@echo "  docker-build - Build Docker images"
	@echo "  docker-up   - Start all services with Docker Compose"
	@echo "  docker-down - Stop all services"
	@echo "  migrate     - Run database migrations"

# Build all services
build:
	@echo "Building User Service..."
	cd user-service && go build -o ../bin/user-service ./cmd/main.go
	@echo "Building Vehicle Service..."
	cd vehicle-service && go build -o ../bin/vehicle-service ./cmd/main.go || echo "Vehicle service not fully implemented yet"
	@echo "Build complete!"

# Run services locally (requires PostgreSQL and Redis running)
run-user:
	@echo "Starting User Service..."
	cd user-service && go run ./cmd/main.go

# Run tests
test:
	@echo "Running tests..."
	cd user-service && go test ./internal/...
	@echo "Tests complete!"

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf bin/
	cd user-service && go clean
	cd vehicle-service && go clean || true
	@echo "Clean complete!"

# Build Docker images
docker-build:
	@echo "Building Docker images..."
	docker-compose build
	@echo "Docker build complete!"

# Start all services
docker-up:
	@echo "Starting all services..."
	docker-compose up -d
	@echo "Services started! Check health:"
	@echo "  User Service: http://localhost:8081/health"
	@echo "  API Gateway: http://localhost:8080/health"

# Stop all services
docker-down:
	@echo "Stopping all services..."
	docker-compose down
	@echo "Services stopped!"

# Show service logs
logs:
	docker-compose logs -f

# Show service status
status:
	docker-compose ps

# Initialize databases
init-db:
	@echo "Initializing databases..."
	docker-compose exec postgres psql -U postgres -f /docker-entrypoint-initdb.d/init-db.sql
	@echo "Database initialization complete!"

# Development setup
dev-setup:
	@echo "Setting up development environment..."
	@echo "Installing Go dependencies..."
	cd user-service && go mod tidy
	cd vehicle-service && go mod tidy || true
	@echo "Development setup complete!"
