import React from 'react'
import { tracksBySlug } from '../tracksStore'
import { events } from '../eventsStore'
import { businesses } from '../businessesStore'
import { BusinessCard } from '../components/BusinessCard'
import { MapEmbed } from '../components/MapEmbed'
import { TrackWeather } from '../components/TrackWeather'
import { FacebookEmbed } from '../components/FacebookEmbed'
import { TrackStructuredData } from '../utils/structuredData'
import { SEO } from '../components/SEO'
import { Breadcrumbs } from '../components/Breadcrumbs'

type Props = {
  slug: string
}

export const TrackPage: React.FC<Props> = ({ slug }) => {
  const track = tracksBySlug[slug]
  if (!track) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-slate-300">Track not found.</p>
      </main>
    )
  }

  const [lat, lng] = track.coords
  const upcoming = events.filter((e) => {
    const status = e.status || 'upcoming'
    if (status === 'completed' || status === 'cancelled') return false
    const eventDate = new Date(e.date + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return e.trackSlug === track.slug && (eventDate >= today || status === 'upcoming' || status === 'live' || status === 'postponed')
  })
  const trackImage = track.photo || track.logo
  const trackBusinesses = businesses.filter((b) => (b.activeAtTracks || []).includes(track.slug))

  return (
    <>
      <SEO
        title={`${track.name} - Speedway Track`}
        description={track.description || `${track.name} in ${track.city}, ${track.region}. Find upcoming events, directions, facilities, and contact info.`}
        path={`/tracks/${track.slug}`}
        image={trackImage ? `https://speedwayhub.nz${trackImage}` : undefined}
        keywords={`${track.name}, ${track.city} speedway, ${track.region} speedway, ${track.classes.join(', ')}, NZ speedway tracks`}
      />
      <TrackStructuredData track={track} />
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Tracks', href: '/tracks' },
          { label: track.name },
        ]} />
        <section className="relative h-64 w-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 md:h-96 shadow-card group">
          <a
            href={track.website || track.facebook || '#'}
            target="_blank"
            rel="noreferrer"
            className="absolute inset-0 z-0 block cursor-alias"
            title="Visit Official Website"
          >
            <img
              src={trackImage}
              alt={track.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="eager"
              width="1200"
              height="384"
              onError={(e) => {
                e.currentTarget.src = track.logo
                e.currentTarget.className = "h-full w-full object-contain p-8 opacity-50 transition-none group-hover:scale-100"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </a>

          <div className="absolute bottom-0 left-0 p-6 w-full flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <a href={track.website || track.facebook || '#'} target="_blank" rel="noreferrer" className="transition-transform hover:scale-105 active:scale-95">
                {track.logo && track.logo !== track.photo && (
                  <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    <img src={track.logo} alt="Logo" className="h-16 w-16 object-contain drop-shadow-lg" />
                  </div>
                )}
              </a>
              <div>
                <h1 className="text-3xl font-black text-white md:text-5xl drop-shadow-2xl tracking-tight leading-tight">{track.name}</h1>
                <p className="text-base font-semibold text-slate-200 drop-shadow-md flex items-center gap-2">
                  <span className="text-hub-red">📍</span> {track.city} • {track.region}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="card space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <div className="space-y-2">
              <p className="text-sm text-slate-200 leading-relaxed max-w-2xl">{track.description}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {track.classes.map((cls) => (
                  <span key={cls} className="pill bg-slate-800 text-slate-300 border border-slate-700">
                    {cls}
                  </span>
                ))}
              </div>
            </div>

            <div className="min-w-[200px] space-y-3 rounded-lg bg-slate-900/50 p-4 border border-slate-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Contact & Info</p>
              <div className="flex flex-col gap-2 text-sm">
                {track.website && (
                  <a href={track.website} className="flex items-center gap-2 text-slate-300 hover:text-hub-red transition-colors" target="_blank" rel="noreferrer">
                    <span className="text-lg">🌐</span> Website
                  </a>
                )}
                {track.facebook && (
                  <a href={track.facebook} className="flex items-center gap-2 text-slate-300 hover:text-hub-red transition-colors" target="_blank" rel="noreferrer">
                    <span className="text-lg">f</span> Facebook
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(track.name + ' ' + track.city)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-hub-red transition-colors"
                >
                  <span className="text-lg">📍</span> Get Directions
                </a>
              </div>
            </div>
          </div>

          {track.status && (
            <div className="flex flex-wrap items-center gap-3 border-t border-slate-800 pt-3 mt-2">
              <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-md tracking-wide ${
                track.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                track.status === 'Heritage' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                track.status === 'Closed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                  'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                {track.status === 'Heritage' ? 'Heritage Track' : track.status}
              </span>
              {track.yearsActive && (
                <span className="text-xs text-slate-400 font-medium tracking-wide">
                  <span className="text-slate-500">ACTIVE:</span> {track.yearsActive}
                </span>
              )}
              {track.trackLength && (
                <span className="text-xs text-slate-400 font-medium tracking-wide">
                  <span className="text-slate-500">LENGTH:</span> {track.trackLength}
                </span>
              )}
              {track.surface && (
                <span className="text-xs text-slate-400 font-medium tracking-wide">
                  <span className="text-slate-500">SURFACE:</span> {track.surface}
                </span>
              )}
            </div>
          )}
        </section>
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
            Track Conditions
          </h2>
          <TrackWeather slug={track.slug} />
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
            Location
          </h2>
          <MapEmbed lat={lat} lng={lng} name={track.name} />
        </section>
        {track.photos && track.photos.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
              Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {track.photos.map((photo, i) => (
                <div key={i} className="aspect-video overflow-hidden rounded-xl bg-slate-900 border border-slate-800 shadow-sm group">
                  <img
                    src={photo}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-zoom-in"
                    alt={`${track.name} gallery photo ${i + 1}`}
                    loading="lazy"
                    width="300"
                    height="169"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Video Highlights */}
        {track.videos && track.videos.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
              Video Highlights
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {track.videos.map((video, i) => (
                <div key={video.id} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-card">
                  <div className="relative aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-slate-200 line-clamp-1">{video.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {track.admissionPrices && (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
              Admission Prices
            </h2>
            <div className="card grid gap-2 sm:grid-cols-2">
              {track.admissionPrices.adults && (
                <div className="text-sm">
                  <span className="text-slate-400">Adults:</span>{' '}
                  <span className="text-slate-200 font-medium">{track.admissionPrices.adults}</span>
                </div>
              )}
              {track.admissionPrices.children && (
                <div className="text-sm">
                  <span className="text-slate-400">Children:</span>{' '}
                  <span className="text-slate-200 font-medium">{track.admissionPrices.children}</span>
                </div>
              )}
              {track.admissionPrices.family && (
                <div className="text-sm">
                  <span className="text-slate-400">Family:</span>{' '}
                  <span className="text-slate-200 font-medium">{track.admissionPrices.family}</span>
                </div>
              )}
              {track.admissionPrices.students && (
                <div className="text-sm">
                  <span className="text-slate-400">Students:</span>{' '}
                  <span className="text-slate-200 font-medium">{track.admissionPrices.students}</span>
                </div>
              )}
              {track.admissionPrices.seniors && (
                <div className="text-sm">
                  <span className="text-slate-400">Seniors:</span>{' '}
                  <span className="text-slate-200 font-medium">{track.admissionPrices.seniors}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Prices may vary for special events. Check track website or Facebook for current pricing.
            </p>
          </section>
        )}
        {/* Heritage / History Section */}
        {(track.historicalNotes || track.notableEvents || track.formerNames) && (
          <section className="space-y-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white">Track History</h2>
              {track.status === 'Heritage' && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Historical Archive
                </span>
              )}
            </div>

            {track.historicalNotes && (
              <p className="text-sm text-slate-300 leading-relaxed">{track.historicalNotes}</p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {track.formerNames && track.formerNames.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Former Names</h3>
                  <ul className="space-y-1">
                    {track.formerNames.map(name => (
                      <li key={name} className="text-sm text-slate-300">{name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {track.notableEvents && track.notableEvents.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Notable Events</h3>
                  <ul className="space-y-1">
                    {track.notableEvents.map(event => (
                      <li key={event} className="text-sm text-slate-300">{event}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {track.yearsActive && (
              <p className="text-xs text-slate-500 border-t border-amber-500/10 pt-3 mt-2">
                This track was active from {track.yearsActive}. SpeedwayHub preserves the history and records of all New Zealand speedway venues, past and present.
              </p>
            )}
          </section>
        )}

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
            Facilities
          </h2>
          {track.facilities && track.facilities.length > 0 ? (
            <ul className="grid gap-2 sm:grid-cols-2">
              {track.facilities.map((f) => (
                <li key={f} className="card text-sm text-slate-200">
                  {f}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-300">
              Facilities info coming soon. Tell us what to add via the Submit page.
            </p>
          )}
        </section>
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
            Upcoming events
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate-300">No events listed yet.</p>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {upcoming.map((e) => (
                <li key={e.id} className="card relative transition-all hover:bg-slate-900 group">
                  <a href={`/events/${e.slug}`} className="block">
                    <h3 className="text-base font-semibold md:text-lg group-hover:text-hub-red transition-colors">{e.title}</h3>
                    <p className="text-xs text-slate-300 md:text-sm">{e.date}</p>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {track.facebook && (
          <section className="space-y-8 py-10 px-6 rounded-3xl bg-slate-900/50 border border-slate-800 shadow-inner">
            <div className="text-center space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-hub-red">
                Live From The Track
              </h2>
              <p className="text-slate-400 text-xs">Real-time updates directly from the official social feed.</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <FacebookEmbed url={track.facebook} />
            </div>
            <div className="flex justify-center pt-4">
              <a href={track.facebook} target="_blank" rel="noreferrer" className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-xs font-bold transition-all border border-slate-700">
                Open Official Facebook Page →
              </a>
            </div>
          </section>
        )}

        {trackBusinesses.length > 0 && (
          <section className="space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Local backers</p>
                <h2 className="text-lg font-semibold text-white">
                  Sponsors &amp; Suppliers at {track.name}
                </h2>
                <p className="text-sm text-slate-400">
                  Businesses we&rsquo;ve spotted backing the racing here.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/sponsors"
                  className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-hub-red"
                >
                  All sponsors
                </a>
                <a
                  href="/suppliers"
                  className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-hub-red"
                >
                  All suppliers
                </a>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {trackBusinesses.map((b) => (
                <BusinessCard key={b.id} business={b} />
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Are you a {track.name} sponsor or supplier we missed?{' '}
              <a href="/submit" className="text-hub-red underline">Add your business</a>.
            </p>
          </section>
        )}
      </main>
    </>
  )
}
