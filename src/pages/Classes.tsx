import React from 'react'
import classesData from '../data/classes.json'
import { SEO } from '../components/SEO'

type SpeedwayClass = {
  id: string
  name: string
  slug: string
  description: string
  photo: string
  specifications: {
    engine: string
    horsepower: string
    weight: string
    topSpeed: string
    [key: string]: string
  }
  rules: {
    contact: string
    bodywork: string
    ageRequirement: string
  }
  teams?: Array<{
    name: string
    description: string
  }>
  subclasses?: Array<{
    name: string
    description: string
  }>
  championships: string[]
}

const classes: SpeedwayClass[] = classesData as SpeedwayClass[]

export const Classes: React.FC = () => {
  return (
    <>
      <SEO
        title="NZ Speedway Racing Classes Explained"
        description="Complete guide to New Zealand speedway racing classes. From Sprintcars to Youth Ministocks, learn about each class, specifications, rules, and championships."
        path="/classes"
        keywords="speedway classes, sprintcars, superstocks, midgets, stockcars, NZ speedway racing, racing classes explained"
      />

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-hub-red">Racing Classes</p>
          <h1 className="text-3xl font-bold md:text-4xl">NZ Speedway Classes Explained</h1>
          <p className="text-sm text-slate-300 max-w-3xl">
            From high-powered Sprintcars to entry-level Youth Ministocks, discover every racing class in New Zealand speedway. Learn the rules, specs, and what makes each class unique.
          </p>
        </header>


        {/* Classes Grid */}
        <section className="space-y-6">
          {classes.map((cls) => (
            <div key={cls.id} className="card space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Class Photo */}
                <div className="flex-shrink-0">
                  {cls.photo ? (
                    <img
                      src={cls.photo}
                      alt={cls.name}
                      className="w-full md:w-64 h-48 object-cover rounded-xl border border-slate-800"
                    />
                  ) : (
                    <div className="w-full md:w-64 h-48 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                      <span className="text-slate-600 text-sm">Photo coming soon</span>
                    </div>
                  )}
                </div>

                {/* Class Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-2xl font-bold text-hub-red">{cls.name}</h2>
                    <p className="text-sm text-slate-300 mt-2">{cls.description}</p>
                  </div>

                  {/* Specifications Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                      <div className="text-xs text-slate-400 mb-1">Engine</div>
                      <div className="text-sm font-semibold text-slate-200">{cls.specifications.engine}</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                      <div className="text-xs text-slate-400 mb-1">Horsepower</div>
                      <div className="text-sm font-semibold text-hub-red">{cls.specifications.horsepower}</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                      <div className="text-xs text-slate-400 mb-1">Weight</div>
                      <div className="text-sm font-semibold text-slate-200">{cls.specifications.weight}</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
                      <div className="text-xs text-slate-400 mb-1">Top Speed</div>
                      <div className="text-sm font-semibold text-hub-red">{cls.specifications.topSpeed}</div>
                    </div>
                  </div>

                  {/* Rules */}
                  <div className="flex flex-wrap gap-2">
                    <span className="pill bg-slate-900 border border-slate-800 text-xs">
                      <span className="text-slate-400">Contact:</span>{' '}
                      <span className="text-slate-200">{cls.rules.contact}</span>
                    </span>
                    <span className="pill bg-slate-900 border border-slate-800 text-xs">
                      <span className="text-slate-400">Age:</span>{' '}
                      <span className="text-slate-200">{cls.rules.ageRequirement}</span>
                    </span>
                  </div>

                  {/* Teams/Subclasses */}
                  {(cls.teams || cls.subclasses) && (
                    <div className="space-y-2">
                      {cls.teams && cls.teams.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Team Formats</h4>
                          <div className="space-y-1">
                            {cls.teams.map((team, idx) => (
                              <div key={idx} className="text-xs">
                                <span className="font-semibold text-slate-200">{team.name}:</span>{' '}
                                <span className="text-slate-400">{team.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {cls.subclasses && cls.subclasses.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Subclasses</h4>
                          <div className="space-y-1">
                            {cls.subclasses.map((sub, idx) => (
                              <div key={idx} className="text-xs">
                                <span className="font-semibold text-slate-200">{sub.name}:</span>{' '}
                                <span className="text-slate-400">{sub.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Championships */}
                  {cls.championships && cls.championships.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Major Championships</h4>
                      <div className="flex flex-wrap gap-2">
                        {cls.championships.map((champ, idx) => (
                          <span key={idx} className="pill bg-hub-red/10 text-hub-red border border-hub-red/30 text-xs">
                            🏆 {champ}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Info Boxes */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card">
            <h3 className="text-sm font-semibold text-hub-red mb-2">Contact Racing</h3>
            <p className="text-xs text-slate-300">
              Superstocks, Stockcars, and Streetstocks allow full contact. Hitting opponents is part of the strategy and spectacle.
            </p>
          </div>
          <div className="card">
            <h3 className="text-sm font-semibold text-hub-red mb-2">Speed Classes</h3>
            <p className="text-xs text-slate-300">
              Sprintcars, Midgets, and Modifieds are non-contact speed classes where the fastest car wins. Spectacular sideways action.
            </p>
          </div>
          <div className="card">
            <h3 className="text-sm font-semibold text-hub-red mb-2">Entry Level</h3>
            <p className="text-xs text-slate-300">
              Youth Ministocks (12-16), Quarter Midgets (5-16), and Streetstocks (16+) offer affordable entry points into speedway racing.
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <section className="card space-y-3">
          <h2 className="text-lg font-semibold text-white">Understanding NZ Speedway Classes</h2>
          <div className="space-y-3 text-sm text-slate-300">
            <p>
              <strong className="text-hub-red">Open-Wheel vs Sedan:</strong> Open-wheel classes (Sprintcars, Midgets, Modifieds) use purpose-built race cars with exposed wheels. Sedan classes (Superstocks, Stockcars, Saloons) use car bodies similar to production vehicles.
            </p>
            <p>
              <strong className="text-hub-red">Team Racing:</strong> Superstock Teams and Stockcar Teams are unique formats where drivers work together to accumulate points for their team. Strategic cooperation and spectacular team tactics make these events fan favorites.
            </p>
            <p>
              <strong className="text-hub-red">Youth Development:</strong> New Zealand speedway has excellent youth development pathways. Drivers can start in Quarter Midgets at age 5, progress to Youth Ministocks at 12, then move into adult classes at 16-18.
            </p>
            <p>
              <strong className="text-hub-red">International Standards:</strong> Many NZ classes follow international specifications, allowing Kiwi drivers to compete overseas and international stars to race in New Zealand. The Midget World Series brings top American drivers to NZ each summer.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
