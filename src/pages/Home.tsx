import React from 'react'
import { events } from '../eventsStore'
import { tracks } from '../tracksStore'
import { businesses, suppliers, sponsors } from '../businessesStore'
import { newsPosts } from '../newsIndex'
import { EventCard } from '../components/EventCard'
import { PhotoHero } from '../components/PhotoHero'
import { SEO } from '../components/SEO'
import { VideoSection } from '../components/VideoEmbed'
import { SchemaOrg, createOrganizationSchema, createWebsiteSchema } from '../components/SchemaOrg'
import { AdSenseHorizontal, AdSenseRectangle } from '../components/AdSense'
import { FacebookEmbed } from '../components/FacebookEmbed'

const isUpcoming = (event: typeof events[0]) => {
  const status = event.status || 'upcoming'
  if (status === 'completed' || status === 'cancelled') return false
  const eventDate = new Date(event.date + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return eventDate >= today || status === 'upcoming' || status === 'live' || status === 'postponed'
}

const getNextEvents = (count: number = 6) => {
  const upcoming = events.filter(isUpcoming)
  return upcoming.slice(0, count)
}

const getThisWeekendEvents = () => {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday

  let thisFriday: Date
  let thisSunday: Date

  if (dayOfWeek === 0) {
    // Today is Sunday - use today as the end of the weekend
    thisSunday = new Date(now)
    thisSunday.setHours(23, 59, 59, 999)
    thisFriday = new Date(now)
    thisFriday.setDate(now.getDate() - 2) // Go back to Friday
    thisFriday.setHours(0, 0, 0, 0)
  } else if (dayOfWeek === 6) {
    // Today is Saturday - Friday was yesterday, Sunday is tomorrow
    thisFriday = new Date(now)
    thisFriday.setDate(now.getDate() - 1)
    thisFriday.setHours(0, 0, 0, 0)
    thisSunday = new Date(now)
    thisSunday.setDate(now.getDate() + 1)
    thisSunday.setHours(23, 59, 59, 999)
  } else if (dayOfWeek === 5) {
    // Today is Friday - use today through Sunday
    thisFriday = new Date(now)
    thisFriday.setHours(0, 0, 0, 0)
    thisSunday = new Date(now)
    thisSunday.setDate(now.getDate() + 2)
    thisSunday.setHours(23, 59, 59, 999)
  } else {
    // Monday-Thursday - calculate upcoming Friday-Sunday
    const daysUntilFriday = 5 - dayOfWeek
    thisFriday = new Date(now)
    thisFriday.setDate(now.getDate() + daysUntilFriday)
    thisFriday.setHours(0, 0, 0, 0)
    thisSunday = new Date(thisFriday)
    thisSunday.setDate(thisFriday.getDate() + 2)
    thisSunday.setHours(23, 59, 59, 999)
  }

  return events.filter(event => {
    const eventDate = new Date(event.date + 'T00:00:00')
    return eventDate >= thisFriday && eventDate <= thisSunday && isUpcoming(event)
  })
}

export const Home: React.FC = () => {
  const upcomingEvents = React.useMemo(() => getNextEvents(6), [])
  const weekendEvents = React.useMemo(() => getThisWeekendEvents(), [])
  const upcomingCount = events.filter(isUpcoming).length
  const latestNews = React.useMemo(() => newsPosts.slice(0, 3), [])
  const totalTracks = tracks.length
  const northTracks = tracks.filter((t) => t.island === 'North').length
  const southTracks = tracks.filter((t) => t.island === 'South').length

  return (
    <>
      <SEO
        title="SpeedwayHub NZ - New Zealand Speedway Directory"
        description={`Find every speedway track, race night, driver, and event across New Zealand. ${totalTracks} tracks, ${upcomingCount} upcoming events. Your complete NZ speedway directory.`}
        path="/"
      />
      <SchemaOrg schema={[createOrganizationSchema(), createWebsiteSchema()]} />
      <main id="main-content" className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
        <PhotoHero />
        <section className="card flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
              NZ Speedway Directory
            </p>
            <h1 className="text-2xl font-semibold md:text-3xl">
              Find every <span className="text-hub-red">track, race night,</span> and club in Aotearoa.
            </h1>
            <p className="text-sm text-slate-300">
              SpeedwayHub is built for fans, drivers, and promoters. Browse tracks, check upcoming events,
              and keep an eye on the latest news.
            </p>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          <div className="card text-center">
            <div className="text-2xl font-bold text-hub-red">{totalTracks}</div>
            <div className="text-xs text-slate-400 mt-1">Speedway Tracks</div>
            <div className="text-[10px] text-slate-500 mt-1">
              {northTracks} North • {southTracks} South
            </div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-hub-red">{upcomingCount}</div>
            <div className="text-xs text-slate-400 mt-1">Upcoming Events</div>
            <div className="text-[10px] text-slate-500 mt-1">Check calendar for details</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-hub-red">{events.length}</div>
            <div className="text-xs text-slate-400 mt-1">Total Events Listed</div>
            <div className="text-[10px] text-slate-500 mt-1">Past & upcoming</div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 shadow-card">
          <p className="font-semibold text-hub-red">We are still building this site.</p>
          <p className="mt-1 text-slate-200">
            We want your feedback to make it better and easier to follow NZ speedway. This will always be
            free for fans and everyday people—no donations or paywalls.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Contact us: <a href="mailto:elitespec2019@gmail.com" className="text-hub-red hover:underline">elitespec2019@gmail.com</a>
          </p>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          <a href="/tracks" className="card hover:border-hub-red/50 transition-colors">
            <h3 className="text-base font-semibold text-hub-red mb-1">Browse Tracks</h3>
            <p className="text-xs text-slate-300">Find speedway tracks across New Zealand</p>
          </a>
          <a href="/events" className="card hover:border-hub-red/50 transition-colors">
            <h3 className="text-base font-semibold text-hub-red mb-1">View Events</h3>
            <p className="text-xs text-slate-300">See all upcoming races and championships</p>
          </a>
          <a href="/live-timing" className="card hover:border-hub-red/50 transition-colors border-hub-red/30">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-hub-red animate-pulse"></div>
              <h3 className="text-base font-semibold text-hub-red">Live Timing</h3>
            </div>
            <p className="text-xs text-slate-300">Real-time race results and lap times</p>
          </a>
        </section>

        <VideoSection
          videos={[
            {
              type: 'youtube',
              videoId: 'ZESlE54KlGg',
              title: 'NZ Midget GP + 248 Superstock Global Challenge',
              description: 'Full contact carnage at Robertson Prestige International Speedway'
            },
            {
              type: 'youtube',
              videoId: 'VEwZBifc3cs',
              title: '2026 NZ Superstock Championship Highlights',
              description: 'Wellington Family Speedway hosts the biggest event in NZ speedway'
            }
          ]}
        />

        {/* AdSense - Mid-page Banner */}
        <AdSenseHorizontal slot="7159506882" className="my-4" />

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
              Latest News
            </h2>
            <a href="/news" className="text-xs text-hub-red underline">
              View all news →
            </a>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {latestNews.map((post) => (
              <a
                key={post.slug}
                href={`/news/${post.slug}`}
                className="card hover:border-hub-red/50 transition-colors group"
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    loading="lazy"
                    width="400"
                    height="128"
                  />
                )}
                <h3 className="text-sm font-semibold text-slate-200 group-hover:text-hub-red transition-colors mb-1">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-400 mb-2">{post.date}</p>
                {post.excerpt && (
                  <p className="text-xs text-slate-300 line-clamp-2">{post.excerpt}</p>
                )}
              </a>
            ))}
          </div>
        </section>

        {weekendEvents.length > 0 && (
          <section className="space-y-3 border-2 border-hub-red/30 rounded-2xl p-6 bg-gradient-to-br from-hub-red/5 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-hub-red animate-pulse"></div>
                <h2 className="text-lg font-bold uppercase tracking-[0.22em] text-hub-red">
                  This Weekend
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-semibold">
                {weekendEvents.length} {weekendEvents.length === 1 ? 'event' : 'events'}
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {weekendEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
              Next events
            </h2>
            {upcomingCount > 6 && (
              <a href="/events" className="text-xs text-hub-red underline">
                View all {upcomingCount} events →
              </a>
            )}
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-slate-300">No upcoming events scheduled. Check back soon!</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {upcomingEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-6 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
              Around the Tracks
            </h2>
            <a href="https://www.facebook.com/profile.php?id=61582865643058" target="_blank" rel="noreferrer" className="text-xs text-hub-red hover:underline font-bold">
              Follow SpeedwayHub NZ →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-white leading-tight">
                Get the latest <span className="text-hub-red">live updates</span> directly from the pits.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                We're integrating live social feeds from every track in New Zealand. Stay in the loop with rain-offs, results, and gate opening times as they happen.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 bg-slate-800 text-[10px] font-bold rounded-full text-slate-300">#NZSpeedway</span>
                <span className="px-3 py-1 bg-slate-800 text-[10px] font-bold rounded-full text-slate-300">#Stockcars</span>
                <span className="px-3 py-1 bg-slate-800 text-[10px] font-bold rounded-full text-slate-300">#Superstocks</span>
                <span className="px-3 py-1 bg-slate-800 text-[10px] font-bold rounded-full text-slate-300">#Sprintcars</span>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
              <FacebookEmbed url="https://www.facebook.com/profile.php?id=61582865643058" />
            </div>
          </div>
        </section>

        {/* Directory teaser - sponsors + suppliers */}
        <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Directory</p>
              <h2 className="text-xl font-bold text-white">
                {businesses.length} NZ businesses powering the sport
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Local sponsors backing drivers, teams and tracks. Suppliers keeping the cars on the dirt.
                Free to browse, free to claim, free for fans.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <a
              href="/sponsors"
              className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-4 hover:border-hub-red"
            >
              <div>
                <p className="text-base font-semibold text-white group-hover:text-hub-red">Sponsors</p>
                <p className="text-xs text-slate-400">{sponsors.length} backing the racing</p>
              </div>
              <span className="text-2xl text-hub-red">→</span>
            </a>
            <a
              href="/suppliers"
              className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-4 hover:border-hub-red"
            >
              <div>
                <p className="text-base font-semibold text-white group-hover:text-hub-red">Suppliers</p>
                <p className="text-xs text-slate-400">{suppliers.length} keeping the cars running</p>
              </div>
              <span className="text-2xl text-hub-red">→</span>
            </a>
          </div>
        </section>

        {/* AdSense - Bottom Banner */}
        <AdSenseHorizontal slot="7159506882" className="my-4" />
      </main>
    </>
  )
}
