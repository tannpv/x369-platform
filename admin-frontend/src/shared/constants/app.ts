// Application-wide constants
export const APP_CONFIG = {
  name: 'AutoRent Admin',
  version: '1.0.0',
  description: 'Professional car rental management system'
} as const

// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  retries: 3
} as const

// Pagination defaults
export const PAGINATION = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100]
} as const

// Modal sizes
export const MODAL_SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl'
} as const

// Theme constants
export const THEME_CONFIG = {
  defaultTheme: 'light' as const,
  storageKey: 'admin-theme',
  sidebar: {
    width: '280px',
    collapsedWidth: '80px'
  },
  header: {
    height: '70px'
  }
} as const

// Navigation routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  VEHICLES: {
    INDEX: '/vehicles',
    CREATE: '/vehicles/create',
    EDIT: (id: string) => `/vehicles/${id}/edit`,
    VIEW: (id: string) => `/vehicles/${id}`
  },
  USERS: '/users',
  BOOKINGS: '/bookings',
  PAYMENTS: '/payments',
  REPORTS: '/reports',
  SETTINGS: '/settings'
} as const

// File upload constants
export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedDocumentTypes: ['application/pdf', 'text/csv', 'application/vnd.ms-excel']
} as const

// Validation constants
export const VALIDATION = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  vehicle: {
    yearMin: 1990,
    yearMax: new Date().getFullYear() + 1,
    seatsMin: 2,
    seatsMax: 15,
    dailyRateMin: 0,
    dailyRateMax: 10000
  }
} as const
