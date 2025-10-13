# Self-Driving Car Rental - Admin Frontend

A modern React-based admin dashboard for managing the self-driving car rental platform. Built with React 19, TypeScript, Tailwind CSS, and Vite.

## Features

### 🚗 **Vehicle Management**
- View and manage fleet of self-driving vehicles
- Real-time vehicle status tracking (available, in-use, maintenance, offline)
- Vehicle location monitoring with GPS coordinates
- Battery level monitoring and alerts
- Add/edit/delete vehicles with comprehensive forms
- Feature management for vehicle capabilities

### 📅 **Booking Management**
- Comprehensive booking oversight and control
- Filter bookings by status, date range, user, or vehicle
- Real-time booking status updates
- Cancel or modify bookings as needed
- Track pickup/dropoff locations and costs
- View booking history and analytics

### 👥 **User Management**
- User account administration
- User status management (active, inactive, suspended)
- User activity monitoring
- Add new users directly from admin panel
- Edit user information and permissions

### 🔔 **Notifications System**
- Create and send notifications to users
- Multiple notification types (system, booking, payment, etc.)
- Priority levels (low, normal, high, urgent)
- Batch notification processing
- Notification status tracking and delivery confirmation

### 📊 **Dashboard & Analytics**
- Real-time system metrics and KPIs
- Interactive charts and graphs (revenue trends, booking analytics)
- Vehicle fleet status visualization
- Recent activity monitoring
- Performance metrics tracking

### ⚙️ **Settings & Configuration**
- System health monitoring
- Service status tracking
- Security settings management
- Notification preferences
- Analytics configuration

## Technology Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **React Query (TanStack Query)** - Data fetching and caching
- **React Router** - Client-side routing
- **Recharts** - Interactive charts and data visualization
- **Heroicons** - Beautiful SVG icons
- **React Hook Form** - Efficient form handling
- **Axios** - HTTP client for API requests
- **Date-fns** - Date manipulation library

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── VehicleModal.tsx
│   ├── UserModal.tsx
│   └── NotificationModal.tsx
├── pages/               # Page components
│   ├── Dashboard.tsx
│   ├── Vehicles.tsx
│   ├── Bookings.tsx
│   ├── Users.tsx
│   ├── Notifications.tsx
│   └── Settings.tsx
├── shared/              # Shared utilities
│   ├── components/      # Shared UI components
│   │   ├── Layout.tsx
│   │   ├── Card.tsx
│   │   ├── Table.tsx
│   │   └── LoadingSpinner.tsx
│   ├── api/            # API client and services
│   │   ├── client.ts
│   │   └── services.ts
│   └── types/          # TypeScript type definitions
│       └── api.ts
├── App.tsx             # Main app component with routing
└── main.tsx           # App entry point
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend services running (see backend documentation)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   ```bash
   # Copy environment file
   cp .env.development .env
   
   # Update API base URL if needed
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
# Build the application
npm run build

# Preview production build locally
npm run preview
```

## API Integration

The frontend integrates with the following backend services:

- **API Gateway** (Port 8000) - Main entry point
- **User Service** (Port 8001) - User management
- **Vehicle Service** (Port 8002) - Fleet management  
- **Booking Service** (Port 8003) - Reservation handling
- **Notification Service** (Port 8004) - Messaging system

### API Client Configuration

The API client (`src/shared/api/client.ts`) includes:
- Automatic JWT token handling
- Request/response interceptors
- Error handling and retry logic
- Base URL configuration via environment variables

### Service Layer

Each service module (`src/shared/api/services.ts`) provides:
- Type-safe API calls with full TypeScript support
- Consistent error handling
- Request/response transformation
- Caching strategies with React Query

## Key Features Implementation

### Real-time Updates
- React Query with automatic refetching
- WebSocket integration ready (WebSocket URL in env vars)
- Optimistic updates for better UX

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Responsive tables with horizontal scrolling
- Collapsible sidebar for mobile devices
- Touch-friendly interface elements

### Data Visualization
- Interactive charts with Recharts
- Real-time metrics display
- Customizable dashboard widgets
- Export capabilities for reports

### Form Handling
- React Hook Form for efficient form management
- Real-time validation with TypeScript
- File upload support for vehicle images
- Bulk data operations

## Development Guidelines

### Code Style
- ESLint configuration with React and TypeScript rules
- Prettier for code formatting
- Consistent naming conventions
- Component composition patterns

### State Management
- React Query for server state
- React Context for global app state
- Local component state with useState/useReducer
- Form state with React Hook Form

### Error Handling
- Global error boundaries
- API error handling with user-friendly messages
- Loading states and error recovery
- Offline support preparation

## Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint

# Type checking
npm run type-check      # TypeScript type checking
```

## Deployment

### Environment Variables
Set the following for production:

```bash
VITE_API_BASE_URL=https://your-api-domain.com
VITE_NODE_ENV=production
VITE_ENABLE_ANALYTICS=true
VITE_WEBSOCKET_URL=wss://your-api-domain.com/ws
```

### Build Optimization
- Code splitting with React.lazy
- Asset optimization with Vite
- Bundle analysis and size monitoring
- CDN integration for static assets

## Performance Optimization

- **Code Splitting**: Route-based and component-based splitting
- **Lazy Loading**: Images and non-critical components
- **Caching**: Aggressive caching with React Query
- **Bundle Size**: Tree shaking and minimal dependencies
- **Rendering**: Virtualization for large lists
- **Memory**: Proper cleanup and memory leak prevention

## Security Considerations

- **Authentication**: JWT token handling with secure storage
- **Authorization**: Role-based access control
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: API client configuration
- **Content Security Policy**: Configured for production
- **Environment Variables**: Secure handling of sensitive data

---

This admin frontend provides a complete, production-ready interface for managing the self-driving car rental platform with modern web technologies and best practices.
