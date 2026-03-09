const fs = require('fs')
const path = require('path')

// Read existing drivers
const driversPath = path.join(__dirname, '../src/data/drivers.json')
const drivers = JSON.parse(fs.readFileSync(driversPath, 'utf8'))

// Function to create URL-friendly slug
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Enhance each driver with slug and additional fields
const enhancedDrivers = drivers.map(driver => ({
  ...driver,
  slug: createSlug(driver.name),
  // Add missing fields with defaults
  bio: driver.bio || null,
  carMake: driver.car || null,
  carModel: driver.carModel || null,
  carYear: driver.carYear || null,
  team: driver.team || null,
  sponsors: driver.sponsors || [],
  facebook: driver.facebook || null,
  instagram: driver.instagram || null,
  website: driver.website || null,
  photo: driver.photo || null,
  championships: driver.championships || [],
  careerStats: driver.careerStats || {
    totalWins: null,
    nationalTitles: null,
    yearsRacing: null
  }
}))

// Write enhanced data
fs.writeFileSync(driversPath, JSON.stringify(enhancedDrivers, null, 2))
console.log(`✓ Enhanced ${enhancedDrivers.length} driver profiles with slugs and fields`)
