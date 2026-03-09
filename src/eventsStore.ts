import eventsData from './data/events.json'
import type { Event } from './types'

export const events: Event[] = eventsData as Event[]

export const eventsBySlug = events.reduce((acc, e) => {
    if (e.slug) {
        acc[e.slug] = e
    }
    return acc
}, {} as Record<string, Event>)
