package domain

import (
	"time"
)

// LogEntry represents a structured log entry
type LogEntry struct {
	ID          string                 `json:"id" db:"id"`
	ServiceName string                 `json:"service_name" db:"service_name"`
	Level       LogLevel               `json:"level" db:"level"`
	Message     string                 `json:"message" db:"message"`
	TraceID     string                 `json:"trace_id" db:"trace_id"`
	SpanID      string                 `json:"span_id" db:"span_id"`
	UserID      *string                `json:"user_id,omitempty" db:"user_id"`
	RequestID   *string                `json:"request_id,omitempty" db:"request_id"`
	Fields      map[string]interface{} `json:"fields,omitempty" db:"fields"`
	Timestamp   time.Time              `json:"timestamp" db:"timestamp"`
	Source      string                 `json:"source" db:"source"`
	Function    *string                `json:"function,omitempty" db:"function"`
	Line        *int                   `json:"line,omitempty" db:"line"`
}

// LogLevel represents the severity level of a log entry
type LogLevel string

const (
	LevelTrace LogLevel = "trace"
	LevelDebug LogLevel = "debug"
	LevelInfo  LogLevel = "info"
	LevelWarn  LogLevel = "warn"
	LevelError LogLevel = "error"
	LevelFatal LogLevel = "fatal"
	LevelPanic LogLevel = "panic"
)

// TraceSpan represents a distributed trace span
type TraceSpan struct {
	ID            string                 `json:"id" db:"id"`
	TraceID       string                 `json:"trace_id" db:"trace_id"`
	ParentSpanID  *string                `json:"parent_span_id,omitempty" db:"parent_span_id"`
	ServiceName   string                 `json:"service_name" db:"service_name"`
	OperationName string                 `json:"operation_name" db:"operation_name"`
	StartTime     time.Time              `json:"start_time" db:"start_time"`
	EndTime       *time.Time             `json:"end_time,omitempty" db:"end_time"`
	Duration      *int64                 `json:"duration,omitempty" db:"duration"` // microseconds
	Status        SpanStatus             `json:"status" db:"status"`
	Tags          map[string]interface{} `json:"tags,omitempty" db:"tags"`
	Logs          []SpanLog              `json:"logs,omitempty" db:"logs"`
}

// SpanStatus represents the status of a trace span
type SpanStatus string

const (
	StatusOK     SpanStatus = "ok"
	StatusError  SpanStatus = "error"
	StatusCancel SpanStatus = "cancelled"
)

// SpanLog represents a log entry within a trace span
type SpanLog struct {
	Timestamp time.Time              `json:"timestamp"`
	Fields    map[string]interface{} `json:"fields"`
}

// Metric represents a custom metric
type Metric struct {
	ID          string            `json:"id" db:"id"`
	ServiceName string            `json:"service_name" db:"service_name"`
	Name        string            `json:"name" db:"name"`
	Type        MetricType        `json:"type" db:"type"`
	Value       float64           `json:"value" db:"value"`
	Labels      map[string]string `json:"labels,omitempty" db:"labels"`
	Timestamp   time.Time         `json:"timestamp" db:"timestamp"`
	Description *string           `json:"description,omitempty" db:"description"`
}

// MetricType represents the type of metric
type MetricType string

const (
	MetricCounter   MetricType = "counter"
	MetricGauge     MetricType = "gauge"
	MetricHistogram MetricType = "histogram"
	MetricSummary   MetricType = "summary"
)

// CreateLogRequest represents a request to create a log entry
type CreateLogRequest struct {
	ServiceName string                 `json:"service_name" validate:"required"`
	Level       LogLevel               `json:"level" validate:"required"`
	Message     string                 `json:"message" validate:"required"`
	TraceID     string                 `json:"trace_id,omitempty"`
	SpanID      string                 `json:"span_id,omitempty"`
	UserID      *string                `json:"user_id,omitempty"`
	RequestID   *string                `json:"request_id,omitempty"`
	Fields      map[string]interface{} `json:"fields,omitempty"`
	Source      string                 `json:"source,omitempty"`
	Function    *string                `json:"function,omitempty"`
	Line        *int                   `json:"line,omitempty"`
}

// CreateTraceRequest represents a request to create a trace span
type CreateTraceRequest struct {
	TraceID       string                 `json:"trace_id" validate:"required"`
	ParentSpanID  *string                `json:"parent_span_id,omitempty"`
	ServiceName   string                 `json:"service_name" validate:"required"`
	OperationName string                 `json:"operation_name" validate:"required"`
	Tags          map[string]interface{} `json:"tags,omitempty"`
}

// LogFilter represents filters for log queries
type LogFilter struct {
	ServiceName *string    `json:"service_name,omitempty"`
	Level       *LogLevel  `json:"level,omitempty"`
	TraceID     *string    `json:"trace_id,omitempty"`
	UserID      *string    `json:"user_id,omitempty"`
	StartTime   *time.Time `json:"start_time,omitempty"`
	EndTime     *time.Time `json:"end_time,omitempty"`
	Message     *string    `json:"message,omitempty"` // for text search
	Limit       int        `json:"limit"`
	Offset      int        `json:"offset"`
}

// TraceFilter represents filters for trace queries
type TraceFilter struct {
	TraceID       *string     `json:"trace_id,omitempty"`
	ServiceName   *string     `json:"service_name,omitempty"`
	OperationName *string     `json:"operation_name,omitempty"`
	Status        *SpanStatus `json:"status,omitempty"`
	StartTime     *time.Time  `json:"start_time,omitempty"`
	EndTime       *time.Time  `json:"end_time,omitempty"`
	MinDuration   *int64      `json:"min_duration,omitempty"` // microseconds
	MaxDuration   *int64      `json:"max_duration,omitempty"` // microseconds
	Limit         int         `json:"limit"`
	Offset        int         `json:"offset"`
}

// ObservabilityStats represents observability statistics
type ObservabilityStats struct {
	TotalLogs       int64              `json:"total_logs"`
	TotalTraces     int64              `json:"total_traces"`
	TotalSpans      int64              `json:"total_spans"`
	LogsByLevel     map[LogLevel]int64 `json:"logs_by_level"`
	LogsByService   map[string]int64   `json:"logs_by_service"`
	TracesByService map[string]int64   `json:"traces_by_service"`
	ErrorRate       float64            `json:"error_rate"`
	AvgResponseTime float64            `json:"avg_response_time"`
}
