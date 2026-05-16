export type Track = {
  id: number
  slug: string
  name: string
  logo: string
  photo?: string
  island: 'North' | 'South'
  region: string
  city: string
  coords: [number, number]
  classes: string[]
  website?: string
  facebook?: string
  openingMonths: string
  description: string
  facilities?: string[]
  phone?: string
  email?: string
  address?: string
  videoUrl?: string
  videos?: { id: string; title: string }[]
  photos?: string[]
  admissionPrices?: {
    adults?: string
    children?: string
    family?: string
    seniors?: string
    students?: string
  }
  surface?: 'Dirt' | 'Clay' | 'Mixed'
  trackLength?: string
  status?: 'Open' | 'Closed' | 'Season Break' | 'Heritage'
  // Heritage/history fields
  yearsActive?: string
  closedYear?: number
  openedYear?: number
  formerNames?: string[]
  notableEvents?: string[]
  historicalNotes?: string
}

export type EventStatus = 'upcoming' | 'live' | 'completed' | 'cancelled' | 'postponed'

export type Event = {
  id: number
  slug: string
  title: string
  date: string
  trackSlug: string
  summary: string
  url?: string
  status?: EventStatus
  startTime?: string
  gateOpenTime?: string
  ticketUrl?: string
  streamUrl?: string
  videoUrl?: string
  results?: {
    winner?: string
    podium?: string[]
    highlights?: string
    resultsUrl?: string
  }
  classes?: string[]
}

export type Driver = {
  id: number
  name: string
  number: string
  classes: string[]
  homeTrack: string
  region?: string
  team?: string
  sponsors?: string[]
  facebook?: string
  instagram?: string
  website?: string
  car?: string
  photo?: string
  championships?: string[]
  bio?: string
  slug: string
}

export type Team = {
  id: number
  name: string
  slug: string
  class: string
  homeTrack: string
  region: string
  championships: string[]
  description: string
  roster?: string[]
}

export type BusinessRole = 'supplier' | 'sponsor'

export type SupplierCategory =
  | 'engine-builders'
  | 'fabricators'
  | 'fuel-and-lubes'
  | 'transport'
  | 'race-wear'
  | 'decals-signage'
  | 'trailers'
  | 'photographers'
  | 'panel-and-paint'
  | 'parts'
  | 'tyres-and-wheels'
  | 'electronics-and-comms'
  | 'safety-gear'
  | 'other'

export type SponsorCategory =
  | 'trades-and-construction'
  | 'transport-and-logistics'
  | 'hospitality'
  | 'retail'
  | 'automotive-retail'
  | 'real-estate'
  | 'farming-and-rural'
  | 'professional-services'
  | 'media-and-marketing'
  | 'fuel-and-energy'
  | 'other'

export type Business = {
  id: number
  slug: string
  name: string
  roles: BusinessRole[]
  supplierCategories?: SupplierCategory[]
  sponsorCategories?: SponsorCategory[]
  town?: string
  region?: string
  island?: 'North' | 'South'
  description?: string
  website?: string
  facebook?: string
  instagram?: string
  email?: string
  phone?: string
  logo?: string
  photos?: string[]
  sponsoredDrivers?: string[]
  sponsoredTeams?: string[]
  activeAtTracks?: string[]
  claimed: boolean
  claimedAt?: string
  source?: string
  addedAt: string
}
