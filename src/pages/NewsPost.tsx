import React from 'react'
import { marked } from 'marked'
import { newsPosts } from '../newsIndex'
import { AdSenseHorizontal } from '../components/AdSense'
import { SEO } from '../components/SEO'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { SchemaOrg, createArticleSchema } from '../components/SchemaOrg'

type Props = {
  slug: string
}

export const NewsPost: React.FC<Props> = ({ slug }) => {
  const post = newsPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-slate-300">Article not found.</p>
      </main>
    )
  }

  const html = marked(post.content)

  return (
    <article>
      <SEO
        title={post.title}
        description={post.excerpt || `Read about ${post.title} on SpeedwayHub NZ.`}
        path={`/news/${post.slug}`}
        type="article"
        image={post.image ? `https://speedwayhub.nz${post.image}` : undefined}
        keywords={`${post.title}, NZ speedway news, speedway racing`}
      />
      <SchemaOrg schema={createArticleSchema({
        title: post.title,
        slug: post.slug,
        date: post.date,
        excerpt: post.excerpt,
        image: post.image,
      })} />
      {/* Hero Header */}
      <header className="relative h-64 w-full overflow-hidden border-b border-slate-800 bg-slate-900 md:h-96">
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover opacity-40 blur-sm"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />

        <div className="relative mx-auto flex h-full max-w-4xl flex-col justify-end px-4 py-10 text-center">
          <div className="mx-auto mb-4 w-fit rounded bg-hub-red px-2 py-0.5 text-[10px] font-bold uppercase text-black">
            News
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 text-sm font-medium text-slate-300">
            {post.date}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'News', href: '/news' },
          { label: post.title },
        ]} />
        <div
          className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-white prose-a:text-hub-red prose-strong:text-white prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* AdSense - Mid-article */}
        <AdSenseHorizontal slot="7159506882" className="my-8" />

        <div className="mt-12 border-t border-slate-800 pt-8 text-center">
          <a
            href="/news"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 hover:text-hub-red"
          >
            ← Back to News
          </a>
        </div>

        {/* AdSense - Bottom of article */}
        <AdSenseHorizontal slot="7159506882" className="mt-8" />
      </main>
    </article>
  )
}
