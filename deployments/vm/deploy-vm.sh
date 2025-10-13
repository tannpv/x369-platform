#!/bin/bash

# VM Deployment Script for Car Rental Platform
# This script sets up the complete production environment on a Linux VM

set -e

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_USER="carrental"
APP_DIR="/opt/carrental"
SERVICE_NAME="carrental"
DOMAIN="${1:-localhost}"

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

echo "🚀 Car Rental Platform - VM Production Deployment"
echo "=================================================="
echo "Domain: $DOMAIN"
echo ""

print_step "1. System Update and Dependencies Installation"

# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y \
    curl \
    git \
    htop \
    nginx \
    ufw \
    fail2ban \
    logrotate \
    cron \
    certbot \
    python3-certbot-nginx \
    jq \
    unzip

print_status "System updated and dependencies installed"

print_step "2. Docker Installation"

# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    print_status "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    
    # Install Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    print_status "Docker and Docker Compose installed"
else
    print_status "Docker is already installed"
fi

print_step "3. Application User Setup"

# Create application user
if ! id "$APP_USER" &>/dev/null; then
    sudo useradd -r -s /bin/bash -d "$APP_DIR" "$APP_USER"
    sudo usermod -aG docker "$APP_USER"
    print_status "Application user '$APP_USER' created"
else
    print_status "Application user '$APP_USER' already exists"
fi

# Create application directory
sudo mkdir -p "$APP_DIR"
sudo chown "$APP_USER:$APP_USER" "$APP_DIR"

print_step "4. Firewall Configuration"

# Configure UFW firewall
sudo ufw --force enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow from 10.0.0.0/8 to any port 5432  # PostgreSQL (internal network only)
sudo ufw allow from 172.16.0.0/12 to any port 5432
sudo ufw allow from 192.168.0.0/16 to any port 5432

print_status "Firewall configured"

print_step "5. Fail2Ban Configuration"

# Configure fail2ban for security
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Create custom jail for nginx
sudo tee /etc/fail2ban/jail.local > /dev/null << EOF
[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
findtime = 600
bantime = 3600
EOF

sudo systemctl restart fail2ban
print_status "Fail2Ban configured"

print_step "6. Application Deployment Directory Setup"

# Create deployment structure
sudo -u "$APP_USER" mkdir -p "$APP_DIR"/{config,logs,data,backups,scripts}
sudo -u "$APP_USER" mkdir -p "$APP_DIR"/config/{nginx,ssl,monitoring}
sudo -u "$APP_USER" mkdir -p "$APP_DIR"/logs/{nginx,app,monitoring}
sudo -u "$APP_USER" mkdir -p "$APP_DIR"/data/{postgres,redis,monitoring}

print_status "Application directory structure created"

print_step "7. Nginx Configuration"

# Create nginx configuration for the app
sudo tee /etc/nginx/sites-available/carrental > /dev/null << EOF
# Car Rental Platform Nginx Configuration

# Rate limiting
limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone \$binary_remote_addr zone=login:10m rate=1r/s;

# Upstream backends
upstream api_backend {
    least_conn;
    server 127.0.0.1:8080 max_fails=3 fail_timeout=30s;
    keepalive 32;
}

# Main server block
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # API routes
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Admin panel (React app)
    location /admin/ {
        alias /var/www/carrental/admin/;
        try_files \$uri \$uri/ /admin/index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    # Security
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Logs
    access_log /var/log/nginx/carrental_access.log;
    error_log /var/log/nginx/carrental_error.log;
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/carrental /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t
sudo systemctl reload nginx

print_status "Nginx configured"

print_step "8. SSL Certificate Setup"

if [ "$DOMAIN" != "localhost" ]; then
    print_status "Setting up SSL certificate for $DOMAIN"
    sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "admin@$DOMAIN" --redirect
    
    # Setup auto-renewal
    echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
    print_status "SSL certificate configured with auto-renewal"
else
    print_warning "Skipping SSL setup for localhost"
fi

print_step "9. Systemd Service Setup"

# Create systemd service for the application
sudo tee /etc/systemd/system/${SERVICE_NAME}.service > /dev/null << EOF
[Unit]
Description=Car Rental Platform
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$APP_DIR
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
ExecReload=/usr/local/bin/docker-compose -f docker-compose.prod.yml restart
TimeoutStartSec=0
User=$APP_USER
Group=$APP_USER

[Install]
WantedBy=multi-user.target
EOF

# Enable the service
sudo systemctl daemon-reload
sudo systemctl enable ${SERVICE_NAME}.service

print_status "Systemd service configured"

print_step "10. Monitoring Setup"

# Create monitoring configuration
sudo -u "$APP_USER" tee "$APP_DIR"/config/monitoring/prometheus.yml > /dev/null << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'carrental-api'
    static_configs:
      - targets: ['api-gateway:8080']
    metrics_path: /metrics
    scrape_interval: 5s

  - job_name: 'carrental-services'
    static_configs:
      - targets: 
        - 'user-service:8080'
        - 'vehicle-service:8080'
        - 'booking-service:8080'
        - 'notification-service:8080'
    metrics_path: /metrics
    scrape_interval: 15s

  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
EOF

print_status "Monitoring configuration created"

print_step "11. Backup Script Setup"

# Create backup script
sudo -u "$APP_USER" tee "$APP_DIR"/scripts/backup.sh > /dev/null << 'EOF'
#!/bin/bash

# Backup script for Car Rental Platform
BACKUP_DIR="/opt/carrental/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup database
docker exec carrental_postgres pg_dumpall -U postgres > "$BACKUP_DIR/database_$DATE.sql"

# Backup application data
tar -czf "$BACKUP_DIR/app_data_$DATE.tar.gz" -C /opt/carrental data logs config

# Upload to S3 (if configured)
if [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$BACKUP_S3_BUCKET" ]; then
    aws s3 cp "$BACKUP_DIR/database_$DATE.sql" s3://$BACKUP_S3_BUCKET/backups/
    aws s3 cp "$BACKUP_DIR/app_data_$DATE.tar.gz" s3://$BACKUP_S3_BUCKET/backups/
fi

# Clean old backups
find "$BACKUP_DIR" -name "*.sql" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $DATE"
EOF

chmod +x "$APP_DIR"/scripts/backup.sh

# Setup cron job for daily backups
echo "0 2 * * * $APP_DIR/scripts/backup.sh >> $APP_DIR/logs/backup.log 2>&1" | sudo -u "$APP_USER" crontab -

print_status "Backup system configured"

print_step "12. Log Rotation Setup"

# Configure log rotation
sudo tee /etc/logrotate.d/carrental > /dev/null << EOF
$APP_DIR/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $APP_USER $APP_USER
    postrotate
        docker-compose -f $APP_DIR/docker-compose.prod.yml kill -s USR1 api-gateway || true
    endscript
}

/var/log/nginx/carrental_*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
EOF

print_status "Log rotation configured"

print_step "13. Final Configuration"

# Create deployment info file
sudo -u "$APP_USER" tee "$APP_DIR"/deployment-info.txt > /dev/null << EOF
Car Rental Platform - Production Deployment
==========================================

Deployment Date: $(date)
Domain: $DOMAIN
Application Directory: $APP_DIR
Application User: $APP_USER
Service Name: $SERVICE_NAME

Services:
- Nginx: Port 80, 443
- API Gateway: Port 8080 (internal)
- PostgreSQL: Port 5432 (internal)
- Redis: Port 6379 (internal)
- Prometheus: Port 9090 (internal)
- Grafana: Port 3001 (internal)

Management Commands:
- Start services: sudo systemctl start $SERVICE_NAME
- Stop services: sudo systemctl stop $SERVICE_NAME
- Restart services: sudo systemctl restart $SERVICE_NAME
- View logs: journalctl -u $SERVICE_NAME -f
- Check status: sudo systemctl status $SERVICE_NAME

Directory Structure:
$APP_DIR/
├── config/          # Configuration files
├── logs/            # Application logs
├── data/            # Persistent data
├── backups/         # Database backups
└── scripts/         # Management scripts

Security:
- Firewall: UFW enabled with restricted access
- Fail2Ban: Configured for brute force protection
- SSL: Let's Encrypt certificate (if domain provided)
- User isolation: Dedicated application user

Monitoring:
- Prometheus: http://$DOMAIN:9090 (internal)
- Grafana: http://$DOMAIN:3001 (internal)
- Nginx status: http://$DOMAIN/health

Backup:
- Daily automated backups at 2:00 AM
- Retention: 30 days
- Location: $APP_DIR/backups/
EOF

print_status "Deployment configuration completed"

echo ""
echo "🎉 VM Production Deployment Setup Complete!"
echo "============================================"
echo ""
echo "Next Steps:"
echo "1. Copy your application code to: $APP_DIR"
echo "2. Configure environment variables in: $APP_DIR/.env.prod"
echo "3. Deploy the application: sudo systemctl start $SERVICE_NAME"
echo "4. Check deployment status: sudo systemctl status $SERVICE_NAME"
echo ""
echo "Management URLs:"
echo "- Application: http://$DOMAIN"
echo "- Health Check: http://$DOMAIN/health"
echo "- Admin Panel: http://$DOMAIN/admin"
echo ""
echo "Important Files:"
echo "- Service config: /etc/systemd/system/${SERVICE_NAME}.service"
echo "- Nginx config: /etc/nginx/sites-available/carrental"
echo "- Application directory: $APP_DIR"
echo "- Deployment info: $APP_DIR/deployment-info.txt"
echo ""
echo "Security Notes:"
echo "- Change default passwords in .env.prod"
echo "- Review firewall rules: sudo ufw status"
echo "- Monitor fail2ban: sudo fail2ban-client status"
echo ""

print_status "VM deployment setup completed successfully! 🎉"
EOF
