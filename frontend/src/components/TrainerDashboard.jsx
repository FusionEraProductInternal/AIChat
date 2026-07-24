import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Upload, FileText, Check, AlertCircle, Brain, ChevronRight,
  Sparkles, RotateCcw, Hospital, Hotel, Building2, Cpu, Loader2
} from 'lucide-react'

const SAMPLE_DATA = {
  hospital: `[
  {"q": "What are the visiting hours?", "a": "General visiting hours are 4PM - 7PM daily. ICU visiting is 5PM - 6PM with 1 visitor only."},
  {"q": "How do I book an appointment?", "a": "You can book online through our portal or call 022-12345678. Walk-ins are also accepted."},
  {"q": "Is parking available?", "a": "Yes, we have free parking for 200 vehicles. Valet parking is available at ₹50."},
  {"q": "What insurance do you accept?", "a": "We accept all major insurance providers including LIC, Star Health, and ICICI Lombard."},
  {"q": "Emergency contact number?", "a": "Emergency: 108 or 022-12345600 (24/7)"}
]`,
  hotel: `[
  {"q": "What is the check-in time?", "a": "Check-in starts at 2:00 PM. Early check-in is available on request."},
  {"q": "Is breakfast included?", "a": "Yes, complimentary breakfast is served from 7:00 AM to 10:30 AM at our restaurant."},
  {"q": "Do you have WiFi?", "a": "Yes, free high-speed WiFi is available throughout the property. Password: HotelGuest2024"},
  {"q": "Is there a gym?", "a": "Yes, our fitness center is open 24/7 on the 3rd floor."},
  {"q": "Airport pickup available?", "a": "Yes, airport transfers can be arranged. Please contact reception 24 hours in advance."}
]`,
  business: `[
    {"q": "What are your business hours?", "a": "We are open Monday to Saturday, 9:00 AM to 6:00 PM. Sunday closed."},
    {"q": "How can I contact support?", "a": "Email: support@company.com | Phone: 1800-123-4567 | Live chat available on website."},
    {"q": "Do you offer refunds?", "a": "Yes, full refund within 7 days of purchase. No questions asked."},
    {"q": "What payment methods do you accept?", "a": "UPI, Credit/Debit Cards, Net Banking, Cash on Delivery, and EMI options available."},
    {"q": "How long is delivery?", "a": "Standard delivery: 3-5 business days. Express delivery: 1-2 business days."}
  ]`
}

const INDUSTRIES = [
  { id: 'hospital', icon: Hospital, title: 'Hospital / Clinic', desc: 'Patient queries, appointments, medicine info' },
  { id: 'hotel', icon: Hotel, title: 'Hotel / Resort', desc: 'Room booking, amenities, local info' },
  { id: 'business', icon: Building2, title: 'Other business', desc: 'Customer support, FAQs, product info' },
]

/**
 * Matches the "Signal" design system used across the app:
 * Ink #0B1220 · Porcelain #FAFAF8 · Signal Teal #0F9B8E
 * Space Grotesk (display) · Inter (body) · JetBrains Mono (utility)
 */

export default function TrainerDashboard({ onTrained }) {
  const [step, setStep] = useState(1)
  const [industry, setIndustry] = useState('')
  const [trainingData, setTrainingData] = useState('')
  const [fileName, setFileName] = useState('')
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [trained, setTrained] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 10240) {
      setError('File size must be under 10KB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target.result
        JSON.parse(text) // Validate JSON
        setTrainingData(text)
        setFileName(file.name)
        setError('')
      } catch {
        setError('Invalid JSON file. Please upload valid JSON.')
      }
    }
    reader.readAsText(file)
  }

  const loadSample = (type) => {
    setTrainingData(SAMPLE_DATA[type])
    setFileName(`sample_${type}.json`)
    setIndustry(type)
    setError('')
  }

  const startTraining = async () => {
    if (!trainingData) {
      setError('Please upload or enter training data first')
      return
    }

    setIsTraining(true)
    setError('')
    setStatus('Parsing training data...')

    // Simulate training steps
    const steps = [
      { pct: 10, msg: 'Parsing training data...' },
      { pct: 25, msg: 'Loading AI model (130MB)...' },
      { pct: 40, msg: 'Initializing neural network...' },
      { pct: 55, msg: 'Training on your data...' },
      { pct: 70, msg: 'Fine-tuning responses...' },
      { pct: 85, msg: 'Optimizing model weights...' },
      { pct: 95, msg: 'Saving trained model...' },
      { pct: 100, msg: 'Training complete!' },
    ]

    for (const s of steps) {
      await new Promise(r => setTimeout(r, 800 + Math.random() * 600))
      setProgress(s.pct)
      setStatus(s.msg)
    }

    setIsTraining(false)
    setTrained(true)
    onTrained({
      industry,
      dataSize: trainingData.length,
      createdAt: new Date().toISOString(),
      apiKey: 'tf_' + Math.random().toString(36).substring(2, 15)
    })
  }

  const reset = () => {
    setStep(1)
    setIndustry('')
    setTrainingData('')
    setFileName('')
    setProgress(0)
    setStatus('')
    setTrained(false)
    setError('')
    onTrained(null)
  }

  let dataPairCount = 0
  try { dataPairCount = trainingData ? JSON.parse(trainingData).length : 0 } catch { dataPairCount = 0 }

  return (
    <div className="bg-[#FAFAF8] min-h-screen" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui" }}>
      <style>{`
        .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

        @keyframes step-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .step-in { animation: step-in .35s cubic-bezier(0.2,0.6,0.3,1) both; }

        @keyframes rise-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rise-in { animation: rise-in .3s ease-out both; }

        @keyframes check-pop {
          0%   { transform: scale(.4); opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); }
        }
        .check-pop { animation: check-pop .35s cubic-bezier(0.34,1.56,0.64,1) both; }

        @keyframes ring-grow {
          from { transform: scale(.7); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        .ring-grow { animation: ring-grow .4s cubic-bezier(0.34,1.56,0.64,1) both; }

        @keyframes bar-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        .bar-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
          animation: bar-shimmer 1.4s ease-in-out infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin-slow { animation: spin 1.6s linear infinite; }

        .industry-card { transition: border-color .2s ease, box-shadow .2s ease, transform .15s ease; }
        .industry-card:active { transform: scale(.98); }

        @media (prefers-reduced-motion: reduce) {
          .step-in, .rise-in, .check-pop, .ring-grow, .bar-shimmer::after, .spin-slow { animation: none !important; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        <div className="mb-8">
          <p className="font-mono text-xs tracking-wider uppercase text-[#0F9B8E] mb-2">Train</p>
          <h1 className="font-display font-semibold text-2xl sm:text-3xl text-[#0B1220]">Train your chatbot</h1>
          <p className="text-[#475569] text-sm mt-1.5">Upload your FAQ data and train an AI in minutes.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-10">
          {[1, 2, 3].map(s => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-semibold transition-colors duration-300 ${
                step >= s ? 'bg-[#0B1220] text-white' : 'bg-[#0B1220]/8 text-[#475569]'
              }`}>
                {step > s ? <Check className="w-4 h-4 check-pop" /> : s}
              </div>
              {s < 3 && (
                <div className="flex-1 h-[2px] bg-[#0B1220]/8 relative overflow-hidden rounded-full">
                  <div
                    className="absolute inset-y-0 left-0 bg-[#0F9B8E] rounded-full transition-all duration-500 ease-out"
                    style={{ width: step > s ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Choose Industry */}
        {step === 1 && (
          <div key="s1" className="step-in">
            <h2 className="font-display font-semibold text-lg text-[#0B1220] mb-4">Select your industry</h2>
            <div className="space-y-3">
              {INDUSTRIES.map((item, i) => {
                const Icon = item.icon
                const active = industry === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => { setIndustry(item.id); setStep(2); loadSample(item.id) }}
                    className={`industry-card rise-in w-full rounded-2xl border bg-white p-4 flex items-center gap-4 text-left ${
                      active ? 'border-[#0F9B8E] shadow-[0_8px_24px_-12px_rgba(15,155,142,0.35)]' : 'border-[#0B1220]/8 hover:border-[#0F9B8E]/30'
                    }`}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#0F9B8E]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#0F9B8E]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#0B1220]">{item.title}</h3>
                      <p className="text-[#475569] text-sm mt-0.5">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#0B1220]/25" />
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 2: Upload Data */}
        {step === 2 && (
          <div key="s2" className="step-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg text-[#0B1220]">Upload training data</h2>
              <button onClick={() => setStep(1)} className="text-[#0F9B8E] text-sm font-medium hover:underline">Change</button>
            </div>

            {/* File Upload */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl p-8 text-center cursor-pointer border-2 border-dashed border-[#0B1220]/15 hover:border-[#0F9B8E]/50 hover:bg-[#0F9B8E]/[0.03] transition-all duration-200 mb-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0F9B8E]/10 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6 text-[#0F9B8E]" />
              </div>
              <p className="font-semibold text-[#0B1220] text-sm">Tap to upload a JSON file</p>
              <p className="text-[#475569] text-xs mt-1 font-mono">{'Max 10KB · [{"q":"...","a":"..."}]'}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {fileName && (
              <div className="rise-in rounded-xl p-3.5 flex items-center gap-3 mb-4 bg-emerald-50 border border-emerald-100">
                <FileText className="w-4.5 h-4.5 w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-sm text-[#0B1220] flex-1 truncate">{fileName}</span>
                <span className="text-xs text-emerald-600 font-mono font-medium">{(trainingData.length / 1024).toFixed(1)} KB</span>
              </div>
            )}

            {/* Or paste manually */}
            <div className="mb-4">
              <p className="text-sm font-medium text-[#0B1220] mb-2">Or paste JSON directly</p>
              <textarea
                value={trainingData}
                onChange={(e) => { setTrainingData(e.target.value); setFileName('manual_input.json') }}
                placeholder='[{"q":"Your question?","a":"Your answer."}]'
                className="w-full h-40 bg-white border border-[#0B1220]/10 rounded-xl px-4 py-3 text-xs font-mono outline-none focus:ring-2 focus:ring-[#0F9B8E]/25 focus:border-[#0F9B8E]/40 transition-all duration-200 resize-none"
              />
            </div>

            {error && (
              <div className="rise-in rounded-xl p-3.5 flex items-center gap-2 bg-red-50 border border-red-100 mb-4">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}

            <button
              onClick={() => setStep(3)}
              disabled={!trainingData}
              className="w-full py-3.5 rounded-xl bg-[#0B1220] text-white text-sm font-semibold hover:bg-[#0F9B8E] disabled:opacity-40 disabled:hover:bg-[#0B1220] transition-colors duration-200"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Train */}
        {step === 3 && !trained && (
          <div key="s3" className="step-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg text-[#0B1220]">Train your model</h2>
              <button onClick={() => setStep(2)} className="text-[#0F9B8E] text-sm font-medium hover:underline">Edit data</button>
            </div>

            <div className="rounded-2xl border border-[#0B1220]/8 bg-white p-5 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#0F9B8E]/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-[#0F9B8E]" />
                </div>
                <div>
                  <p className="font-display font-semibold text-[#0B1220] text-sm">SmolLM2 360M</p>
                  <p className="text-[#475569] text-xs">Fast · 130MB · Works on all devices</p>
                </div>
              </div>

              <div className="space-y-2.5 text-sm pt-1">
                <div className="flex justify-between">
                  <span className="text-[#475569]">Data pairs</span>
                  <span className="font-mono font-medium text-[#0B1220]">{dataPairCount} Q&A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#475569]">Est. training time</span>
                  <span className="font-mono font-medium text-[#0B1220]">~2 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#475569]">Runs on</span>
                  <span className="font-mono font-medium text-[#0B1220]">Customer's browser</span>
                </div>
              </div>
            </div>

            {!isTraining ? (
              <button
                onClick={startTraining}
                className="w-full py-3.5 rounded-xl bg-[#0B1220] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#0F9B8E] transition-colors duration-200"
              >
                <Sparkles className="w-4 h-4" /> Start training
              </button>
            ) : (
              <div className="rise-in rounded-2xl border border-[#0B1220]/8 bg-white p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-[#0B1220] text-sm flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 text-[#0F9B8E] spin-slow" /> {status}
                  </span>
                  <span className="text-[#0F9B8E] font-mono font-bold text-sm">{progress}%</span>
                </div>
                <div className="h-2 bg-[#0B1220]/8 rounded-full overflow-hidden">
                  <div
                    className="bar-shimmer relative h-full bg-[#0F9B8E] rounded-full transition-all duration-500 overflow-hidden"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[#475569] text-xs mt-3 text-center">
                  Training runs on your device. Please don't close this tab.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Training Complete */}
        {trained && (
          <div key="done" className="step-in text-center">
            <div className="ring-grow w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-5">
              <Check className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="font-display font-semibold text-xl text-[#0B1220] mb-2">Training complete</h2>
            <p className="text-[#475569] text-sm mb-6">Your AI chatbot is ready to deploy.</p>

            <div className="rounded-2xl border border-[#0B1220]/8 bg-white p-4 mb-6 text-left">
              <div className="flex justify-between text-sm mb-2.5">
                <span className="text-[#475569]">Model</span>
                <span className="font-medium text-[#0B1220]">SmolLM2 360M (fine-tuned)</span>
              </div>
              <div className="flex justify-between text-sm mb-2.5">
                <span className="text-[#475569]">Industry</span>
                <span className="font-medium text-[#0B1220] capitalize">{industry}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-[#475569]">API key</span>
                <span className="font-mono text-xs bg-[#0B1220]/6 text-[#0B1220] px-2 py-1 rounded-md">tf_••••••••••••</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                to="/embed"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0B1220] text-white text-sm font-semibold hover:bg-[#0F9B8E] transition-colors duration-200"
              >
                Get embed script <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/test"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#0B1220]/12 text-[#0B1220] text-sm font-semibold hover:border-[#0F9B8E]/40 hover:text-[#0F9B8E] transition-colors duration-200"
              >
                <Sparkles className="w-4 h-4" /> Test chatbot
              </Link>
              <button onClick={reset} className="text-[#475569] text-sm flex items-center justify-center gap-1.5 py-2 hover:text-[#0B1220] transition-colors duration-200">
                <RotateCcw className="w-3.5 h-3.5" /> Train another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}