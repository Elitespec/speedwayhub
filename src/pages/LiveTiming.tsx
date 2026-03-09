import React from 'react'
import { SEO } from '../components/SEO'

export const LiveTiming: React.FC = () => {
  return (
    <>
      <SEO
        title="Live Timing & Results"
        description="Watch live speedway race timing from tracks across New Zealand. Real-time lap times, positions, and results from SpeedwayLive and MYLAPS Speedhive platforms."
        path="/live-timing"
      />
      <main id="main-content" className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
      <section className="card">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
            Live Race Timing
          </p>
          <h1 className="text-2xl font-semibold md:text-3xl">
            Watch <span className="text-hub-red">live timing</span> from tracks across NZ
          </h1>
          <p className="text-sm text-slate-300">
            Access real-time race results, lap times, and positions as they happen. Multiple platforms provide live timing for New Zealand speedway events.
          </p>
        </div>
      </section>

      {/* Live Now Section */}
      <section className="card border-hub-red/50 bg-hub-red/5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2 w-2 rounded-full bg-hub-red animate-pulse"></div>
          <h2 className="text-lg font-semibold text-hub-red">Check What's Live Now</h2>
        </div>
        <p className="text-sm text-slate-300 mb-4">
          Visit the platforms below to see if any tracks are currently racing with live timing.
        </p>
      </section>

      {/* Live Timing Platforms */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          Live Timing Platforms
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* SpeedwayLive */}
          <a
            href="https://speedwaylive.co.nz/m/live.php"
            target="_blank"
            rel="noopener noreferrer"
            className="card hover:border-hub-red/50 transition-colors group"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base font-semibold text-hub-red group-hover:underline">
                SpeedwayLive.co.nz
              </h3>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Live timing and results platform used by many NZ speedway tracks. Includes historical results archive.
            </p>
            <div className="text-[10px] text-slate-400 space-y-1">
              <div>✓ Live race timing</div>
              <div>✓ Results archive</div>
              <div>✓ Mobile app available</div>
            </div>
          </a>

          {/* MYLAPS Speedhive */}
          <a
            href="https://speedhive.mylaps.com/Organizations/129437"
            target="_blank"
            rel="noopener noreferrer"
            className="card hover:border-hub-red/50 transition-colors group"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base font-semibold text-hub-red group-hover:underline">
                MYLAPS Speedhive
              </h3>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Official MYLAPS timing platform. All 23 Speedway NZ tracks use the MYLAPS X2 System for professional timing.
            </p>
            <div className="text-[10px] text-slate-400 space-y-1">
              <div>✓ X2 System across all 23 tracks</div>
              <div>✓ Free MYLAPS Speedhive mobile app</div>
              <div>✓ Live timing & analysis</div>
            </div>
          </a>
        </div>
      </section>

      {/* Event Schedule Section */}
      <section className="card bg-slate-900/50">
        <h2 className="text-base font-semibold text-hub-red mb-3">
          Looking for Upcoming Events?
        </h2>
        <p className="text-sm text-slate-300 mb-4">
          Check the event calendar to see when and where races are happening.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/events"
            className="inline-block rounded-full bg-hub-red px-4 py-2 text-xs font-semibold text-black shadow-card hover:bg-hub-red/90 transition-colors"
          >
            View SpeedwayHub Events
          </a>
          <a
            href="https://racecontrol.nz/calendar.php"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border border-hub-red/50 px-4 py-2 text-xs font-semibold text-hub-red hover:bg-hub-red/10 transition-colors"
          >
            RaceControl.nz Calendar →
          </a>
        </div>
      </section>

      {/* Results Archive Section */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          Results Archives
        </h2>

        <div className="grid gap-3 md:grid-cols-3">
          <a
            href="https://speedwaylive.co.nz/m/home.php"
            target="_blank"
            rel="noopener noreferrer"
            className="card hover:border-hub-red/50 transition-colors text-center"
          >
            <div className="text-sm font-semibold text-slate-200 mb-1">SpeedwayLive</div>
            <div className="text-xs text-slate-400">Historical results archive</div>
          </a>

          <a
            href="https://speedhive.mylaps.com/Organizations/129437"
            target="_blank"
            rel="noopener noreferrer"
            className="card hover:border-hub-red/50 transition-colors text-center"
          >
            <div className="text-sm font-semibold text-slate-200 mb-1">MYLAPS Speedhive</div>
            <div className="text-xs text-slate-400">NZ Timing Services results</div>
          </a>

          <a
            href="https://speedway.co.nz/competitors-1/championships/results-archive"
            target="_blank"
            rel="noopener noreferrer"
            className="card hover:border-hub-red/50 transition-colors text-center"
          >
            <div className="text-sm font-semibold text-slate-200 mb-1">Speedway NZ</div>
            <div className="text-xs text-slate-400">Official championship results</div>
          </a>
        </div>
      </section>

      {/* Mobile Apps Section */}
      <section className="card">
        <h2 className="text-base font-semibold text-hub-red mb-3">
          Mobile Apps
        </h2>
        <p className="text-sm text-slate-300 mb-4">
          Download mobile apps for live timing on the go:
        </p>
        <div className="space-y-2 text-sm text-slate-300">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-hub-red mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            <div>
              <div className="font-semibold text-slate-200">MYLAPS Speedhive</div>
              <div className="text-xs text-slate-400">Available for iOS and Android</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-hub-red mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            <div>
              <div className="font-semibold text-slate-200">SpeedwayLive Mobile App</div>
              <div className="text-xs text-slate-400">Check their website for download links</div>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  )
}
