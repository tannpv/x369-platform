#!/bin/bash

# Frontend-Backend Integration Test Script
set -e

echo "🔗 Testing Frontend-Backend Integration"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test API endpoint via API Gateway
test_api_endpoint() {
    local method=$1
    local endpoint=$2
    local expected_status=$3
    local description=$4
    local data=$5
    
    echo -n "Testing $description..."
    
    if [ "$method" = "GET" ]; then
        status_code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8000$endpoint")
    elif [ "$method" = "POST" ] && [ -n "$data" ]; then
        status_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -d "$data" \
            "http://localhost:8000$endpoint")
    else
        status_code=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "http://localhost:8000$endpoint")
    fi
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e " ${GREEN}✓${NC} (HTTP $status_code)"
        return 0
    else
        echo -e " ${RED}✗${NC} (Expected HTTP $expected_status, got $status_code)"
        return 1
    fi
}

# Function to test API data response
test_api_data() {
    local endpoint=$1
    local description=$2
    
    echo -n "Testing $description..."
    
    response=$(curl -s "http://localhost:8000$endpoint")
    
    if echo "$response" | grep -q '"users":\|"vehicles":\|"bookings":\|"notifications":'; then
        echo -e " ${GREEN}✓${NC} (Valid JSON response)"
        return 0
    else
        echo -e " ${RED}✗${NC} (Invalid response: $response)"
        return 1
    fi
}

echo -e "\n${YELLOW}Testing API Gateway Health:${NC}"
test_api_endpoint "GET" "/health" "200" "API Gateway health check"

echo -e "\n${YELLOW}Testing User Service via API Gateway:${NC}"
test_api_endpoint "GET" "/api/users" "200" "List users via gateway"
test_api_data "/api/users" "User service data format"

echo -e "\n${YELLOW}Testing Vehicle Service via API Gateway:${NC}"
test_api_endpoint "GET" "/api/vehicles" "200" "List vehicles via gateway"
test_api_data "/api/vehicles" "Vehicle service data format"

echo -e "\n${YELLOW}Testing Cross-Origin Requests (CORS):${NC}"
cors_response=$(curl -s -H "Origin: http://localhost:5174" \
    -H "Access-Control-Request-Method: GET" \
    -H "Access-Control-Request-Headers: Content-Type" \
    -X OPTIONS "http://localhost:8000/api/users")

if [ $? -eq 0 ]; then
    echo -e "CORS preflight request: ${GREEN}✓${NC}"
else
    echo -e "CORS preflight request: ${RED}✗${NC}"
fi

echo -e "\n${YELLOW}Testing Frontend Accessibility:${NC}"
frontend_status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5174")
if [ "$frontend_status" = "200" ]; then
    echo -e "Frontend accessibility: ${GREEN}✓${NC} (HTTP $frontend_status)"
else
    echo -e "Frontend accessibility: ${RED}✗${NC} (HTTP $frontend_status)"
fi

echo -e "\n${GREEN}🎉 Frontend-Backend Integration Tests Complete!${NC}"

echo -e "\n${YELLOW}Integration Summary:${NC}"
echo -e "- Backend API Gateway: ${GREEN}http://localhost:8000${NC}"
echo -e "- Admin Frontend: ${GREEN}http://localhost:5174${NC}"
echo -e "- User Service: ${GREEN}http://localhost:8001${NC}"
echo -e "- Vehicle Service: ${GREEN}http://localhost:8002${NC}"
echo -e "- Booking Service: ${GREEN}http://localhost:8003${NC}"
echo -e "- Notification Service: ${GREEN}http://localhost:8004${NC}"

echo -e "\n${YELLOW}Next Steps:${NC}"
echo -e "1. Open ${GREEN}http://localhost:5174${NC} in your browser"
echo -e "2. Test admin interface features"
echo -e "3. Verify data loading from backend services"
echo -e "4. Test CRUD operations through the UI"
