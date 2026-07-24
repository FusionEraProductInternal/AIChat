import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Minimize2, Maximize2, Sparkles, Info } from 'lucide-react'

const DEMO_RESPONSES = {
  'visiting': 'General visiting hours are 4PM - 7PM daily. ICU visiting is restricted to 5PM - 6PM with 1 visitor only.',
  'appointment': 'You can book an appointment online through our portal or call 022-12345678. Walk-ins are also accepted.',
  'parking': 'Yes, we have free parking for 200 vehicles. Valet parking is available at ₹50.',
  'insurance': 'We accept all major insurance providers including LIC, Star Health, and ICICI Lombard.',
  'emergency': 'Emergency: Dial 108 or call 022-12345600 (24/7). Our emergency ward is always open.',
  'doctor': 'Dr. Sharma is available Mon-Fri 9AM-5PM. For other doctors, please check our doctors directory.',
  'check': 'Check-in starts at 2:00 PM. Early check-in is available on request.',
  'wifi': 'Yes, free high-speed WiFi is available throughout the property.',
  'breakfast': 'Yes, complimentary breakfast is served from 7:00 AM to 10:30 AM.',
  'gym': 'Yes, our fitness center is open 24/7 on the 3rd floor.',
  'hello': 'Hello! How can I help you today?',
  'hi': 'Hi there! What can I assist you with?',
  'thank': 'You re welcome! Is there anything else I can help you with?',
  'bye': 'Goodbye! Take care and feel free to reach out anytime.',
}

function getResponse(input) {
  const lower = input.toLowerCase()
  for (const [key, value] of Object.entries(DEMO_RESPONSES)) {
    if (lower.includes(key)) return value
  }
  return "I'm not sure about that. Could you please rephrase or contact our support team at support@techfusionera.com?"
}

/**
 * Matches the "Signal" design system used across the app:
 * Ink #0B1220 · Porcelain #FAFAF8 · Signal Teal #0F9B8E
 * Space Grotesk (display) · Inter (body) · JetBrains Mono (utility)
 */

export default function TestChatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your AI assistant. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const sendMessage = () => {
    if (!input.trim()) return

    const userMsg = input.trim()
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response = getResponse(userMsg)
      setMessages(prev => [...prev, { role: 'bot', text: response }])
      setIsTyping(false)
    }, 800 + Math.random() * 1000)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const suggestions = [
    'What are the visiting hours?',
    'How do I book an appointment?',
    'Is parking available?',
    'What insurance do you accept?',
    'Emergency contact number?',
  ]

  return (
    <div
      className="bg-[#FAFAF8] min-h-screen"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui" }}
    >
      <style>{`
        .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

        @keyframes msg-in {
          from { opacity: 0; transform: translateY(6px) scale(.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .msg-in { animation: msg-in .22s cubic-bezier(0.2,0.6,0.3,1) both; }

        @keyframes chip-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .chip-in { animation: chip-in .3s ease-out both; }

        @keyframes typing-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: .35; }
          30% { transform: translateY(-3px); opacity: 1; }
        }
        .typing-dot { animation: typing-dot 1.1s ease-in-out infinite; }
        .typing-dot:nth-child(2) { animation-delay: .15s; }
        .typing-dot:nth-child(3) { animation-delay: .3s; }

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
          background: #34D399;
          animation: signal-ping 2.2s cubic-bezier(0.4,0,0.6,1) infinite;
        }

        .panel-collapse {
          transition: grid-template-rows .3s ease;
          display: grid;
        }

        @media (prefers-reduced-motion: reduce) {
          .msg-in, .chip-in, .typing-dot, .signal-dot::before { animation: none !important; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        <div className="mb-8">
          <p className="font-mono text-xs tracking-wider uppercase text-[#0F9B8E] mb-2">Preview</p>
          <h1 className="font-display font-semibold text-2xl sm:text-3xl text-[#0B1220]">Test your chatbot</h1>
          <p className="text-[#475569] text-sm mt-1.5">Ask it something the way a real patient or customer would.</p>
        </div>

        {/* Suggested Questions */}
        <div className="rounded-2xl border border-[#0B1220]/8 bg-white p-5 mb-5">
          <h3 className="font-semibold text-[#0B1220] text-sm mb-3.5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0F9B8E]" /> Try these questions
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((q, i) => (
              <button
                key={i}
                onClick={() => { setInput(q); inputRef.current?.focus() }}
                className="chip-in px-3.5 py-1.5 bg-[#0F9B8E]/8 text-[#0F9B8E] text-xs font-medium rounded-full border border-[#0F9B8E]/15 hover:bg-[#0F9B8E]/15 hover:border-[#0F9B8E]/30 active:scale-95 transition-all duration-150"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="rounded-2xl border border-[#0B1220]/8 bg-white overflow-hidden">
          {/* Header */}
          <div className="bg-[#0B1220] text-white px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0F9B8E]/15 flex items-center justify-center">
                <Bot className="w-4.5 h-4.5 text-[#0F9B8E]" />
              </div>
              <div>
                <p className="font-display font-semibold text-sm leading-none">AI Assistant</p>
                <p className="text-white/50 text-xs mt-1.5 flex items-center gap-1.5">
                  <span className="relative w-1.5 h-1.5">
                    <span className="signal-dot absolute inset-0" />
                    <span className="absolute inset-0 rounded-full bg-emerald-400" />
                  </span>
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white/50 hover:text-white transition-colors duration-200"
              aria-label={isOpen ? 'Minimize' : 'Expand'}
            >
              {isOpen ? <Minimize2 className="w-4.5 h-4.5" /> : <Maximize2 className="w-4.5 h-4.5" />}
            </button>
          </div>

          <div className={`panel-collapse ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <div className="overflow-hidden">
              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-3.5 bg-[#FAFAF8]">
                {messages.map((msg, i) => (
                  <div key={i} className={`msg-in flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'bot' && (
                      <div className="w-7 h-7 rounded-full bg-[#0F9B8E]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-[#0F9B8E]" />
                      </div>
                    )}
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#0B1220] text-white rounded-tr-sm'
                        : 'bg-white text-[#0B1220] border border-[#0B1220]/6 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-[#0B1220]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-[#475569]" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="msg-in flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#0F9B8E]/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-[#0F9B8E]" />
                    </div>
                    <div className="bg-white border border-[#0B1220]/6 px-4 py-3 rounded-2xl rounded-tl-sm">
                      <div className="flex gap-1">
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#0B1220]/30 inline-block" />
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#0B1220]/30 inline-block" />
                        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#0B1220]/30 inline-block" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-3 py-3 border-t border-[#0B1220]/8 bg-white flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message…"
                  className="flex-1 bg-[#FAFAF8] border border-[#0B1220]/8 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0F9B8E]/25 focus:border-[#0F9B8E]/40 transition-all duration-200"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-[#0F9B8E] rounded-full flex items-center justify-center text-white disabled:opacity-30 disabled:active:scale-100 hover:bg-[#12B5A6] active:scale-90 transition-all duration-150"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-5 rounded-2xl border border-[#0B1220]/8 bg-white p-5 flex gap-3">
          <Info className="w-4 h-4 text-[#0F9B8E] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-[#0B1220] text-sm mb-1.5">How this works</h3>
            <p className="text-[#475569] text-xs leading-relaxed">
              This is a preview of how your trained chatbot appears on any website. Once
              you embed the script, this exact widget shows up in the corner of your site —
              answering patients or customers 24/7 from your own training data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
