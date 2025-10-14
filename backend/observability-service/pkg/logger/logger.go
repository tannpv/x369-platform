package logger

import (
	"context"
	"fmt"
	"os"
	"runtime"
	"strings"
	"time"

	"github.com/sirupsen/logrus"
	"go.opentelemetry.io/otel/trace"
)

// Logger is a structured logger with OpenTelemetry integration
type Logger struct {
	*logrus.Logger
	serviceName string
	fields      logrus.Fields
}

// Config holds the logger configuration
type Config struct {
	Level       string `json:"level"`  // debug, info, warn, error
	Format      string `json:"format"` // json, text
	ServiceName string `json:"service_name"`
	Environment string `json:"environment"`
	Output      string `json:"output"` // stdout, file
	FilePath    string `json:"file_path"`
}

// New creates a new structured logger
func New(config Config) *Logger {
	log := logrus.New()

	// Set log level
	level, err := logrus.ParseLevel(config.Level)
	if err != nil {
		level = logrus.InfoLevel
	}
	log.SetLevel(level)

	// Set formatter
	if config.Format == "json" {
		log.SetFormatter(&logrus.JSONFormatter{
			TimestampFormat: time.RFC3339,
			FieldMap: logrus.FieldMap{
				logrus.FieldKeyTime:  "timestamp",
				logrus.FieldKeyLevel: "level",
				logrus.FieldKeyMsg:   "message",
				logrus.FieldKeyFunc:  "function",
				logrus.FieldKeyFile:  "source",
			},
		})
	} else {
		log.SetFormatter(&logrus.TextFormatter{
			FullTimestamp:   true,
			TimestampFormat: time.RFC3339,
		})
	}

	// Set output
	if config.Output == "file" && config.FilePath != "" {
		file, err := os.OpenFile(config.FilePath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
		if err != nil {
			log.Warnf("Failed to open log file %s, using stdout: %v", config.FilePath, err)
		} else {
			log.SetOutput(file)
		}
	} else {
		log.SetOutput(os.Stdout)
	}

	return &Logger{
		Logger:      log,
		serviceName: config.ServiceName,
		fields: logrus.Fields{
			"service": config.ServiceName,
			"env":     config.Environment,
		},
	}
}

// WithContext adds trace information from context if available
func (l *Logger) WithContext(ctx context.Context) *logrus.Entry {
	entry := l.Logger.WithFields(l.fields)

	// Add trace information if available
	if span := trace.SpanFromContext(ctx); span != nil {
		spanContext := span.SpanContext()
		if spanContext.IsValid() {
			entry = entry.WithFields(logrus.Fields{
				"trace_id": spanContext.TraceID().String(),
				"span_id":  spanContext.SpanID().String(),
			})
		}
	}

	// Add caller information
	if pc, file, line, ok := runtime.Caller(2); ok {
		funcName := runtime.FuncForPC(pc).Name()
		// Get just the function name without package path
		if idx := strings.LastIndex(funcName, "/"); idx != -1 {
			funcName = funcName[idx+1:]
		}
		if idx := strings.LastIndex(funcName, "."); idx != -1 {
			funcName = funcName[idx+1:]
		}

		// Get just the filename without full path
		if idx := strings.LastIndex(file, "/"); idx != -1 {
			file = file[idx+1:]
		}

		entry = entry.WithFields(logrus.Fields{
			"function": funcName,
			"source":   fmt.Sprintf("%s:%d", file, line),
		})
	}

	return entry
}

// WithFields adds custom fields to the log entry
func (l *Logger) WithFields(fields map[string]interface{}) *logrus.Entry {
	logrusFields := make(logrus.Fields)
	for k, v := range l.fields {
		logrusFields[k] = v
	}
	for k, v := range fields {
		logrusFields[k] = v
	}
	return l.Logger.WithFields(logrusFields)
}

// WithUserID adds user ID to the log entry
func (l *Logger) WithUserID(userID string) *logrus.Entry {
	return l.Logger.WithFields(l.fields).WithField("user_id", userID)
}

// WithRequestID adds request ID to the log entry
func (l *Logger) WithRequestID(requestID string) *logrus.Entry {
	return l.Logger.WithFields(l.fields).WithField("request_id", requestID)
}

// WithError adds error information to the log entry
func (l *Logger) WithError(err error) *logrus.Entry {
	return l.Logger.WithFields(l.fields).WithError(err)
}

// InfoWithContext logs an info message with context
func (l *Logger) InfoWithContext(ctx context.Context, msg string) {
	l.WithContext(ctx).Info(msg)
}

// WarnWithContext logs a warning message with context
func (l *Logger) WarnWithContext(ctx context.Context, msg string) {
	l.WithContext(ctx).Warn(msg)
}

// ErrorWithContext logs an error message with context
func (l *Logger) ErrorWithContext(ctx context.Context, msg string) {
	l.WithContext(ctx).Error(msg)
}

// DebugWithContext logs a debug message with context
func (l *Logger) DebugWithContext(ctx context.Context, msg string) {
	l.WithContext(ctx).Debug(msg)
}

// TraceWithContext logs a trace message with context
func (l *Logger) TraceWithContext(ctx context.Context, msg string) {
	l.WithContext(ctx).Trace(msg)
}

// LogRequest logs HTTP request information
func (l *Logger) LogRequest(ctx context.Context, method, path, userAgent, clientIP string, statusCode int, duration time.Duration) {
	l.WithContext(ctx).WithFields(logrus.Fields{
		"method":      method,
		"path":        path,
		"user_agent":  userAgent,
		"client_ip":   clientIP,
		"status_code": statusCode,
		"duration_ms": duration.Milliseconds(),
		"type":        "http_request",
	}).Info("HTTP request processed")
}

// LogDatabaseQuery logs database query information
func (l *Logger) LogDatabaseQuery(ctx context.Context, query string, duration time.Duration, err error) {
	entry := l.WithContext(ctx).WithFields(logrus.Fields{
		"query":       query,
		"duration_ms": duration.Milliseconds(),
		"type":        "database_query",
	})

	if err != nil {
		entry.WithError(err).Error("Database query failed")
	} else {
		entry.Debug("Database query executed")
	}
}

// LogServiceCall logs inter-service communication
func (l *Logger) LogServiceCall(ctx context.Context, serviceName, method, endpoint string, duration time.Duration, statusCode int, err error) {
	entry := l.WithContext(ctx).WithFields(logrus.Fields{
		"target_service": serviceName,
		"method":         method,
		"endpoint":       endpoint,
		"duration_ms":    duration.Milliseconds(),
		"status_code":    statusCode,
		"type":           "service_call",
	})

	if err != nil {
		entry.WithError(err).Error("Service call failed")
	} else {
		entry.Info("Service call completed")
	}
}

// LogBusinessEvent logs important business events
func (l *Logger) LogBusinessEvent(ctx context.Context, eventType string, entityID string, details map[string]interface{}) {
	fields := logrus.Fields{
		"event_type": eventType,
		"entity_id":  entityID,
		"type":       "business_event",
	}

	for k, v := range details {
		fields[k] = v
	}

	l.WithContext(ctx).WithFields(fields).Info("Business event occurred")
}

// GetDefaultConfig returns a default logger configuration
func GetDefaultConfig(serviceName string) Config {
	return Config{
		Level:       getEnv("LOG_LEVEL", "info"),
		Format:      getEnv("LOG_FORMAT", "json"),
		ServiceName: serviceName,
		Environment: getEnv("ENVIRONMENT", "development"),
		Output:      getEnv("LOG_OUTPUT", "stdout"),
		FilePath:    getEnv("LOG_FILE_PATH", ""),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
