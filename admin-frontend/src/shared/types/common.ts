// Common types used across the application
export interface BaseEntity {
  id: string
  createdAt?: string
  updatedAt?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

export interface TableColumn<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (value: any, item: T) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export interface FormFieldProps {
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface FilterOption extends SelectOption {
  count?: number
}

export interface SearchFilters {
  query?: string
  status?: string
  type?: string
  dateFrom?: string
  dateTo?: string
  [key: string]: any
}

export interface StatsCard {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ComponentType<any>
  color?: string
}

export type ViewMode = 'grid' | 'list' | 'table'
export type SortDirection = 'asc' | 'desc'
export type Theme = 'light' | 'dark' | 'system'
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  actions?: Array<{
    label: string
    action: () => void
  }>
}
