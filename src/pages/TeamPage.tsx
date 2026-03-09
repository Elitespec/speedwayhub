import React from 'react'
import { teamsBySlug } from '../teamsStore'
import { tracksBySlug } from '../tracksStore'
import { SEO } from '../components/SEO'
import { AdSenseHorizontal } from '../components/AdSense'

type Props = {
  slug: string
}

export const TeamPage: React.FC<Props> = ({ slug }) => {
  const team = teamsBySlug[slug]

  if (!team) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-slate-300">Team not found.</p>
      </main>
    )
  }

  const homeTrack = tracksBySlug[team.homeTrack]

  return (
    <>
      <SEO
        title={`${team.name} - ${team.class} Team`}
        description={team.description}
        path={`/teams/${slug}`}
        type="article"
        keywords={`${team.name}, ${team.class}, ${team.region} speedway, NZ speedway team`}
      />

      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-400">
          <a href="/teams" className="hover:text-hub-red underline">Teams</a>
          <span className="mx-1">/</span>
          <span className="text-slate-200">{team.name}</span>
        </nav>

        {/* Team Header */}
        <section className="card space-y-4">
          <h1 className="text-3xl font-bold text-white md:text-4xl">{team.name}</h1>

          <div className="flex flex-wrap gap-2">
            <span className="pill bg-hub-red/20 text-hub-red border border-hub-red/30">
              {team.class}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="text-sm text-slate-300">
              <strong className="text-slate-200">Region:</strong> {team.region}
            </div>
            {homeTrack && (
              <div className="text-sm text-slate-300">
                <strong className="text-slate-200">Home Track:</strong>{' '}
                <a href={`/tracks/${homeTrack.slug}`} className="text-hub-red underline hover:no-underline">
                  {homeTrack.name}
                </a>
              </div>
            )}
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">{team.description}</p>
        </section>

        <AdSenseHorizontal slot="7159506882" className="my-4" />

        {/* Championships */}
        {team.championships.length > 0 && (
          <section className="card">
            <h2 className="text-lg font-semibold text-hub-red mb-3">Championships & Achievements</h2>
            <div className="space-y-2">
              {team.championships.map((title, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm">
                  <span className="text-hub-red text-xl">&#127942;</span>
                  <span className="text-slate-200">{title}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <AdSenseHorizontal slot="7159506882" className="my-4" />
      </main>
    </>
  )
}
