/**
 * User seed data generator
 * Generates realistic user data for testing and development
 */

import type { User, UserRole, UserStatus } from '../types/user'

// Sample data arrays for generating realistic users
const FIRST_NAMES = {
  male: [
    'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher',
    'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua',
    'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Jason', 'Edward', 'Jeffrey', 'Ryan',
    'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon',
    'Benjamin', 'Samuel', 'Gregory', 'Alexander', 'Frank', 'Raymond', 'Jack', 'Dennis', 'Jerry', 'Tyler'
  ],
  female: [
    'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
    'Nancy', 'Lisa', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle',
    'Laura', 'Sarah', 'Kimberly', 'Deborah', 'Dorothy', 'Lisa', 'Nancy', 'Karen', 'Betty', 'Helen',
    'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle', 'Laura', 'Sarah', 'Kimberly', 'Deborah',
    'Amy', 'Angela', 'Ashley', 'Brenda', 'Emma', 'Olivia', 'Cynthia', 'Marie', 'Janet', 'Catherine'
  ]
}

const LAST_names = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
  'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper',
  'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
  'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
  'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'
]

const CITIES_STATES = [
  { city: 'New York', state: 'NY', zipCode: '10001' },
  { city: 'Los Angeles', state: 'CA', zipCode: '90210' },
  { city: 'Chicago', state: 'IL', zipCode: '60601' },
  { city: 'Houston', state: 'TX', zipCode: '77001' },
  { city: 'Phoenix', state: 'AZ', zipCode: '85001' },
  { city: 'Philadelphia', state: 'PA', zipCode: '19101' },
  { city: 'San Antonio', state: 'TX', zipCode: '78201' },
  { city: 'San Diego', state: 'CA', zipCode: '92101' },
  { city: 'Dallas', state: 'TX', zipCode: '75201' },
  { city: 'San Jose', state: 'CA', zipCode: '95101' },
  { city: 'Austin', state: 'TX', zipCode: '73301' },
  { city: 'Jacksonville', state: 'FL', zipCode: '32099' },
  { city: 'Fort Worth', state: 'TX', zipCode: '76101' },
  { city: 'Columbus', state: 'OH', zipCode: '43085' },
  { city: 'Charlotte', state: 'NC', zipCode: '28201' },
  { city: 'San Francisco', state: 'CA', zipCode: '94102' },
  { city: 'Indianapolis', state: 'IN', zipCode: '46201' },
  { city: 'Seattle', state: 'WA', zipCode: '98101' },
  { city: 'Denver', state: 'CO', zipCode: '80014' },
  { city: 'Boston', state: 'MA', zipCode: '02108' },
  { city: 'El Paso', state: 'TX', zipCode: '79901' },
  { city: 'Detroit', state: 'MI', zipCode: '48201' },
  { city: 'Nashville', state: 'TN', zipCode: '37201' },
  { city: 'Portland', state: 'OR', zipCode: '97201' },
  { city: 'Memphis', state: 'TN', zipCode: '37501' },
  { city: 'Oklahoma City', state: 'OK', zipCode: '73101' },
  { city: 'Las Vegas', state: 'NV', zipCode: '89101' },
  { city: 'Louisville', state: 'KY', zipCode: '40201' },
  { city: 'Baltimore', state: 'MD', zipCode: '21201' },
  { city: 'Milwaukee', state: 'WI', zipCode: '53201' },
  { city: 'Albuquerque', state: 'NM', zipCode: '87101' },
  { city: 'Tucson', state: 'AZ', zipCode: '85701' },
  { city: 'Fresno', state: 'CA', zipCode: '93650' },
  { city: 'Mesa', state: 'AZ', zipCode: '85201' },
  { city: 'Sacramento', state: 'CA', zipCode: '94203' },
  { city: 'Atlanta', state: 'GA', zipCode: '30301' },
  { city: 'Kansas City', state: 'MO', zipCode: '64101' },
  { city: 'Colorado Springs', state: 'CO', zipCode: '80901' },
  { city: 'Miami', state: 'FL', zipCode: '33101' },
  { city: 'Raleigh', state: 'NC', zipCode: '27601' },
  { city: 'Omaha', state: 'NE', zipCode: '68101' },
  { city: 'Long Beach', state: 'CA', zipCode: '90801' },
  { city: 'Virginia Beach', state: 'VA', zipCode: '23450' },
  { city: 'Oakland', state: 'CA', zipCode: '94601' },
  { city: 'Minneapolis', state: 'MN', zipCode: '55401' },
  { city: 'Tulsa', state: 'OK', zipCode: '74101' },
  { city: 'Arlington', state: 'TX', zipCode: '76010' },
  { city: 'Tampa', state: 'FL', zipCode: '33601' },
  { city: 'New Orleans', state: 'LA', zipCode: '70112' },
  { city: 'Wichita', state: 'KS', zipCode: '67201' }
]

const STREET_NAMES = [
  'Main St', 'First St', 'Second St', 'Third St', 'Park Ave', 'Oak St', 'Pine St', 'Maple Ave',
  'Cedar St', 'Elm St', 'Washington St', 'Lake St', 'Hill St', 'Spring St', 'Church St',
  'Sunset Blvd', 'Broadway', 'Lincoln Ave', 'Jefferson St', 'Madison Ave', 'Monroe St',
  'Jackson Ave', 'Adams St', 'Wilson Ave', 'Johnson St', 'Williams Ave', 'Brown St',
  'Davis Ave', 'Miller St', 'Wilson Ave', 'Moore St', 'Taylor Ave', 'Anderson St',
  'Thomas Ave', 'Jackson St', 'White Ave', 'Harris St', 'Martin Ave', 'Thompson St',
  'Garcia Ave', 'Martinez St', 'Robinson Ave', 'Clark St', 'Rodriguez Ave', 'Lewis St',
  'Lee Ave', 'Walker St', 'Hall Ave', 'Allen St', 'Young Ave', 'Hernandez St'
]

const EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'protonmail.com', 'zoho.com', 'mail.com', 'yandex.com'
]

// Avatar URLs from Unsplash for diverse, professional-looking profile pictures
const AVATAR_URLS = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1539571696986-004b3e14cb29?w=150&h=150&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=150&h=150&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1619946794135-5bc917a27793?w=150&h=150&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1628890923662-2cb23c2e0cfe?w=150&h=150&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=150&h=150&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1664574654529-b60630f33fdb?w=150&h=150&fit=crop&auto=format&q=80'
]

// Utility functions
const randomChoice = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)]
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min
const randomFloat = (min: number, max: number, decimals = 2): number => 
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals))

const formatPhoneNumber = (): string => {
  const areaCode = randomInt(200, 999)
  const exchange = randomInt(200, 999)
  const number = randomInt(1000, 9999)
  return `+1-${areaCode}-${exchange}-${number}`
}

const generateEmail = (firstName: string, lastName: string): string => {
  const domain = randomChoice(EMAIL_DOMAINS)
  const variations = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()}${randomInt(1, 999)}@${domain}`,
    `${firstName.charAt(0).toLowerCase()}${lastName.toLowerCase()}@${domain}`
  ]
  return randomChoice(variations)
}

const generateDateOfBirth = (): string => {
  const year = randomInt(1950, 2006) // Ages 18-74
  const month = randomInt(1, 12)
  const day = randomInt(1, 28) // Avoid month-end issues
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}

const generateJoinDate = (): string => {
  const startDate = new Date('2020-01-01')
  const endDate = new Date('2024-12-31')
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
  return new Date(randomTime).toISOString()
}

const generateLastLogin = (memberSince: string): string | undefined => {
  // 10% chance of never logging in
  if (Math.random() < 0.1) return undefined
  
  const memberDate = new Date(memberSince)
  const now = new Date()
  const randomTime = memberDate.getTime() + Math.random() * (now.getTime() - memberDate.getTime())
  return new Date(randomTime).toISOString()
}

const generateUserStats = (role: UserRole, memberSince: string): {
  totalBookings: number
  totalSpent: number
  rating: number
} => {
  const monthsSinceMember = (new Date().getTime() - new Date(memberSince).getTime()) / (1000 * 60 * 60 * 24 * 30)
  
  if (role === 'driver') {
    return {
      totalBookings: randomInt(0, Math.floor(monthsSinceMember * 8)), // Drivers complete bookings
      totalSpent: 0, // Drivers don't spend, they earn
      rating: randomFloat(4.0, 5.0, 1)
    }
  } else if (role === 'customer') {
    const bookings = randomInt(0, Math.floor(monthsSinceMember * 3))
    return {
      totalBookings: bookings,
      totalSpent: bookings * randomFloat(50, 500),
      rating: bookings > 0 ? randomFloat(3.5, 5.0, 1) : 0
    }
  } else {
    return {
      totalBookings: 0,
      totalSpent: 0,
      rating: 0
    }
  }
}

const getRoleDistribution = (index: number): UserRole => {
  // Role distribution: 70% customers, 20% drivers, 8% managers, 2% admins
  if (index < 2) return 'admin'
  if (index < 10) return 'manager' 
  if (index < 30) return 'driver'
  return 'customer'
}

const getStatusDistribution = (role: UserRole): UserStatus => {
  if (role === 'admin' || role === 'manager') {
    return Math.random() < 0.95 ? 'active' : 'inactive'
  }
  
  const rand = Math.random()
  if (rand < 0.75) return 'active'
  if (rand < 0.85) return 'inactive'
  if (rand < 0.95) return 'pending'
  return 'suspended'
}

/**
 * Generate a single user with realistic data
 */
const generateUser = (index: number): User => {
  const gender = Math.random() < 0.5 ? 'male' : 'female'
  const firstName = randomChoice(FIRST_NAMES[gender])
  const lastName = randomChoice(LAST_names)
  const role = getRoleDistribution(index)
  const status = getStatusDistribution(role)
  const location = randomChoice(CITIES_STATES)
  const streetNumber = randomInt(100, 9999)
  const streetName = randomChoice(STREET_NAMES)
  const memberSince = generateJoinDate()
  const stats = generateUserStats(role, memberSince)
  
  return {
    id: `U${String(index + 1).padStart(3, '0')}`,
    firstName,
    lastName,
    email: generateEmail(firstName, lastName),
    phone: formatPhoneNumber(),
    role,
    status,
    avatar: randomChoice(AVATAR_URLS),
    emailVerified: status !== 'pending' && Math.random() < 0.9,
    lastLogin: generateLastLogin(memberSince),
    dateOfBirth: generateDateOfBirth(),
    address: {
      street: `${streetNumber} ${streetName}`,
      city: location.city,
      state: location.state,
      zipCode: location.zipCode,
      country: 'USA'
    },
    totalBookings: stats.totalBookings,
    totalSpent: stats.totalSpent,
    rating: stats.rating,
    memberSince,
    createdAt: memberSince,
    updatedAt: memberSince
  }
}

/**
 * Generate array of users with realistic data
 */
export const generateUsers = (count: number = 100): User[] => {
  return Array.from({ length: count }, (_, index) => generateUser(index))
}

/**
 * Pre-generated seed data for 100 users
 */
export const USER_SEED_DATA: User[] = generateUsers(100)

/**
 * Get users by role
 */
export const getUsersByRole = (role: UserRole): User[] => {
  return USER_SEED_DATA.filter(user => user.role === role)
}

/**
 * Get users by status
 */
export const getUsersByStatus = (status: UserStatus): User[] => {
  return USER_SEED_DATA.filter(user => user.status === status)
}

/**
 * Get user statistics
 */
export const getUserStats = () => {
  const total = USER_SEED_DATA.length
  const active = USER_SEED_DATA.filter(u => u.status === 'active').length
  const inactive = USER_SEED_DATA.filter(u => u.status === 'inactive').length
  const suspended = USER_SEED_DATA.filter(u => u.status === 'suspended').length
  const pending = USER_SEED_DATA.filter(u => u.status === 'pending').length
  
  const thisMonth = new Date()
  thisMonth.setMonth(thisMonth.getMonth() - 1)
  const newThisMonth = USER_SEED_DATA.filter(u => u.createdAt && new Date(u.createdAt) > thisMonth).length
  
  const totalRevenue = USER_SEED_DATA.reduce((sum, u) => sum + (u.totalSpent || 0), 0)
  const ratingsSum = USER_SEED_DATA.filter(u => u.rating && u.rating > 0).reduce((sum, u) => sum + (u.rating || 0), 0)
  const ratingsCount = USER_SEED_DATA.filter(u => u.rating && u.rating > 0).length
  const averageRating = ratingsCount > 0 ? ratingsSum / ratingsCount : 0
  
  const byRole = {
    admin: USER_SEED_DATA.filter(u => u.role === 'admin').length,
    manager: USER_SEED_DATA.filter(u => u.role === 'manager').length,
    customer: USER_SEED_DATA.filter(u => u.role === 'customer').length,
    driver: USER_SEED_DATA.filter(u => u.role === 'driver').length
  }
  
  return {
    total,
    active,
    inactive,
    suspended,
    pending,
    newThisMonth,
    totalRevenue,
    averageRating: parseFloat(averageRating.toFixed(1)),
    byRole
  }
}

// Export individual users for specific testing
export const SAMPLE_USERS = {
  admin: USER_SEED_DATA.find(u => u.role === 'admin')!,
  manager: USER_SEED_DATA.find(u => u.role === 'manager')!,
  customer: USER_SEED_DATA.find(u => u.role === 'customer')!,
  driver: USER_SEED_DATA.find(u => u.role === 'driver')!,
  active: USER_SEED_DATA.find(u => u.status === 'active')!,
  inactive: USER_SEED_DATA.find(u => u.status === 'inactive')!,
  pending: USER_SEED_DATA.find(u => u.status === 'pending')!,
  suspended: USER_SEED_DATA.find(u => u.status === 'suspended')!
}
