import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Radio, Menu, X, ChevronLeft } from 'lucide-react'

/**
 * Matches the "Signal" design system used across the app:
 * Ink #0B1220 · Porcelain #FAFAF8 · Signal Teal #0F9B8E
 * Space Grotesk (display) · Inter (body) · JetBrains Mono (utility)
 */

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  const links = [
    { path: '/', label: 'Home' },
    { path: '/train', label: 'Train' },
    { path: '/embed', label: 'Embed' },
    { path: '/test', label: 'Test' },
  ]

  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  return (
    <nav
      className={`safe-top sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAFAF8]/85 backdrop-blur-md border-b border-[#0B1220]/8'
          : 'bg-[#FAFAF8]/0 border-b border-transparent'
      }`}
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui" }}
    >
      <style>{`
        .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

        @keyframes signal-ping {
          0%   { transform: scale(1); opacity: .55; }
          70%  { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .signal-dot::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: #0F9B8E;
          animation: signal-ping 2.2s cubic-bezier(0.4,0,0.6,1) infinite;
        }

        .nav-link { position: relative; }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -6px;
          height: 2px;
          background: #0F9B8E;
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform .25s ease;
        }
        .nav-link:hover::after,
        .nav-link.active::after { transform: scaleX(1); }

        @keyframes menu-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .menu-panel { animation: menu-in .18s ease-out; }
        .menu-item { opacity: 0; animation: menu-in .28s ease-out forwards; }

        .burger-icon { transition: transform .25s ease, opacity .2s ease; }

        @media (prefers-reduced-motion: reduce) {
          .signal-dot::before, .menu-panel, .menu-item, .nav-link::after, .burger-icon {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

<div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {isHome ? (
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg bg-[#0B1220] flex items-center justify-center overflow-hidden">
              <Radio className="w-4 h-4 text-[#0F9B8E] transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="font-display font-semibold text-sm text-[#0B1220] tracking-tight flex items-center gap-1.5">
              TechFusionEra.AI
              <span className="relative w-1.5 h-1.5">
                <span className="signal-dot absolute inset-0" />
                <span className="absolute inset-0 rounded-full bg-[#0F9B8E]" />
              </span>
            </span>
          </Link>
        ) : (
          <Link
            to="/"
            className="flex items-center gap-1 text-[#0F9B8E] text-sm font-medium group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back
          </Link>
        )}

        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link text-sm font-medium transition-colors duration-200 ${
                location.pathname === link.path
                  ? 'active text-[#0F9B8E]'
                  : 'text-[#475569] hover:text-[#0B1220]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden relative w-8 h-8 flex items-center justify-center rounded-lg text-[#0B1220] hover:bg-[#0B1220]/5 transition-colors duration-200"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <X className={`burger-icon absolute w-5 h-5 ${menuOpen ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'}`} />
          <Menu className={`burger-icon absolute w-5 h-5 ${menuOpen ? '-rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="menu-panel md:hidden bg-[#FAFAF8]/95 backdrop-blur-md border-t border-[#0B1220]/8">
          {links.map((link, i) => (
            <Link
              key={link.path}
              to={link.path}
              className={`menu-item flex items-center justify-between px-4 py-3.5 text-sm border-b border-[#0B1220]/6 last:border-b-0 active:bg-[#0B1220]/[0.03] transition-colors ${
                location.pathname === link.path ? 'text-[#0F9B8E] font-semibold' : 'text-[#0B1220]'
              }`}
              style={{ animationDelay: `${i * 40}ms` }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
              {location.pathname === link.path && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F9B8E]" />
              )}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}