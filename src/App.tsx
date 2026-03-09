import React from 'react'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Tracks } from './pages/Tracks'
import { TrackPage } from './pages/TrackPage'
import { Events } from './pages/Events'
import { Submit } from './pages/Submit'
import { News } from './pages/News'
import { NewsPost } from './pages/NewsPost'
import { Sponsors } from './pages/Sponsors'
import { Drivers } from './pages/Drivers'
import { DriverPage } from './pages/DriverPage'
import { Classes } from './pages/Classes'
import { LiveTiming } from './pages/LiveTiming'
import { EventPage } from './pages/EventPage'
import { CreateDriverProfile } from './pages/CreateDriverProfile'
import { About } from './pages/About'
import { FAQ } from './pages/FAQ'

const getRoute = () => {
  const path = window.location.pathname
  const segments = path.split('/').filter(Boolean)

  if (segments.length === 0) return { page: 'home' as const }
  if (segments[0] === 'tracks' && segments.length === 1) return { page: 'tracks' as const }
  if (segments[0] === 'tracks' && segments.length === 2)
    return { page: 'track', slug: segments[1] as string }
  if (segments[0] === 'events' && segments.length === 1) return { page: 'events' as const }
  if (segments[0] === 'events' && segments.length === 2)
    return { page: 'event', slug: segments[1] as string }
  if (segments[0] === 'live-timing') return { page: 'liveTiming' as const }
  if (segments[0] === 'drivers' && segments.length === 1) return { page: 'drivers' as const }
  if (segments[0] === 'drivers' && segments[1] === 'create') return { page: 'createDriverProfile' as const }
  if (segments[0] === 'drivers' && segments.length === 2)
    return { page: 'driver', slug: segments[1] as string }
  if (segments[0] === 'classes') return { page: 'classes' as const }
  if (segments[0] === 'submit') return { page: 'submit' as const }
  if (segments[0] === 'sponsors') return { page: 'sponsors' as const }
  if (segments[0] === 'news' && segments.length === 1) return { page: 'news' as const }
  if (segments[0] === 'news' && segments.length === 2)
    return { page: 'newsPost', slug: segments[1] as string }
  if (segments[0] === 'about') return { page: 'about' as const }
  if (segments[0] === 'faq') return { page: 'faq' as const }

  return { page: 'notFound' as const }
}

const NotFound: React.FC = () => (
  <main className="mx-auto max-w-3xl px-4 py-20 text-center space-y-6">
    <h1 className="text-6xl font-black text-hub-red">404</h1>
    <h2 className="text-2xl font-semibold text-white">Page Not Found</h2>
    <p className="text-slate-300">The page you're looking for doesn't exist or has been moved.</p>
    <div className="flex flex-wrap justify-center gap-4 pt-4">
      <a href="/" className="px-6 py-2 bg-hub-red text-white rounded-lg font-semibold hover:bg-hub-red/80 transition-colors">Go Home</a>
      <a href="/tracks" className="px-6 py-2 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-colors">Browse Tracks</a>
      <a href="/events" className="px-6 py-2 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-colors">View Events</a>
    </div>
  </main>
)

export default function App() {
  const route = getRoute()

  let content: React.ReactNode
  switch (route.page) {
    case 'tracks':
      content = <Tracks />
      break
    case 'track':
      content = <TrackPage slug={route.slug!} />
      break
    case 'events':
      content = <Events />
      break
    case 'event':
      content = <EventPage slug={route.slug!} />
      break
    case 'liveTiming':
      content = <LiveTiming />
      break
    case 'drivers':
      content = <Drivers />
      break
    case 'driver':
      content = <DriverPage slug={route.slug!} />
      break
    case 'createDriverProfile':
      content = <CreateDriverProfile />
      break
    case 'classes':
      content = <Classes />
      break
    case 'submit':
      content = <Submit />
      break
    case 'news':
      content = <News />
      break
    case 'newsPost':
      content = <NewsPost slug={route.slug!} />
      break
    case 'sponsors':
      content = <Sponsors />
      break
    case 'about':
      content = <About />
      break
    case 'faq':
      content = <FAQ />
      break
    case 'notFound':
      content = <NotFound />
      break
    case 'home':
    default:
      content = <Home />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div id="main-content" className="flex-1 pb-8">{content}</div>
      <Footer />
    </div>
  )
}
