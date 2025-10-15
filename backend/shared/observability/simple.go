package observability

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"
)

// SimpleObservability provides basic observability without complex dependencies
type SimpleObservability struct {
	ServiceName string
	Environment string
}

// NewSimpleObservability creates a basic observability instance
func NewSimpleObservability(serviceName, environment string) *SimpleObservability {
	return &SimpleObservability{
		ServiceName: serviceName,
		Environment: environment,
	}
}

// LogRequest logs HTTP request details
func (so *SimpleObservability) LogRequest(method, path, clientIP string, statusCode int, duration time.Duration) {
	log.Printf("[%s] %s %s %s - %d (%v)",
		so.ServiceName, method, path, clientIP, statusCode, duration)
}

// LogOperation logs business operation details
func (so *SimpleObservability) LogOperation(ctx context.Context, operation string, duration time.Duration, err error) {
	status := "SUCCESS"
	if err != nil {
		status = "ERROR"
	}

	log.Printf("[%s] Operation: %s - %s (%v) %v",
		so.ServiceName, operation, status, duration, func() string {
			if err != nil {
				return fmt.Sprintf("Error: %v", err)
			}
			return ""
		}())
}

// LogDatabaseQuery logs database query details
func (so *SimpleObservability) LogDatabaseQuery(operation string, duration time.Duration, err error) {
	status := "SUCCESS"
	if err != nil {
		status = "ERROR"
	}

	log.Printf("[%s] DB %s - %s (%v) %v",
		so.ServiceName, operation, status, duration, func() string {
			if err != nil {
				return fmt.Sprintf("Error: %v", err)
			}
			return ""
		}())
}

// Middleware returns a simple HTTP middleware for logging
func (so *SimpleObservability) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Create response writer wrapper
		wrapper := &responseWriter{
			ResponseWriter: w,
			statusCode:     200,
		}

		// Get client IP
		clientIP := r.RemoteAddr
		if forwarded := r.Header.Get("X-Forwarded-For"); forwarded != "" {
			clientIP = forwarded
		}

		// Serve request
		next.ServeHTTP(wrapper, r)

		// Log request
		duration := time.Since(start)
		so.LogRequest(r.Method, r.URL.Path, clientIP, wrapper.statusCode, duration)
	})
}

// responseWriter wraps http.ResponseWriter to capture status code
type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

// TimedOperation wraps an operation with timing and logging
func (so *SimpleObservability) TimedOperation(ctx context.Context, operationName string, fn func() error) error {
	start := time.Now()
	err := fn()
	duration := time.Since(start)

	so.LogOperation(ctx, operationName, duration, err)
	return err
}

// TimedDatabaseOperation wraps a database operation with timing and logging
func (so *SimpleObservability) TimedDatabaseOperation(operationName string, fn func() error) error {
	start := time.Now()
	err := fn()
	duration := time.Since(start)

	so.LogDatabaseQuery(operationName, duration, err)
	return err
}

// HealthCheck provides a basic health check endpoint
func (so *SimpleObservability) HealthCheck() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, `{"status":"ok","service":"%s","timestamp":"%s"}`,
			so.ServiceName, time.Now().UTC().Format(time.RFC3339))
	}
}

// MetricsCollector provides simple metrics collection
type MetricsCollector struct {
	RequestCount   int64
	ErrorCount     int64
	TotalDuration  time.Duration
	DatabaseCalls  int64
	DatabaseErrors int64
}

var globalMetrics = &MetricsCollector{}

// IncrementRequestCount increments the request counter
func (so *SimpleObservability) IncrementRequestCount() {
	globalMetrics.RequestCount++
}

// IncrementErrorCount increments the error counter
func (so *SimpleObservability) IncrementErrorCount() {
	globalMetrics.ErrorCount++
}

// AddRequestDuration adds to the total request duration
func (so *SimpleObservability) AddRequestDuration(duration time.Duration) {
	globalMetrics.TotalDuration += duration
}

// IncrementDatabaseCall increments database call counter
func (so *SimpleObservability) IncrementDatabaseCall() {
	globalMetrics.DatabaseCalls++
}

// IncrementDatabaseError increments database error counter
func (so *SimpleObservability) IncrementDatabaseError() {
	globalMetrics.DatabaseErrors++
}

// GetMetrics returns current metrics
func (so *SimpleObservability) GetMetrics() *MetricsCollector {
	return globalMetrics
}

// MetricsHandler provides a metrics endpoint
func (so *SimpleObservability) MetricsHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		metrics := so.GetMetrics()
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		avgDuration := float64(0)
		if metrics.RequestCount > 0 {
			avgDuration = float64(metrics.TotalDuration.Nanoseconds()) / float64(metrics.RequestCount) / 1000000 // ms
		}

		fmt.Fprintf(w, `{
			"service": "%s",
			"requests_total": %d,
			"errors_total": %d,
			"avg_duration_ms": %.2f,
			"database_calls_total": %d,
			"database_errors_total": %d,
			"timestamp": "%s"
		}`, so.ServiceName, metrics.RequestCount, metrics.ErrorCount, avgDuration,
			metrics.DatabaseCalls, metrics.DatabaseErrors, time.Now().UTC().Format(time.RFC3339))
	}
}
