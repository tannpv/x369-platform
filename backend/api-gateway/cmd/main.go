package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"

	"github.com/gorilla/mux"
)

type ServiceConfig struct {
	UserServiceURL         string
	VehicleServiceURL      string
	BookingServiceURL      string
	NotificationServiceURL string
}

func main() {
	config := ServiceConfig{
		UserServiceURL:         getEnv("USER_SERVICE_URL", "http://localhost:8001"),
		VehicleServiceURL:      getEnv("VEHICLE_SERVICE_URL", "http://localhost:8002"),
		BookingServiceURL:      getEnv("BOOKING_SERVICE_URL", "http://localhost:8003"),
		NotificationServiceURL: getEnv("NOTIFICATION_SERVICE_URL", "http://localhost:8004"),
	}

	router := mux.NewRouter()

	// Add CORS middleware
	router.Use(corsMiddleware)

	// Health check
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status": "healthy", "service": "api-gateway"}`))
	}).Methods("GET")

	// API routes with service proxying
	api := router.PathPrefix("/api").Subrouter()

	// User service routes
	setupServiceProxy(api, "/users", config.UserServiceURL)
	setupServiceProxy(api, "/auth", config.UserServiceURL)

	// Stats routes - these need special handling to avoid conflicts
	setupStatsServiceProxy(api, "/v1/users/stats", config.UserServiceURL, "/stats/users")
	setupStatsServiceProxy(api, "/v1/vehicles/stats", config.VehicleServiceURL, "/vehicles/stats")
	setupStatsServiceProxy(api, "/v1/bookings/stats", config.BookingServiceURL, "/api/v1/bookings/stats")

	// Vehicle service routes
	setupServiceProxy(api, "/vehicles", config.VehicleServiceURL)

	// Booking service routes
	setupServiceProxy(api, "/bookings", config.BookingServiceURL)

	// Notification service routes
	setupServiceProxy(api, "/notifications", config.NotificationServiceURL)

	// Start server
	port := getEnv("PORT", "8000")
	log.Printf("API Gateway starting on port %s", port)
	log.Printf("Proxying to services:")
	log.Printf("  Users: %s", config.UserServiceURL)
	log.Printf("  Vehicles: %s", config.VehicleServiceURL)
	log.Printf("  Bookings: %s", config.BookingServiceURL)
	log.Printf("  Notifications: %s", config.NotificationServiceURL)

	log.Fatal(http.ListenAndServe(":"+port, router))
}

func setupServiceProxy(router *mux.Router, path, serviceURL string) {
	targetURL, err := url.Parse(serviceURL)
	if err != nil {
		log.Fatalf("Invalid service URL %s: %v", serviceURL, err)
	}

	proxy := httputil.NewSingleHostReverseProxy(targetURL)

	// Modify request to remove /api prefix before forwarding
	originalDirector := proxy.Director
	proxy.Director = func(req *http.Request) {
		originalDirector(req)
		req.URL.Path = strings.TrimPrefix(req.URL.Path, "/api")
		req.Host = targetURL.Host
	}

	router.PathPrefix(path).Handler(proxy)
}

func setupStatsServiceProxy(router *mux.Router, apiPath, serviceURL, servicePath string) {
	targetURL, err := url.Parse(serviceURL)
	if err != nil {
		log.Fatalf("Invalid service URL %s: %v", serviceURL, err)
	}

	proxy := httputil.NewSingleHostReverseProxy(targetURL)

	// Modify request to route to specific service path
	originalDirector := proxy.Director
	proxy.Director = func(req *http.Request) {
		originalDirector(req)
		req.URL.Path = servicePath
		req.Host = targetURL.Host
	}

	router.HandleFunc(apiPath, proxy.ServeHTTP).Methods("GET")
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow all origins for development
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
