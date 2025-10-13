package middleware

import (
	"context"
	"strconv"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/metric"
	"go.opentelemetry.io/otel/trace"
)

// Middleware provides observability middleware for HTTP handlers
type Middleware struct {
	tracer            trace.Tracer
	meter             metric.Meter
	httpRequestCount  metric.Int64Counter
	httpRequestDuration metric.Float64Histogram
	httpRequestSize   metric.Int64Histogram
	httpResponseSize  metric.Int64Histogram
}

// NewMiddleware creates a new observability middleware
func NewMiddleware(serviceName string) (*Middleware, error) {
	tracer := otel.Tracer(serviceName)
	meter := otel.Meter(serviceName)

	// Create metrics
	httpRequestCount, err := meter.Int64Counter(
		"http_requests_total",
		metric.WithDescription("Total number of HTTP requests"),
	)
	if err != nil {
		return nil, err
	}

	httpRequestDuration, err := meter.Float64Histogram(
		"http_request_duration_seconds",
		metric.WithDescription("HTTP request duration in seconds"),
		metric.WithUnit("s"),
	)
	if err != nil {
		return nil, err
	}

	httpRequestSize, err := meter.Int64Histogram(
		"http_request_size_bytes",
		metric.WithDescription("HTTP request size in bytes"),
		metric.WithUnit("By"),
	)
	if err != nil {
		return nil, err
	}

	httpResponseSize, err := meter.Int64Histogram(
		"http_response_size_bytes",
		metric.WithDescription("HTTP response size in bytes"),
		metric.WithUnit("By"),
	)
	if err != nil {
		return nil, err
	}

	return &Middleware{
		tracer:              tracer,
		meter:               meter,
		httpRequestCount:    httpRequestCount,
		httpRequestDuration: httpRequestDuration,
		httpRequestSize:     httpRequestSize,
		httpResponseSize:    httpResponseSize,
	}, nil
}

// Handler returns an HTTP middleware that adds tracing and metrics
func (m *Middleware) Handler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Start tracing span
		ctx, span := m.tracer.Start(r.Context(), r.Method+" "+r.URL.Path,
			trace.WithAttributes(
				attribute.String("http.method", r.Method),
				attribute.String("http.url", r.URL.String()),
				attribute.String("http.scheme", r.URL.Scheme),
				attribute.String("http.host", r.Host),
				attribute.String("http.user_agent", r.UserAgent()),
				attribute.String("http.remote_addr", r.RemoteAddr),
			),
		)
		defer span.End()

		// Create response writer wrapper to capture status and size
		wrapper := &responseWriter{
			ResponseWriter: w,
			statusCode:     200,
		}

		// Serve the request
		next.ServeHTTP(wrapper, r.WithContext(ctx))

		// Record metrics and span attributes
		duration := time.Since(start)
		statusCode := wrapper.statusCode
		responseSize := wrapper.bytesWritten

		// Add span attributes
		span.SetAttributes(
			attribute.Int("http.status_code", statusCode),
			attribute.Int64("http.response_size", responseSize),
			attribute.Float64("http.duration", duration.Seconds()),
		)

		// Set span status based on HTTP status code
		if statusCode >= 400 {
			span.SetStatus(trace.StatusError, http.StatusText(statusCode))
		}

		// Record metrics
		labels := metric.WithAttributes(
			attribute.String("method", r.Method),
			attribute.String("endpoint", r.URL.Path),
			attribute.String("status_code", strconv.Itoa(statusCode)),
		)

		m.httpRequestCount.Add(ctx, 1, labels)
		m.httpRequestDuration.Record(ctx, duration.Seconds(), labels)
		m.httpResponseSize.Record(ctx, responseSize, labels)

		if r.ContentLength > 0 {
			m.httpRequestSize.Record(ctx, r.ContentLength, labels)
		}
	})
}

// responseWriter wraps http.ResponseWriter to capture status code and response size
type responseWriter struct {
	http.ResponseWriter
	statusCode    int
	bytesWritten  int64
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

func (rw *responseWriter) Write(b []byte) (int, error) {
	n, err := rw.ResponseWriter.Write(b)
	rw.bytesWritten += int64(n)
	return n, err
}

// DatabaseMiddleware provides observability for database operations
type DatabaseMiddleware struct {
	tracer               trace.Tracer
	meter                metric.Meter
	dbQueryCount         metric.Int64Counter
	dbQueryDuration      metric.Float64Histogram
	dbConnectionsActive  metric.Int64UpDownCounter
}

// NewDatabaseMiddleware creates a new database observability middleware
func NewDatabaseMiddleware(serviceName string) (*DatabaseMiddleware, error) {
	tracer := otel.Tracer(serviceName + ".db")
	meter := otel.Meter(serviceName + ".db")

	dbQueryCount, err := meter.Int64Counter(
		"db_queries_total",
		metric.WithDescription("Total number of database queries"),
	)
	if err != nil {
		return nil, err
	}

	dbQueryDuration, err := meter.Float64Histogram(
		"db_query_duration_seconds",
		metric.WithDescription("Database query duration in seconds"),
		metric.WithUnit("s"),
	)
	if err != nil {
		return nil, err
	}

	dbConnectionsActive, err := meter.Int64UpDownCounter(
		"db_connections_active",
		metric.WithDescription("Number of active database connections"),
	)
	if err != nil {
		return nil, err
	}

	return &DatabaseMiddleware{
		tracer:              tracer,
		meter:               meter,
		dbQueryCount:        dbQueryCount,
		dbQueryDuration:     dbQueryDuration,
		dbConnectionsActive: dbConnectionsActive,
	}, nil
}

// WrapQuery wraps a database query with tracing and metrics
func (dm *DatabaseMiddleware) WrapQuery(ctx context.Context, operation, query string, args ...interface{}) (context.Context, func(error)) {
	start := time.Now()
	
	ctx, span := dm.tracer.Start(ctx, operation,
		trace.WithAttributes(
			attribute.String("db.system", "postgresql"),
			attribute.String("db.operation", operation),
			attribute.String("db.statement", query),
		),
	)

	return ctx, func(err error) {
		duration := time.Since(start)
		
		// Add span attributes
		span.SetAttributes(
			attribute.Float64("db.duration", duration.Seconds()),
		)

		if err != nil {
			span.RecordError(err)
			span.SetStatus(trace.StatusError, err.Error())
		}
		
		span.End()

		// Record metrics
		status := "success"
		if err != nil {
			status = "error"
		}

		labels := metric.WithAttributes(
			attribute.String("operation", operation),
			attribute.String("status", status),
		)

		dm.dbQueryCount.Add(ctx, 1, labels)
		dm.dbQueryDuration.Record(ctx, duration.Seconds(), labels)
	}
}
