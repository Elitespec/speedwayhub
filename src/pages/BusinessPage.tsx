import React from 'react'
import { businessesBySlug, SPONSOR_CATEGORY_LABELS, SUPPLIER_CATEGORY_LABELS } from '../businessesStore'
import { tracksBySlug } from '../tracksStore'
import { SEO } from '../components/SEO'

export const BusinessPage: React.FC<{ slug: string }> = ({ slug }) => {
  const business = businessesBySlug[slug]

  if (!business) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center space-y-6">
        <h1 className="text-3xl font-semibold text-white">Business not found</h1>
        <p className="text-slate-300">
          We don&rsquo;t have a listing at <code className="text-hub-red">{slug}</code> yet.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <a href="/sponsors" className="rounded-full bg-hub-red px-6 py-2 font-semibold text-black hover:brightness-110">Browse sponsors</a>
          <a href="/suppliers" className="rounded-full bg-slate-700 px-6 py-2 font-semibold text-white hover:bg-slate-600">Browse suppliers</a>
          <a href="/submit" className="rounded-full border border-slate-700 px-6 py-2 font-semibold text-slate-200 hover:border-hub-red">Add a business</a>
        </div>
      </main>
    )
  }

  const supplierCats = (business.supplierCategories || []).map((c) => SUPPLIER_CATEGORY_LABELS[c])
  const sponsorCats = (business.sponsorCategories || []).map((c) => SPONSOR_CATEGORY_LABELS[c])
  const tracks = (business.activeAtTracks || [])
    .map((s) => tracksBySlug[s])
    .filter(Boolean)

  const description =
    business.description ||
    `${business.name} appears in the NZ speedway directory as ${business.roles.includes('supplier') && business.roles.includes('sponsor') ? 'a supplier and sponsor' : business.roles.includes('supplier') ? 'a supplier' : 'a sponsor'}${business.town ? ` based in ${business.town}` : ''}${tracks.length > 0 ? `, seen at ${tracks.map((t) => t.name).join(', ')}` : ''}.`

  return (
    <>
      <SEO
        title={`${business.name} — NZ Speedway`}
        description={description}
        path={`/business/${business.slug}`}
      />
      <main className="mx-auto max-w-4xl space-y-5 px-4 py-6">
        <nav className="text-xs text-slate-400">
          <a href="/" className="hover:text-hub-red">Home</a>
          {' / '}
          {business.roles.includes('sponsor') && (
            <>
              <a href="/sponsors" className="hover:text-hub-red">Sponsors</a>
              {business.roles.includes('supplier') && ' & '}
            </>
          )}
          {business.roles.includes('supplier') && (
            <a href="/suppliers" className="hover:text-hub-red">Suppliers</a>
          )}
          {' / '}
          <span className="text-slate-200">{business.name}</span>
        </nav>

        <header className="card space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
                {business.roles.map((r) => (r === 'supplier' ? 'Supplier' : 'Sponsor')).join(' · ')}
              </p>
              <h1 className="text-2xl font-semibold text-white md:text-3xl">{business.name}</h1>
              {(business.town || business.region) && (
                <p className="text-sm text-slate-400">
                  {[business.town, business.region, business.island && `${business.island} Island`].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
            {!business.claimed && (
              <span className="rounded-full border border-amber-700 bg-amber-900/30 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-amber-300">
                Unclaimed listing
              </span>
            )}
          </div>

          <p className="text-sm text-slate-200">{description}</p>

          <div className="flex flex-wrap gap-3 pt-1">
            {business.website && (
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-hub-red px-4 py-2 text-xs font-semibold text-black hover:brightness-110"
              >
                Visit website
              </a>
            )}
            {business.facebook && (
              <a
                href={business.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-hub-red"
              >
                Facebook
              </a>
            )}
            {business.email && (
              <a
                href={`mailto:${business.email}`}
                className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-hub-red"
              >
                Email
              </a>
            )}
            {business.phone && (
              <a
                href={`tel:${business.phone.replace(/[^0-9+]/g, '')}`}
                className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-hub-red"
              >
                {business.phone}
              </a>
            )}
          </div>
        </header>

        {(supplierCats.length > 0 || sponsorCats.length > 0) && (
          <section className="card space-y-3">
            <h2 className="text-base font-semibold text-white">Categories</h2>
            {supplierCats.length > 0 && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Supplier</p>
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {supplierCats.map((c) => (
                    <li key={c} className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {sponsorCats.length > 0 && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Sponsor</p>
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {sponsorCats.map((c) => (
                    <li key={c} className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {tracks.length > 0 && (
          <section className="card space-y-3">
            <h2 className="text-base font-semibold text-white">Active at tracks</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {tracks.map((t) => (
                <li key={t.slug}>
                  <a
                    href={`/tracks/${t.slug}`}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:border-hub-red"
                  >
                    <span>{t.name}</span>
                    <span className="text-xs text-slate-400">{t.region}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {!business.claimed && (
          <section className="card space-y-3 border-amber-800/60">
            <h2 className="text-base font-semibold text-white">Is this your business?</h2>
            <p className="text-sm text-slate-300">
              We auto-listed {business.name} from publicly visible sponsor information on track sites and
              Facebook pages. Claim the listing to add your logo, full description, photos, contact details
              and full profile.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href={`mailto:elitespec2019@gmail.com?subject=${encodeURIComponent(`Claim ${business.name} on SpeedwayHub`)}&body=${encodeURIComponent(`Hi,\n\nI'd like to claim the SpeedwayHub listing for ${business.name} (${business.slug}).\n\nMy details:\nName:\nRole:\nPhone:\nEmail:\n\nLet me know what you need next.\n`)}`}
                className="rounded-full bg-hub-red px-4 py-2 text-xs font-semibold text-black hover:brightness-110"
              >
                Claim this listing
              </a>
              <a href="/advertise" className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-hub-red">
                Featured placement options
              </a>
            </div>
          </section>
        )}
      </main>
    </>
  )
}
