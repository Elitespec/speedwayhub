import React from 'react'
import type { Driver } from '../types'
import { tracksBySlug } from '../tracksStore'

export const DriverCard: React.FC<{ driver: Driver }> = ({ driver }) => {
  const home = tracksBySlug[driver.homeTrack]
  return (
    <a href={`/drivers/${driver.slug}`} className="card flex flex-col gap-1 hover:border-hub-red/50 transition-colors">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-white md:text-lg">{driver.name}</h3>
        <span className="text-xs font-semibold text-hub-red">{driver.number}</span>
      </div>
      <p className="text-xs text-slate-300 md:text-sm">
        {driver.classes.join(', ')} {home ? `• ${home.region}` : driver.region || ''}
      </p>
      {home && (
        <p className="text-[11px] text-slate-400">
          Home track: <a href={`/tracks/${home.slug}`} className="underline hover:text-hub-red">{home.name}</a>
        </p>
      )}
      {driver.team && <p className="text-[11px] text-slate-400">Team: {driver.team}</p>}
      {driver.sponsors && driver.sponsors.length > 0 && (
        <p className="text-[11px] text-slate-400">Sponsors: {driver.sponsors.join(', ')}</p>
      )}
      <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-300">
        {driver.website && (
          <a href={driver.website} className="underline hover:text-hub-red" target="_blank" rel="noreferrer">
            Website
          </a>
        )}
        {driver.facebook && (
          <a href={driver.facebook} className="underline hover:text-hub-red" target="_blank" rel="noreferrer">
            Facebook
          </a>
        )}
        {driver.instagram && (
          <a href={driver.instagram} className="underline hover:text-hub-red" target="_blank" rel="noreferrer">
            Instagram
          </a>
        )}
      </div>
    </a>
  )
}
