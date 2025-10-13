# 🏗️ Clean Architecture Guide

## Overview
This admin frontend follows a **feature-based clean architecture** that promotes:
- **Reusability** - Shared components and utilities
- **Maintainability** - Clear separation of concerns  
- **Scalability** - Easy to add new features
- **Testability** - Isolated business logic
- **Type Safety** - Full TypeScript coverage

## 📁 Folder Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Pure UI components (Button, Input, Modal, etc.)
│   ├── layout/          # Layout-specific components
│   ├── forms/           # Form-specific components
│   └── modals/          # Modal components
├── features/            # Feature-based modules
│   ├── vehicles/        # Vehicle management feature
│   │   ├── components/  # Vehicle-specific components
│   │   ├── hooks/       # Custom hooks for vehicles
│   │   ├── pages/       # Vehicle pages
│   │   └── types/       # Vehicle-specific types
│   ├── dashboard/       # Dashboard feature
│   └── users/           # User management feature
├── services/            # API services and data layer
│   ├── api.ts          # Base API service
│   ├── vehicleService.ts
│   └── userService.ts
├── shared/              # Shared utilities and types
│   ├── types/          # TypeScript interfaces
│   ├── constants/      # App constants
│   ├── utils/          # Utility functions
│   └── hooks/          # Shared custom hooks
├── store/              # State management (Context/Redux)
├── pages/              # Top-level pages and routing
└── App.tsx             # Main app component
```

## 🧱 Architecture Principles

### 1. **Feature-Based Organization**
Each feature (vehicles, users, dashboard) has its own folder with:
- Components specific to that feature
- Custom hooks for business logic
- Types and interfaces
- Pages and routing

### 2. **Shared Resources**
Common elements are centralized:
- **UI Components**: Reusable Button, Input, Modal, etc.
- **Types**: Common interfaces and type definitions
- **Utils**: Helper functions, validation, formatting
- **Constants**: App-wide configuration and settings

### 3. **Service Layer**
Clean separation between UI and data:
- **API Service**: Base class for HTTP operations
- **Feature Services**: Specialized services (VehicleService)
- **Mock Services**: Development-time data mocking

### 4. **Custom Hooks**
Business logic extracted into reusable hooks:
- Data fetching and state management
- Form handling and validation
- Complex interactions and side effects

## 🎯 Key Benefits

### **Reusability**
```typescript
// Use the same Button component everywhere
import { Button } from '../components/ui'

// Reuse validation across forms
import { validateForm, COMMON_RULES } from '../shared/utils'

// Share business logic via hooks
import { useVehicles } from '../features/vehicles/hooks'
```

### **Extensibility**
```typescript
// Easy to add new features
src/features/bookings/
├── components/
├── hooks/
├── pages/
└── types/

// Extend existing components
interface ExtendedButtonProps extends ButtonProps {
  customProp: string
}
```

### **Type Safety**
```typescript
// Centralized type definitions
import type { Vehicle, VehicleFilters } from '../shared/types'

// Validated API responses
const response: ApiResponse<Vehicle> = await vehicleService.create(data)

// Type-safe form validation
const result = validateForm(formData, vehicleValidationRules)
```

### **Testability**
```typescript
// Easy to test individual pieces
import { formatCurrency } from '../shared/utils'
import { MockVehicleService } from '../services/vehicleService'
import { useVehicles } from '../features/vehicles/hooks'
```

## 🚀 Usage Examples

### **Creating a New Feature**
1. Create feature folder: `src/features/bookings/`
2. Add hooks: `useBookings.ts`, `useBookingForm.ts`
3. Create components: `BookingCard.tsx`, `BookingModal.tsx`
4. Add service: `bookingService.ts`
5. Define types: `booking.ts`

### **Adding a New UI Component**
```typescript
// src/components/ui/Badge.tsx
import { cn } from '../../shared/utils'

interface BadgeProps {
  variant: 'success' | 'error' | 'warning'
  children: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({ variant, children }) => {
  return (
    <span className={cn('px-2 py-1 rounded-full text-xs', {
      'bg-green-100 text-green-800': variant === 'success',
      'bg-red-100 text-red-800': variant === 'error',
      'bg-yellow-100 text-yellow-800': variant === 'warning'
    })}>
      {children}
    </span>
  )
}
```

### **Using the Service Layer**
```typescript
// In a component or hook
import { vehicleService } from '../services/vehicleService'

const createVehicle = async (data: CreateVehiclePayload) => {
  try {
    const response = await vehicleService.create(data)
    // Handle success
  } catch (error) {
    // Handle error
  }
}
```

## 📚 Best Practices

### **Component Structure**
- Keep components small and focused
- Use TypeScript interfaces for props
- Implement proper error boundaries
- Follow consistent naming conventions

### **State Management**
- Use custom hooks for complex state
- Keep local state when possible
- Implement proper loading and error states
- Use context for truly global state

### **File Naming**
- `PascalCase` for components
- `camelCase` for hooks and utilities
- `kebab-case` for files and folders
- Descriptive names over abbreviations

### **Import Organization**
```typescript
// 1. React imports
import { useState, useEffect } from 'react'

// 2. Third-party imports
import { XMarkIcon } from '@heroicons/react/24/outline'

// 3. Internal imports (absolute paths)
import { Button, Modal } from '../components/ui'
import { useVehicles } from '../features/vehicles/hooks'
import type { Vehicle } from '../shared/types'
```

## 🔧 Development Workflow

1. **Start with Types**: Define interfaces in `shared/types/`
2. **Create Services**: Implement API calls in `services/`
3. **Build Hooks**: Extract business logic into custom hooks
4. **Design Components**: Create reusable UI components
5. **Compose Features**: Combine everything in feature modules
6. **Test & Iterate**: Write tests and refine

This architecture ensures your code is **maintainable**, **scalable**, and **enjoyable to work with**! 🎉
