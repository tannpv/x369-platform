-- Create observability database schema

-- Create logs table
CREATE TABLE IF NOT EXISTS logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name VARCHAR(100) NOT NULL,
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    trace_id VARCHAR(32),
    span_id VARCHAR(16),
    user_id UUID,
    request_id VARCHAR(50),
    fields JSONB,
    source VARCHAR(200),
    function VARCHAR(100),
    line INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for logs
CREATE INDEX IF NOT EXISTS idx_logs_service_name ON logs(service_name);
CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_trace_id ON logs(trace_id);
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_logs_fields ON logs USING GIN(fields);

-- Add constraint for log levels
ALTER TABLE logs 
ADD CONSTRAINT chk_log_level 
CHECK (level IN ('trace', 'debug', 'info', 'warn', 'error', 'fatal', 'panic'));

-- Create traces table
CREATE TABLE IF NOT EXISTS traces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trace_id VARCHAR(32) NOT NULL,
    parent_span_id VARCHAR(16),
    service_name VARCHAR(100) NOT NULL,
    operation_name VARCHAR(200) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration BIGINT, -- microseconds
    status VARCHAR(20) NOT NULL DEFAULT 'ok',
    tags JSONB,
    logs JSONB
);

-- Create indexes for traces
CREATE INDEX IF NOT EXISTS idx_traces_trace_id ON traces(trace_id);
CREATE INDEX IF NOT EXISTS idx_traces_service_name ON traces(service_name);
CREATE INDEX IF NOT EXISTS idx_traces_operation_name ON traces(operation_name);
CREATE INDEX IF NOT EXISTS idx_traces_start_time ON traces(start_time);
CREATE INDEX IF NOT EXISTS idx_traces_duration ON traces(duration);
CREATE INDEX IF NOT EXISTS idx_traces_status ON traces(status);
CREATE INDEX IF NOT EXISTS idx_traces_tags ON traces USING GIN(tags);

-- Add constraint for trace status
ALTER TABLE traces 
ADD CONSTRAINT chk_trace_status 
CHECK (status IN ('ok', 'error', 'cancelled'));

-- Create metrics table
CREATE TABLE IF NOT EXISTS metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    labels JSONB,
    description TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for metrics
CREATE INDEX IF NOT EXISTS idx_metrics_service_name ON metrics(service_name);
CREATE INDEX IF NOT EXISTS idx_metrics_name ON metrics(name);
CREATE INDEX IF NOT EXISTS idx_metrics_type ON metrics(type);
CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_metrics_labels ON metrics USING GIN(labels);

-- Add constraint for metric types
ALTER TABLE metrics 
ADD CONSTRAINT chk_metric_type 
CHECK (type IN ('counter', 'gauge', 'histogram', 'summary'));

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    condition TEXT NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    threshold DOUBLE PRECISION NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for alerts
CREATE INDEX IF NOT EXISTS idx_alerts_service_name ON alerts(service_name);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);

-- Add constraints for alerts
ALTER TABLE alerts 
ADD CONSTRAINT chk_alert_type 
CHECK (type IN ('error_rate', 'response_time', 'request_count', 'service_down', 'custom_metric'));

ALTER TABLE alerts 
ADD CONSTRAINT chk_alert_severity 
CHECK (severity IN ('low', 'medium', 'high', 'critical'));

ALTER TABLE alerts 
ADD CONSTRAINT chk_alert_status 
CHECK (status IN ('active', 'resolved', 'muted'));

-- Create service_health table for tracking service health
CREATE TABLE IF NOT EXISTS service_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'healthy',
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    error_rate DOUBLE PRECISION DEFAULT 0.0,
    avg_response_time DOUBLE PRECISION DEFAULT 0.0,
    request_count BIGINT DEFAULT 0,
    error_count BIGINT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for service health
CREATE INDEX IF NOT EXISTS idx_service_health_status ON service_health(status);
CREATE INDEX IF NOT EXISTS idx_service_health_last_seen ON service_health(last_seen);

-- Add constraint for service health status
ALTER TABLE service_health 
ADD CONSTRAINT chk_service_health_status 
CHECK (status IN ('healthy', 'degraded', 'unhealthy'));

-- Create triggers to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_alerts_updated_at 
    BEFORE UPDATE ON alerts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_health_updated_at 
    BEFORE UPDATE ON service_health 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create materialized view for service statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS service_stats AS
SELECT 
    service_name,
    COUNT(*) as total_logs,
    COUNT(CASE WHEN level = 'error' THEN 1 END) as error_logs,
    COUNT(CASE WHEN level = 'warn' THEN 1 END) as warn_logs,
    COUNT(CASE WHEN level = 'info' THEN 1 END) as info_logs,
    MIN(timestamp) as first_log,
    MAX(timestamp) as last_log,
    EXTRACT(EPOCH FROM (MAX(timestamp) - MIN(timestamp))) as time_span_seconds
FROM logs 
WHERE timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY service_name;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_service_stats_service_name ON service_stats(service_name);

-- Create function to refresh service stats (should be called periodically)
CREATE OR REPLACE FUNCTION refresh_service_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY service_stats;
END;
$$ LANGUAGE plpgsql;

-- Create function to cleanup old data
CREATE OR REPLACE FUNCTION cleanup_old_observability_data(retention_days INTEGER DEFAULT 30)
RETURNS TABLE(
    deleted_logs BIGINT,
    deleted_traces BIGINT,
    deleted_metrics BIGINT,
    deleted_alerts BIGINT
) AS $$
DECLARE
    cutoff_date TIMESTAMP WITH TIME ZONE;
    logs_deleted BIGINT;
    traces_deleted BIGINT;
    metrics_deleted BIGINT;
    alerts_deleted BIGINT;
BEGIN
    cutoff_date := NOW() - (retention_days || ' days')::INTERVAL;
    
    -- Delete old logs
    DELETE FROM logs WHERE timestamp < cutoff_date;
    GET DIAGNOSTICS logs_deleted = ROW_COUNT;
    
    -- Delete old traces
    DELETE FROM traces WHERE start_time < cutoff_date;
    GET DIAGNOSTICS traces_deleted = ROW_COUNT;
    
    -- Delete old metrics
    DELETE FROM metrics WHERE timestamp < cutoff_date;
    GET DIAGNOSTICS metrics_deleted = ROW_COUNT;
    
    -- Delete old resolved alerts
    DELETE FROM alerts WHERE status = 'resolved' AND resolved_at < cutoff_date;
    GET DIAGNOSTICS alerts_deleted = ROW_COUNT;
    
    RETURN QUERY SELECT logs_deleted, traces_deleted, metrics_deleted, alerts_deleted;
END;
$$ LANGUAGE plpgsql;
