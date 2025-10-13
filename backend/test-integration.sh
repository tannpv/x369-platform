#!/bin/bash

# Integration test script for the car rental backend services
set -e

echo "🚀 Starting Car Rental Backend Integration Tests"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if service is running
check_service() {
    local service_name=$1
    local port=$2
    local max_attempts=30
    local attempt=1

    echo -n "Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:$port/health > /dev/null 2>&1; then
            echo -e " ${GREEN}✓${NC}"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e " ${RED}✗${NC}"
    echo -e "${RED}Failed to connect to $service_name on port $port${NC}"
    return 1
}

# Function to test API endpoint
test_endpoint() {
    local method=$1
    local url=$2
    local expected_status=$3
    local description=$4
    
    echo -n "Testing $description..."
    
    if [ "$method" = "GET" ]; then
        status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    else
        status_code=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$url")
    fi
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e " ${GREEN}✓${NC} (HTTP $status_code)"
        return 0
    else
        echo -e " ${RED}✗${NC} (Expected HTTP $expected_status, got $status_code)"
        return 1
    fi
}

# Build and start services
echo "📦 Building and starting services..."
docker-compose -f docker-compose.yml up -d --build

# Wait for database to be ready
echo "⏳ Waiting for database to initialize..."
sleep 10

# Check if services are running
echo -e "\n🔍 Checking service health..."
check_service "User Service" 8001
check_service "Vehicle Service" 8002  
check_service "Booking Service" 8003
check_service "Notification Service" 8004

# Test individual service endpoints
echo -e "\n🧪 Testing service endpoints..."

# User Service Tests
echo -e "\n${YELLOW}User Service Tests:${NC}"
test_endpoint "GET" "http://localhost:8001/health" "200" "User service health check"
test_endpoint "GET" "http://localhost:8001/api/v1/users" "200" "List users endpoint"

# Vehicle Service Tests  
echo -e "\n${YELLOW}Vehicle Service Tests:${NC}"
test_endpoint "GET" "http://localhost:8002/health" "200" "Vehicle service health check"
test_endpoint "GET" "http://localhost:8002/api/v1/vehicles" "200" "List vehicles endpoint"

# Booking Service Tests
echo -e "\n${YELLOW}Booking Service Tests:${NC}"
test_endpoint "GET" "http://localhost:8003/health" "200" "Booking service health check"
test_endpoint "GET" "http://localhost:8003/api/v1/bookings" "200" "List bookings endpoint"

# Notification Service Tests
echo -e "\n${YELLOW}Notification Service Tests:${NC}"
test_endpoint "GET" "http://localhost:8004/health" "200" "Notification service health check"  
test_endpoint "GET" "http://localhost:8004/api/v1/notifications" "200" "List notifications endpoint"

echo -e "\n${GREEN}🎉 Integration tests completed!${NC}"
echo -e "\n📊 Service Status:"
echo -e "- User Service: ${GREEN}Running${NC} on http://localhost:8001"
echo -e "- Vehicle Service: ${GREEN}Running${NC} on http://localhost:8002"
echo -e "- Booking Service: ${GREEN}Running${NC} on http://localhost:8003"
echo -e "- Notification Service: ${GREEN}Running${NC} on http://localhost:8004"

echo -e "\n🔗 API Documentation:"
echo -e "- User API: http://localhost:8001/api/v1/users"
echo -e "- Vehicle API: http://localhost:8002/api/v1/vehicles" 
echo -e "- Booking API: http://localhost:8003/api/v1/bookings"
echo -e "- Notification API: http://localhost:8004/api/v1/notifications"

echo -e "\n💡 To stop services: docker-compose down"
echo -e "💡 To view logs: docker-compose logs -f [service-name]"
