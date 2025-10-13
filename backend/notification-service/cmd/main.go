package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"notification-service/internal/delivery/http/handlers"
	"notification-service/internal/domain"
	"notification-service/internal/repository"
	"notification-service/internal/usecase"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func main() {
	log.Println("Starting notification service...")

	// Database connection
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://notification_user:notification_pass@localhost:5432/notification_db?sslmode=disable"
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
	notificationRepo := repository.NewPostgresNotificationRepository(db)

	// Initialize services (mock implementations)
	notificationSender := &mockNotificationSender{}
	userService := &mockUserService{}

	// Initialize use cases
	notificationUseCase := usecase.NewNotificationUseCase(notificationRepo, notificationSender, userService)

	// Initialize handlers
	notificationHandler := handlers.NewNotificationHandler(notificationUseCase)

	// Setup routes
	router := mux.NewRouter()
	api := router.PathPrefix("/api/v1").Subrouter()
	
	// Add CORS middleware
	router.Use(corsMiddleware)
	
	notificationHandler.RegisterRoutes(api)

	// Health check
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET")

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8004"
	}

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	// Start background job for sending pending notifications
	go func() {
		ticker := time.NewTicker(30 * time.Second) // Send pending notifications every 30 seconds
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
				err := notificationUseCase.SendPendingNotifications(ctx)
				if err != nil {
					log.Printf("Error sending pending notifications: %v", err)
				}
				cancel()
			}
		}
	}()

	// Graceful shutdown
	go func() {
		log.Printf("Notification service starting on port %s", port)
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

type mockNotificationSender struct{}

func (m *mockNotificationSender) SendEmail(ctx context.Context, to, subject, body string) error {
	log.Printf("Sending email to %s: %s - %s", to, subject, body)
	return nil
}

func (m *mockNotificationSender) SendSMS(ctx context.Context, to, message string) error {
	log.Printf("Sending SMS to %s: %s", to, message)
	return nil
}

func (m *mockNotificationSender) SendPush(ctx context.Context, userID, title, message string, data map[string]interface{}) error {
	log.Printf("Sending push notification to user %s: %s - %s (data: %+v)", userID, title, message, data)
	return nil
}

type mockUserService struct{}

func (m *mockUserService) GetUser(ctx context.Context, userID string) (*domain.User, error) {
	return &domain.User{
		ID:        userID,
		Email:     "user@example.com",
		FirstName: "John",
		LastName:  "Doe",
		Phone:     "+1234567890",
		Status:    "active",
	}, nil
}

func (m *mockUserService) GetUserPreferences(ctx context.Context, userID string) (*domain.UserPreferences, error) {
	return &domain.UserPreferences{
		UserID:       userID,
		EmailEnabled: true,
		SMSEnabled:   true,
		PushEnabled:  true,
	}, nil
}
