import React from 'react'
import { driversBySlug } from '../driversStore'
import { tracksBySlug } from '../tracksStore'
import { events } from '../eventsStore'
import { SEO } from '../components/SEO'
import { SchemaOrg, createDriverSchema } from '../components/SchemaOrg'
import { AdSenseRectangle, AdSenseHorizontal } from '../components/AdSense'

type Props = {
  slug: string
}

export const DriverPage: React.FC<Props> = ({ slug }) => {
  const driver = driversBySlug[slug]

  if (!driver) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-slate-300">Driver not found.</p>
      </main>
    )
  }

  // Get home track details
  const homeTrack = driver.homeTrack ? tracksBySlug[driver.homeTrack] : null

  // Get events this driver is competing in
  const driverEvents = events.filter(event =>
    event.classes?.some(cls => driver.classes.includes(cls))
  ).slice(0, 5) // Show only the 5 most recent

  return (
    <>
      <SEO
        title={`${driver.name} (#${driver.number}) - ${driver.classes[0]} Driver`}
        description={`${driver.name} - ${driver.classes.join(', ')} driver from ${driver.region}. View championship titles, career stats, and racing history.`}
        path={`/drivers/${slug}`}
        type="article"
        keywords={`${driver.name}, ${driver.classes.join(', ')}, ${driver.region} speedway, NZ speedway driver`}
      />

      <SchemaOrg schema={createDriverSchema(driver)} />

      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* Driver Header */}
        <section className="card space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Driver Photo */}
            <div className="flex-shrink-0">
              {driver.photo ? (
                <img
                  src={driver.photo}
                  alt={driver.name}
                  className="h-48 w-48 rounded-xl object-cover border-2 border-hub-red"
                />
              ) : (
                <div className="h-48 w-48 rounded-xl border-2 border-slate-800 bg-slate-900 flex items-center justify-center">
                  <span className="text-6xl font-bold text-slate-700">{driver.number}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white md:text-4xl">{driver.name}</h1>

              <div className="flex flex-wrap gap-2">
                {driver.classes.map((cls) => (
                  <span key={cls} className="pill bg-hub-red/20 text-hub-red border border-hub-red/30">
                    {cls}
                  </span>
                ))}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="text-sm">
                  <span className="text-slate-400">Number:</span>{' '}
                  <span className="font-semibold text-hub-red">{driver.number}</span>
                </div>
                <div className="text-sm text-slate-300">
                  <strong className="text-slate-200">Region:</strong> {driver.region}
                </div>
                {driver.team && (
                  <div className="text-sm text-slate-300">
                    <span className="text-slate-400">Team:</span> {driver.team}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* AdSense - Mid-page */}
        <AdSenseHorizontal slot="7159506882" className="my-4" />

        {/* Stats Grid */}
        <div className="grid gap-3 md:grid-cols-3">
          {driver.championships && driver.championships.length > 0 && (
            <div className="card text-center">
              <div className="text-2xl font-bold text-hub-red">{driver.championships.length}</div>
              <div className="text-xs text-slate-400 mt-1">Championships Won</div>
            </div>
          )}
          {driver.careerStats?.totalWins && (
            <div className="card text-center">
              <div className="text-2xl font-bold text-hub-red">{driver.careerStats.totalWins}</div>
              <div className="text-xs text-slate-400 mt-1">Career Wins</div>
            </div>
          )}
          {driver.careerStats?.yearsRacing && (
            <div className="card text-center">
              <div className="text-2xl font-bold text-hub-red">{driver.careerStats.yearsRacing}</div>
              <div className="text-xs text-slate-400 mt-1">Years Racing</div>
            </div>
          )}
        </div>

        {/* Championships */}
        {driver.championships && driver.championships.length > 0 && (
          <section className="card">
            <h2 className="text-lg font-semibold text-hub-red mb-3">Championships & Achievements</h2>
            <div className="space-y-2">
              {driver.championships.map((title, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm">
                  <span className="text-hub-red text-xl">🏆</span>
                  <span className="text-slate-200">{title}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent Events */}
        {driverEvents.length > 0 && (
          <section className="card space-y-3">
            <h2 className="text-xl font-semibold text-white">Recent Events</h2>
            <div className="space-y-2">
              {driverEvents.map(event => (
                <a
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3 hover:border-hub-red/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-200">{event.title}</p>
                    <p className="text-xs text-slate-400">{event.date}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* AdSense - Bottom of Driver Page */}
        <AdSenseRectangle slot="6558733477" className="my-4" />
      </main>
    </>
  )
}
