import React from 'react'

const NavLink: React.FC<{ href: string; label: string; onClick?: () => void }> = ({ href, label, onClick }) => {
  const isActive = window.location.pathname === href
  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={`text-sm tracking-wide ${isActive ? 'text-hub-red' : 'text-slate-200'
        }`}
    >
      {label}
    </a>
  )
}

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-hub-red focus:text-black focus:font-semibold focus:rounded"
      >
        Skip to main content
      </a>
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src="/logos/speedwayhub-horizontal.svg"
              alt="SpeedwayHub logo"
              className="h-12 w-auto sm:h-14 md:h-16 drop-shadow-lg"
              loading="eager"
              width="200"
              height="48"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <NavLink href="/tracks" label="Tracks" />
            <NavLink href="/events" label="Events" />
            <NavLink href="/results" label="Results" />
            <NavLink href="/live-timing" label="Live" />
            <NavLink href="/drivers" label="Drivers" />
            <NavLink href="/teams" label="Teams" />
            <NavLink href="/news" label="News" />
            <a
              href="https://www.facebook.com/profile.php?id=61582865643058"
              target="_blank"
              rel="noreferrer"
              className="text-slate-200 hover:text-hub-red transition-colors p-2"
              aria-label="Follow us on Facebook"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="/submit"
              className="rounded-full bg-hub-red px-4 py-2 text-xs font-semibold text-black shadow-card hover:bg-hub-red/90 transition-colors"
            >
              Add Listing
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`w-6 h-0.5 bg-slate-200 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-slate-200 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-slate-200 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-slate-800 bg-slate-950">
            <div className="flex flex-col px-4 py-4">
              <a href="/tracks" onClick={() => setMobileMenuOpen(false)} className="py-3 text-base text-slate-200 border-b border-slate-800">Tracks</a>
              <a href="/events" onClick={() => setMobileMenuOpen(false)} className="py-3 text-base text-slate-200 border-b border-slate-800">Events</a>
              <a href="/results" onClick={() => setMobileMenuOpen(false)} className="py-3 text-base text-slate-200 border-b border-slate-800">Results</a>
              <a href="/live-timing" onClick={() => setMobileMenuOpen(false)} className="py-3 text-base text-slate-200 border-b border-slate-800">Live Timing</a>
              <a href="/drivers" onClick={() => setMobileMenuOpen(false)} className="py-3 text-base text-slate-200 border-b border-slate-800">Drivers</a>
              <a href="/teams" onClick={() => setMobileMenuOpen(false)} className="py-3 text-base text-slate-200 border-b border-slate-800">Teams</a>
              <a href="/classes" onClick={() => setMobileMenuOpen(false)} className="py-3 text-base text-slate-200 border-b border-slate-800">Classes</a>
              <a href="/news" onClick={() => setMobileMenuOpen(false)} className="py-3 text-base text-slate-200 border-b border-slate-800">News</a>
              <a
                href="/submit"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 rounded-full bg-hub-red px-6 py-3 text-base font-semibold text-black text-center shadow-card"
              >
                Add Listing
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61582865643058"
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex items-center justify-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-sm font-semibold tracking-wide">Follow SpeedwayHub on Facebook</span>
              </a>
            </div>
          </nav>
        )}
      </header>
    </>
  )
}
