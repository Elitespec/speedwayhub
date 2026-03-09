import React from 'react'
import { events } from '../eventsStore'
import { tracksBySlug } from '../tracksStore'
import { SEO } from '../components/SEO'
import type { Event } from '../types'

type CategoryKey = 'nz' | 'gp' | 'island' | 'teams'

const categories: { key: CategoryKey; label: string }[] = [
  { key: 'nz', label: 'NZ Championships 2025/2026' },
  { key: 'gp', label: 'Grand Prix Results' },
  { key: 'island', label: 'Island Championships' },
  { key: 'teams', label: 'Teams Championships' },
]

function categorize(event: Event): CategoryKey | null {
  const t = event.title.toLowerCase()
  if (/teams?\s+champ/i.test(t)) return 'teams'
  if (/grand\s+prix/i.test(t) || /\bgp\b/i.test(t)) return 'gp'
  if (/north\s+island|south\s+island|island\s+champ/i.test(t)) return 'island'
  if (/new\s+zealand|nz\s/i.test(t) || /\bnz\b/i.test(t)) return 'nz'
  return null
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })
}

const ResultCard: React.FC<{ event: Event }> = ({ event }) => {
  const track = event.trackSlug ? tracksBySlug[event.trackSlug] : null
  const results = event.results!

  return (
    <a
      href={`/events/${event.slug}`}
      className="card hover:border-hub-red/50 transition-colors group block"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm font-semibold text-slate-200 group-hover:text-hub-red transition-colors leading-tight">
          {event.title}
        </h3>
        {event.classes && event.classes.length > 0 && (
          <span className="shrink-0 rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-300">
            {event.classes[0]}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mb-3">
        {track && <span>{track.name}</span>}
        <span>{formatDate(event.date)}</span>
      </div>

      {/* Winner */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-hub-red text-lg">🏆</span>
        <span className="text-sm font-bold text-white">{results.winner}</span>
      </div>

      {/* Podium */}
      {results.podium && results.podium.length > 1 && (
        <div className="ml-8 space-y-0.5 mb-2">
          {results.podium.slice(1, 3).map((p, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
              <span className="text-slate-500 font-bold w-4">{i + 2}.</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      )}

      {/* Highlights */}
      {results.highlights && (
        <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
          {results.highlights}
        </p>
      )}

      <span className="inline-block mt-3 text-[10px] text-hub-red font-semibold uppercase tracking-wider">
        View full event →
      </span>
    </a>
  )
}

export const Results: React.FC = () => {
  const eventsWithResults = React.useMemo(
    () => events.filter((e) => e.results && e.results.winner),
    []
  )

  const grouped = React.useMemo(() => {
    const map: Record<CategoryKey, Event[]> = { nz: [], gp: [], island: [], teams: [] }
    const uncategorized: Event[] = []

    for (const event of eventsWithResults) {
      const cat = categorize(event)
      if (cat) {
        map[cat].push(event)
      } else {
        uncategorized.push(event)
      }
    }

    // Sort each group by date descending
    for (const key of Object.keys(map) as CategoryKey[]) {
      map[key].sort((a, b) => b.date.localeCompare(a.date))
    }
    uncategorized.sort((a, b) => b.date.localeCompare(a.date))

    return { map, uncategorized }
  }, [eventsWithResults])

  return (
    <>
      <SEO
        title="2025/2026 NZ Speedway Championship Results | SpeedwayHub"
        description="Complete results from every New Zealand speedway championship. Sprintcars, Superstocks, Stockcars, Midgets, Super Saloons and more."
        path="/results"
        keywords="NZ speedway results, New Zealand speedway championships, speedway results 2025 2026, NZ sprintcar results, NZ stockcar results, NZ superstock results"
      />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
        {/* Header */}
        <section className="card space-y-2">
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
            Championship Results
          </p>
          <h1 className="text-2xl font-semibold md:text-3xl">
            2025/2026 NZ Speedway <span className="text-hub-red">Results</span>
          </h1>
          <p className="text-sm text-slate-300">
            Complete results from every New Zealand speedway championship this season.
            Click any event for full details.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="rounded-full bg-hub-red/20 px-3 py-1 text-xs font-bold text-hub-red">
              {eventsWithResults.length} results
            </span>
          </div>
        </section>

        {/* Summary table */}
        <section className="card overflow-x-auto">
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300 mb-3">
            Quick Summary
          </h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-xs uppercase tracking-wider text-slate-400">
                <th className="pb-2 pr-4">Championship</th>
                <th className="pb-2 pr-4">Winner</th>
                <th className="pb-2 pr-4 hidden sm:table-cell">Venue</th>
                <th className="pb-2 hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {eventsWithResults
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((event) => {
                  const track = event.trackSlug ? tracksBySlug[event.trackSlug] : null
                  return (
                    <tr key={event.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="py-2 pr-4">
                        <a href={`/events/${event.slug}`} className="text-slate-200 hover:text-hub-red transition-colors">
                          {event.title}
                        </a>
                      </td>
                      <td className="py-2 pr-4 font-semibold text-white">{event.results!.winner}</td>
                      <td className="py-2 pr-4 text-slate-400 hidden sm:table-cell">{track?.name || '—'}</td>
                      <td className="py-2 text-slate-400 hidden md:table-cell">{formatDate(event.date)}</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </section>

        {/* Grouped sections */}
        {categories.map(({ key, label }) => {
          const group = grouped.map[key]
          if (group.length === 0) return null
          return (
            <section key={key} className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
                {label}
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {group.map((event) => (
                  <ResultCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )
        })}

        {/* Uncategorized results (other champs) */}
        {grouped.uncategorized.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
              Other Results
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {grouped.uncategorized.map((event) => (
                <ResultCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  )
}
