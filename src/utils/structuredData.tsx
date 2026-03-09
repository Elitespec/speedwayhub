import React from 'react'
import type { Event, Track } from '../types'

export const addStructuredData = (data: object) => {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.text = JSON.stringify(data)
  script.id = 'structured-data'
  
  // Remove existing structured data
  const existing = document.getElementById('structured-data')
  if (existing) {
    existing.remove()
  }
  
  document.head.appendChild(script)
}

export const EventStructuredData: React.FC<{ event: Event; track?: Track }> = ({ event, track }) => {
  React.useEffect(() => {
    const startDate = new Date(event.date + (event.startTime ? `T${event.startTime}` : 'T18:00:00'))
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000)

    const data = {
      '@context': 'https://schema.org',
      '@type': 'SportsEvent',
      name: event.title,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      description: event.summary,
      ...(track && {
        location: {
          '@type': 'Place',
          name: track.name,
          address: {
            '@type': 'PostalAddress',
            addressLocality: track.city,
            addressRegion: track.region,
            addressCountry: 'NZ',
          },
        },
      }),
      ...(event.url && { url: event.url }),
      ...(event.ticketUrl && {
        offers: {
          '@type': 'Offer',
          url: event.ticketUrl,
          availability: 'https://schema.org/InStock',
        },
      }),
    }

    addStructuredData(data)
  }, [event, track])

  return null
}

export const TrackStructuredData: React.FC<{ track: Track }> = ({ track }) => {
  React.useEffect(() => {
    // Create multiple schemas for comprehensive coverage
    const schemas = [
      // SportsActivityLocation schema for sports search
      {
        '@context': 'https://schema.org',
        '@type': 'SportsActivityLocation',
        name: track.name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: track.city,
          addressRegion: track.region,
          addressCountry: 'NZ',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: track.coords[0],
          longitude: track.coords[1],
        },
        description: track.description,
        ...(track.website && { url: track.website }),
        ...(track.phone && { telephone: track.phone }),
      },
      // LocalBusiness schema for local SEO
      {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `https://speedwayhub.nz/tracks/${track.slug}`,
        name: track.name,
        description: track.description,
        image: track.photo ? `https://speedwayhub.nz${track.photo}` : undefined,
        address: {
          '@type': 'PostalAddress',
          addressLocality: track.city,
          addressRegion: track.region,
          addressCountry: 'NZ',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: track.coords[0],
          longitude: track.coords[1],
        },
        ...(track.website && { url: track.website }),
        ...(track.phone && { telephone: track.phone }),
        ...(track.facebook && { sameAs: [track.facebook] }),
        openingHoursSpecification: track.openingMonths ? {
          '@type': 'OpeningHoursSpecification',
          description: `Season: ${track.openingMonths}`,
        } : undefined,
        amenityFeature: track.facilities?.map(facility => ({
          '@type': 'LocationFeatureSpecification',
          name: facility,
          value: true,
        })),
      },
    ]

    // Create a single script with @graph for multiple schemas
    const data = {
      '@context': 'https://schema.org',
      '@graph': schemas,
    }

    addStructuredData(data)
  }, [track])

  return null
}



