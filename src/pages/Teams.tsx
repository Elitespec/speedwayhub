import React from 'react'
import { teams } from '../teamsStore'
import { tracksBySlug } from '../tracksStore'
import { SEO } from '../components/SEO'
import { AdSenseHorizontal } from '../components/AdSense'

export const Teams: React.FC = () => {
  const [cls, setCls] = React.useState('All')

  const classes = React.useMemo(() => {
    const r = Array.from(new Set(teams.map((t) => t.class))).sort()
    return ['All', ...r]
  }, [])

  const filtered = React.useMemo(() => {
    return teams.filter((t) => {
      if (cls !== 'All' && t.class !== cls) return false
      return true
    })
  }, [cls])

  return (
    <>
      <SEO
        title="NZ Speedway Teams"
        description={`Complete directory of New Zealand speedway teams. Superstock and Stockcar teams from across the country.`}
        path="/teams"
        keywords="NZ speedway teams, superstock teams, stockcar teams, New Zealand speedway, team racing"
      />
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-6 space-y-4">
        <header className="mb-4">
          <h1 className="text-xl font-semibold md:text-2xl">Teams</h1>
          <p className="text-sm text-slate-300">Superstock and Stockcar teams from across New Zealand.</p>
        </header>

        <section className="card grid gap-3 md:grid-cols-2">
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

        <AdSenseHorizontal slot="7159506882" className="my-4" />

        <section className="grid gap-3 md:grid-cols-2">
          {filtered.map((team) => {
            const home = tracksBySlug[team.homeTrack]
            return (
              <a
                key={team.id}
                href={`/teams/${team.slug}`}
                className="card flex flex-col gap-1 hover:border-hub-red/50 transition-colors"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold text-white md:text-lg">{team.name}</h3>
                  <span className="pill bg-hub-red/20 text-hub-red border border-hub-red/30 text-[11px]">
                    {team.class}
                  </span>
                </div>
                <p className="text-xs text-slate-300 md:text-sm">{team.region}</p>
                {home && (
                  <p className="text-[11px] text-slate-400">
                    Home track: {home.name}
                  </p>
                )}
                {team.championships.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {team.championships.map((c, i) => (
                      <span key={i} className="text-[11px] text-hub-red">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </a>
            )
          })}
          {filtered.length === 0 && <p className="text-sm text-slate-300">No teams match that filter.</p>}
        </section>

        <AdSenseHorizontal slot="7159506882" className="my-4" />
      </main>
    </>
  )
}
