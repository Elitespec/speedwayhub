import React from 'react'
import type { Event } from '../types'
import { tracksBySlug } from '../tracksStore'
import { downloadCalendar } from '../utils/calendar'

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'upcoming':
      return 'bg-green-500/20 text-green-400 border-green-500/40'
    case 'live':
      return 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
    case 'completed':
      return 'bg-slate-500/20 text-slate-400 border-slate-500/40'
    case 'cancelled':
      return 'bg-red-500/20 text-red-400 border-red-500/40'
    case 'postponed':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
    default:
      return 'bg-blue-500/20 text-blue-400 border-blue-500/40'
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-NZ', { weekday: 'short', day: 'numeric', month: 'short' })
}

export const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const track = tracksBySlug[event.trackSlug]
  const status = event.status || 'upcoming'

  // Date parsing
  const dateObj = new Date(event.date + 'T00:00:00')
  const month = dateObj.toLocaleDateString('en-NZ', { month: 'short' }).toUpperCase()
  const day = dateObj.getDate()
  const weekday = dateObj.toLocaleDateString('en-NZ', { weekday: 'long' })

  // Image source
  const imageSrc = track?.photo || track?.logo

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-card transition-all hover:border-slate-700 hover:shadow-2xl hover:-translate-y-1">
      {/* Cover Image Section */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-950">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={track?.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
            loading="lazy"
            width="400"
            height="160"
          />
        ) : (
          <div className="h-full w-full bg-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

        {/* Date Badge */}
        <div className="absolute left-3 top-3 flex flex-col items-center justify-center rounded bg-white/10 backdrop-blur-md border border-white/20 p-2 text-white shadow-lg min-w-[3.5rem]">
          <span className="text-[10px] font-bold uppercase tracking-wider">{month}</span>
          <span className="text-xl font-bold leading-none">{day}</span>
        </div>

        {/* Status Pill */}
        {status && status !== 'upcoming' && (
          <div className="absolute right-3 top-3">
            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border shadow-lg ${getStatusColor(status)} backdrop-blur-md`}>
              {status}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4 pt-2">
        {/* Meta Row */}
        <div className="flex items-center gap-2 mb-2 text-xs text-hub-red font-medium uppercase tracking-wide">
          <span className="truncate">{weekday}</span>
          {event.startTime && <span>• {event.startTime}</span>}
        </div>

        <a href={`/events/${event.slug}`} className="block group">
          <h3 className="text-lg font-bold text-white group-hover:text-hub-red line-clamp-1" title={event.title}>
            {event.title}
          </h3>
        </a>

        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
          <span>📍</span>
          {track ? (
            <a
              href={`/tracks/${track.slug}`}
              className="truncate hover:text-hub-red transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {track.name}, {track.city}
            </a>
          ) : (
            <span className="truncate">Location TBA</span>
          )}
        </div>

        {/* Classes Tags */}
        {event.classes && event.classes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {event.classes.slice(0, 3).map((cls) => (
              <a
                key={cls}
                href="/classes"
                className="px-1.5 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded text-slate-300 hover:border-hub-red hover:text-hub-red transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {cls}
              </a>
            ))}
            {event.classes.length > 3 && (
              <span className="px-1.5 py-0.5 text-[10px] text-slate-500">
                +{event.classes.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-1 items-end justify-between border-t border-slate-800 pt-3">
          <div className="flex gap-3">
            {(event.ticketUrl || event.url) && (
              <a
                href={event.ticketUrl || event.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-white hover:text-hub-red transition-colors flex items-center gap-1"
              >
                {event.ticketUrl ? '🎟️ GET TICKETS' : 'DETAILS'}
              </a>
            )}
          </div>

          <div className="flex gap-3">
            {event.streamUrl && (
              <a
                href={event.streamUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-hub-red hover:text-white transition-colors flex items-center gap-1"
              >
                📺 WATCH
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
