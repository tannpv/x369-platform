#!/bin/bash

# Local Development Environment Setup Script
# This script sets up the complete local development environment

set -e

echo "🚀 Setting up Car Rental Platform - Local Development Environment"
echo "=================================================================="

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_warning "Node.js is not installed. Installing Node.js..."
    # Install Node.js via NodeSource (Ubuntu/Debian)
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

NODE_VERSION=$(node --version)
print_status "Node.js version: $NODE_VERSION"

# Check if Go is installed
if ! command -v go &> /dev/null; then
    print_warning "Go is not installed. Installing Go..."
    # Install Go
    GO_VERSION="1.21.3"
    wget -q "https://golang.org/dl/go${GO_VERSION}.linux-amd64.tar.gz"
    sudo rm -rf /usr/local/go
    sudo tar -C /usr/local -xzf "go${GO_VERSION}.linux-amd64.tar.gz"
    rm "go${GO_VERSION}.linux-amd64.tar.gz"
    
    # Add Go to PATH if not already there
    if ! grep -q "/usr/local/go/bin" ~/.bashrc; then
        echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
        export PATH=$PATH:/usr/local/go/bin
    fi
fi

GO_VERSION=$(go version)
print_status "Go version: $GO_VERSION"

# Check if Flutter is installed (optional for mobile development)
if ! command -v flutter &> /dev/null; then
    print_warning "Flutter is not installed. This is optional for mobile development."
    echo "To install Flutter, visit: https://flutter.dev/docs/get-started/install"
else
    FLUTTER_VERSION=$(flutter --version | head -n 1)
    print_status "Flutter version: $FLUTTER_VERSION"
fi

print_step "1. Setting up directory structure..."

# Create necessary directories
mkdir -p logs
mkdir -p data/postgres
mkdir -p data/redis
mkdir -p config/local
mkdir -p config/production
mkdir -p scripts

print_status "Directory structure created."

print_step "2. Creating environment configuration files..."

# Create local environment file
cat > .env.local << EOF
# Local Development Environment Configuration
COMPOSE_PROJECT_NAME=carrental-dev

# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_USER=postgres
POSTGRES_PASSWORD=devpassword123
POSTGRES_DB=carrental_dev

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6380

# Backend Services
API_GATEWAY_URL=http://localhost:8080
USER_SERVICE_URL=http://localhost:8081
VEHICLE_SERVICE_URL=http://localhost:8082
BOOKING_SERVICE_URL=http://localhost:8083
NOTIFICATION_SERVICE_URL=http://localhost:8084

# Frontend Configuration
ADMIN_FRONTEND_URL=http://localhost:5173
MOBILE_APP_URL=http://localhost:3000

# Security
JWT_SECRET=dev-jwt-secret-key-change-in-production
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Monitoring URLs
ADMINER_URL=http://localhost:8090
REDIS_COMMANDER_URL=http://localhost:8091

# Environment
NODE_ENV=development
LOG_LEVEL=debug
EOF

print_status "Environment configuration created (.env.local)"

print_step "3. Setting up backend services..."

# Build backend services
if [ -d "backend" ]; then
    cd backend
    
    # Build all Go services
    print_status "Building Go services..."
    if [ -f "Makefile" ]; then
        make build-all
    else
        # Build each service individually
        for service in user-service vehicle-service booking-service notification-service api-gateway; do
            if [ -d "$service" ]; then
                print_status "Building $service..."
                cd "$service"
                go mod tidy
                go build -o bin/main cmd/main.go
                cd ..
            fi
        done
    fi
    
    cd ..
fi

print_step "4. Setting up admin frontend..."

# Setup admin frontend
if [ -d "admin-frontend" ]; then
    cd admin-frontend
    print_status "Installing admin frontend dependencies..."
    npm install
    cd ..
fi

print_step "5. Starting development environment..."

# Start the development environment
docker-compose -f docker-compose.dev.yml down --remove-orphans
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up -d

print_status "Waiting for services to start..."
sleep 10

print_step "6. Verifying services..."

# Function to check if a service is running
check_service() {
    local service_name=$1
    local url=$2
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "$url" > /dev/null 2>&1; then
            print_status "$service_name is running ✓"
            return 0
        fi
        
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    print_warning "$service_name is not responding after $max_attempts attempts"
    return 1
}

# Check all services
echo -n "Checking API Gateway"
check_service "API Gateway" "http://localhost:8080/health"

echo -n "Checking User Service"
check_service "User Service" "http://localhost:8081/health"

echo -n "Checking Vehicle Service"
check_service "Vehicle Service" "http://localhost:8082/health"

echo -n "Checking Booking Service"
check_service "Booking Service" "http://localhost:8083/health"

echo -n "Checking Notification Service"
check_service "Notification Service" "http://localhost:8084/health"

print_step "7. Development environment setup complete!"

echo ""
echo "🎉 Car Rental Platform - Local Development Environment is Ready!"
echo "=============================================================="
echo ""
echo "📋 Service URLs:"
echo "  • API Gateway:        http://localhost:8080"
echo "  • User Service:       http://localhost:8081"
echo "  • Vehicle Service:    http://localhost:8082"  
echo "  • Booking Service:    http://localhost:8083"
echo "  • Notification Svc:   http://localhost:8084"
echo ""
echo "🗄️ Database Management:"
echo "  • Adminer:           http://localhost:8090"
echo "  • Redis Commander:   http://localhost:8091"
echo ""
echo "🖥️ Frontend Applications:"
echo "  • Admin Frontend:    http://localhost:5173 (npm run dev)"
echo "  • Mobile App:        http://localhost:3000 (flutter run -d web)"
echo ""
echo "📝 Next Steps:"
echo "  1. Start the admin frontend: cd admin-frontend && npm run dev"
echo "  2. Test API endpoints: curl http://localhost:8080/api/v1/users"
echo "  3. Access database via Adminer with:"
echo "     - Server: postgres"
echo "     - Username: postgres"
echo "     - Password: devpassword123"
echo "     - Database: carrental_dev"
echo ""
echo "🛠️ Development Commands:"
echo "  • View logs: docker-compose -f docker-compose.dev.yml logs -f [service]"
echo "  • Restart services: docker-compose -f docker-compose.dev.yml restart"
echo "  • Stop environment: docker-compose -f docker-compose.dev.yml down"
echo "  • Rebuild services: docker-compose -f docker-compose.dev.yml build --no-cache"
echo ""
echo "📁 Configuration files:"
echo "  • Environment: .env.local"
echo "  • Docker Compose: docker-compose.dev.yml"
echo ""

# Create a quick development script for easier management
cat > scripts/dev.sh << 'EOF'
#!/bin/bash

# Development helper script

case "$1" in
    "start")
        echo "🚀 Starting development environment..."
        docker-compose -f docker-compose.dev.yml up -d
        ;;
    "stop")
        echo "🛑 Stopping development environment..."
        docker-compose -f docker-compose.dev.yml down
        ;;
    "restart")
        echo "🔄 Restarting development environment..."
        docker-compose -f docker-compose.dev.yml restart
        ;;
    "logs")
        service=${2:-""}
        if [ -n "$service" ]; then
            docker-compose -f docker-compose.dev.yml logs -f "$service"
        else
            docker-compose -f docker-compose.dev.yml logs -f
        fi
        ;;
    "build")
        echo "🔨 Building services..."
        docker-compose -f docker-compose.dev.yml build --no-cache
        ;;
    "clean")
        echo "🧹 Cleaning up development environment..."
        docker-compose -f docker-compose.dev.yml down --remove-orphans --volumes
        docker system prune -f
        ;;
    "status")
        echo "📊 Development environment status:"
        docker-compose -f docker-compose.dev.yml ps
        ;;
    "frontend")
        echo "🖥️ Starting admin frontend..."
        cd admin-frontend && npm run dev
        ;;
    *)
        echo "Car Rental Platform - Development Helper"
        echo "Usage: $0 {start|stop|restart|logs [service]|build|clean|status|frontend}"
        echo ""
        echo "Commands:"
        echo "  start    - Start all development services"
        echo "  stop     - Stop all development services"
        echo "  restart  - Restart all development services"
        echo "  logs     - View logs (optionally specify service name)"
        echo "  build    - Rebuild all services"
        echo "  clean    - Clean up containers, volumes, and images"
        echo "  status   - Show service status"
        echo "  frontend - Start admin frontend development server"
        ;;
esac
EOF

chmod +x scripts/dev.sh

print_status "Development helper script created: scripts/dev.sh"
print_status "Local development environment setup completed successfully! 🎉"
