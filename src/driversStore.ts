import driversData from './data/drivers.json'
import type { Driver } from './types'

export const drivers: Driver[] = driversData as Driver[]

// Create a lookup object for drivers by slug
export const driversBySlug: Record<string, Driver> = drivers.reduce((acc, driver) => {
  if (driver.slug) {
    acc[driver.slug] = driver
  }
  return acc
}, {} as Record<string, Driver>)
