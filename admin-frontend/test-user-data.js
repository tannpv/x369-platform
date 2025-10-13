/**
 * Test script to validate user seed data generation
 */

import { USER_SEED_DATA, getUserStats, getUsersByRole, SAMPLE_USERS } from './src/shared/data/userSeedData.js'

console.log('🧪 Testing User Seed Data System\n')

// Test 1: Basic data generation
console.log('📊 Basic Statistics:')
console.log(`Total Users: ${USER_SEED_DATA.length}`)

const stats = getUserStats()
console.log(`Active Users: ${stats.active}`)
console.log(`Total Revenue: $${stats.totalRevenue.toLocaleString()}`)
console.log(`Average Rating: ${stats.averageRating} stars`)
console.log(`New Users This Month: ${stats.newThisMonth}`)

// Test 2: Role distribution
console.log('\n👥 Role Distribution:')
Object.entries(stats.byRole).forEach(([role, count]) => {
  const percentage = ((count / stats.total) * 100).toFixed(1)
  console.log(`${role}: ${count} users (${percentage}%)`)
})

// Test 3: Status distribution
console.log('\n📈 Status Distribution:')
console.log(`Active: ${stats.active} users`)
console.log(`Inactive: ${stats.inactive} users`)
console.log(`Pending: ${stats.pending} users`)
console.log(`Suspended: ${stats.suspended} users`)

// Test 4: Sample users
console.log('\n🎭 Sample Users:')
console.log(`Admin: ${SAMPLE_USERS.admin.firstName} ${SAMPLE_USERS.admin.lastName}`)
console.log(`Manager: ${SAMPLE_USERS.manager.firstName} ${SAMPLE_USERS.manager.lastName}`)
console.log(`Customer: ${SAMPLE_USERS.customer.firstName} ${SAMPLE_USERS.customer.lastName}`)
console.log(`Driver: ${SAMPLE_USERS.driver.firstName} ${SAMPLE_USERS.driver.lastName}`)

// Test 5: Data validation
console.log('\n✅ Data Validation:')
const hasEmail = USER_SEED_DATA.every(u => u.email && u.email.includes('@'))
const hasNames = USER_SEED_DATA.every(u => u.firstName && u.lastName)
const hasValidRoles = USER_SEED_DATA.every(u => ['admin', 'manager', 'customer', 'driver'].includes(u.role))
const hasValidStatuses = USER_SEED_DATA.every(u => ['active', 'inactive', 'pending', 'suspended'].includes(u.status))

console.log(`All users have emails: ${hasEmail}`)
console.log(`All users have names: ${hasNames}`)
console.log(`All users have valid roles: ${hasValidRoles}`)
console.log(`All users have valid statuses: ${hasValidStatuses}`)

// Test 6: Geographic distribution
console.log('\n🗺️ Geographic Distribution:')
const cities = [...new Set(USER_SEED_DATA.map(u => u.address?.city).filter(Boolean))]
const states = [...new Set(USER_SEED_DATA.map(u => u.address?.state).filter(Boolean))]
console.log(`Cities represented: ${cities.length}`)
console.log(`States represented: ${states.length}`)
console.log(`Sample cities: ${cities.slice(0, 5).join(', ')}...`)

// Test 7: Business metrics
console.log('\n💰 Business Metrics:')
const customers = getUsersByRole('customer')
const drivers = getUsersByRole('driver')
const avgCustomerSpent = customers.reduce((sum, u) => sum + (u.totalSpent || 0), 0) / customers.length
const avgDriverBookings = drivers.reduce((sum, u) => sum + (u.totalBookings || 0), 0) / drivers.length

console.log(`Average customer spending: $${avgCustomerSpent.toFixed(2)}`)
console.log(`Average driver bookings: ${avgDriverBookings.toFixed(1)}`)

console.log('\n🎉 User Seed Data System Test Complete!')
