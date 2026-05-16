import React from 'react'
import { suppliers, SUPPLIER_CATEGORY_LABELS } from '../businessesStore'
import { BusinessCard } from '../components/BusinessCard'
import { SEO } from '../components/SEO'
import type { SupplierCategory } from '../types'

const CATEGORY_KEYS = Object.keys(SUPPLIER_CATEGORY_LABELS) as SupplierCategory[]

export const Suppliers: React.FC = () => {
  const [q, setQ] = React.useState('')
  const [cat, setCat] = React.useState<'All' | SupplierCategory>('All')

  const filtered = React.useMemo(() => {
    return suppliers.filter((b) => {
      if (cat !== 'All' && !(b.supplierCategories || []).includes(cat)) return false
      if (q.trim().length > 0) {
        const s = q.toLowerCase()
        const hay = `${b.name} ${b.town || ''} ${b.region || ''} ${(b.supplierCategories || []).join(' ')}`.toLowerCase()
        if (!hay.includes(s)) return false
      }
      return true
    })
  }, [cat, q])

  const grouped = React.useMemo(() => {
    const map = new Map<SupplierCategory, typeof suppliers>()
    for (const b of filtered) {
      for (const c of b.supplierCategories || []) {
        if (!map.has(c)) map.set(c, [])
        map.get(c)!.push(b)
      }
    }
    return map
  }, [filtered])

  return (
    <>
      <SEO
        title="NZ Speedway Suppliers Directory"
        description={`Find ${suppliers.length} businesses supplying the NZ speedway scene: engine builders, fabricators, fuel, parts, race wear, photographers and more. Free directory for fans and competitors.`}
        path="/suppliers"
      />
      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <header className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Directory</p>
          <h1 className="text-xl font-semibold md:text-2xl">NZ Speedway Suppliers</h1>
          <p className="text-sm text-slate-300">
            Engine builders, fabricators, fuel, parts, race wear, photographers and the rest of the supply chain that keeps the cars on the track.
          </p>
        </header>

        <section className="card grid gap-3 md:grid-cols-3">
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.18em] text-slate-300">
            Search
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Business name, town, category..."
              className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.18em] text-slate-300">
            Category
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value as 'All' | SupplierCategory)}
              className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
            >
              <option value="All">All categories</option>
              {CATEGORY_KEYS.map((k) => (
                <option key={k} value={k}>
                  {SUPPLIER_CATEGORY_LABELS[k]}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <p className="text-xs text-slate-400">
              {filtered.length} {filtered.length === 1 ? 'supplier' : 'suppliers'}
              {suppliers.length !== filtered.length && ` of ${suppliers.length}`}
            </p>
          </div>
        </section>

        {filtered.length === 0 ? (
          <div className="card text-sm text-slate-300">
            No suppliers match. Try clearing filters, or{' '}
            <a href="/submit" className="text-hub-red underline">add your business</a>.
          </div>
        ) : cat === 'All' ? (
          <div className="space-y-6">
            {CATEGORY_KEYS.map((c) => {
              const items = grouped.get(c) || []
              if (items.length === 0) return null
              return (
                <section key={c} className="space-y-3">
                  <h2 className="text-base font-semibold text-white">
                    {SUPPLIER_CATEGORY_LABELS[c]}{' '}
                    <span className="text-xs font-normal text-slate-400">({items.length})</span>
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((b) => (
                      <BusinessCard key={b.id} business={b} emphasiseRole="supplier" />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((b) => (
              <BusinessCard key={b.id} business={b} emphasiseRole="supplier" />
            ))}
          </div>
        )}

        <section className="card mt-8 space-y-2 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-white">Supply NZ speedway?</h2>
          <p>
            We auto-list businesses we find supplying the sport. Don&rsquo;t see yourself, or want to claim your listing?
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a href="/submit" className="rounded-full bg-hub-red px-4 py-2 text-xs font-semibold text-black hover:brightness-110">
              Add your business
            </a>
            <a href="/advertise" className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-hub-red">
              Featured placements
            </a>
          </div>
        </section>
      </main>
    </>
  )
}
