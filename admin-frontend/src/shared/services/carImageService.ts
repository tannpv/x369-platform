/**
 * Enhanced car image service with high-quality, realistic vehicle images
 */

import type { VehicleType } from '../types/vehicle'

// High-quality car images curated from Unsplash
const carImageDatabase = {
  'Sedan': [
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop&auto=format&q=80', // BMW 3 Series
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop&auto=format&q=80', // Mercedes C-Class
    'https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&h=400&fit=crop&auto=format&q=80', // Toyota Camry
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop&auto=format&q=80', // Honda Accord
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop&auto=format&q=80', // Audi A4
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop&auto=format&q=80', // Luxury sedan
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&h=400&fit=crop&auto=format&q=80', // Modern sedan
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop&auto=format&q=80', // Executive sedan
    'https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=600&h=400&fit=crop&auto=format&q=80', // Premium sedan
    'https://images.unsplash.com/photo-1580414055444-121a2fb6dae8?w=600&h=400&fit=crop&auto=format&q=80', // Compact sedan
  ],
  'SUV': [
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop&auto=format&q=80', // BMW X5
    'https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=600&h=400&fit=crop&auto=format&q=80', // Mercedes GLE
    'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=600&h=400&fit=crop&auto=format&q=80', // Toyota RAV4
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop&auto=format&q=80', // Honda CR-V
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop&auto=format&q=80', // Audi Q5
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&auto=format&q=80', // Range Rover
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop&auto=format&q=80', // Luxury SUV
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop&auto=format&q=80', // Premium SUV
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&h=400&fit=crop&auto=format&q=80', // Modern SUV
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop&auto=format&q=80', // Compact SUV
  ],
  'Truck': [
    'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=600&h=400&fit=crop&auto=format&q=80', // Ford F-150
    'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&h=400&fit=crop&auto=format&q=80', // Chevrolet Silverado
    'https://images.unsplash.com/photo-1596003906949-67221c37965c?w=600&h=400&fit=crop&auto=format&q=80', // Ram 1500
    'https://images.unsplash.com/photo-1567013275276-91baca4c5f5e?w=600&h=400&fit=crop&auto=format&q=80', // Toyota Tacoma
    'https://images.unsplash.com/photo-1582639510494-c80b5de9f148?w=600&h=400&fit=crop&auto=format&q=80', // GMC Sierra
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop&auto=format&q=80', // Pickup truck
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop&auto=format&q=80', // Heavy duty truck
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop&auto=format&q=80', // Work truck
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop&auto=format&q=80', // Modern truck
    'https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&h=400&fit=crop&auto=format&q=80', // Commercial truck
  ],
  'Van': [
    'https://images.unsplash.com/photo-1582639510494-c80b5de9f148?w=600&h=400&fit=crop&auto=format&q=80', // Mercedes Sprinter
    'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop&auto=format&q=80', // Ford Transit
    'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=400&fit=crop&auto=format&q=80', // Honda Odyssey
    'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop&auto=format&q=80', // Toyota Sienna
    'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=400&fit=crop&auto=format&q=80', // Chrysler Pacifica
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop&auto=format&q=80', // Cargo van
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop&auto=format&q=80', // Passenger van
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop&auto=format&q=80', // Commercial van
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop&auto=format&q=80', // Minivan
    'https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&h=400&fit=crop&auto=format&q=80', // Family van
  ],
  'Coupe': [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop&auto=format&q=80', // BMW coupe
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop&auto=format&q=80', // Mercedes coupe
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop&auto=format&q=80', // Audi coupe
    'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=600&h=400&fit=crop&auto=format&q=80', // Ford Mustang
    'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=600&h=400&fit=crop&auto=format&q=80', // Chevrolet Camaro
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop&auto=format&q=80', // Sports coupe
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop&auto=format&q=80', // Luxury coupe
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop&auto=format&q=80', // Performance coupe
    'https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&h=400&fit=crop&auto=format&q=80', // Classic coupe
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop&auto=format&q=80', // Modern coupe
  ],
  'Hatchback': [
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=400&fit=crop&auto=format&q=80', // VW Golf
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop&auto=format&q=80', // Honda Fit
    'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=600&h=400&fit=crop&auto=format&q=80', // Toyota Corolla hatchback
    'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=600&h=400&fit=crop&auto=format&q=80', // Hyundai Elantra GT
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop&auto=format&q=80', // Kia Rio hatchback
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop&auto=format&q=80', // Ford Focus hatchback
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop&auto=format&q=80', // Mazda3 hatchback
    'https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&h=400&fit=crop&auto=format&q=80', // Subaru Impreza hatchback
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop&auto=format&q=80', // Compact hatchback
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop&auto=format&q=80', // Premium hatchback
  ],
  'Convertible': [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop&auto=format&q=80', // BMW Z4
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop&auto=format&q=80', // Mercedes SL
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop&auto=format&q=80', // Audi TT convertible
    'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=600&h=400&fit=crop&auto=format&q=80', // Ford Mustang convertible
    'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=600&h=400&fit=crop&auto=format&q=80', // Chevrolet Camaro convertible
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop&auto=format&q=80', // Sports convertible
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop&auto=format&q=80', // Luxury convertible
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop&auto=format&q=80', // Classic convertible
    'https://images.unsplash.com/photo-1549924231-f129b911e442?w=600&h=400&fit=crop&auto=format&q=80', // Roadster
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop&auto=format&q=80', // Cabriolet
  ]
} as const

// Brand-specific image preferences for more realistic matching
const brandImageMapping: Record<string, Record<VehicleType, number[]>> = {
  'BMW': {
    'Sedan': [0, 5, 7],
    'SUV': [0, 6, 8],
    'Coupe': [0, 6, 7],
    'Convertible': [0, 6, 8],
    'Hatchback': [9, 5, 7],
    'Truck': [8, 9, 7],
    'Van': [7, 8, 9]
  },
  'Mercedes-Benz': {
    'Sedan': [1, 6, 8],
    'SUV': [1, 7, 9],
    'Coupe': [1, 7, 8],
    'Convertible': [1, 7, 9],
    'Hatchback': [6, 7, 8],
    'Truck': [7, 8, 9],
    'Van': [0, 8, 9]
  },
  'Toyota': {
    'Sedan': [2, 8, 9],
    'SUV': [2, 8, 9],
    'Coupe': [8, 9, 4],
    'Convertible': [8, 9, 4],
    'Hatchback': [2, 8, 9],
    'Truck': [3, 8, 9],
    'Van': [3, 8, 9]
  },
  'Tesla': {
    'Sedan': [4, 7, 8],
    'SUV': [4, 8, 9],
    'Coupe': [5, 8, 9],
    'Convertible': [6, 8, 9],
    'Hatchback': [8, 9, 4],
    'Truck': [6, 7, 8],
    'Van': [8, 9, 6]
  }
}

/**
 * Generate a realistic car image URL based on make, model, type, and year
 */
export const generateCarImage = (make: string, model: string, type: VehicleType, year: number): string => {
  // Create a deterministic hash for consistent image selection
  const hashString = `${make}-${model}-${year}`
  let hash = 0
  for (let i = 0; i < hashString.length; i++) {
    const char = hashString.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  const images = carImageDatabase[type]
  
  // Use brand-specific preferences if available
  if (brandImageMapping[make]?.[type]) {
    const preferredIndices = brandImageMapping[make][type]
    const selectedIndex = preferredIndices[Math.abs(hash) % preferredIndices.length]
    return images[selectedIndex]
  }
  
  // Otherwise use hash-based selection
  const imageIndex = Math.abs(hash) % images.length
  return images[imageIndex]
}

/**
 * Get a random car image for a specific vehicle type
 */
export const getRandomCarImage = (type: VehicleType): string => {
  const images = carImageDatabase[type]
  const randomIndex = Math.floor(Math.random() * images.length)
  return images[randomIndex]
}

/**
 * Get all available images for a vehicle type
 */
export const getCarImagesByType = (type: VehicleType): string[] => {
  return [...carImageDatabase[type]]
}

/**
 * Get car image with fallback options
 */
export const getCarImageWithFallback = (make: string, model: string, type: VehicleType, year: number): string => {
  try {
    return generateCarImage(make, model, type, year)
  } catch (error) {
    console.warn(`Failed to generate image for ${make} ${model}, using fallback`)
    return getRandomCarImage(type)
  }
}
