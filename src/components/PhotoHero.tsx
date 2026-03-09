import React from 'react'
import { tracks } from '../tracksStore'

type Slide = {
  src: string
  title: string
  subtitle?: string
}

export const PhotoHero: React.FC = () => {
  const slides = React.useMemo<Slide[]>(
    () =>
      tracks
        .filter((t) => t.photo)
        .map((t) => ({
          src: t.photo!,
          title: t.name,
          subtitle: `${t.city} • ${t.region}`,
        })),
    [],
  )

  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 4500)
    return () => clearInterval(id)
  }, [slides.length])

  if (slides.length === 0) return null

  return (
    <section className="relative h-64 w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 md:h-80">
      {slides.map((slide, i) => {
        const isActive = i === index
        return (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.title}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
            loading={i === 0 ? 'eager' : 'lazy'}
            width="1200"
            height="320"
          />
        )
      })}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-slate-950/10" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
        <p className="text-[11px] uppercase tracking-[0.25em] text-slate-300">NZ Speedway</p>
        <h2 className="text-xl font-semibold text-white sm:text-2xl">{slides[index].title}</h2>
        {slides[index].subtitle && (
          <p className="text-sm text-slate-200">{slides[index].subtitle}</p>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition ${
              i === index ? 'bg-hub-red' : 'bg-slate-500/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
