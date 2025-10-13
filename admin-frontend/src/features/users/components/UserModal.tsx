import React, { useState, useEffect } from 'react'
import { Modal, Button, Input, Select } from '../../../components/ui'
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from '../../../shared/constants/user'
import { validateEmail, validatePhoneNumber } from '../../../shared/utils/validation'
import type { User, CreateUserPayload, UpdateUserPayload, UserRole, UserStatus } from '../../../shared/types/user'

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateUserPayload | UpdateUserPayload) => Promise<void>
  mode: 'create' | 'edit' | 'view'
  user?: User
  loading?: boolean
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  status: string
  dateOfBirth: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface FormErrors {
  [key: string]: string
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  user,
  loading = false
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'customer',
    status: 'active',
    dateOfBirth: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form data when user prop changes
  useEffect(() => {
    if (user && (mode === 'edit' || mode === 'view')) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        status: user.status,
        dateOfBirth: user.dateOfBirth || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || 'USA'
      })
    } else if (mode === 'create') {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'customer',
        status: 'active',
        dateOfBirth: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
      })
    }
    setErrors({})
  }, [user, mode])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.phone && !validatePhoneNumber(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    // Date validation
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      
      if (age < 18 || age > 100) {
        newErrors.dateOfBirth = 'User must be between 18 and 100 years old'
      }
    }



    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const payload = mode === 'create' 
        ? {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone || undefined,
            role: formData.role as UserRole,
            dateOfBirth: formData.dateOfBirth || undefined,
            address: {
              street: formData.street,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              country: formData.country
            }
          } as CreateUserPayload
        : {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone || undefined,
            role: formData.role as UserRole,
            status: formData.status as UserStatus,
            dateOfBirth: formData.dateOfBirth || undefined,
            address: {
              street: formData.street,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              country: formData.country
            }
          } as UpdateUserPayload

      await onSubmit(payload)
    } catch (error) {
      console.error('Failed to submit user data:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  const isReadOnly = mode === 'view'
  const title = mode === 'create' ? 'Add New User' : mode === 'edit' ? 'Edit User' : 'User Details'

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              error={errors.firstName}
              required
              disabled={isReadOnly}
            />

            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              error={errors.lastName}
              required
              disabled={isReadOnly}
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              required
              disabled={isReadOnly}
            />

            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              error={errors.phone}
              disabled={isReadOnly}
              placeholder="+1 (555) 123-4567"
            />

            <Select
              label="Role"
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              options={USER_ROLE_OPTIONS}
              disabled={isReadOnly}
            />

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              options={USER_STATUS_OPTIONS}
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              error={errors.dateOfBirth}
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* Address Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Street Address"
              value={formData.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              disabled={isReadOnly}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                disabled={isReadOnly}
              />

              <Input
                label="State"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                disabled={isReadOnly}
              />

              <Input
                label="ZIP Code"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                disabled={isReadOnly}
              />

              <Input
                label="Country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        {!isReadOnly && (
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={loading}
            >
              {mode === 'create' ? 'Create User' : 'Update User'}
            </Button>
          </div>
        )}

        {isReadOnly && (
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        )}
      </form>
    </Modal>
  )
}

export default UserModal
