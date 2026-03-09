import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/95 mt-8">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Main footer content */}
        <div className="grid gap-6 md:grid-cols-4 mb-6">
          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Directory</h3>
            <nav className="flex flex-col gap-2 text-[11px] text-slate-400">
              <a href="/tracks" className="hover:text-hub-red transition-colors">Speedway Tracks</a>
              <a href="/events" className="hover:text-hub-red transition-colors">Upcoming Events</a>
              <a href="/drivers" className="hover:text-hub-red transition-colors">Drivers</a>
              <a href="/classes" className="hover:text-hub-red transition-colors">Racing Classes</a>
            </nav>
          </div>

          {/* Live & News */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Live & News</h3>
            <nav className="flex flex-col gap-2 text-[11px] text-slate-400">
              <a href="/live-timing" className="hover:text-hub-red transition-colors">Live Timing</a>
              <a href="/news" className="hover:text-hub-red transition-colors">Latest News</a>
              <a href="/submit" className="hover:text-hub-red transition-colors">Submit Listing</a>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Resources</h3>
            <nav className="flex flex-col gap-2 text-[11px] text-slate-400">
              <a href="/sponsors" className="hover:text-hub-red transition-colors">Sponsors</a>
              <a href="/faq" className="hover:text-hub-red transition-colors">FAQ</a>
              <a href="/privacy-policy.html" className="hover:text-hub-red transition-colors">Privacy Policy</a>
              <a href="/sitemap.xml" className="hover:text-hub-red transition-colors">Sitemap</a>
            </nav>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">About</h3>
            <nav className="flex flex-col gap-2 text-[11px] text-slate-400 mb-2">
              <a href="/about" className="hover:text-hub-red transition-colors">About SpeedwayHub</a>
              <a href="mailto:elitespec2019@gmail.com" className="hover:text-hub-red transition-colors">Contact Us</a>
            </nav>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              NZ's fastest speedway directory.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-2 pt-4 border-t border-slate-800 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} SpeedwayHub NZ. Unofficial directory. Not affiliated with Speedway NZ Inc. Built by{' '}
            <a href="https://elitespec.co.nz" className="underline hover:text-slate-200" target="_blank" rel="noopener noreferrer">
              EliteSpec
            </a>
            .
          </p>
          <p className="text-slate-500">
            For fans, drivers & promoters
          </p>
        </div>
      </div>
    </footer>
  )
}
