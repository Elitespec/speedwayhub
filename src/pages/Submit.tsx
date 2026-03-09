import React from 'react'
import { SEO } from '../components/SEO'

export const Submit: React.FC = () => {
  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-4">
      <SEO
        title="Submit a Listing"
        description="Submit a track, event, driver, or team listing to SpeedwayHub NZ. Help us build the most complete NZ speedway directory."
        path="/submit"
      />
      <h1 className="text-xl font-semibold md:text-2xl">Add listing</h1>
      <p className="text-sm text-slate-300">
        Send us track, event, driver, or team updates and we&rsquo;ll add them. We&rsquo;re still building, so
        all submissions are moderated and added manually for now.
      </p>
      <form
        className="card grid gap-3 text-sm text-slate-200"
        onSubmit={(e) => {
          e.preventDefault()
          const form = e.currentTarget as HTMLFormElement
          const data = new FormData(form)
          const subject = encodeURIComponent('SpeedwayHub submission')
          const body = encodeURIComponent(
            `Type: ${data.get('type')}\nName: ${data.get('name')}\nContact: ${data.get('contact')}\nLinks: ${data.get('links')}\nDetails:\n${data.get('details')}`,
          )
          window.location.href = `mailto:elitespec2019@gmail.com?subject=${subject}&body=${body}`
        }}
      >
        <label className="text-xs uppercase tracking-[0.18em] text-slate-300">
          Submission type
          <select
            name="type"
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
          >
            <option>Track</option>
            <option>Event</option>
            <option>Driver</option>
            <option>Team</option>
            <option>Other</option>
          </select>
        </label>
        <label className="text-xs uppercase tracking-[0.18em] text-slate-300">
          Name
          <input
            name="name"
            required
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            placeholder="Track / event / driver name"
          />
        </label>
        <label className="text-xs uppercase tracking-[0.18em] text-slate-300">
          Contact email or phone
          <input
            name="contact"
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            placeholder="So we can confirm details"
          />
        </label>
        <label className="text-xs uppercase tracking-[0.18em] text-slate-300">
          Links
          <input
            name="links"
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            placeholder="Website, Facebook, ticketing, livestream, etc."
          />
        </label>
        <label className="text-xs uppercase tracking-[0.18em] text-slate-300">
          Details
          <textarea
            name="details"
            required
            rows={4}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            placeholder="Dates, classes, classes, drivers/teams involved, or updates we should make."
          />
        </label>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-full bg-hub-red px-4 py-2 text-[13px] font-semibold text-black shadow-card hover:brightness-110"
          >
            Email us your update
          </button>
          <p className="text-[11px] text-slate-400">Opens your email with details prefilled.</p>
        </div>
      </form>
    </main>
  )
}
