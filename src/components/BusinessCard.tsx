import React from 'react'
import type { Business } from '../types'
import { SPONSOR_CATEGORY_LABELS, SUPPLIER_CATEGORY_LABELS } from '../businessesStore'

function isRecent(isoDate?: string): boolean {
  if (!isoDate) return false
  const added = new Date(isoDate + 'T00:00:00')
  const now = new Date()
  const diffDays = (now.getTime() - added.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays >= 0 && diffDays <= 7
}

export const BusinessCard: React.FC<{ business: Business; emphasiseRole?: 'supplier' | 'sponsor' }> = ({
  business,
  emphasiseRole,
}) => {
  const cats = emphasiseRole === 'supplier'
    ? (business.supplierCategories || []).map((c) => SUPPLIER_CATEGORY_LABELS[c])
    : emphasiseRole === 'sponsor'
      ? (business.sponsorCategories || []).map((c) => SPONSOR_CATEGORY_LABELS[c])
      : [
          ...(business.supplierCategories || []).map((c) => SUPPLIER_CATEGORY_LABELS[c]),
          ...(business.sponsorCategories || []).map((c) => SPONSOR_CATEGORY_LABELS[c]),
        ]

  const isNew = isRecent(business.addedAt)

  return (
    <a
      href={`/business/${business.slug}`}
      className="group flex h-full flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-4 transition-colors hover:border-hub-red"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-white group-hover:text-hub-red">{business.name}</h3>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {isNew && (
            <span className="rounded-full bg-hub-red px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-black">
              New
            </span>
          )}
          {!business.claimed && (
            <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-400">
              Unclaimed
            </span>
          )}
        </div>
      </div>
      {(business.town || business.region) && (
        <p className="text-xs text-slate-400">
          {[business.town, business.region].filter(Boolean).join(', ')}
        </p>
      )}
      {cats.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 pt-1">
          {cats.slice(0, 3).map((c) => (
            <li
              key={c}
              className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300"
            >
              {c}
            </li>
          ))}
        </ul>
      )}
      {business.activeAtTracks && business.activeAtTracks.length > 0 && (
        <p className="mt-auto pt-2 text-[11px] text-slate-500">
          Seen at {business.activeAtTracks.length} {business.activeAtTracks.length === 1 ? 'track' : 'tracks'}
        </p>
      )}
    </a>
  )
}
