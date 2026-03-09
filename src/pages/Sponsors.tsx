import React from 'react'
import { SEO } from '../components/SEO'

const SPONSOR_EMAIL = 'elitespec2019@gmail.com'

export const Sponsors: React.FC = () => {
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    company: '',
    placement: 'Homepage hero',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { name, email, company, placement, message } = form
    if (!name || !email || !message) return
    const subject = encodeURIComponent('SpeedwayHub Sponsorship Enquiry')
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nPlacement interest: ${placement}\n\nMessage:\n${message}`,
    )
    window.location.href = `mailto:${SPONSOR_EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-6">
      <SEO
        title="Advertise on SpeedwayHub"
        description="Sponsor SpeedwayHub NZ and reach engaged NZ speedway fans, drivers, and clubs. Affordable seasonal packages available."
        path="/sponsors"
      />
      <section className="card space-y-2">
        <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Partners</p>
        <h1 className="text-2xl font-semibold text-white md:text-3xl">Advertise on SpeedwayHub</h1>
        <p className="text-sm text-slate-200">
          We&rsquo;re still building and improving the site. Sponsor placements help us keep the
          directory free for fans and make NZ speedway easier to follow.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-100 shadow-card">
        <h2 className="text-base font-semibold text-white">Why sponsor?</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-200">
          <li>Reach engaged NZ speedway fans, drivers, and clubs.</li>
          <li>Support an independent, free resource with no paywalls.</li>
          <li>Feature on the homepage, track pages, or event listings.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-100 shadow-card">
        <h2 className="text-base font-semibold text-white">What we need from you</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-200">
          <li>Your logo (PNG/SVG) and a landscape image if available.</li>
          <li>Where you&rsquo;d like to appear (homepage hero, footer badge, track/event pages).</li>
          <li>Your link target (site, ticketing, or promo page) and short copy (one to two sentences).</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-100 shadow-card">
        <h2 className="text-base font-semibold text-white">Seasonal pricing (full season Oct&ndash;Apr)</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-200">
          <li>Homepage hero slot (rotating): NZD $250 / season</li>
          <li>Footer badge (sitewide): NZD $100 / season</li>
          <li>Featured track page: NZD $80 / season per track</li>
          <li>Featured event block: NZD $40 / event</li>
          <li>Bundle: Hero + footer + 3 track pages for NZD $400 / season</li>
        </ul>
        <p className="mt-2 text-slate-200">
          Seasonal pricing covers the entire speedway season (~6 months). No lock-ins, straightforward invoiced payment.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-100 shadow-card">
        <h2 className="text-base font-semibold text-white">How to get started</h2>
        <p className="mt-2 text-slate-200">
          Send us your assets and placement preference, and we&rsquo;ll reply with available slots and a
          preview. We keep it simple&mdash;no long contracts, and we will never ask everyday fans for money.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-3 grid gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs uppercase tracking-[0.18em] text-slate-300">
              Name*
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                required
              />
            </label>
            <label className="text-xs uppercase tracking-[0.18em] text-slate-300">
              Email*
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                required
              />
            </label>
            <label className="text-xs uppercase tracking-[0.18em] text-slate-300">
              Company
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                placeholder="Optional"
              />
            </label>
            <label className="text-xs uppercase tracking-[0.18em] text-slate-300">
              Placement interest
              <select
                name="placement"
                value={form.placement}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
              >
                <option>Homepage hero</option>
                <option>Footer badge</option>
                <option>Track pages</option>
                <option>Event blocks</option>
                <option>Bundle / custom</option>
              </select>
            </label>
          </div>
          <label className="text-xs uppercase tracking-[0.18em] text-slate-300">
            Message*
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
              placeholder="Tell us what you need and where you want to appear."
              required
            />
          </label>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-hub-red px-4 py-2 text-[13px] font-semibold text-black shadow-card hover:brightness-110"
            >
              Send via email
            </button>
            <p className="text-[11px] text-slate-400">
              We open your mail app with the details. No payment requested.
            </p>
          </div>
        </form>
      </section>
    </main>
  )
}
