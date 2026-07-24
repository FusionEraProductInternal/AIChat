import React from 'react'
import { Link } from 'react-router-dom'
import {
  Bot, Hospital, Hotel, Building2, ArrowRight, Lock, Timer,
  Code2, Radio, MessageCircle, CheckCircle2, PlayCircle
} from 'lucide-react'

/**
 * Design language: "Signal" — your FAQ becomes a live conversation.
 * Palette:  Porcelain #FAFAF8 (canvas) · Ink #0B1220 (contained panels)
 *           Signal Teal #0F9B8E (primary accent) · Slate #475569 (text)
 * Type:     Space Grotesk (display) · Inter (body) · JetBrains Mono (data/code)
 *
 * Fonts: add these to your index.html <head> (or Tailwind font config):
 * <link rel="preconnect" href="https://fonts.googleapis.com">
 * <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
 */

export default function LandingPage() {
  const industries = [
    {
      icon: <Hospital className="w-6 h-6" />,
      title: 'Hospitals',
      desc: 'Appointments, medicine info, visiting hours, ward directions — answered instantly.',
    },
    {
      icon: <Hotel className="w-6 h-6" />,
      title: 'Hotels',
      desc: 'Room availability, amenities, local recommendations, check-in details.',
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: 'Any business',
      desc: 'Product questions, support tickets, pricing, and lead capture, on autopilot.',
    },
  ]

  const features = [
    { icon: <Lock className="w-5 h-5" />, title: 'Private by design', desc: 'Training happens in the browser. Your data never touches a server.' },
    { icon: <Timer className="w-5 h-5" />, title: 'Live in two minutes', desc: 'Upload a FAQ and your assistant is ready to answer.' },
    { icon: <Code2 className="w-5 h-5" />, title: 'One line to embed', desc: 'A single script tag. No SDK, no backend, no dependencies.' },
    { icon: <Radio className="w-5 h-5" />, title: 'Always listening', desc: 'Answers customers around the clock, across every time zone.' },
  ]

  const steps = [
    { num: '01', title: 'Upload your FAQ', desc: 'Drop in a JSON file of your questions and answers — under 10KB.' },
    { num: '02', title: 'Train in your browser', desc: 'Your assistant learns the material locally, in about two minutes.' },
    { num: '03', title: 'Copy your script', desc: 'Get a single embeddable line, ready to paste anywhere.' },
    { num: '04', title: 'Paste it live', desc: 'Drop it into your site. Your assistant is answering immediately.' },
  ]

  return (
    <div className="bg-[#FAFAF8] text-[#0B1220]" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui" }}>
      <style>{`
        @keyframes signal-pulse {
          0%   { stroke-dashoffset: 240; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes typing-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: .4; }
          30% { transform: translateY(-3px); opacity: 1; }
        }
        .signal-line path {
          stroke-dasharray: 6 10;
          animation: signal-pulse 5s linear infinite;
        }
        .typing-dot { animation: typing-dot 1.1s ease-in-out infinite; }
        .typing-dot:nth-child(2) { animation-delay: .15s; }
        .typing-dot:nth-child(3) { animation-delay: .3s; }
        .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

        /* Hero visual */
        @keyframes hero-float {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-12px); }
        }
        .hero-float { animation: hero-float 6s ease-in-out infinite; }

        @keyframes ring-spin { to { transform: rotate(360deg); } }
        .ring-spin { animation: ring-spin 3.2s linear infinite; }

        @keyframes hero-wave {
          0%   { stroke-dashoffset: 200; }
          100% { stroke-dashoffset: 0; }
        }
        .hero-wave { stroke-dasharray: 5 8; animation: hero-wave 4.5s linear infinite; }

        @keyframes chip-float-a {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes chip-float-b {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(8px); }
        }
        .chip-float-a { animation: chip-float-a 4s ease-in-out infinite; }
        .chip-float-b { animation: chip-float-b 4.6s ease-in-out infinite .3s; }

        @keyframes glow-breathe {
          0%, 100% { opacity: .35; transform: scale(1); }
          50%      { opacity: .55; transform: scale(1.08); }
        }
        .glow-breathe { animation: glow-breathe 5s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .signal-line path, .typing-dot, .hero-float, .ring-spin,
          .hero-wave, .chip-float-a, .chip-float-b, .glow-breathe {
            animation: none !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ───────── Hero ───────── */}
        <section className="pt-16 pb-14 sm:pt-24 sm:pb-20">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-6 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0F9B8E]/25 bg-[#0F9B8E]/[0.06] text-[#0F9B8E] text-xs font-semibold tracking-wide uppercase mb-7">
                <Radio className="w-3.5 h-3.5" />
                Private, in-browser AI
              </div>

              <h1 className="font-display font-semibold text-[2.5rem] leading-[1.08] sm:text-6xl sm:leading-[1.05] tracking-tight text-[#0B1220] mb-6">
                Turn your FAQ into
                <br />
                an assistant customers
                <br />
                <span className="text-[#0F9B8E]">actually trust.</span>
              </h1>

              <p className="text-[#475569] text-base sm:text-lg leading-relaxed max-w-lg mb-9">
                Upload what you already know. Train a custom AI right in the browser.
                Paste one script into your site. No servers, no code, no data leaving your machine.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/train"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0B1220] text-white text-sm font-semibold hover:bg-[#0F9B8E] transition-colors duration-200"
                >
                  Start training <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/test"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#0B1220]/12 text-[#0B1220] text-sm font-semibold hover:border-[#0F9B8E]/40 hover:text-[#0F9B8E] transition-colors duration-200"
                >
                  <PlayCircle className="w-4 h-4" /> Watch it answer
                </Link>
              </div>
            </div>

            <HeroVisual />
          </div>
        </section>

        <SignalDivider />

        {/* ───────── Industries ───────── */}
        <section className="py-14 sm:py-16">
          <p className="font-mono text-xs tracking-wider uppercase text-[#0F9B8E] mb-3">Built for</p>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[#0B1220] mb-8">
            Wherever people ask the same questions all day.
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {industries.map((ind, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-[#0B1220]/8 bg-white hover:border-[#0F9B8E]/30 hover:shadow-[0_8px_30px_-12px_rgba(15,155,142,0.25)] transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-[#0B1220] text-[#0F9B8E] flex items-center justify-center mb-5 group-hover:bg-[#0F9B8E] group-hover:text-white transition-colors duration-200">
                  {ind.icon}
                </div>
                <h3 className="font-display font-semibold text-[#0B1220] mb-1.5">{ind.title}</h3>
                <p className="text-[#475569] text-sm leading-relaxed">{ind.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <SignalDivider />

        {/* ───────── Features ───────── */}
        <section className="py-14 sm:py-16">
          <p className="font-mono text-xs tracking-wider uppercase text-[#0F9B8E] mb-3">Why it's different</p>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[#0B1220] mb-8">
            Nothing to install. Nothing to trust but your own words.
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-[#0B1220]/8">
                <div className="w-9 h-9 rounded-lg bg-[#0F9B8E]/10 text-[#0F9B8E] flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-sm text-[#0B1220] mb-1.5">{f.title}</h3>
                <p className="text-[#475569] text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <SignalDivider />

        {/* ───────── How it works ───────── */}
        <section className="py-14 sm:py-16">
          <p className="font-mono text-xs tracking-wider uppercase text-[#0F9B8E] mb-3">The process</p>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[#0B1220] mb-10">
            Four steps. About two minutes.
          </h2>
          <div className="relative">
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-[#0B1220]/10 hidden sm:block" />
            <div className="space-y-8 sm:space-y-10">
              {steps.map((s, i) => (
                <div key={i} className="flex items-start gap-5 relative">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-white border border-[#0B1220]/12 flex items-center justify-center font-mono text-xs font-medium text-[#0F9B8E] z-10">
                    {s.num}
                  </div>
                  <div className="pt-1.5">
                    <h3 className="font-display font-semibold text-[#0B1220] mb-1">{s.title}</h3>
                    <p className="text-[#475569] text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SignalDivider />

        {/* ───────── Live demo ───────── */}
        <section className="py-14 sm:py-16">
          <p className="font-mono text-xs tracking-wider uppercase text-[#0F9B8E] mb-3">See it answer</p>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-[#0B1220] mb-8">
            This is what your customers will see.
          </h2>

          <div className="rounded-2xl bg-[#0B1220] p-3 sm:p-4 overflow-hidden">
            <div className="max-w-sm mx-auto bg-[#111A2C] rounded-xl border border-white/[0.06] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                <div className="w-7 h-7 rounded-full bg-[#0F9B8E]/15 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-[#0F9B8E]" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold leading-none">City Hospital</p>
                  <p className="text-[#0F9B8E] text-[10px] mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F9B8E]" /> online now
                  </p>
                </div>
              </div>

              <div className="p-4 space-y-3 min-h-[13rem]">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#0F9B8E]/15 flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3 text-[#0F9B8E]" />
                  </div>
                  <div className="bg-white/[0.06] text-white/90 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-xs leading-relaxed max-w-[80%]">
                    Hi, I'm City Hospital's assistant. What can I help with?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-[#0F9B8E] text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-xs leading-relaxed max-w-[80%]">
                    What are the visiting hours?
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#0F9B8E]/15 flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3 text-[#0F9B8E]" />
                  </div>
                  <div className="bg-white/[0.06] text-white/90 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-xs leading-relaxed max-w-[80%]">
                    General visiting is 4–7PM daily. ICU allows one visitor, 5–6PM only.
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#0F9B8E]/15 flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3 text-[#0F9B8E]" />
                  </div>
                  <div className="bg-white/[0.06] rounded-2xl rounded-tl-sm px-3.5 py-3 flex items-center gap-1">
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/50 inline-block" />
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/50 inline-block" />
                    <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/50 inline-block" />
                  </div>
                </div>
              </div>

              <div className="px-3 py-3 border-t border-white/[0.06] flex gap-2">
                <div className="flex-1 bg-white/[0.06] rounded-full px-3.5 py-2 text-xs text-white/30">
                  Type a message…
                </div>
                <button className="w-8 h-8 rounded-full bg-[#0F9B8E] flex items-center justify-center text-white shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── Final CTA ───────── */}
        <section className="pb-20 sm:pb-28">
          <div className="rounded-3xl bg-[#0B1220] px-8 py-14 sm:px-16 sm:py-16 text-center relative overflow-hidden">
            <div className="relative">
              <h2 className="font-display font-semibold text-white text-2xl sm:text-4xl leading-tight mb-3">
                Give your website a voice.
              </h2>
              <p className="text-white/50 text-sm sm:text-base mb-8 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0F9B8E]" /> Free forever — no card, no server, no catch.
              </p>
              <Link
                to="/train"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#0F9B8E] text-white text-sm font-semibold hover:bg-[#12B5A6] transition-colors duration-200"
              >
                Start training now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

/**
 * Hero signature visual — "your FAQ becomes a live signal."
 * A layered, gently-tilted ink card: data lines feed into a processing
 * ring, resolve into a waveform, and surface as a ready answer — with
 * two feature chips orbiting it. Pure CSS/SVG, no image assets.
 */
function HeroVisual() {
  return (
    <div className="relative flex items-center justify-center py-4 lg:py-0" aria-hidden="true">
      {/* ambient glow */}
      <div className="glow-breathe absolute w-72 h-72 sm:w-80 sm:h-80 bg-[#0F9B8E]/25 rounded-full blur-[70px]" />

      {/* dot-grid texture */}
      <div
        className="absolute w-[26rem] h-[26rem] opacity-[0.5]"
        style={{
          backgroundImage: 'radial-gradient(#0B1220 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          maskImage: 'radial-gradient(circle at center, black, transparent 68%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 68%)',
        }}
      />

      <div className="relative hero-float" style={{ perspective: '1000px' }}>
        <div
          className="relative"
          style={{ transform: 'rotateY(-9deg) rotateX(5deg)', transformStyle: 'preserve-3d' }}
        >
          {/* offset backing card — depth cue */}
          <div className="absolute inset-0 translate-x-3.5 translate-y-3.5 rounded-3xl border border-[#0F9B8E]/30" />

          {/* main card */}
          <div className="relative w-[17rem] sm:w-80 rounded-3xl bg-[#0B1220] border border-white/[0.07] shadow-[0_35px_70px_-25px_rgba(11,18,32,0.55)] overflow-hidden">
            {/* data header */}
            <div className="px-5 pt-5 flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-wide text-white/35">faq.json</p>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F9B8E]" />
            </div>
            <div className="px-5 mt-3 space-y-1.5">
              <div className="h-1.5 rounded-full bg-white/10 w-full" />
              <div className="h-1.5 rounded-full bg-white/10 w-4/5" />
              <div className="h-1.5 rounded-full bg-[#0F9B8E]/50 w-3/5" />
            </div>

            {/* processing ring */}
            <div className="flex justify-center py-6">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                <div className="ring-spin absolute inset-0 rounded-full border-2 border-[#0F9B8E] border-t-transparent border-r-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#0F9B8E]" />
                </div>
              </div>
            </div>

            {/* resolving waveform */}
            <svg viewBox="0 0 280 36" className="w-full h-9 text-[#0F9B8E]/80" preserveAspectRatio="none">
              <path
                className="hero-wave"
                d="M0 18 H55 L65 5 L75 31 L85 5 L95 31 L105 18 H175 L185 9 L195 27 L205 18 H280"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* resolved answer */}
            <div className="px-5 pb-5 pt-3">
              <div className="inline-flex items-center gap-1.5 bg-white/[0.07] rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[11px] text-white/85">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0F9B8E]" />
                Answer ready
              </div>
            </div>
          </div>
        </div>

        {/* orbiting feature chips */}
        <div className="chip-float-a absolute -left-7 top-4 hidden sm:flex items-center gap-1.5 bg-white rounded-full pl-1.5 pr-3 py-1.5 shadow-[0_14px_30px_-14px_rgba(11,18,32,0.35)] border border-[#0B1220]/6">
          <div className="w-6 h-6 rounded-full bg-[#0F9B8E]/12 flex items-center justify-center">
            <Lock className="w-3 h-3 text-[#0F9B8E]" />
          </div>
          <span className="text-[10px] font-medium text-[#0B1220] whitespace-nowrap">Private</span>
        </div>

        <div className="chip-float-b absolute -right-6 bottom-8 hidden sm:flex items-center gap-1.5 bg-white rounded-full pl-1.5 pr-3 py-1.5 shadow-[0_14px_30px_-14px_rgba(11,18,32,0.35)] border border-[#0B1220]/6">
          <div className="w-6 h-6 rounded-full bg-[#0F9B8E]/12 flex items-center justify-center">
            <Timer className="w-3 h-3 text-[#0F9B8E]" />
          </div>
          <span className="text-[10px] font-medium text-[#0B1220] whitespace-nowrap">2 min setup</span>
        </div>
      </div>
    </div>
  )
}

/** Signature element: a signal/waveform line threading between sections. */
function SignalDivider() {
  return (
    <div className="flex justify-center py-1" aria-hidden="true">
      <svg
        className="signal-line w-full max-w-md h-6 text-[#0F9B8E]/40"
        viewBox="0 0 400 24"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 12 H140 L155 2 L170 22 L185 2 L200 22 L215 12 H400"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}