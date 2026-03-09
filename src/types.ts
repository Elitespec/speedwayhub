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
  status?: 'Open' | 'Closed' | 'Season Break'
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
}
