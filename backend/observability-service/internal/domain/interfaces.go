package domain

import (
	"context"
	"time"
)

// LogRepository defines the interface for log data operations
type LogRepository interface {
	Create(ctx context.Context, log *LogEntry) error
	GetByID(ctx context.Context, id string) (*LogEntry, error)
	List(ctx context.Context, filter *LogFilter) ([]*LogEntry, error)
	Count(ctx context.Context, filter *LogFilter) (int64, error)
	Search(ctx context.Context, query string, filter *LogFilter) ([]*LogEntry, error)
	DeleteOldLogs(ctx context.Context, olderThan time.Time) (int64, error)
	GetLogsByTrace(ctx context.Context, traceID string) ([]*LogEntry, error)
}

// TraceRepository defines the interface for trace data operations
type TraceRepository interface {
	CreateSpan(ctx context.Context, span *TraceSpan) error
	UpdateSpan(ctx context.Context, spanID string, endTime time.Time, status SpanStatus, tags map[string]interface{}) error
	GetSpanByID(ctx context.Context, spanID string) (*TraceSpan, error)
	GetTrace(ctx context.Context, traceID string) ([]*TraceSpan, error)
	ListTraces(ctx context.Context, filter *TraceFilter) ([]*TraceSpan, error)
	CountTraces(ctx context.Context, filter *TraceFilter) (int64, error)
	DeleteOldTraces(ctx context.Context, olderThan time.Time) (int64, error)
}

// MetricRepository defines the interface for metric data operations
type MetricRepository interface {
	Create(ctx context.Context, metric *Metric) error
	List(ctx context.Context, serviceName, metricName string, startTime, endTime time.Time) ([]*Metric, error)
	GetLatest(ctx context.Context, serviceName, metricName string) (*Metric, error)
	DeleteOldMetrics(ctx context.Context, olderThan time.Time) (int64, error)
}

// ObservabilityUseCase defines the interface for observability business logic
type ObservabilityUseCase interface {
	// Logging
	CreateLog(ctx context.Context, req *CreateLogRequest) (*LogEntry, error)
	GetLogs(ctx context.Context, filter *LogFilter) ([]*LogEntry, error)
	SearchLogs(ctx context.Context, query string, filter *LogFilter) ([]*LogEntry, error)
	GetLogsByTrace(ctx context.Context, traceID string) ([]*LogEntry, error)
	
	// Tracing
	StartTrace(ctx context.Context, req *CreateTraceRequest) (*TraceSpan, error)
	FinishSpan(ctx context.Context, spanID string, status SpanStatus, tags map[string]interface{}) error
	GetTrace(ctx context.Context, traceID string) ([]*TraceSpan, error)
	ListTraces(ctx context.Context, filter *TraceFilter) ([]*TraceSpan, error)
	
	// Metrics
	RecordMetric(ctx context.Context, serviceName, name string, metricType MetricType, value float64, labels map[string]string) error
	GetMetrics(ctx context.Context, serviceName, metricName string, startTime, endTime time.Time) ([]*Metric, error)
	
	// Analytics
	GetStats(ctx context.Context, startTime, endTime time.Time) (*ObservabilityStats, error)
	GetServiceHealth(ctx context.Context, serviceName string) (*ServiceHealth, error)
	
	// Maintenance
	CleanupOldData(ctx context.Context, retentionDays int) error
}

// ExportService defines the interface for exporting observability data
type ExportService interface {
	ExportToJaeger(ctx context.Context, spans []*TraceSpan) error
	ExportToPrometheus(ctx context.Context, metrics []*Metric) error
	ExportToElasticsearch(ctx context.Context, logs []*LogEntry) error
}

// AlertingService defines the interface for alerting based on observability data
type AlertingService interface {
	CheckAlerts(ctx context.Context) error
	CreateAlert(ctx context.Context, alert *Alert) error
	GetActiveAlerts(ctx context.Context) ([]*Alert, error)
}

// ServiceHealth represents the health status of a service
type ServiceHealth struct {
	ServiceName     string    `json:"service_name"`
	Status          string    `json:"status"` // healthy, degraded, unhealthy
	LastSeen        time.Time `json:"last_seen"`
	ErrorRate       float64   `json:"error_rate"`
	AvgResponseTime float64   `json:"avg_response_time"`
	RequestCount    int64     `json:"request_count"`
	ErrorCount      int64     `json:"error_count"`
}

// Alert represents an alert based on observability data
type Alert struct {
	ID          string                 `json:"id"`
	ServiceName string                 `json:"service_name"`
	Type        AlertType              `json:"type"`
	Severity    AlertSeverity          `json:"severity"`
	Message     string                 `json:"message"`
	Condition   string                 `json:"condition"`
	Value       float64                `json:"value"`
	Threshold   float64                `json:"threshold"`
	Status      AlertStatus            `json:"status"`
	CreatedAt   time.Time              `json:"created_at"`
	UpdatedAt   time.Time              `json:"updated_at"`
	ResolvedAt  *time.Time             `json:"resolved_at,omitempty"`
	Metadata    map[string]interface{} `json:"metadata,omitempty"`
}

// AlertType represents the type of alert
type AlertType string

const (
	AlertTypeErrorRate     AlertType = "error_rate"
	AlertTypeResponseTime  AlertType = "response_time"
	AlertTypeRequestCount  AlertType = "request_count"
	AlertTypeServiceDown   AlertType = "service_down"
	AlertTypeCustomMetric  AlertType = "custom_metric"
)

// AlertSeverity represents the severity of an alert
type AlertSeverity string

const (
	SeverityLow      AlertSeverity = "low"
	SeverityMedium   AlertSeverity = "medium"
	SeverityHigh     AlertSeverity = "high"
	SeverityCritical AlertSeverity = "critical"
)

// AlertStatus represents the status of an alert
type AlertStatus string

const (
	AlertStatusActive   AlertStatus = "active"
	AlertStatusResolved AlertStatus = "resolved"
	AlertStatusMuted    AlertStatus = "muted"
)
