import tracksData from './data/tracks.json'
import type { Track } from './types'

export const tracks: Track[] = tracksData as Track[]

export const tracksBySlug: Record<string, Track> = Object.fromEntries(
  tracks.map((t) => [t.slug, t]),
)
