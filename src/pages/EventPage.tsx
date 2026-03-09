import React from 'react'
import { eventsBySlug } from '../eventsStore'
import { tracksBySlug } from '../tracksStore'
import { TrackWeather } from '../components/TrackWeather'
import { SchemaOrg, createEventSchema } from '../components/SchemaOrg'
import { SEO } from '../components/SEO'
import { Breadcrumbs } from '../components/Breadcrumbs'

interface Props {
    slug: string
}

export const EventPage: React.FC<Props> = ({ slug }) => {
    const event = eventsBySlug[slug]
    const track = event ? tracksBySlug[event.trackSlug] : null

    if (!event) {
        return (
            <main className="mx-auto max-w-3xl px-4 py-10">
                <p className="text-sm text-slate-300">Event not found.</p>
                <a href="/events" className="text-hub-red text-sm mt-4 inline-block">← Back to all events</a>
            </main>
        )
    }

    const [lat, lng] = track?.coords || [0, 0]

    return (
        <>
            <SEO
                title={event.title}
                description={event.summary}
                path={`/events/${slug}`}
            />
            {track && <SchemaOrg schema={createEventSchema({
                title: event.title,
                date: event.date,
                trackName: track.name,
                trackSlug: track.slug,
                description: event.summary,
                status: event.status
            })} />}

            <main className="mx-auto max-w-5xl px-4 py-6 space-y-8">
                <Breadcrumbs items={[
                    { label: 'Home', href: '/' },
                    { label: 'Events', href: '/events' },
                    { label: event.title },
                ]} />
                {/* Header Section */}
                <section className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-card min-h-[300px] flex items-end group">
                    {track?.photo && (
                        <a href={`/tracks/${track.slug}`} className="absolute inset-0 block group-hover:cursor-alias">
                            <img
                                src={track.photo}
                                alt={track.name}
                                className="h-full w-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                        </a>
                    )}

                    <div className="relative p-6 md:p-10 w-full">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-4 max-w-2xl">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-hub-red text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-lg">
                                        {event.status || 'Upcoming'}
                                    </span>
                                    <span className="text-slate-200 text-sm font-bold bg-slate-950/50 backdrop-blur-sm px-3 py-1 rounded border border-white/10">
                                        📅 {new Date(event.date + 'T00:00:00').toLocaleDateString('en-NZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-2xl">
                                    {event.title}
                                </h1>
                                {track && (
                                    <a href={`/tracks/${track.slug}`} className="flex items-center gap-2 text-slate-200 hover:text-white transition-all text-lg font-semibold bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 w-fit hover:bg-hub-red hover:border-hub-red active:scale-95 shadow-lg">
                                        <span>📍</span> {track.name}, {track.city}
                                    </a>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[200px] relative z-20">
                                {event.ticketUrl && (
                                    <a href={event.ticketUrl} target="_blank" rel="noreferrer" className="flex-1 py-3 px-6 bg-white text-slate-950 text-center font-bold rounded-lg hover:bg-slate-200 transition-all shadow-xl transform hover:scale-105 active:scale-95">
                                        🎟️ Get Tickets
                                    </a>
                                )}
                                {event.streamUrl && (
                                    <a href={event.streamUrl} target="_blank" rel="noreferrer" className="flex-1 py-3 px-6 bg-hub-red text-white text-center font-bold rounded-lg hover:bg-red-700 transition-all shadow-xl transform hover:scale-105 active:scale-95">
                                        📺 Watch Live
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
                    <div className="space-y-8">
                        {/* Summary / Story */}
                        <section className="card">
                            <h2 className="text-xl font-bold text-white mb-4">Event Details</h2>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{event.summary}</p>
                            </div>
                        </section>

                        {/* Weather Widget */}
                        {track && (
                            <section className="space-y-4">
                                <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Track Conditions</h2>
                                <TrackWeather slug={track.slug} />
                            </section>
                        )}

                        {/* Classes Racing */}
                        {event.classes && event.classes.length > 0 && (
                            <section className="card">
                                <h2 className="text-lg font-bold text-white mb-4">Classes Racing</h2>
                                <div className="flex flex-wrap gap-2">
                                    {event.classes.map(cls => (
                                        <a key={cls} href="/classes" className="pill bg-slate-800 text-slate-300 border border-slate-700 hover:border-hub-red transition-colors">
                                            {cls}
                                        </a>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="space-y-6">
                        {/* Info Card */}
                        <div className="card bg-slate-900 border-slate-800">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 pb-2 border-b border-slate-800">Event Info</h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Date:</span>
                                    <span className="text-white font-medium">{event.date}</span>
                                </div>
                                {event.startTime && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Start Time:</span>
                                        <span className="text-white font-medium">{event.startTime}</span>
                                    </div>
                                )}
                                {event.gateOpenTime && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Gates Open:</span>
                                        <span className="text-white font-medium">{event.gateOpenTime}</span>
                                    </div>
                                )}
                                {track?.region && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Region:</span>
                                        <span className="text-white font-medium">{track.region}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Results Preview (if completed) */}
                        {event.status === 'completed' && event.results && (
                            <div className="card bg-emerald-500/5 border-emerald-500/20">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-4">Final Results</h3>
                                <div className="space-y-2">
                                    <p className="text-white font-bold text-lg">Winner: {event.results.winner}</p>
                                    {event.results.podium && (
                                        <ol className="list-decimal list-inside text-sm text-slate-300 space-y-1">
                                            {event.results.podium.map((p, i) => (
                                                <li key={i}>{p}</li>
                                            ))}
                                        </ol>
                                    )}
                                    {event.results.resultsUrl && (
                                        <a href={event.results.resultsUrl} className="text-emerald-400 text-xs mt-4 inline-block hover:underline" target="_blank" rel="noreferrer">
                                            View full results on Facebook →
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </main>
        </>
    )
}
