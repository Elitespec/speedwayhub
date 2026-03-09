import React from 'react'
import { tracks } from '../tracksStore'
import { TrackCard } from '../components/TrackCard'
import { SEO } from '../components/SEO'
import { AdSenseHorizontal } from '../components/AdSense'

export const Tracks: React.FC = () => {
  const [q, setQ] = React.useState('')
  const [island, setIsland] = React.useState<'All' | 'North' | 'South'>('All')
  const [region, setRegion] = React.useState('All')
  const [cls, setCls] = React.useState('All')

  const regions = React.useMemo(() => {
    const r = Array.from(new Set(tracks.map((t) => t.region))).sort()
    return ['All', ...r]
  }, [])

  const classes = React.useMemo(() => {
    const r = Array.from(new Set(tracks.flatMap((t) => t.classes))).sort()
    return ['All', ...r]
  }, [])

  const filtered = React.useMemo(() => {
    return tracks.filter((t) => {
      if (island !== 'All' && t.island !== island) return false
      if (region !== 'All' && t.region !== region) return false
      if (cls !== 'All' && !t.classes.includes(cls)) return false
      if (q.trim().length > 0) {
        const s = q.toLowerCase()
        const hay = `${t.name} ${t.city} ${t.region} ${t.classes.join(' ')}`.toLowerCase()
        if (!hay.includes(s)) return false
      }
      return true
    })
  }, [cls, island, q, region])

  const northCount = tracks.filter((t) => t.island === 'North').length
  const southCount = tracks.filter((t) => t.island === 'South').length

  return (
    <>
      <SEO
        title="Speedway Tracks"
        description={`Browse all ${tracks.length} speedway tracks across New Zealand. ${northCount} North Island and ${southCount} South Island dirt oval racing venues. Find tracks by region and racing class.`}
        path="/tracks"
      />
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-6 space-y-4">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold md:text-2xl">Tracks in New Zealand</h1>
        <p className="text-sm text-slate-300">
          Browse dirt ovals and clubs across Aotearoa. Filter by island, region, or racing class.
        </p>
      </header>

      <section className="card grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.18em] text-slate-300">
          Search
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Track, city, class..."
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.18em] text-slate-300">
          Island
          <select
            value={island}
            onChange={(e) => setIsland(e.target.value as 'All' | 'North' | 'South')}
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
          >
            <option>All</option>
            <option>North</option>
            <option>South</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.18em] text-slate-300">
          Region
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
          >
            {regions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.18em] text-slate-300">
          Class
          <select
            value={cls}
            onChange={(e) => setCls(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
          >
            {classes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="flex items-center justify-between text-xs text-slate-400">
        <span>{filtered.length} tracks</span>
        <button
          type="button"
          className="text-hub-red underline"
          onClick={() => {
            setQ('')
            setIsland('All')
            setRegion('All')
            setCls('All')
          }}
        >
          Reset filters
        </button>
      </section>


      <section className="grid gap-3">
        {filtered.map((t) => (
          <TrackCard key={t.id} track={t} />
        ))}
      </section>

      {/* AdSense - Bottom of Tracks page */}
      <AdSenseHorizontal slot="7159506882" className="my-4" />
    </main>
    </>
  )
}
