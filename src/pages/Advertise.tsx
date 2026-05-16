import React from 'react'
import { SEO } from '../components/SEO'

const ADVERTISE_EMAIL = 'elitespec2019@gmail.com'

export const Advertise: React.FC = () => {
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    company: '',
    placement: 'Featured directory listing',
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
    const subject = encodeURIComponent('SpeedwayHub Advertising Enquiry')
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nPlacement interest: ${placement}\n\nMessage:\n${message}`,
    )
    window.location.href = `mailto:${ADVERTISE_EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-6">
      <SEO
        title="Advertise on SpeedwayHub"
        description="Sponsor SpeedwayHub NZ and reach engaged NZ speedway fans, drivers, clubs and the supply chain. Featured directory listings, homepage placements, newsletter slots."
        path="/advertise"
      />
      <section className="card space-y-2">
        <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Partners</p>
        <h1 className="text-2xl font-semibold text-white md:text-3xl">Advertise on SpeedwayHub</h1>
        <p className="text-sm text-slate-200">
          SpeedwayHub is the directory NZ speedway fans, drivers and the supply chain use to find each
          other. Fans, drivers, teams and tracks always use the site for free. Businesses that profit
          from the sport pay for visibility.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-100 shadow-card">
        <h2 className="text-base font-semibold text-white">Who advertises with us</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-200">
          <li>Suppliers: engine builders, fabricators, fuel, parts, race wear, photographers, trailers, panel &amp; paint.</li>
          <li>Sponsors: local trades, hospitality, retail, real estate, transport, anyone backing drivers/teams.</li>
          <li>National brands: tyres, fuel, lubes, automotive retail.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-100 shadow-card">
        <h2 className="text-base font-semibold text-white">Placements</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-200">
          <li><strong>Featured directory listing</strong> &mdash; top of category, photos, full profile, click-through tracking.</li>
          <li><strong>Homepage spotlight</strong> &mdash; rotating brand block above the fold.</li>
          <li><strong>Track-page sponsorship</strong> &mdash; appear on a specific track&rsquo;s page.</li>
          <li><strong>Driver/team profile sponsor</strong> &mdash; logo + link on the drivers/teams you back.</li>
          <li><strong>Newsletter slot</strong> &mdash; one sponsor per weekly digest, in-season Oct&ndash;Apr.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-100 shadow-card">
        <h2 className="text-base font-semibold text-white">Pricing</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-200">
          <li>Standard featured listing: NZD $29 / month</li>
          <li>Premium featured (homepage + multiple categories): NZD $99 / month</li>
          <li>Newsletter sponsor slot: NZD $200 / send</li>
          <li>Custom packages for national brands &mdash; talk to us.</li>
        </ul>
        <p className="mt-2 text-slate-200">
          No lock-ins. Free auto-listings stay free. Fans never pay.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-100 shadow-card">
        <h2 className="text-base font-semibold text-white">Get in touch</h2>
        <p className="mt-2 text-slate-200">
          Send us your assets and placement preference and we&rsquo;ll reply with available slots and a
          preview.
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
                <option>Featured directory listing</option>
                <option>Homepage spotlight</option>
                <option>Track-page sponsorship</option>
                <option>Driver/team profile sponsor</option>
                <option>Newsletter slot</option>
                <option>Custom package</option>
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
