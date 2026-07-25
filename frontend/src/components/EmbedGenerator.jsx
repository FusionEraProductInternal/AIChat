import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Copy, Check, Code2, Palette, MessageSquare, ExternalLink,
  Stethoscope, BedDouble, Building2, MoonStar, ArrowRight
} from 'lucide-react'

const THEMES = [
  { id: 'hospital', name: 'Hospital', color: '#0F9B8E', icon: Stethoscope },
  { id: 'hotel', name: 'Hotel', color: '#D97706', icon: BedDouble },
  { id: 'business', name: 'Business', color: '#2563EB', icon: Building2 },
  { id: 'dark', name: 'Dark mode', color: '#0B1220', icon: MoonStar },
]

/**
 * Matches the "Signal" design system used across the app:
 * Ink #0B1220 · Porcelain #FAFAF8 · Signal Teal #0F9B8E
 * Space Grotesk (display) · Inter (body) · JetBrains Mono (utility)
 */

export default function EmbedGenerator({ config }) {
  const [copied, setCopied] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState('hospital')
  const [position, setPosition] = useState('bottom-right')
  const [title, setTitle] = useState('Chat with us')

  const apiKey = config?.apiKey || 'tf_demo_123456789'
  const activeTheme = THEMES.find(t => t.id === selectedTheme)
  const baseUrl = import.meta.env.DEV
    ? 'http://localhost:3000'
    : 'https://api.techfusionera.com'

  const embedCode = `<!-- TechFusionEra AI Chatbot -->
<script 
  src="${baseUrl}/embed/tf-chatbot.js"
  data-api-key="${apiKey}"
  data-theme="${selectedTheme}"
  data-position="${position}"
  data-title="${title}"
  data-greeting="Hello! How can I help you today?"
></script>
<!-- End TechFusionEra AI Chatbot -->`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const steps = [
    'Copy the embed code above',
    'Open your website HTML, WordPress, or CMS',
    'Paste it just before the </body> tag',
    'Save and refresh your website',
    'Your chatbot appears automatically',
  ]

  return (
    <div className="bg-[#FAFAF8] min-h-screen" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui" }}>
      <style>{`
        .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

        @keyframes rise-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rise-in { animation: rise-in .35s cubic-bezier(0.2,0.6,0.3,1) both; }

        @keyframes check-pop {
          0%   { transform: scale(.5); opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); }
        }
        .check-pop { animation: check-pop .3s cubic-bezier(0.34,1.56,0.64,1) both; }

        @keyframes caret-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .caret { animation: caret-blink 1s step-end infinite; }

        .theme-card { transition: border-color .2s ease, background-color .2s ease, transform .15s ease; }
        .theme-card:active { transform: scale(.98); }

        .widget-preview { transition: left .25s ease, right .25s ease; }

        @media (prefers-reduced-motion: reduce) {
          .rise-in, .check-pop, .caret { animation: none !important; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        <div className="mb-8">
          <p className="font-mono text-xs tracking-wider uppercase text-[#0F9B8E] mb-2">Deploy</p>
          <h1 className="font-display font-semibold text-2xl sm:text-3xl text-[#0B1220]">Get your embed code</h1>
          <p className="text-[#475569] text-sm mt-1.5">Add the chatbot to any website with one script.</p>
        </div>

        {/* Theme Selector */}
        <div className="rounded-2xl border border-[#0B1220]/8 bg-white p-5 mb-4">
          <h3 className="font-semibold text-[#0B1220] text-sm mb-3.5 flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#0F9B8E]" /> Choose a theme
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map(t => {
              const Icon = t.icon
              const active = selectedTheme === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTheme(t.id)}
                  className={`theme-card p-3.5 rounded-xl border-2 text-left ${active ? 'border-[#0F9B8E] bg-[#0F9B8E]/[0.05]' : 'border-transparent bg-[#FAFAF8]'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${t.color}1A` }}
                    >
                      <Icon className="w-4.5 h-4.5" style={{ color: t.color }} />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#0B1220]">{t.name}</p>
                      <span
                        className="inline-block w-3 h-3 rounded-full mt-1"
                        style={{ background: t.color }}
                      />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Position */}
        <div className="rounded-2xl border border-[#0B1220]/8 bg-white p-5 mb-4">
          <h3 className="font-semibold text-[#0B1220] text-sm mb-3.5">Widget position</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'bottom-right', label: 'Bottom right' },
              { id: 'bottom-left', label: 'Bottom left' },
            ].map(pos => (
              <button
                key={pos.id}
                onClick={() => setPosition(pos.id)}
                className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${position === pos.id
                    ? 'bg-[#0B1220] text-white'
                    : 'bg-[#FAFAF8] text-[#475569] hover:bg-[#0B1220]/5'
                  }`}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="rounded-2xl border border-[#0B1220]/8 bg-white p-5 mb-4">
          <h3 className="font-semibold text-[#0B1220] text-sm mb-3.5">Chatbot title</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#FAFAF8] border border-[#0B1220]/8 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0F9B8E]/25 focus:border-[#0F9B8E]/40 transition-all duration-200"
            placeholder="Chat with us"
          />
        </div>

        {/* Preview */}
        <div className="rounded-2xl border border-[#0B1220]/8 bg-white p-5 mb-4">
          <h3 className="font-semibold text-[#0B1220] text-sm mb-3.5 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#0F9B8E]" /> Live preview
          </h3>
          <div className="bg-[#FAFAF8] rounded-xl p-4 relative h-64 overflow-hidden border border-[#0B1220]/6">
            {/* Fake website background */}
            <div className="space-y-2 opacity-40">
              <div className="h-3 bg-[#0B1220]/10 rounded w-3/4" />
              <div className="h-3 bg-[#0B1220]/10 rounded w-full" />
              <div className="h-3 bg-[#0B1220]/10 rounded w-5/6" />
              <div className="h-20 bg-[#0B1220]/10 rounded w-full mt-4" />
            </div>

            {/* Chat widget */}
            <div className={`widget-preview absolute ${position === 'bottom-right' ? 'right-3 bottom-3' : 'left-3 bottom-3'} w-56`}>
              <div className="bg-white rounded-2xl shadow-[0_12px_30px_-10px_rgba(11,18,32,0.25)] overflow-hidden border border-[#0B1220]/6">
                <div className="px-3 py-2.5 flex items-center gap-2" style={{ background: activeTheme?.color }}>
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageSquare className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white text-xs font-semibold truncate">{title || 'Chat with us'}</span>
                </div>
                <div className="p-2.5 h-24 bg-[#FAFAF8]">
                  <div className="bg-white border border-[#0B1220]/6 rounded-xl rounded-tl-sm px-2.5 py-1.5 text-[10px] text-[#475569] inline-block mb-2">
                    Hello! How can I help you today?
                  </div>
                </div>
                <div className="px-2 py-1.5 border-t border-[#0B1220]/6 flex gap-1.5">
                  <div className="flex-1 bg-[#FAFAF8] rounded-lg h-6 flex items-center px-2">
                    <span className="text-[9px] text-[#0B1220]/25 font-mono">Type a message<span className="caret">|</span></span>
                  </div>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: activeTheme?.color }}>
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Embed Code */}
        <div className="rounded-2xl border border-[#0B1220]/8 bg-white p-5 mb-4">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="font-semibold text-[#0B1220] text-sm flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#0F9B8E]" /> Embed code
            </h3>
            <button
              onClick={copyToClipboard}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ${copied ? 'bg-emerald-50 text-emerald-600' : 'bg-[#0F9B8E]/10 text-[#0F9B8E] hover:bg-[#0F9B8E]/20'
                }`}
            >
              {copied
                ? <Check className="w-3.5 h-3.5 check-pop" />
                : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="bg-[#0B1220] rounded-xl p-4 overflow-x-auto">
            <pre className="text-xs text-[#0F9B8E] font-mono whitespace-pre-wrap leading-relaxed">{embedCode}</pre>
          </div>
          <p className="text-[#475569] text-xs mt-3">
            Paste this just before the closing <code className="bg-[#0B1220]/6 text-[#0B1220] px-1.5 py-0.5 rounded font-mono">&lt;/body&gt;</code> tag on any website.
          </p>
        </div>

        {/* Instructions */}
        <div className="rounded-2xl border border-[#0B1220]/8 bg-white p-5 mb-6">
          <h3 className="font-semibold text-[#0B1220] text-sm mb-4">Installation steps</h3>
          <div className="space-y-3.5">
            {steps.map((step, i) => (
              <div key={i} className="rise-in flex items-start gap-3" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="w-6 h-6 rounded-full bg-[#0F9B8E]/10 text-[#0F9B8E] flex items-center justify-center font-mono text-[11px] font-semibold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-[#475569] leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/test"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0B1220] text-white text-sm font-semibold hover:bg-[#0F9B8E] transition-colors duration-200"
          >
            Test your chatbot <ExternalLink className="w-4 h-4" />
          </Link>
          <Link
            to="/train"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#0B1220]/12 text-[#0B1220] text-sm font-semibold hover:border-[#0F9B8E]/40 hover:text-[#0F9B8E] transition-colors duration-200"
          >
            Train another model
          </Link>
        </div>
      </div>
    </div>
  )
}