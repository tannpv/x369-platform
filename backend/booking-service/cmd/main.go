package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"booking-service/internal/delivery/http/handlers"
	"booking-service/internal/domain"
	"booking-service/internal/repository"
	"booking-service/internal/usecase"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func main() {
	// Database connection
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://booking_user:booking_pass@localhost:5432/booking_db?sslmode=disable"
	}

	db, err := sqlx.Connect("postgres", dbURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Test database connection
	if err := db.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	// Initialize repositories
	bookingRepo := repository.NewPostgresBookingRepository(db)

	// Initialize services (mock implementations)
	vehicleService := &mockVehicleService{}
	userService := &mockUserService{}

	// Initialize use cases
	bookingUseCase := usecase.NewBookingUseCase(bookingRepo, vehicleService, userService)

	// Initialize handlers
	bookingHandler := handlers.NewBookingHandler(bookingUseCase)

	// Setup routes
	router := mux.NewRouter()
	api := router.PathPrefix("/api/v1").Subrouter()
	
	// Add CORS middleware
	router.Use(corsMiddleware)
	
	bookingHandler.RegisterRoutes(api)

	// Health check
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET")

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8003"
	}

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	// Graceful shutdown
	go func() {
		log.Printf("Booking service starting on port %s", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Failed to start server:", err)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exited")
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-User-ID")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// Mock implementations for development - replace with actual service calls in production

type mockVehicleService struct{}

func (m *mockVehicleService) GetVehicle(ctx context.Context, vehicleID string) (*domain.Vehicle, error) {
	// Mock implementation
	return &domain.Vehicle{
		ID:           vehicleID,
		Make:         "Tesla",
		Model:        "Model 3",
		Year:         2023,
		LicensePlate: "ABC123",
		Status:       "available",
		Latitude:     40.7128,
		Longitude:    -74.0060,
	}, nil
}

func (m *mockVehicleService) UpdateVehicleStatus(ctx context.Context, vehicleID string, status string) error {
	// Mock implementation
	log.Printf("Updating vehicle %s status to %s", vehicleID, status)
	return nil
}

func (m *mockVehicleService) IsVehicleAvailable(ctx context.Context, vehicleID string, startTime time.Time) (bool, error) {
	// Mock implementation - always return true for now
	return true, nil
}

type mockUserService struct{}

func (m *mockUserService) GetUser(ctx context.Context, userID string) (*domain.User, error) {
	// Mock implementation
	return &domain.User{
		ID:        userID,
		Email:     "user@example.com",
		FirstName: "John",
		LastName:  "Doe",
		Phone:     "+1234567890",
		Status:    "active",
	}, nil
}

func (m *mockUserService) ValidateUser(ctx context.Context, userID string) error {
	// Mock implementation - always return nil for now
	return nil
}
