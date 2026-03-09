import { useEffect } from 'react'

type SchemaOrgProps = {
  schema: object | object[]
}

export const SchemaOrg: React.FC<SchemaOrgProps> = ({ schema }) => {
  useEffect(() => {
    const scriptId = 'schema-org-jsonld'
    let script = document.getElementById(scriptId) as HTMLScriptElement

    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }

    script.textContent = JSON.stringify(Array.isArray(schema) ? schema : [schema])

    return () => {
      // Cleanup on unmount
      const existingScript = document.getElementById(scriptId)
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [schema])

  return null
}

// Helper functions to generate common schema types

export const createOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SpeedwayHub NZ',
  url: 'https://speedwayhub.nz',
  logo: 'https://speedwayhub.nz/logos/speedwayhub-logo.svg',
  description: 'The ultimate directory for New Zealand Speedway. Find every track, race night, and event across New Zealand.',
  areaServed: {
    '@type': 'Country',
    name: 'New Zealand',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'elitespec2019@gmail.com',
    contactType: 'Customer Service',
  },
  sameAs: [
    'https://www.facebook.com/profile.php?id=61582865643058',
  ],
})

export const createWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SpeedwayHub NZ',
  url: 'https://speedwayhub.nz',
  description: 'Find every speedway track, race night, driver, and event across New Zealand.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://speedwayhub.nz/tracks?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
})

export const createSportsEventSchema = (event: any, track: any) => {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: event.title,
    startDate: event.date,
    eventStatus: event.status === 'cancelled'
      ? 'https://schema.org/EventCancelled'
      : event.status === 'postponed'
        ? 'https://schema.org/EventPostponed'
        : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    sport: 'Speedway Racing',
    ...(event.summary && { description: event.summary }),
    organizer: {
      '@type': 'Organization',
      name: 'SpeedwayHub NZ',
      url: 'https://speedwayhub.nz',
    },
  }

  if (track) {
    schema.location = {
      '@type': 'Place',
      name: track.name,
      url: `https://speedwayhub.nz/tracks/${track.slug}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: track.city,
        addressRegion: track.region,
        addressCountry: 'NZ',
      },
    }
    if (track.coords) {
      schema.location.geo = {
        '@type': 'GeoCoordinates',
        latitude: track.coords[0],
        longitude: track.coords[1],
      }
    }
  }

  if (event.startTime) {
    schema.doorTime = event.gateOpenTime || undefined
  }

  if (event.ticketUrl) {
    schema.offers = {
      '@type': 'Offer',
      url: event.ticketUrl,
      availability: event.status === 'upcoming' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
    }
  }

  if (event.results?.winner) {
    schema.competitor = {
      '@type': 'Person',
      name: event.results.winner,
    }
  }

  return schema
}

export const createEventSchema = (event: {
  title: string
  date: string
  trackName?: string
  trackSlug?: string
  description?: string
  status?: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'SportsEvent',
  name: event.title,
  startDate: event.date,
  eventStatus: event.status === 'completed'
    ? 'https://schema.org/EventScheduled'
    : event.status === 'cancelled'
      ? 'https://schema.org/EventCancelled'
      : event.status === 'postponed'
        ? 'https://schema.org/EventPostponed'
        : 'https://schema.org/EventScheduled',
  ...(event.description && { description: event.description }),
  ...(event.trackName && {
    location: {
      '@type': 'Place',
      name: event.trackName,
      ...(event.trackSlug && {
        url: `https://speedwayhub.nz/tracks/${event.trackSlug}`,
      }),
    },
  }),
  sport: 'Speedway Racing',
  organizer: {
    '@type': 'Organization',
    name: 'SpeedwayHub NZ',
    url: 'https://speedwayhub.nz',
  },
})

export const createDriverSchema = (driver: any) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: driver.name,
  description: driver.bio || undefined,
  url: `https://speedwayhub.nz/drivers/${driver.slug}`,
  sameAs: [driver.facebook, driver.instagram, driver.website].filter(Boolean),
  award: driver.championships?.length ? driver.championships : undefined,
})

export const createTrackSchema = (track: {
  name: string
  slug: string
  description?: string
  website?: string
  facebook?: string
  coords?: [number, number]
  city?: string
  region?: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'SportsActivityLocation',
  name: track.name,
  url: `https://speedwayhub.nz/tracks/${track.slug}`,
  ...(track.description && { description: track.description }),
  ...(track.coords && {
    geo: {
      '@type': 'GeoCoordinates',
      latitude: track.coords[0],
      longitude: track.coords[1],
    },
  }),
  ...(track.city && track.region && {
    address: {
      '@type': 'PostalAddress',
      addressLocality: track.city,
      addressRegion: track.region,
      addressCountry: 'NZ',
    },
  }),
  sport: 'Speedway Racing',
  ...(track.website && {
    sameAs: [
      track.website,
      ...(track.facebook ? [track.facebook] : []),
    ].filter(Boolean),
  }),
})

export const createArticleSchema = (article: {
  title: string
  slug: string
  date: string
  excerpt?: string
  image?: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  url: `https://speedwayhub.nz/news/${article.slug}`,
  datePublished: article.date,
  dateModified: article.date,
  ...(article.excerpt && { description: article.excerpt }),
  ...(article.image && {
    image: `https://speedwayhub.nz${article.image}`,
  }),
  author: {
    '@type': 'Organization',
    name: 'SpeedwayHub NZ',
  },
  publisher: {
    '@type': 'Organization',
    name: 'SpeedwayHub NZ',
    logo: {
      '@type': 'ImageObject',
      url: 'https://speedwayhub.nz/logos/speedwayhub-logo.svg',
    },
  },
})

export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
})
