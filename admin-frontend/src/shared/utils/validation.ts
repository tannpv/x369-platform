/**
 * Form validation utilities
 */

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  min?: number
  max?: number
  custom?: (value: any) => string | null
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export const validateField = (value: any, rules: ValidationRule): ValidationResult => {
  const errors: string[] = []

  // Required validation
  if (rules.required && (value === undefined || value === null || value === '')) {
    errors.push('This field is required')
    return { isValid: false, errors }
  }

  // Skip other validations if field is empty and not required
  if (!rules.required && (value === undefined || value === null || value === '')) {
    return { isValid: true, errors: [] }
  }

  // String validations
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`Must be at least ${rules.minLength} characters`)
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`Must not exceed ${rules.maxLength} characters`)
    }
    
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push('Invalid format')
    }
  }

  // Number validations
  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      errors.push(`Must be at least ${rules.min}`)
    }
    
    if (rules.max !== undefined && value > rules.max) {
      errors.push(`Must not exceed ${rules.max}`)
    }
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value)
    if (customError) {
      errors.push(customError)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateForm = <T extends Record<string, any>>(
  data: T, 
  rules: Record<keyof T, ValidationRule>
): { isValid: boolean; errors: Record<keyof T, string[]> } => {
  const errors = {} as Record<keyof T, string[]>
  let isValid = true

  for (const field in rules) {
    const fieldResult = validateField(data[field], rules[field])
    if (!fieldResult.isValid) {
      errors[field] = fieldResult.errors
      isValid = false
    }
  }

  return { isValid, errors }
}

// Common validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  url: /^https?:\/\/.+/,
  licensePlate: /^[A-Z0-9\-]{3,10}$/i,
  year: /^(19|20)\d{2}$/,
  postalCode: /^\d{5}(-\d{4})?$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
} as const

// Common validation rules
export const COMMON_RULES = {
  required: { required: true },
  email: { 
    required: true, 
    pattern: VALIDATION_PATTERNS.email 
  },
  phone: { 
    pattern: VALIDATION_PATTERNS.phone 
  },
  url: { 
    pattern: VALIDATION_PATTERNS.url 
  },
  password: {
    required: true,
    minLength: 8,
    pattern: VALIDATION_PATTERNS.strongPassword
  },
  year: {
    required: true,
    min: 1990,
    max: new Date().getFullYear() + 1
  }
} as const

// Validation helper functions
export const validateEmail = (email: string): boolean => {
  return VALIDATION_PATTERNS.email.test(email)
}

export const validatePhoneNumber = (phone: string): boolean => {
  return VALIDATION_PATTERNS.phone.test(phone)
}

export const validateUrl = (url: string): boolean => {
  return VALIDATION_PATTERNS.url.test(url)
}

export const validateStrongPassword = (password: string): boolean => {
  return password.length >= 8 && VALIDATION_PATTERNS.strongPassword.test(password)
}

export const validateYear = (year: string | number): boolean => {
  const yearNum = typeof year === 'string' ? parseInt(year, 10) : year
  return yearNum >= 1990 && yearNum <= new Date().getFullYear() + 1
}
