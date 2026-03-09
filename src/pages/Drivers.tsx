import React from 'react'
import { drivers } from '../driversStore'
import { DriverCard } from '../components/DriverCard'
import { tracksBySlug } from '../tracksStore'
import { SEO } from '../components/SEO'
import { AdSenseHorizontal } from '../components/AdSense'

export const Drivers: React.FC = () => {
  const [q, setQ] = React.useState('')
  const [cls, setCls] = React.useState('All')
  const [track, setTrack] = React.useState('All')

  const classes = React.useMemo(() => {
    const r = Array.from(new Set(drivers.flatMap((d) => d.classes))).sort()
    return ['All', ...r]
  }, [])

  const tracksList = React.useMemo(() => {
    const r = Array.from(new Set(drivers.map((d) => tracksBySlug[d.homeTrack]?.name).filter(Boolean))).sort()
    return ['All', ...r]
  }, [])

  const filtered = React.useMemo(() => {
    return drivers.filter((d) => {
      if (cls !== 'All' && !d.classes.includes(cls)) return false
      if (track !== 'All') {
        const homeName = tracksBySlug[d.homeTrack]?.name
        if (homeName !== track) return false
      }
      if (q.trim().length > 0) {
        const s = q.toLowerCase()
        const hay = `${d.name} ${d.number} ${d.classes.join(' ')} ${d.team || ''}`.toLowerCase()
        if (!hay.includes(s)) return false
      }
      return true
    })
  }, [cls, q, track])

  return (
    <>
      <SEO
        title="Speedway Drivers"
        description={`Browse ${drivers.length} speedway drivers across New Zealand. Find drivers by racing class, home track, and team. Create your own driver profile.`}
        path="/drivers"
      />
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-6 space-y-4">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-semibold md:text-2xl">Drivers</h1>
          <p className="text-sm text-slate-300">Search and filter by class or home track.</p>
        </div>
        <a
          href="/drivers/create"
          className="inline-block rounded-full bg-hub-red px-6 py-2 text-sm font-semibold text-black shadow-card hover:bg-hub-red/90 transition-colors text-center"
        >
          Create Your Profile
        </a>
      </header>

      {/* Notice about driver information */}
      <div className="rounded-lg border border-hub-red/40 bg-hub-red/10 px-4 py-3 text-sm text-slate-200">
        <p>
          <strong>Note:</strong> Driver information may not be fully accurate or up-to-date. If you're a driver, please{' '}
          <a href="/drivers/create" className="font-semibold text-hub-red underline hover:no-underline">
            create your profile
          </a>{' '}
          to ensure your details are correct.
        </p>
      </div>

      <section className="card grid gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.18em] text-slate-300">
          Search
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name, number, team..."
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
          />
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
        <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.18em] text-slate-300">
          Home track
          <select
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
          >
            {tracksList.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </section>


      {/* AdSense - Above listings */}
      <AdSenseHorizontal slot="7159506882" className="my-4" />

      <section className="grid gap-3 md:grid-cols-2">
        {filtered.map((d) => (
          <DriverCard key={d.id} driver={d} />
        ))}
        {filtered.length === 0 && <p className="text-sm text-slate-300">No drivers match those filters.</p>}
      </section>

      {/* AdSense - Bottom of Drivers page */}
      <AdSenseHorizontal slot="7159506882" className="my-4" />
    </main>
    </>
  )
}
