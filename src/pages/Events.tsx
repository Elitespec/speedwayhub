import React from 'react'
import { events } from '../eventsStore'
import { EventCard } from '../components/EventCard'
import { tracksBySlug } from '../tracksStore'
import { SEO } from '../components/SEO'
import { AdSenseHorizontal } from '../components/AdSense'

const isThisWeekend = (dateStr: string) => {
  const now = new Date()
  const eventDate = new Date(dateStr + 'T00:00:00')
  const day = now.getDay() // 0 Sun
  const daysToFriday = (5 - day + 7) % 7
  const friday = new Date(now)
  friday.setHours(0, 0, 0, 0)
  friday.setDate(now.getDate() + daysToFriday)
  const sunday = new Date(friday)
  sunday.setDate(friday.getDate() + 2)
  return eventDate >= friday && eventDate <= sunday
}

const isUpcoming = (event: typeof events[0]) => {
  const status = event.status || 'upcoming'
  if (status === 'completed' || status === 'cancelled') return false
  const eventDate = new Date(event.date + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return eventDate >= today || status === 'upcoming' || status === 'live' || status === 'postponed'
}

const isPast = (event: typeof events[0]) => {
  return event.status === 'completed' || (!isUpcoming(event) && event.status !== 'postponed')
}

export const Events: React.FC = () => {
  const [q, setQ] = React.useState('')
  const [region, setRegion] = React.useState('All')
  const [weekendOnly, setWeekendOnly] = React.useState(false)
  const [viewMode, setViewMode] = React.useState<'upcoming' | 'past' | 'all'>('upcoming')

  const regions = React.useMemo(() => {
    const r = Array.from(new Set(events.map((e) => tracksBySlug[e.trackSlug]?.region).filter(Boolean))).sort()
    return ['All', ...r]
  }, [])

  const filtered = React.useMemo(() => {
    let filteredEvents = events

    // Filter by view mode
    if (viewMode === 'upcoming') {
      filteredEvents = filteredEvents.filter(isUpcoming)
    } else if (viewMode === 'past') {
      filteredEvents = filteredEvents.filter(isPast)
    }

    // Apply other filters
    return filteredEvents.filter((e) => {
      const track = tracksBySlug[e.trackSlug]
      if (weekendOnly && !isThisWeekend(e.date)) return false
      if (region !== 'All' && track?.region !== region) return false
      if (q.trim().length > 0) {
        const s = q.toLowerCase()
        const hay = `${e.title} ${track?.name || ''} ${track?.region || ''} ${e.classes?.join(' ') || ''}`.toLowerCase()
        if (!hay.includes(s)) return false
      }
      return true
    })
  }, [q, region, weekendOnly, viewMode])

  const upcomingCount = events.filter(isUpcoming).length
  const pastCount = events.filter(isPast).length

  return (
    <>
      <SEO
        title="Speedway Events"
        description={`Browse ${upcomingCount} upcoming speedway events and ${pastCount} past results across New Zealand. Filter by region, track, and racing class.`}
        path="/events"
      />
      <main id="main-content" className="space-y-8 pb-12">
        {/* Hero Section */}
        <section className="relative h-64 w-full overflow-hidden border-b border-slate-800 bg-slate-900 md:h-80">
          <div className="absolute inset-0 bg-[url('/photos/baypark-speedway.webp')] bg-cover bg-center opacity-40 blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-slate-950/40" />
          <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 py-8">
            <p className="text-xs uppercase tracking-[0.25em] text-hub-red">Official Calendar</p>
            <h1 className="mt-2 text-3xl font-bold text-white md:text-5xl">Upcoming Events</h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              Your guide to every race meeting across New Zealand. Tickets, live streams, and results.
            </p>

            {/* View Mode Tabs (Integrated into Hero) */}
            <div className="mt-6 flex border-b border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('upcoming')}
                className={`mr-6 pb-2 text-sm font-bold uppercase tracking-wide transition-colors ${viewMode === 'upcoming'
                    ? 'border-b-2 border-hub-red text-white'
                    : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                Upcoming ({upcomingCount})
              </button>
              <button
                type="button"
                onClick={() => setViewMode('past')}
                className={`mr-6 pb-2 text-sm font-bold uppercase tracking-wide transition-colors ${viewMode === 'past'
                    ? 'border-b-2 border-hub-red text-white'
                    : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                Past Results ({pastCount})
              </button>
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={`pb-2 text-sm font-bold uppercase tracking-wide transition-colors ${viewMode === 'all'
                    ? 'border-b-2 border-hub-red text-white'
                    : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                All ({events.length})
              </button>
            </div>
          </div>
        </section>

        {/* Filters & Content */}
        <div className="mx-auto max-w-6xl px-4">
          <section className="sticky top-4 z-10 mb-6 rounded-xl border border-slate-700 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search events, tracks, or classes..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:border-hub-red focus:outline-none"
                />
              </div>

              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 py-2 px-4 text-sm text-white focus:border-hub-red focus:outline-none"
              >
                {regions.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>

              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 hover:bg-slate-800 transition-colors">
                <input
                  type="checkbox"
                  checked={weekendOnly}
                  onChange={(e) => setWeekendOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-hub-red focus:ring-hub-red"
                />
                <span className="text-sm font-medium text-slate-300">This Weekend</span>
              </label>
            </div>

            {/* External Calendars Link (Subtle) */}
            <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3 text-xs text-slate-400">
              <span>Showing {filtered.length} events</span>
              <div className="flex gap-4">
                <a href="/live-timing" className="hover:text-hub-red transition-colors">Live Timing</a>
                <a href="https://racecontrol.nz/calendar.php" target="_blank" rel="noreferrer" className="hover:text-hub-red transition-colors">RaceControl.nz</a>
              </div>
            </div>
          </section>


          {/* AdSense - Top of listings */}
          <AdSenseHorizontal slot="7159506882" className="mb-6" />

          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </section>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="rounded-full bg-slate-900 p-6">
                <span className="text-4xl">🏁</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">No events found</h3>
              <p className="max-w-md text-sm text-slate-400 mt-2">
                Try adjusting your search filters or selecting a different region.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQ('')
                  setRegion('All')
                  setWeekendOnly(false)
                  setViewMode('all')
                }}
                className="mt-6 rounded-full border border-slate-700 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* AdSense - Bottom of Events page */}
          <AdSenseHorizontal slot="7159506882" className="my-6" />
        </div>
      </main>
    </>
  )
}
