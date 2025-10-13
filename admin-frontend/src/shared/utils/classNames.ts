/**
 * CSS class name utilities
 */

export type ClassValue = string | number | boolean | undefined | null | ClassValue[]

export const cn = (...classes: ClassValue[]): string => {
  return classes
    .flat()
    .filter(Boolean)
    .join(' ')
}

export const classNames = (...classes: (string | undefined)[]): string => {
  return classes.filter(Boolean).join(' ')
}

// Conditional class helpers
export const conditionalClass = (
  condition: boolean, 
  trueClass: string, 
  falseClass = ''
): string => {
  return condition ? trueClass : falseClass
}

// Status-based classes
export const getStatusClasses = (status: string): string => {
  const statusMap: Record<string, string> = {
    available: 'bg-green-100 text-green-800 border-green-200',
    rented: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    maintenance: 'bg-red-100 text-red-800 border-red-200',
    reserved: 'bg-blue-100 text-blue-800 border-blue-200',
    pending: 'bg-gray-100 text-gray-800 border-gray-200',
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200'
  }
  
  return statusMap[status.toLowerCase()] || statusMap.pending
}

// Size-based classes
export const getSizeClasses = (size: 'sm' | 'md' | 'lg' | 'xl'): string => {
  const sizeMap: Record<string, string> = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
    xl: 'px-6 py-4 text-lg'
  }
  
  return sizeMap[size] || sizeMap.md
}

// Animation classes
export const ANIMATION_CLASSES = {
  fadeIn: 'animate-fadeIn',
  fadeOut: 'animate-fadeOut',
  slideIn: 'animate-slideIn',
  slideOut: 'animate-slideOut',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  spin: 'animate-spin'
} as const

// Layout classes
export const LAYOUT_CLASSES = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-8 sm:py-12 lg:py-16',
  card: 'bg-white rounded-lg shadow-sm border border-gray-200',
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors',
    danger: 'bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors'
  }
} as const
