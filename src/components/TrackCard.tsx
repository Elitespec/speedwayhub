import React from 'react'
import type { Track } from '../types'

export const TrackCard: React.FC<{ track: Track }> = ({ track }) => {
  return (
    <article className="card flex gap-4 overflow-hidden">
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold md:text-lg">
              <a href={`/tracks/${track.slug}`} className="hover:text-hub-red">
                {track.name}
              </a>
            </h3>
            <p className="text-xs text-slate-300 md:text-sm">
              {track.region} • {track.island} Island
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 md:text-sm line-clamp-2">
          Classes: {track.classes.join(', ')}
        </p>
        <p className="text-xs text-slate-400">Opening: {track.openingMonths || 'Check website'}</p>
        <div className="mt-auto flex flex-wrap gap-2 text-[11px] text-slate-300 pt-2">
          {track.website && (
            <a href={track.website} className="underline hover:text-hub-red" target="_blank" rel="noreferrer">
              Website
            </a>
          )}
          {track.facebook && (
            <a href={track.facebook} className="underline hover:text-hub-red" target="_blank" rel="noreferrer">
              Facebook
            </a>
          )}
          <a
            href={`/tracks/${track.slug}#map`}
            className="underline hover:text-hub-red"
          >
            Map
          </a>
        </div>
      </div>
      <div className="w-24 h-24 shrink-0 overflow-hidden rounded-md bg-slate-800">
        <img 
          src={track.photo || track.logo || '/photos/western-spring.webp'} 
          alt={track.name}
          className="h-full w-full object-cover"
          loading="lazy"
          width="96"
          height="96"
        />
      </div>
    </article>
  )
}
