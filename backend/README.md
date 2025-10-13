# Self-Driving Car Rental Backend

A microservices-based backend system for managing a self-driving car rental platform, built with Go and clean architecture principles.

## Architecture

### Microservices
- **API Gateway** - Single entry point, routing, authentication
- **User Service** - User management, authentication, authorization  
- **Vehicle Service** - Fleet management, vehicle status, location tracking
- **Booking Service** - Reservation management, trip handling
- **Notification Service** - Email, SMS, push notifications

### Technology Stack
- **Go 1.24** - Programming language
- **PostgreSQL** - Primary database
- **Redis** - Caching and session storage
- **Docker & Docker Compose** - Containerization
- **Gorilla Mux** - HTTP routing
- **Clean Architecture** - Domain-driven design

## Project Structure

```
backend/
├── docker-compose.yml          # Multi-service orchestration
├── init-db.sql                 # Database initialization
├── api-gateway/                # API Gateway service
├── user-service/               # User management service
│   ├── cmd/                    # Application entry points
│   ├── internal/
│   │   ├── domain/             # Business entities & interfaces
│   │   ├── usecase/            # Business logic
│   │   ├── repository/         # Data access layer
│   │   ├── delivery/http/      # HTTP handlers
│   │   └── infra/              # Infrastructure concerns
│   ├── migrations/             # Database migrations
│   └── Dockerfile
├── vehicle-service/            # Vehicle management service
├── booking-service/            # Booking management service
└── notification-service/       # Notification service
```

## Clean Architecture Layers

### Domain Layer (`internal/domain/`)
- **Entities**: Core business objects (User, Vehicle, Booking)
- **Interfaces**: Repository and usecase contracts
- **Value Objects**: Immutable objects like Status, Role

### Usecase Layer (`internal/usecase/`)
- **Business Logic**: Application-specific rules
- **Orchestration**: Coordinates between different domains
- **Validation**: Input validation and business rule enforcement

### Repository Layer (`internal/repository/`)
- **Data Access**: Database operations
- **Abstraction**: Implements domain repository interfaces
- **Persistence**: Handles data storage and retrieval

### Delivery Layer (`internal/delivery/http/`)
- **HTTP Handlers**: REST API endpoints
- **Request/Response**: JSON serialization
- **Routing**: URL path handling

### Infrastructure Layer (`internal/infra/`)
- **Database**: Connection management
- **External Services**: Third-party API integrations
- **Configuration**: Environment variables, settings

## Key Features

### User Service
- User registration and authentication
- Role-based access control (Customer, Admin)
- Profile management
- JWT token generation and validation

### Vehicle Service
- Fleet inventory management
- Real-time location tracking
- Status monitoring (Available, Rented, Maintenance)
- Self-driving car API integration

### Booking Service
- Reservation creation and management
- Trip lifecycle handling
- Payment processing integration
- Availability checking

### Notification Service
- Multi-channel notifications (Email, SMS, Push)
- Event-driven messaging
- Template management
- Delivery tracking

### API Gateway
- Request routing and load balancing
- Authentication and authorization
- Rate limiting and throttling
- Request/response transformation

## Development

### Prerequisites
- Go 1.24+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Quick Start

```bash
# Clone and navigate to backend
cd backend/

# Start all services
docker-compose up -d

# Check service health
curl http://localhost:8080/health

# View logs
docker-compose logs -f user-service
```

### Service Endpoints

| Service | Port | Health Check |
|---------|------|--------------|
| API Gateway | 8080 | http://localhost:8080/health |
| User Service | 8081 | http://localhost:8081/health |
| Vehicle Service | 8082 | http://localhost:8082/health |
| Booking Service | 8083 | http://localhost:8083/health |
| Notification Service | 8084 | http://localhost:8084/health |

### API Documentation

#### User Service
- `POST /users` - Create user
- `GET /users/{id}` - Get user by ID
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user
- `GET /users` - List users (paginated)
- `POST /auth/login` - User login

#### Vehicle Service
- `POST /vehicles` - Add vehicle to fleet
- `GET /vehicles/{id}` - Get vehicle details
- `PUT /vehicles/{id}` - Update vehicle
- `GET /vehicles` - Search vehicles
- `PUT /vehicles/{id}/status` - Update vehicle status
- `PUT /vehicles/{id}/location` - Update vehicle location

### Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=carrental_users

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Service
PORT=8080

# JWT (API Gateway)
JWT_SECRET=your-super-secret-key
```

## Deployment

### Docker Compose (Development)
```bash
docker-compose up -d
```

### Production Considerations
- Use managed databases (AWS RDS, Google Cloud SQL)
- Implement service mesh (Istio, Linkerd)
- Add monitoring (Prometheus, Grafana)
- Configure log aggregation (ELK Stack)
- Set up CI/CD pipelines
- Implement blue-green deployments

## Testing

```bash
# Unit tests
go test ./internal/...

# Integration tests
go test -tags=integration ./...

# Load testing
docker run --rm -i --network=backend_carrental-network \
  grafana/k6:latest run - <loadtest.js
```

## Monitoring

### Health Checks
Each service exposes a `/health` endpoint for container orchestration and load balancers.

### Metrics
- Request duration and count
- Database connection pool stats
- Cache hit/miss ratios
- Business metrics (bookings, revenue)

### Logging
Structured JSON logging with correlation IDs for request tracing across services.

## Security

- JWT-based stateless authentication
- CORS configured for frontend domains
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- Rate limiting on API endpoints
- HTTPS termination at load balancer

## Contributing

1. Follow clean architecture principles
2. Write unit tests for business logic
3. Document API changes
4. Use meaningful commit messages
5. Update README for new features
