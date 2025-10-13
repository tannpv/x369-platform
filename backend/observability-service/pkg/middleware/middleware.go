package middleware

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"observability-service/pkg/logger"
	"observability-service/pkg/telemetry"

	"go.opentelemetry.io/otel/trace"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gorilla/mux/otelmux"
)

// ObservabilityMiddleware provides comprehensive observability for HTTP requests
type ObservabilityMiddleware struct {
	logger *logger.Logger
	tracer trace.Tracer
}

// NewObservabilityMiddleware creates a new observability middleware
func NewObservabilityMiddleware(log *logger.Logger, provider *telemetry.Provider) *ObservabilityMiddleware {
	return &ObservabilityMiddleware{
		logger: log,
		tracer: provider.Tracer,
	}
}

// Middleware returns the HTTP middleware function
func (m *ObservabilityMiddleware) Middleware(next http.Handler) http.Handler {
	// Wrap with OpenTelemetry middleware first
	otlHandler := otelmux.Middleware("http-server")(next)
	
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		
		// Create response writer wrapper to capture status code
		wrapped := &responseWriter{
			ResponseWriter: w,
			statusCode:     http.StatusOK,
		}
		
		// Get client IP
		clientIP := getClientIP(r)
		
		// Process request
		otlHandler.ServeHTTP(wrapped, r)
		
		// Log request
		duration := time.Since(start)
		m.logger.LogRequest(
			r.Context(),
			r.Method,
			r.URL.Path,
			r.UserAgent(),
			clientIP,
			wrapped.statusCode,
			duration,
		)
	})
}

// TraceMiddleware adds tracing to HTTP handlers
func (m *ObservabilityMiddleware) TraceMiddleware(operationName string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx, span := m.tracer.Start(r.Context(), operationName)
			defer span.End()
			
			// Add request attributes
			telemetry.AddSpanAttributes(span, map[string]interface{}{
				"http.method":     r.Method,
				"http.url":        r.URL.String(),
				"http.user_agent": r.UserAgent(),
				"http.client_ip":  getClientIP(r),
			})
			
			// Add user ID if available from headers
			if userID := r.Header.Get("X-User-ID"); userID != "" {
				telemetry.AddSpanAttributes(span, map[string]interface{}{
					"user.id": userID,
				})
			}
			
			// Create response writer wrapper
			wrapped := &responseWriter{
				ResponseWriter: w,
				statusCode:     http.StatusOK,
			}
			
			// Process request
			next.ServeHTTP(wrapped, r.WithContext(ctx))
			
			// Add response attributes
			telemetry.AddSpanAttributes(span, map[string]interface{}{
				"http.status_code": wrapped.statusCode,
			})
			
			// Set span status based on HTTP status code
			if wrapped.statusCode >= 400 {
				span.SetStatus(trace.StatusError, http.StatusText(wrapped.statusCode))
			}
		})
	}
}

// CORSMiddleware adds CORS headers
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-User-ID, X-Request-ID, X-Trace-ID")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// RequestIDMiddleware adds a unique request ID to each request
func RequestIDMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requestID := r.Header.Get("X-Request-ID")
		if requestID == "" {
			requestID = generateRequestID()
		}
		
		// Add to response headers
		w.Header().Set("X-Request-ID", requestID)
		
		// Add to context for logging
		ctx := r.Context()
		// You could add request ID to context here if needed
		
		next.ServeHTTP(w, r.WithContext(ctx))
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

func (rw *responseWriter) Write(b []byte) (int, error) {
	return rw.ResponseWriter.Write(b)
}

// getClientIP extracts the client IP address from the request
func getClientIP(r *http.Request) string {
	// Check X-Forwarded-For header
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		// Take the first IP if multiple are present
		if idx := strings.Index(xff, ","); idx != -1 {
			return strings.TrimSpace(xff[:idx])
		}
		return strings.TrimSpace(xff)
	}
	
	// Check X-Real-IP header
	if xri := r.Header.Get("X-Real-IP"); xri != "" {
		return strings.TrimSpace(xri)
	}
	
	// Fall back to remote address
	if idx := strings.LastIndex(r.RemoteAddr, ":"); idx != -1 {
		return r.RemoteAddr[:idx]
	}
	
	return r.RemoteAddr
}

// generateRequestID generates a unique request ID
func generateRequestID() string {
	// Simple implementation - in production you might want to use UUID
	return fmt.Sprintf("req_%d", time.Now().UnixNano())
}
