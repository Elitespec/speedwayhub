import React from 'react'
import { SEO } from '../components/SEO'
import { tracks } from '../tracksStore'
import { events } from '../eventsStore'
import { drivers } from '../driversStore'

export const About: React.FC = () => {
  const totalTracks = tracks.length
  const totalEvents = events.length
  const totalDrivers = drivers.length

  return (
    <>
      <SEO
        title="About SpeedwayHub NZ - New Zealand's Speedway Directory"
        description="Learn about SpeedwayHub NZ, the free community resource for New Zealand speedway racing. Find tracks, events, drivers, and everything speedway."
        path="/about"
      />
      <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            About <span className="text-hub-red">SpeedwayHub NZ</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            SpeedwayHub NZ is the free, community-focused directory for New Zealand speedway racing.
            We're building the most comprehensive resource for fans, drivers, and promoters across Aotearoa.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="card text-center">
            <div className="text-3xl font-bold text-hub-red">{totalTracks}</div>
            <div className="text-sm text-slate-400 mt-1">Speedway Tracks</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-hub-red">{totalEvents}</div>
            <div className="text-sm text-slate-400 mt-1">Events Listed</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-hub-red">{totalDrivers}</div>
            <div className="text-sm text-slate-400 mt-1">Driver Profiles</div>
          </div>
        </section>

        <section className="card space-y-4">
          <h2 className="text-xl font-semibold text-white">Our Mission</h2>
          <p className="text-slate-300 leading-relaxed">
            We believe every speedway fan deserves easy access to track information, event schedules,
            and driver profiles - all in one place. SpeedwayHub NZ is built to connect the New Zealand
            speedway community and make it easier than ever to follow the sport we love.
          </p>
          <p className="text-slate-300 leading-relaxed">
            From Western Springs in Auckland to Riverside in Invercargill, we're documenting every
            track, every race night, and every driver across both islands.
          </p>
        </section>

        <section className="card space-y-4">
          <h2 className="text-xl font-semibold text-white">What We Offer</h2>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-hub-red font-bold">1.</span>
              <div>
                <strong className="text-white">Track Directory</strong> - Find every speedway track in New Zealand
                with locations, facilities, racing classes, and contact information.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-hub-red font-bold">2.</span>
              <div>
                <strong className="text-white">Event Calendar</strong> - Stay up to date with upcoming race nights,
                championships, and special events at tracks across the country.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-hub-red font-bold">3.</span>
              <div>
                <strong className="text-white">Driver Profiles</strong> - Learn about the drivers competing in
                various classes from Superstocks to Sprintcars.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-hub-red font-bold">4.</span>
              <div>
                <strong className="text-white">Racing Classes</strong> - Understand the different racing classes
                with specifications, rules, and history.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-hub-red font-bold">5.</span>
              <div>
                <strong className="text-white">Live Timing</strong> - Links to live timing and streaming for
                race nights across New Zealand.
              </div>
            </li>
          </ul>
        </section>

        <section className="card space-y-4">
          <h2 className="text-xl font-semibold text-white">Free For Everyone</h2>
          <p className="text-slate-300 leading-relaxed">
            SpeedwayHub NZ is completely free. No subscriptions, no paywalls, no donations required.
            We're funded by advertising and built with passion for New Zealand speedway.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Our goal is to grow the sport by making information accessible to everyone - whether you're
            a lifelong fan, a new spectator, or a driver looking to compete.
          </p>
        </section>

        <section className="card space-y-4">
          <h2 className="text-xl font-semibold text-white">Get Involved</h2>
          <p className="text-slate-300 leading-relaxed">
            SpeedwayHub NZ is a community project. We welcome contributions from:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>Track officials with event schedules and track information</li>
            <li>Drivers who want to create or update their profiles</li>
            <li>Photographers with track and event photos</li>
            <li>Fans with corrections, suggestions, or new content</li>
          </ul>
          <div className="pt-4 flex flex-wrap gap-4">
            <a href="/submit" className="px-6 py-2 bg-hub-red text-white rounded-lg font-semibold hover:bg-hub-red/80 transition-colors">
              Submit Information
            </a>
            <a href="mailto:elitespec2019@gmail.com" className="px-6 py-2 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-colors">
              Contact Us
            </a>
          </div>
        </section>

        <section className="card space-y-4">
          <h2 className="text-xl font-semibold text-white">Built By</h2>
          <p className="text-slate-300 leading-relaxed">
            SpeedwayHub NZ is developed and maintained by{' '}
            <a href="https://elitespec.co.nz" target="_blank" rel="noreferrer" className="text-hub-red hover:underline">
              Elite Spec
            </a>
            , a New Zealand web development company. We build affordable, modern websites for Kiwi businesses.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a
              href="https://www.facebook.com/profile.php?id=61582865643058"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-hub-red transition-colors"
            >
              Follow us on Facebook
            </a>
          </div>
        </section>

        <section className="text-center text-slate-500 text-sm pt-8">
          <p>SpeedwayHub NZ - Your complete guide to New Zealand speedway racing.</p>
        </section>
      </main>
    </>
  )
}
