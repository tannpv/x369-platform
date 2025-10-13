package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"observability-service/internal/delivery/http/handlers"
	"observability-service/internal/repository"
	"observability-service/internal/usecase"
	"observability-service/pkg/logger"
	"observability-service/pkg/middleware"
	"observability-service/pkg/telemetry"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func main() {
	serviceName := "observability-service"
	
	// Initialize logger
	logConfig := logger.GetDefaultConfig(serviceName)
	appLogger := logger.New(logConfig)
	
	// Initialize OpenTelemetry
	telemetryConfig := telemetry.GetDefaultConfig(serviceName)
	provider, err := telemetry.InitOpenTelemetry(telemetryConfig)
	if err != nil {
		log.Fatalf("Failed to initialize OpenTelemetry: %v", err)
	}
	defer func() {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := provider.Shutdown(ctx); err != nil {
			appLogger.ErrorWithContext(ctx, "Failed to shutdown OpenTelemetry")
		}
	}()

	// Database connection
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://observability_user:observability_pass@localhost:5432/observability_db?sslmode=disable"
	}

	db, err := sqlx.Connect("postgres", dbURL)
	if err != nil {
		appLogger.WithError(err).Fatal("Failed to connect to database")
	}
	defer db.Close()

	// Test database connection
	if err := db.Ping(); err != nil {
		appLogger.WithError(err).Fatal("Failed to ping database")
	}

	appLogger.Info("Connected to database successfully")

	// Initialize repositories
	logRepo := repository.NewPostgresLogRepository(db)
	traceRepo := repository.NewPostgresTraceRepository(db)
	metricRepo := repository.NewPostgresMetricRepository(db)

	// Initialize use cases
	observabilityUseCase := usecase.NewObservabilityUseCase(logRepo, traceRepo, metricRepo)

	// Initialize handlers
	observabilityHandler := handlers.NewObservabilityHandler(observabilityUseCase, appLogger)

	// Initialize middleware
	obsMiddleware := middleware.NewObservabilityMiddleware(appLogger, provider)

	// Setup routes
	router := mux.NewRouter()
	
	// Add middleware
	router.Use(middleware.CORSMiddleware)
	router.Use(middleware.RequestIDMiddleware)
	router.Use(obsMiddleware.Middleware)

	// API routes
	api := router.PathPrefix("/api/v1").Subrouter()
	observabilityHandler.RegisterRoutes(api)

	// Health check
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET")

	// Metrics endpoint for Prometheus
	router.HandleFunc("/metrics", func(w http.ResponseWriter, r *http.Request) {
		// This would serve Prometheus metrics
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("# Metrics endpoint - integrate with Prometheus exporter"))
	}).Methods("GET")

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8005"
	}

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	// Start background cleanup job
	go func() {
		ticker := time.NewTicker(24 * time.Hour) // Cleanup daily
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
				retentionDays := 30 // Keep data for 30 days
				if err := observabilityUseCase.CleanupOldData(ctx, retentionDays); err != nil {
					appLogger.WithError(err).Error("Failed to cleanup old data")
				} else {
					appLogger.Info("Successfully cleaned up old observability data")
				}
				cancel()
			}
		}
	}()

	// Graceful shutdown
	go func() {
		appLogger.WithFields(map[string]interface{}{
			"port": port,
		}).Info("Observability service starting")
		
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			appLogger.WithError(err).Fatal("Failed to start server")
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	appLogger.Info("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		appLogger.WithError(err).Fatal("Server forced to shutdown")
	}

	appLogger.Info("Server exited")
}
