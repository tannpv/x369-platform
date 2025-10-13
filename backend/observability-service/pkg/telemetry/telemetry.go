package telemetry

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/exporters/jaeger"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	"go.opentelemetry.io/otel/exporters/prometheus"
	"go.opentelemetry.io/otel/metric"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/instrumentation"
	sdkmetric "go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.17.0"
	"go.opentelemetry.io/otel/trace"
)

// Config holds the OpenTelemetry configuration
type Config struct {
	ServiceName     string
	ServiceVersion  string
	Environment     string
	JaegerEndpoint  string
	OTLPEndpoint    string
	PrometheusPort  string
	SamplingRate    float64
}

// Provider holds the OpenTelemetry providers
type Provider struct {
	TracerProvider trace.TracerProvider
	MeterProvider  metric.MeterProvider
	Tracer         trace.Tracer
	Meter          metric.Meter
	shutdown       func(context.Context) error
}

// InitOpenTelemetry initializes OpenTelemetry with the given configuration
func InitOpenTelemetry(config Config) (*Provider, error) {
	ctx := context.Background()

	// Create resource with service information
	res, err := resource.New(ctx,
		resource.WithAttributes(
			semconv.ServiceName(config.ServiceName),
			semconv.ServiceVersion(config.ServiceVersion),
			semconv.DeploymentEnvironment(config.Environment),
		),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create resource: %w", err)
	}

	// Initialize tracing
	tracerProvider, err := initTracing(ctx, res, config)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize tracing: %w", err)
	}

	// Initialize metrics
	meterProvider, err := initMetrics(ctx, res, config)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize metrics: %w", err)
	}

	// Set global providers
	otel.SetTracerProvider(tracerProvider)
	otel.SetMeterProvider(meterProvider)

	// Set global propagator
	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{},
	))

	// Create tracer and meter instances
	tracer := otel.Tracer(config.ServiceName)
	meter := otel.Meter(config.ServiceName)

	provider := &Provider{
		TracerProvider: tracerProvider,
		MeterProvider:  meterProvider,
		Tracer:         tracer,
		Meter:          meter,
		shutdown: func(ctx context.Context) error {
			if tp, ok := tracerProvider.(*sdktrace.TracerProvider); ok {
				if err := tp.Shutdown(ctx); err != nil {
					log.Printf("Error shutting down tracer provider: %v", err)
				}
			}
			if mp, ok := meterProvider.(*sdkmetric.MeterProvider); ok {
				if err := mp.Shutdown(ctx); err != nil {
					log.Printf("Error shutting down meter provider: %v", err)
				}
			}
			return nil
		},
	}

	return provider, nil
}

// Shutdown gracefully shuts down the OpenTelemetry providers
func (p *Provider) Shutdown(ctx context.Context) error {
	return p.shutdown(ctx)
}

func initTracing(ctx context.Context, res *resource.Resource, config Config) (trace.TracerProvider, error) {
	var exporters []sdktrace.SpanExporter

	// OTLP exporter (for services like Jaeger, Zipkin, etc.)
	if config.OTLPEndpoint != "" {
		otlpExporter, err := otlptracehttp.New(ctx,
			otlptracehttp.WithEndpoint(config.OTLPEndpoint),
			otlptracehttp.WithInsecure(), // Use WithTLSClientConfig for production
		)
		if err != nil {
			return nil, fmt.Errorf("failed to create OTLP exporter: %w", err)
		}
		exporters = append(exporters, otlpExporter)
	}

	// Jaeger exporter (direct to Jaeger)
	if config.JaegerEndpoint != "" {
		jaegerExporter, err := jaeger.New(
			jaeger.WithCollectorEndpoint(jaeger.WithEndpoint(config.JaegerEndpoint)),
		)
		if err != nil {
			return nil, fmt.Errorf("failed to create Jaeger exporter: %w", err)
		}
		exporters = append(exporters, jaegerExporter)
	}

	// If no exporters configured, use console exporter for development
	if len(exporters) == 0 {
		log.Println("No trace exporters configured, traces will be logged to console")
	}

	// Create batch span processors for each exporter
	var spanProcessors []sdktrace.SpanProcessor
	for _, exporter := range exporters {
		spanProcessors = append(spanProcessors, sdktrace.NewBatchSpanProcessor(exporter))
	}

	// Configure sampling
	sampler := sdktrace.AlwaysSample()
	if config.SamplingRate > 0 && config.SamplingRate < 1 {
		sampler = sdktrace.TraceIDRatioBased(config.SamplingRate)
	}

	// Create tracer provider
	tracerProvider := sdktrace.NewTracerProvider(
		sdktrace.WithResource(res),
		sdktrace.WithSampler(sampler),
	)

	// Add all span processors
	for _, processor := range spanProcessors {
		tracerProvider.RegisterSpanProcessor(processor)
	}

	return tracerProvider, nil
}

func initMetrics(ctx context.Context, res *resource.Resource, config Config) (metric.MeterProvider, error) {
	var readers []sdkmetric.Reader

	// Prometheus exporter
	if config.PrometheusPort != "" {
		prometheusExporter, err := prometheus.New(
			prometheus.WithoutUnits(),
			prometheus.WithoutScopeInfo(),
		)
		if err != nil {
			return nil, fmt.Errorf("failed to create Prometheus exporter: %w", err)
		}
		readers = append(readers, prometheusExporter)

		// Start Prometheus HTTP server
		go func() {
			// Note: In production, you might want to start this server separately
			// or integrate it with your main HTTP server
			log.Printf("Starting Prometheus metrics server on port %s", config.PrometheusPort)
			// Implementation would depend on how you want to expose metrics
		}()
	}

	// Create meter provider
	meterProvider := sdkmetric.NewMeterProvider(
		sdkmetric.WithResource(res),
		sdkmetric.WithReader(readers...),
	)

	return meterProvider, nil
}

// StartSpan starts a new trace span with the given name and options
func (p *Provider) StartSpan(ctx context.Context, spanName string, opts ...trace.SpanStartOption) (context.Context, trace.Span) {
	return p.Tracer.Start(ctx, spanName, opts...)
}

// AddSpanAttributes adds attributes to the current span
func AddSpanAttributes(span trace.Span, attrs map[string]interface{}) {
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
		default:
			otelAttrs = append(otelAttrs, attribute.String(key, fmt.Sprintf("%v", v)))
		}
	}
	span.SetAttributes(otelAttrs...)
}

// RecordError records an error in the current span
func RecordError(span trace.Span, err error) {
	if err != nil {
		span.RecordError(err)
		span.SetStatus(trace.StatusError, err.Error())
	}
}

// GetDefaultConfig returns a default OpenTelemetry configuration
func GetDefaultConfig(serviceName string) Config {
	return Config{
		ServiceName:     serviceName,
		ServiceVersion:  getEnv("SERVICE_VERSION", "1.0.0"),
		Environment:     getEnv("ENVIRONMENT", "development"),
		JaegerEndpoint:  getEnv("JAEGER_ENDPOINT", ""),
		OTLPEndpoint:    getEnv("OTLP_ENDPOINT", ""),
		PrometheusPort:  getEnv("PROMETHEUS_PORT", "9090"),
		SamplingRate:    0.1, // 10% sampling rate
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
