import businessesData from './data/businesses.json'
import type { Business, BusinessRole, SponsorCategory, SupplierCategory } from './types'

export const businesses: Business[] = businessesData as Business[]

export const businessesBySlug: Record<string, Business> = Object.fromEntries(
  businesses.map((b) => [b.slug, b]),
)

export const suppliers = businesses.filter((b) => b.roles.includes('supplier'))
export const sponsors = businesses.filter((b) => b.roles.includes('sponsor'))

export const suppliersByCategory: Record<string, Business[]> = suppliers.reduce(
  (acc, b) => {
    for (const cat of b.supplierCategories || []) {
      acc[cat] = acc[cat] || []
      acc[cat].push(b)
    }
    return acc
  },
  {} as Record<string, Business[]>,
)

export const sponsorsByCategory: Record<string, Business[]> = sponsors.reduce(
  (acc, b) => {
    for (const cat of b.sponsorCategories || []) {
      acc[cat] = acc[cat] || []
      acc[cat].push(b)
    }
    return acc
  },
  {} as Record<string, Business[]>,
)

export const SUPPLIER_CATEGORY_LABELS: Record<SupplierCategory, string> = {
  'engine-builders': 'Engine Builders',
  fabricators: 'Fabricators',
  'fuel-and-lubes': 'Fuel & Lubes',
  transport: 'Transport',
  'race-wear': 'Race Wear',
  'decals-signage': 'Decals & Signage',
  trailers: 'Trailers',
  photographers: 'Photographers',
  'panel-and-paint': 'Panel & Paint',
  parts: 'Parts',
  'tyres-and-wheels': 'Tyres & Wheels',
  'electronics-and-comms': 'Electronics & Comms',
  'safety-gear': 'Safety Gear',
  other: 'Other Suppliers',
}

export const SPONSOR_CATEGORY_LABELS: Record<SponsorCategory, string> = {
  'trades-and-construction': 'Trades & Construction',
  'transport-and-logistics': 'Transport & Logistics',
  hospitality: 'Hospitality',
  retail: 'Retail',
  'automotive-retail': 'Automotive Retail',
  'real-estate': 'Real Estate',
  'farming-and-rural': 'Farming & Rural',
  'professional-services': 'Professional Services',
  'media-and-marketing': 'Media & Marketing',
  'fuel-and-energy': 'Fuel & Energy',
  other: 'Other Sponsors',
}

export function roleLabel(role: BusinessRole): string {
  return role === 'supplier' ? 'Supplier' : 'Sponsor'
}
