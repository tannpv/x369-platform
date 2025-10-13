package integration

import (
	"context"
	"net/http"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/trace"
	"go.opentelemetry.io/contrib/instrumentation/github.com/gorilla/mux/otelmux"
	"go.opentelemetry.io/contrib/instrumentation/database/sql/otelsql"
	"github.com/jmoiron/sqlx"
)

// ServiceObservability provides observability integration for services
type ServiceObservability struct {
	serviceName string
	tracer      trace.Tracer
}

// NewServiceObservability creates a new service observability instance
func NewServiceObservability(serviceName string) *ServiceObservability {
	return &ServiceObservability{
		serviceName: serviceName,
		tracer:      otel.Tracer(serviceName),
	}
}

// HTTPMiddleware returns OpenTelemetry HTTP middleware
func (so *ServiceObservability) HTTPMiddleware() func(http.Handler) http.Handler {
	return otelmux.Middleware(so.serviceName)
}

// StartSpan starts a new trace span
func (so *ServiceObservability) StartSpan(ctx context.Context, operationName string, opts ...trace.SpanStartOption) (context.Context, trace.Span) {
	return so.tracer.Start(ctx, operationName, opts...)
}

// AddSpanEvent adds an event to the current span
func (so *ServiceObservability) AddSpanEvent(ctx context.Context, name string, attrs ...attribute.KeyValue) {
	span := trace.SpanFromContext(ctx)
	span.AddEvent(name, trace.WithAttributes(attrs...))
}

// RecordError records an error in the current span
func (so *ServiceObservability) RecordError(ctx context.Context, err error) {
	span := trace.SpanFromContext(ctx)
	if err != nil {
		span.RecordError(err)
		span.SetStatus(trace.StatusError, err.Error())
	}
}

// WrapDatabase wraps a database connection with OpenTelemetry instrumentation
func (so *ServiceObservability) WrapDatabase(driverName, dataSourceName string) (*sqlx.DB, error) {
	// Register the wrapped driver
	driverName = otelsql.Register(driverName, otelsql.WithAttributes(
		attribute.String("db.system", "postgresql"),
	))
	
	// Connect using the wrapped driver
	db, err := sqlx.Connect(driverName, dataSourceName)
	if err != nil {
		return nil, err
	}

	return db, nil
}

// LogOperationStart logs the start of an operation with tracing
func (so *ServiceObservability) LogOperationStart(ctx context.Context, operation string, attrs map[string]interface{}) (context.Context, func(error)) {
	// Convert attributes
	var otelAttrs []attribute.KeyValue
	for key, value := range attrs {
		switch v := value.(type) {
		case string:
			otelAttrs = append(otelAttrs, attribute.String(key, v))
		case int:
			otelAttrs = append(otelAttrs, attribute.Int(key, v))
		case int64:
			otelAttrs = append(otelAttrs, attribute.Int64(key, v))
		case float64:
			otelAttrs = append(otelAttrs, attribute.Float64(key, v))
		case bool:
			otelAttrs = append(otelAttrs, attribute.Bool(key, v))
		}
	}

	// Start span
	ctx, span := so.tracer.Start(ctx, operation, trace.WithAttributes(otelAttrs...))
	start := time.Now()

	return ctx, func(err error) {
		duration := time.Since(start)
		span.SetAttributes(attribute.Float64("duration_ms", float64(duration.Nanoseconds())/1000000))
		
		if err != nil {
			span.RecordError(err)
			span.SetStatus(trace.StatusError, err.Error())
		}
		
		span.End()
	}
}

// BusinessOperation wraps a business operation with observability
func (so *ServiceObservability) BusinessOperation(ctx context.Context, operationName string, fn func(context.Context) error) error {
	ctx, finish := so.LogOperationStart(ctx, operationName, map[string]interface{}{
		"operation.type": "business",
	})
	
	err := fn(ctx)
	finish(err)
	return err
}

// DatabaseOperation wraps a database operation with observability
func (so *ServiceObservability) DatabaseOperation(ctx context.Context, operation string, fn func(context.Context) error) error {
	ctx, finish := so.LogOperationStart(ctx, "db."+operation, map[string]interface{}{
		"operation.type": "database",
		"db.operation":   operation,
	})
	
	err := fn(ctx)
	finish(err)
	return err
}

// ExternalAPICall wraps an external API call with observability
func (so *ServiceObservability) ExternalAPICall(ctx context.Context, serviceName, endpoint string, fn func(context.Context) error) error {
	ctx, finish := so.LogOperationStart(ctx, "http.client."+serviceName, map[string]interface{}{
		"operation.type":    "http_client",
		"http.client.name":  serviceName,
		"http.client.endpoint": endpoint,
	})
	
	err := fn(ctx)
	finish(err)
	return err
}
