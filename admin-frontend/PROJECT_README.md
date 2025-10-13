# Self-Driving Car Rental Admin Frontend

A React + TypeScript admin dashboard for managing a self-driving car rental platform.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
src/
├── app/                    # App-level configuration
├── features/               # Feature-based organization
│   ├── auth/              # Authentication
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   ├── users/             # User management
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   ├── vehicles/          # Vehicle management
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── services/
│   └── bookings/          # Booking management
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       └── services/
└── shared/                # Shared utilities and components
    ├── components/        # Reusable UI components
    ├── hooks/            # Shared custom hooks
    ├── types/            # TypeScript type definitions
    └── utils/            # Utility functions
```

## Features

- **Dashboard** - Overview of system metrics
- **User Management** - Admin and customer management
- **Vehicle Management** - Fleet monitoring and control
- **Booking Management** - Reservation handling
- **Authentication** - Secure admin login

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Design Principles

- **Feature-based structure** - Each feature is self-contained
- **Reusable components** - Shared UI components in `/shared`
- **Type safety** - Full TypeScript coverage
- **Responsive design** - Mobile-first approach with Tailwind
- **Clean code** - ESLint and consistent patterns
