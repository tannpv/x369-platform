import type { Vehicle } from '../types/vehicle'
import { generateCarImage } from '../services/carImageService'

// Helper arrays for generating realistic data
const makes = [
  'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi', 
  'Volkswagen', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Lexus', 'Acura', 'Infiniti',
  'Cadillac', 'Lincoln', 'Jeep', 'Ram', 'GMC', 'Buick', 'Chrysler', 'Dodge',
  'Volvo', 'Tesla', 'Porsche', 'Jaguar', 'Land Rover', 'Mini'
]

const modelsByMake: Record<string, string[]> = {
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Tacoma', 'Tundra', 'Sienna', 'Avalon', 'C-HR'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit', 'HR-V', 'Passport', 'Ridgeline', 'Insight', 'Odyssey'],
  'Ford': ['F-150', 'Escape', 'Explorer', 'Focus', 'Mustang', 'Edge', 'Expedition', 'Ranger', 'Bronco', 'Transit'],
  'Chevrolet': ['Silverado', 'Equinox', 'Malibu', 'Tahoe', 'Suburban', 'Colorado', 'Camaro', 'Corvette', 'Blazer', 'Traverse'],
  'Nissan': ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Titan', 'Frontier', 'Murano', 'Armada', 'Versa', 'Maxima'],
  'BMW': ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'X7', 'i3', 'i8', 'Z4', 'X1'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'GLS', 'A-Class', 'CLA', 'GLA', 'G-Class'],
  'Audi': ['A3', 'A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8'],
  'Volkswagen': ['Jetta', 'Passat', 'Tiguan', 'Atlas', 'Golf', 'Beetle', 'Arteon', 'ID.4', 'Touareg', 'CC'],
  'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Kona', 'Venue', 'Genesis', 'Veloster', 'Ioniq'],
  'Kia': ['Forte', 'Optima', 'Sorento', 'Telluride', 'Sportage', 'Soul', 'Rio', 'Stinger', 'Niro', 'Carnival'],
  'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck', 'Roadster'],
  'Lexus': ['ES', 'IS', 'LS', 'RX', 'GX', 'LX', 'NX', 'UX', 'LC', 'RC'],
  'Acura': ['TLX', 'ILX', 'RDX', 'MDX', 'NSX', 'TSX', 'RSX', 'RL', 'TL', 'ZDX']
}

const colors = [
  'White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Brown', 'Gold', 'Orange',
  'Yellow', 'Purple', 'Maroon', 'Navy', 'Teal', 'Lime', 'Cyan', 'Magenta', 'Tan', 'Beige'
]

const locations = [
  'Downtown Depot', 'Airport Terminal', 'North Station', 'South Hub', 'East Side Lot',
  'West End Plaza', 'Central Mall', 'Business District', 'University Campus', 'Shopping Center',
  'Train Station', 'Convention Center', 'Hotel District', 'Industrial Park', 'Residential Area'
]

const features = [
  'GPS Navigation', 'Bluetooth', 'Backup Camera', 'Heated Seats', 'Sunroof', 'Leather Interior',
  'Cruise Control', 'Keyless Entry', 'Premium Sound', 'USB Ports', 'Wireless Charging',
  'Apple CarPlay', 'Android Auto', 'Lane Departure Warning', 'Blind Spot Monitor',
  'Adaptive Cruise Control', 'Parking Sensors', 'Remote Start', 'Dual Zone Climate',
  '360 Camera', 'Head-up Display', 'Ventilated Seats', 'Heated Steering Wheel'
]

// Helper function to get random item from array
const getRandomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)]

// Helper function to get random items from array
const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Helper function to generate random number in range
const getRandomNumber = (min: number, max: number): number => 
  Math.floor(Math.random() * (max - min + 1)) + min

// Helper function to generate license plate
const generateLicensePlate = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  
  // Format: ABC-1234
  let plate = ''
  for (let i = 0; i < 3; i++) {
    plate += letters[Math.floor(Math.random() * letters.length)]
  }
  plate += '-'
  for (let i = 0; i < 4; i++) {
    plate += numbers[Math.floor(Math.random() * numbers.length)]
  }
  
  return plate
}

// Helper function to generate VIN
const generateVIN = (): string => {
  const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789'
  let vin = ''
  for (let i = 0; i < 17; i++) {
    vin += chars[Math.floor(Math.random() * chars.length)]
  }
  return vin
}



// Generate 200 vehicles
export const vehicleSeedData: Vehicle[] = Array.from({ length: 200 }, (_, index) => {
  const make = getRandomItem(makes)
  const availableModels = modelsByMake[make] || ['Model A', 'Model B', 'Model C']
  const model = getRandomItem(availableModels)
  const year = getRandomNumber(2018, 2024)
  
  // Determine vehicle type based on model name
  let type: Vehicle['type'] = 'Sedan'
  const modelLower = model.toLowerCase()
  if (modelLower.includes('suv') || modelLower.includes('x') || 
      ['rav4', 'cr-v', 'escape', 'equinox', 'rogue', 'tucson', 'sorento', 'rx', 'rdx'].some(suv => modelLower.includes(suv))) {
    type = 'SUV'
  } else if (['f-150', 'silverado', 'titan', 'tacoma', 'tundra', 'ranger', 'colorado', 'frontier'].some(truck => modelLower.includes(truck))) {
    type = 'Truck'
  } else if (['sienna', 'odyssey', 'transit', 'carnival'].some(van => modelLower.includes(van))) {
    type = 'Van'
  } else if (['mustang', 'camaro', 'corvette', 'z4', 'tt', 'r8'].some(coupe => modelLower.includes(coupe))) {
    type = 'Coupe'
  } else if (['fit', 'rio', 'versa', 'golf'].some(hatch => modelLower.includes(hatch))) {
    type = 'Hatchback'
  }
  
  // Determine fuel type based on make and model
  let fuelType: Vehicle['fuelType'] = 'Gasoline'
  if (make === 'Tesla' || model.includes('i3') || model.includes('ID.4') || model.includes('Ioniq')) {
    fuelType = 'Electric'
  } else if (model.includes('Prius') || model.includes('Insight') || model.includes('Niro')) {
    fuelType = 'Hybrid'
  } else if (type === 'Truck' && Math.random() > 0.7) {
    fuelType = 'Diesel'
  }
  
  // Determine seats based on type
  let seats: number
  switch (type) {
    case 'Truck':
      seats = getRandomItem([2, 4, 5])
      break
    case 'Van':
      seats = getRandomItem([7, 8, 9])
      break
    case 'SUV':
      seats = getRandomItem([5, 7, 8])
      break
    case 'Coupe':
      seats = getRandomItem([2, 4])
      break
    default:
      seats = getRandomItem([4, 5])
  }
  
  // Determine transmission (luxury brands more likely to have automatic)
  const isLuxury = ['BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Acura', 'Infiniti', 'Cadillac', 'Lincoln'].includes(make)
  const transmission: Vehicle['transmission'] = isLuxury || Math.random() > 0.15 ? 'Automatic' : getRandomItem(['Manual', 'CVT'])
  
  // Generate realistic daily rate based on make, year, and type
  let baseRate = 35
  if (isLuxury) baseRate += 40
  if (year >= 2022) baseRate += 15
  if (year >= 2024) baseRate += 10
  if (type === 'SUV') baseRate += 20
  if (type === 'Truck') baseRate += 25
  if (type === 'Van') baseRate += 30
  if (fuelType === 'Electric') baseRate += 15
  if (fuelType === 'Hybrid') baseRate += 10
  
  const dailyRate = baseRate + getRandomNumber(-10, 20)
  
  // Generate status with realistic distribution
  const statusWeights = { 'Available': 0.6, 'Rented': 0.25, 'Maintenance': 0.1, 'Reserved': 0.05 }
  const rand = Math.random()
  let status: Vehicle['status'] = 'Available'
  if (rand < statusWeights.Maintenance) status = 'Maintenance'
  else if (rand < statusWeights.Maintenance + statusWeights.Reserved) status = 'Reserved'
  else if (rand < statusWeights.Maintenance + statusWeights.Reserved + statusWeights.Rented) status = 'Rented'
  
  // Generate mileage based on year
  const maxMileage = (2024 - year) * 12000 + getRandomNumber(-5000, 10000)
  const mileage = Math.max(0, maxMileage)
  
  // Generate dates
  const createdDate = new Date(2023, getRandomNumber(0, 11), getRandomNumber(1, 28))
  const lastServiceDate = new Date(createdDate.getTime() + getRandomNumber(30, 300) * 24 * 60 * 60 * 1000)
  const nextServiceDate = new Date(lastServiceDate.getTime() + getRandomNumber(90, 180) * 24 * 60 * 60 * 1000)
  
  return {
    id: `V${String(index + 1).padStart(3, '0')}`,
    make,
    model,
    year,
    type,
    fuelType,
    transmission,
    dailyRate,
    status,
    licensePlate: generateLicensePlate(),
    vin: generateVIN(),
    color: getRandomItem(colors),
    seats,
    mileage,
    features: getRandomItems(features, getRandomNumber(3, 8)),
    image: generateCarImage(make, model, type, year),
    description: `${year} ${make} ${model} - ${type.toLowerCase()} with ${fuelType.toLowerCase()} engine and ${transmission.toLowerCase()} transmission. Perfect for ${type === 'SUV' ? 'family trips and adventures' : type === 'Truck' ? 'hauling and work projects' : type === 'Van' ? 'group travel and moving' : 'city driving and commuting'}.`,
    location: getRandomItem(locations),
    lastService: lastServiceDate.toISOString().split('T')[0],
    nextService: nextServiceDate.toISOString().split('T')[0],
    rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
    totalBookings: getRandomNumber(5, 150),
    revenue: getRandomNumber(1000, 25000),
    createdAt: createdDate.toISOString(),
    updatedAt: new Date(createdDate.getTime() + getRandomNumber(1, 30) * 24 * 60 * 60 * 1000).toISOString()
  }
})

// Helper function to get vehicles by status
export const getVehiclesByStatus = (status: Vehicle['status']): Vehicle[] => {
  return vehicleSeedData.filter(vehicle => vehicle.status === status)
}

// Helper function to get vehicles by type
export const getVehiclesByType = (type: Vehicle['type']): Vehicle[] => {
  return vehicleSeedData.filter(vehicle => vehicle.type === type)
}

// Helper function to get vehicles by make
export const getVehiclesByMake = (make: string): Vehicle[] => {
  return vehicleSeedData.filter(vehicle => vehicle.make === make)
}

// Helper function to get vehicles by year range
export const getVehiclesByYearRange = (minYear: number, maxYear: number): Vehicle[] => {
  return vehicleSeedData.filter(vehicle => vehicle.year >= minYear && vehicle.year <= maxYear)
}

// Helper function to get luxury vehicles
export const getLuxuryVehicles = (): Vehicle[] => {
  const luxuryMakes = ['BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Acura', 'Infiniti', 'Cadillac', 'Lincoln', 'Tesla', 'Porsche', 'Jaguar']
  return vehicleSeedData.filter(vehicle => luxuryMakes.includes(vehicle.make))
}

// Helper function to get electric vehicles
export const getElectricVehicles = (): Vehicle[] => {
  return vehicleSeedData.filter(vehicle => vehicle.fuelType === 'Electric')
}

// Statistics
export const vehicleStats = {
  total: vehicleSeedData.length,
  available: getVehiclesByStatus('Available').length,
  rented: getVehiclesByStatus('Rented').length,
  maintenance: getVehiclesByStatus('Maintenance').length,
  reserved: getVehiclesByStatus('Reserved').length,
  byType: {
    sedan: getVehiclesByType('Sedan').length,
    suv: getVehiclesByType('SUV').length,
    truck: getVehiclesByType('Truck').length,
    van: getVehiclesByType('Van').length,
    coupe: getVehiclesByType('Coupe').length,
    hatchback: getVehiclesByType('Hatchback').length
  },
  byFuelType: {
    gasoline: vehicleSeedData.filter(v => v.fuelType === 'Gasoline').length,
    diesel: vehicleSeedData.filter(v => v.fuelType === 'Diesel').length,
    electric: vehicleSeedData.filter(v => v.fuelType === 'Electric').length,
    hybrid: vehicleSeedData.filter(v => v.fuelType === 'Hybrid').length
  },
  averageRate: Number((vehicleSeedData.reduce((sum, v) => sum + v.dailyRate, 0) / vehicleSeedData.length).toFixed(2)),
  totalRevenue: vehicleSeedData.reduce((sum, v) => sum + (v.revenue || 0), 0)
}

export default vehicleSeedData
