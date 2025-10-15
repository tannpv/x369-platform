package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	httpHandler "vehicle-service/internal/delivery/http"
	"vehicle-service/internal/repository"
	"vehicle-service/internal/usecase"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

func main() {
	// Database connection
	dsn := getEnv("DATABASE_URL", "")
	if dsn == "" {
		dbHost := getEnv("DB_HOST", "localhost")
		dbPort := getEnv("DB_PORT", "5432")
		dbUser := getEnv("DB_USER", "postgres")
		dbPassword := getEnv("DB_PASSWORD", "password")
		dbName := getEnv("DB_NAME", "vehicle_db")

		dsn = fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
			dbHost, dbPort, dbUser, dbPassword, dbName)
	}

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Test database connection
	if err := db.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	log.Println("Connected to database successfully")

	// Initialize layers
	vehicleRepo := repository.NewPostgresVehicleRepository(db)
	vehicleUseCase := usecase.NewVehicleUseCase(vehicleRepo)
	vehicleHandler := httpHandler.NewVehicleHandler(vehicleUseCase)

	// Setup routes
	router := mux.NewRouter()
	vehicleHandler.RegisterRoutes(router)

	// CORS middleware
	router.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	})

	// Start server
	port := getEnv("PORT", "8080")
	log.Printf("Vehicle service starting on port %s", port)

	if err := http.ListenAndServe(":"+port, router); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
