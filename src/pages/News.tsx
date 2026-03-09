import React from 'react'
import { newsPosts } from '../newsIndex'
import { AdSenseHorizontal } from '../components/AdSense'
import { SEO } from '../components/SEO'

export const News: React.FC = () => {
  return (
    <main className="space-y-8">
      <SEO
        title="Speedway News"
        description="Latest NZ speedway news, race reports, driver interviews, and announcements from tracks around New Zealand."
        path="/news"
        keywords="NZ speedway news, speedway race reports, New Zealand motorsport news"
      />
      {/* Hero Section */}
      <section className="relative h-64 w-full overflow-hidden border-b border-slate-800 bg-slate-900 md:h-80">
        <div className="absolute inset-0 bg-[url('/photos/ruapuna-speedway.webp')] bg-cover bg-center opacity-40 blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-slate-950/40" />
        <div className="relative mx-auto flex h-full max-w-5xl flex-col justify-end px-4 py-8">
          <p className="text-xs uppercase tracking-[0.25em] text-hub-red">Latest Updates</p>
          <h1 className="mt-2 text-3xl font-bold text-white md:text-5xl">News from the Dirt</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Race reports, driver interviews, and announcements from around the country.
          </p>
        </div>
      </section>

      {/* AdSense - Top of News page */}
      <div className="mx-auto max-w-5xl px-4">
        <AdSenseHorizontal slot="7159506882" className="mb-6" />
      </div>

      {/* News Grid */}
      <section className="mx-auto grid max-w-5xl gap-6 px-4 pb-12 sm:grid-cols-2 lg:grid-cols-3">
        {newsPosts.map((post) => (
          <a
            key={post.slug}
            href={`/news/${post.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-card transition-all hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl"
          >
            {/* Image Container */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-950">
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-600">
                  <span className="text-3xl">🏁</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
              <div className="absolute bottom-2 left-2">
                <span className="rounded bg-hub-red px-2 py-0.5 text-[10px] font-bold uppercase text-black">
                  News
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
              <div className="mb-2 text-xs text-slate-400">{post.date}</div>
              <h2 className="line-clamp-2 text-lg font-bold text-white group-hover:text-hub-red">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-400">
                  {post.excerpt}
                </p>
              )}
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-hub-red">
                Read Article <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </a>
        ))}
      </section>

      {/* AdSense - Bottom of News page */}
      <AdSenseHorizontal slot="7159506882" className="my-6" />
    </main>
  )
}
