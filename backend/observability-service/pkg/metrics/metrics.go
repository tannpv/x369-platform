package metrics

import (
	"context"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/metric"
)

// MetricsCollector provides application metrics collection
type MetricsCollector struct {
	meter               metric.Meter
	httpRequestCount    metric.Int64Counter
	httpRequestDuration metric.Float64Histogram
	httpRequestSize     metric.Int64Histogram
	httpResponseSize    metric.Int64Histogram
	dbQueryCount        metric.Int64Counter
	dbQueryDuration     metric.Float64Histogram
	dbConnectionsActive metric.Int64UpDownCounter
	businessMetrics     map[string]metric.Int64Counter
}

// NewMetricsCollector creates a new metrics collector
func NewMetricsCollector(serviceName string) (*MetricsCollector, error) {
	meter := otel.Meter(serviceName)

	// HTTP metrics
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

	// Database metrics
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

	return &MetricsCollector{
		meter:               meter,
		httpRequestCount:    httpRequestCount,
		httpRequestDuration: httpRequestDuration,
		httpRequestSize:     httpRequestSize,
		httpResponseSize:    httpResponseSize,
		dbQueryCount:        dbQueryCount,
		dbQueryDuration:     dbQueryDuration,
		dbConnectionsActive: dbConnectionsActive,
		businessMetrics:     make(map[string]metric.Int64Counter),
	}, nil
}

// RecordHTTPRequest records HTTP request metrics
func (mc *MetricsCollector) RecordHTTPRequest(ctx context.Context, method, endpoint string, statusCode int, duration time.Duration, requestSize, responseSize int64) {
	labels := metric.WithAttributes(
		attribute.String("method", method),
		attribute.String("endpoint", endpoint),
		attribute.String("status_code", string(rune(statusCode))),
	)

	mc.httpRequestCount.Add(ctx, 1, labels)
	mc.httpRequestDuration.Record(ctx, duration.Seconds(), labels)

	if requestSize > 0 {
		mc.httpRequestSize.Record(ctx, requestSize, labels)
	}
	if responseSize > 0 {
		mc.httpResponseSize.Record(ctx, responseSize, labels)
	}
}

// RecordDBQuery records database query metrics
func (mc *MetricsCollector) RecordDBQuery(ctx context.Context, operation string, duration time.Duration, err error) {
	status := "success"
	if err != nil {
		status = "error"
	}

	labels := metric.WithAttributes(
		attribute.String("operation", operation),
		attribute.String("status", status),
	)

	mc.dbQueryCount.Add(ctx, 1, labels)
	mc.dbQueryDuration.Record(ctx, duration.Seconds(), labels)
}

// RecordDBConnection records database connection metrics
func (mc *MetricsCollector) RecordDBConnection(ctx context.Context, delta int64) {
	mc.dbConnectionsActive.Add(ctx, delta)
}

// IncrementBusinessMetric increments a business-specific metric
func (mc *MetricsCollector) IncrementBusinessMetric(ctx context.Context, name, description string, labels ...attribute.KeyValue) error {
	counter, exists := mc.businessMetrics[name]
	if !exists {
		var err error
		counter, err = mc.meter.Int64Counter(
			name,
			metric.WithDescription(description),
		)
		if err != nil {
			return err
		}
		mc.businessMetrics[name] = counter
	}

	counter.Add(ctx, 1, metric.WithAttributes(labels...))
	return nil
}

// BusinessMetrics contains service-specific business metrics
type BusinessMetrics struct {
	collector *MetricsCollector
}

// NewBusinessMetrics creates business metrics for a service
func NewBusinessMetrics(collector *MetricsCollector) *BusinessMetrics {
	return &BusinessMetrics{
		collector: collector,
	}
}

// User Service Metrics
func (bm *BusinessMetrics) IncrementUserRegistration(ctx context.Context) error {
	return bm.collector.IncrementBusinessMetric(ctx, "users_registered_total", "Total number of user registrations")
}

func (bm *BusinessMetrics) IncrementUserLogin(ctx context.Context, success bool) error {
	status := "success"
	if !success {
		status = "failure"
	}
	return bm.collector.IncrementBusinessMetric(ctx, "user_logins_total", "Total number of user login attempts",
		attribute.String("status", status))
}

// Vehicle Service Metrics
func (bm *BusinessMetrics) IncrementVehicleCreated(ctx context.Context) error {
	return bm.collector.IncrementBusinessMetric(ctx, "vehicles_created_total", "Total number of vehicles created")
}

func (bm *BusinessMetrics) IncrementVehicleStatusChange(ctx context.Context, fromStatus, toStatus string) error {
	return bm.collector.IncrementBusinessMetric(ctx, "vehicle_status_changes_total", "Total number of vehicle status changes",
		attribute.String("from_status", fromStatus),
		attribute.String("to_status", toStatus))
}

// Booking Service Metrics
func (bm *BusinessMetrics) IncrementBookingCreated(ctx context.Context) error {
	return bm.collector.IncrementBusinessMetric(ctx, "bookings_created_total", "Total number of bookings created")
}

func (bm *BusinessMetrics) IncrementBookingStatusChange(ctx context.Context, fromStatus, toStatus string) error {
	return bm.collector.IncrementBusinessMetric(ctx, "booking_status_changes_total", "Total number of booking status changes",
		attribute.String("from_status", fromStatus),
		attribute.String("to_status", toStatus))
}

func (bm *BusinessMetrics) RecordBookingRevenue(ctx context.Context, amount float64) error {
	counter, exists := bm.collector.businessMetrics["booking_revenue_total"]
	if !exists {
		var err error
		counter, err = bm.collector.meter.Int64Counter(
			"booking_revenue_total",
			metric.WithDescription("Total booking revenue"),
		)
		if err != nil {
			return err
		}
		bm.collector.businessMetrics["booking_revenue_total"] = counter
	}

	// Convert to cents to avoid floating point issues
	counter.Add(ctx, int64(amount*100), metric.WithAttributes(
		attribute.String("currency", "USD"),
	))
	return nil
}

// Notification Service Metrics
func (bm *BusinessMetrics) IncrementNotificationSent(ctx context.Context, notificationType, channel string, success bool) error {
	status := "success"
	if !success {
		status = "failure"
	}
	return bm.collector.IncrementBusinessMetric(ctx, "notifications_sent_total", "Total number of notifications sent",
		attribute.String("type", notificationType),
		attribute.String("channel", channel),
		attribute.String("status", status))
}
