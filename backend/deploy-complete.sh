#!/bin/bash

# Complete Car Rental Platform Deployment Script
set -e

echo "🚀 Car Rental Platform - Complete Deployment"
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.yml"
SERVICES=("user-service" "vehicle-service" "booking-service" "notification-service" "api-gateway")
PORTS=("8001" "8002" "8003" "8004" "8000")
SERVICE_NAMES=("User Service" "Vehicle Service" "Booking Service" "Notification Service" "API Gateway")

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to check if a port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1
    else
        return 0
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local service_name=$1
    local port=$2
    local max_attempts=60
    local attempt=1

    print_status $YELLOW "Waiting for $service_name to be ready on port $port..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s --max-time 2 http://localhost:$port/health > /dev/null 2>&1; then
            print_status $GREEN "✅ $service_name is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_status $RED "❌ $service_name failed to start on port $port"
    return 1
}

# Function to test API endpoint
test_endpoint() {
    local method=$1
    local url=$2
    local expected_status=$3
    local description=$4
    
    print_status $BLUE "Testing: $description"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$url" 2>/dev/null)
        status_code=$(echo $response | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    else
        status_code=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$url" 2>/dev/null)
    fi
    
    if [ "$status_code" = "$expected_status" ]; then
        print_status $GREEN "  ✅ SUCCESS (HTTP $status_code)"
        return 0
    else
        print_status $RED "  ❌ FAILED (Expected HTTP $expected_status, got $status_code)"
        return 1
    fi
}

# Function to run business logic tests
test_business_logic() {
    print_status $BLUE "\n🧪 Testing Business Logic..."
    
    # Test creating a user (mock)
    test_endpoint "GET" "http://localhost:8001/api/v1/users" "200" "List users"
    
    # Test listing vehicles
    test_endpoint "GET" "http://localhost:8002/api/v1/vehicles" "200" "List vehicles"
    
    # Test booking endpoints
    test_endpoint "GET" "http://localhost:8003/api/v1/bookings" "200" "List bookings"
    test_endpoint "GET" "http://localhost:8003/api/v1/bookings/active" "200" "Get active bookings"
    test_endpoint "GET" "http://localhost:8003/api/v1/bookings/stats" "200" "Get booking statistics"
    
    # Test notification endpoints
    test_endpoint "GET" "http://localhost:8004/api/v1/notifications" "200" "List notifications"
    test_endpoint "GET" "http://localhost:8004/api/v1/notifications/stats" "200" "Get notification statistics"
    test_endpoint "POST" "http://localhost:8004/api/v1/notifications/send-pending" "204" "Send pending notifications"
    
    # Test API Gateway routing
    test_endpoint "GET" "http://localhost:8000/health" "200" "API Gateway health check"
}

# Function to display service information
display_service_info() {
    print_status $BLUE "\n📊 Service Information:"
    echo "===================="
    
    for i in "${!SERVICES[@]}"; do
        local service=${SERVICES[$i]}
        local port=${PORTS[$i]}
        local name=${SERVICE_NAMES[$i]}
        
        if curl -s --max-time 2 http://localhost:$port/health >/dev/null 2>&1; then
            print_status $GREEN "✅ $name: http://localhost:$port (Running)"
        else
            print_status $RED "❌ $name: http://localhost:$port (Not responding)"
        fi
    done
    
    # Database status
    if docker-compose ps postgres | grep -q "Up"; then
        print_status $GREEN "✅ PostgreSQL Database: Running"
    else
        print_status $RED "❌ PostgreSQL Database: Not running"
    fi
    
    # Redis status
    if docker-compose ps redis | grep -q "Up"; then
        print_status $GREEN "✅ Redis Cache: Running"
    else
        print_status $RED "❌ Redis Cache: Not running"
    fi
}

# Function to show useful commands
show_useful_commands() {
    print_status $BLUE "\n💡 Useful Commands:"
    echo "=================="
    echo "View service logs:     docker-compose logs -f [service-name]"
    echo "Stop all services:     docker-compose down"
    echo "Restart a service:     docker-compose restart [service-name]"
    echo "View database:         docker-compose exec postgres psql -U postgres -d carrental"
    echo "Scale a service:       docker-compose up -d --scale [service-name]=3"
    echo ""
    
    print_status $BLUE "📍 API Endpoints:"
    echo "================"
    echo "API Gateway:       http://localhost:8000"
    echo "User Service:      http://localhost:8001/api/v1/users"
    echo "Vehicle Service:   http://localhost:8002/api/v1/vehicles"
    echo "Booking Service:   http://localhost:8003/api/v1/bookings"
    echo "Notification Svc:  http://localhost:8004/api/v1/notifications"
    echo ""
    
    print_status $BLUE "📈 Monitoring:"
    echo "============="
    echo "Prometheus:        http://localhost:9090 (if configured)"
    echo "Health Checks:     curl http://localhost:800{1,2,3,4,0}/health"
    echo "Service Metrics:   curl http://localhost:8005/metrics (if observability running)"
}

# Main deployment process
main() {
    print_status $BLUE "🔍 Pre-flight Checks..."
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        print_status $RED "❌ Docker is not running. Please start Docker first."
        exit 1
    fi
    
    # Check if docker-compose file exists
    if [ ! -f "$COMPOSE_FILE" ]; then
        print_status $RED "❌ docker-compose.yml not found in current directory"
        exit 1
    fi
    
    print_status $GREEN "✅ Pre-flight checks passed"
    
    # Check for port conflicts
    print_status $BLUE "\n🔍 Checking for port conflicts..."
    for port in "${PORTS[@]}"; do
        if ! check_port $port; then
            print_status $YELLOW "⚠️  Port $port is already in use"
            read -p "Continue anyway? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                print_status $RED "Deployment cancelled"
                exit 1
            fi
            break
        fi
    done
    
    # Build and start services
    print_status $BLUE "\n🏗️  Building and starting services..."
    docker-compose down --remove-orphans 2>/dev/null || true
    
    if ! docker-compose up -d --build; then
        print_status $RED "❌ Failed to start services"
        exit 1
    fi
    
    print_status $GREEN "✅ Services started successfully"
    
    # Wait for database to initialize
    print_status $BLUE "\n⏳ Waiting for database to initialize..."
    sleep 15
    
    # Wait for each service to be ready
    print_status $BLUE "\n🔄 Waiting for services to be ready..."
    failed_services=()
    
    for i in "${!SERVICES[@]}"; do
        local service=${SERVICES[$i]}
        local port=${PORTS[$i]}
        local name=${SERVICE_NAMES[$i]}
        
        if ! wait_for_service "$name" "$port"; then
            failed_services+=("$name")
        fi
    done
    
    # Report failed services
    if [ ${#failed_services[@]} -gt 0 ]; then
        print_status $RED "\n❌ The following services failed to start:"
        for service in "${failed_services[@]}"; do
            echo "  - $service"
        done
        print_status $YELLOW "\nCheck logs with: docker-compose logs [service-name]"
    else
        print_status $GREEN "\n🎉 All services are running!"
    fi
    
    # Run integration tests
    print_status $BLUE "\n🧪 Running Integration Tests..."
    test_business_logic
    
    # Display service information
    display_service_info
    
    # Show useful commands
    show_useful_commands
    
    print_status $GREEN "\n🎉 Deployment Complete!"
    print_status $BLUE "The Car Rental Platform is now running and ready for use."
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "test")
        print_status $BLUE "🧪 Running Integration Tests Only..."
        test_business_logic
        ;;
    "status")
        display_service_info
        ;;
    "help")
        echo "Usage: $0 [command]"
        echo "Commands:"
        echo "  deploy (default) - Full deployment with tests"
        echo "  test            - Run integration tests only"
        echo "  status          - Show service status"
        echo "  help            - Show this help message"
        ;;
    *)
        print_status $RED "Unknown command: $1"
        print_status $BLUE "Use '$0 help' for usage information"
        exit 1
        ;;
esac
