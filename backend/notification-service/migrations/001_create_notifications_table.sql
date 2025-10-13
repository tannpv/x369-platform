-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    priority VARCHAR(20) NOT NULL DEFAULT 'normal',
    data JSONB,
    read_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Add constraints
ALTER TABLE notifications 
ADD CONSTRAINT chk_notification_status 
CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed'));

ALTER TABLE notifications 
ADD CONSTRAINT chk_notification_priority 
CHECK (priority IN ('low', 'normal', 'high', 'urgent'));

ALTER TABLE notifications 
ADD CONSTRAINT chk_notification_type 
CHECK (type IN ('booking_created', 'booking_confirmed', 'booking_started', 'booking_completed', 'booking_cancelled', 'vehicle_assigned', 'payment_processed', 'system_alert', 'promotion'));

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create notification templates table
CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'normal',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add constraint for template priority
ALTER TABLE notification_templates 
ADD CONSTRAINT chk_template_priority 
CHECK (priority IN ('low', 'normal', 'high', 'urgent'));

-- Add trigger for templates updated_at
CREATE TRIGGER update_notification_templates_updated_at 
    BEFORE UPDATE ON notification_templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default notification templates
INSERT INTO notification_templates (type, title, message, priority) VALUES
('booking_created', 'Booking Created', 'Your booking has been created successfully.', 'normal'),
('booking_confirmed', 'Booking Confirmed', 'Your booking has been confirmed.', 'normal'),
('booking_started', 'Trip Started', 'Your trip has started. Enjoy your ride!', 'high'),
('booking_completed', 'Trip Completed', 'Your trip has been completed successfully.', 'normal'),
('booking_cancelled', 'Booking Cancelled', 'Your booking has been cancelled.', 'normal'),
('vehicle_assigned', 'Vehicle Assigned', 'A vehicle has been assigned to your booking.', 'normal'),
('payment_processed', 'Payment Processed', 'Your payment has been processed successfully.', 'normal'),
('system_alert', 'System Alert', 'Important system notification.', 'high')
ON CONFLICT (type) DO NOTHING;
