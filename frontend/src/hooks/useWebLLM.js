import { useState, useRef, useCallback } from 'react'

const MODEL_ID = 'SmolLM2-360M-Instruct-q4f16_1-MLC'

const DEFAULT_SAMPLE_DATA = [
  { q: "What are the visiting hours?", a: "General visiting hours are 4PM - 7PM daily. ICU visiting is 5PM - 6PM with 1 visitor only." },
  { q: "How do I book an appointment?", a: "You can book online through our portal or call 022-12345678. Walk-ins are also accepted." },
  { q: "Is parking available?", a: "Yes, we have free parking for 200 vehicles. Valet parking is available at ₹50." },
  { q: "What insurance do you accept?", a: "We accept all major insurance providers including LIC, Star Health, and ICICI Lombard." },
  { q: "Emergency contact number?", a: "Emergency: 108 or 022-12345600 (24/7)" }
]

export function useWebLLM() {
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressText, setProgressText] = useState('')
  const [error, setError] = useState(null)
  const [engineMode, setEngineMode] = useState('webllm') // 'webllm' or 'fast'
  const [webGpuSupported, setWebGpuSupported] = useState(true)

  const engineRef = useRef(null)
  const systemPromptRef = useRef('')
  const parsedKbRef = useRef([])
  const loadCancelledRef = useRef(false)

  const parseKnowledgeData = (trainingData) => {
    let kb = [...DEFAULT_SAMPLE_DATA]
    if (trainingData && trainingData.trim()) {
      try {
        const parsed = JSON.parse(trainingData)
        if (Array.isArray(parsed)) {
          kb = parsed
        }
      } catch {
        const lines = trainingData.split('\n').filter(l => l.trim())
        kb = lines.map((line, idx) => ({ q: `Topic ${idx + 1}`, a: line }))
      }
    }
    return kb
  }

  const switchToFastMode = useCallback(() => {
    loadCancelledRef.current = true
    engineRef.current = null
    setEngineMode('fast')
    setIsReady(true)
    setIsLoading(false)
    setProgress(100)
    setProgressText('Instant AI Engine active (No download required)')
  }, [])

  const loadModel = useCallback(async (trainingData = '') => {
    loadCancelledRef.current = false
    setIsLoading(true)
    setError(null)
    setProgress(0)
    setProgressText('Checking WebGPU support & initializing model...')
    setEngineMode('webllm')

    const kbData = parseKnowledgeData(trainingData)
    parsedKbRef.current = kbData

    let systemPrompt = `You are a helpful, friendly AI assistant for a business. Answer naturally and conversationally in the same language the user writes in (English or Hindi/Hinglish). Don't just match keywords — understand what the user actually means. Use the business knowledge below when it's relevant, but you can also have a normal conversation beyond it.`

    const knowledgeText = kbData.map(d => `Q: ${d.q}\nA: ${d.a}`).join('\n\n')
    systemPrompt += `\n\nBusiness knowledge base:\n\n${knowledgeText.slice(0, 6000)}`
    systemPromptRef.current = systemPrompt

    // Check WebGPU availability
    const hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator && !!navigator.gpu
    setWebGpuSupported(hasWebGPU)

    if (!hasWebGPU) {
      console.warn('WebGPU is not supported in this browser. Switching to Instant Fast AI Engine.')
      switchToFastMode()
      return true
    }

    const MAX_RETRIES = 2
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      if (loadCancelledRef.current) return true
      try {
        const webllm = await import('@mlc-ai/web-llm')

        const engine = await webllm.CreateMLCEngine(MODEL_ID, {
          initProgressCallback: (report) => {
            if (loadCancelledRef.current) return
            if (typeof report.progress === 'number' && !isNaN(report.progress)) {
              setProgress(Math.round(report.progress * 100))
            }
            if (report.text) {
              let text = report.text
              if (text.includes('Fetch')) {
                text = text.replace(/Fetch\s+https?:\/\/[^\s]+/g, 'Downloading model file')
              }
              setProgressText(text)
            }
          },
          logLevel: 'INFO',
          appConfig: {
            ...webllm.prebuiltAppConfig,
            useIndexedDBCache: true
          }
        })

        if (loadCancelledRef.current) return true

        engineRef.current = engine
        setIsReady(true)
        setIsLoading(false)
        setEngineMode('webllm')
        return true
      } catch (err) {
        console.warn(`WebLLM load attempt ${attempt} failed:`, err)
        const errMsg = String(err?.message || err)
        const isNetworkOrCdnError = (
          errMsg.includes('Cache') ||
          errMsg.includes('NetworkError') ||
          errMsg.includes('Fetch') ||
          errMsg.includes('HTTP2') ||
          errMsg.includes('params_shard') ||
          errMsg.includes('Failed to execute')
        )

        if (isNetworkOrCdnError || attempt === MAX_RETRIES) {
          console.warn('HuggingFace CDN / Cache Network Error detected. Automatically switching to Instant Fast AI Engine.')
          switchToFastMode()
          setProgressText('HuggingFace CDN network error — Switched to Instant AI Engine')
          return true
        }
        setProgress(0)
        setProgressText(`Retry attempt ${attempt + 1}... Checking cache...`)
        await new Promise(r => setTimeout(r, 1000))
      }
    }
  }, [switchToFastMode])

  const generateFastResponse = useCallback((userMessage, history = []) => {
    const query = userMessage.toLowerCase().trim()
    const kb = parsedKbRef.current.length > 0 ? parsedKbRef.current : DEFAULT_SAMPLE_DATA

    // Extract userName from full chat history + current message
    let userName = ''
    const fullTranscript = [...history, { role: 'user', text: userMessage }]
    for (const msg of fullTranscript) {
      if (msg.role === 'user' && msg.text) {
        const text = msg.text.trim()
        const m = text.match(/(?:my name is|i am|i'm|mera na+m|mera na+me|main|mai)\s+([a-zA-Z\s]{2,30})(?:\s+hai|\s+hoon|\s+hu|$|\.)/i)
        if (m && m[1]) {
          const rawName = m[1].replace(/^(hai|hoon|hu|is)\s+/i, '').trim()
          if (rawName.length >= 2 && !['a', 'the', 'is', 'am', 'are', 'not', 'here', 'fine', 'good', 'asking', 'checking'].includes(rawName.toLowerCase())) {
            userName = rawName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
          }
        }
      }
    }

    const isHindi = /(mera|naam|naam|hai|hu|hoon|kya|kaise|kaisa|batao|shukriya|dhanyawad|aap|tum|hum|ko|se|me|par|karo|bataiye)/i.test(query)

    // 1. Name query (e.g., "mera name kya hai", "what is my name", "who am i")
    if (/(mera|my)\s+(na+m|na+me)\s+(kya|what)|what\s+is\s+my\s+name|who\s+am\s+i|mujhe\s+mera\s+naam\s+batao|do\s+you\s+know\s+my\s+name/i.test(query)) {
      if (userName) {
        return isHindi ? `Aapka naam ${userName} hai! 😊` : `Your name is ${userName}! 😊`
      } else {
        return isHindi ? `Aapne abhi tak apna naam nahi bataya. Aapka naam kya hai?` : `You haven't told me your name yet! What is your name?`
      }
    }

    // 2. Name introduction (e.g., "my name is pranav vishwakarma", "mera name pranav hai")
    const nameIntroMatch = query.match(/(?:my name is|i am|i'm|mera na+m|mera na+me|main|mai)\s+([a-zA-Z\s]{2,30})(?:\s+hai|\s+hoon|\s+hu|$|\.)/i)
    if (nameIntroMatch && nameIntroMatch[1]) {
      const extracted = nameIntroMatch[1].replace(/^(hai|hoon|hu|is)\s+/i, '').trim()
      const formatted = extracted.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
      if (isHindi) {
        return `Namaste ${formatted}! 😊 Aapse milkar khushi hui. Main aapki kya sahayata kar sakta hoon?`
      } else {
        return `Nice to meet you, ${formatted}! 😊 How can I help you today?`
      }
    }

    // 3. Greetings (e.g., "hello", "hi", "hey", "namaste", "good morning")
    if (/^(hi|hello|hey|greetings|namaste|pranam|hii+|helo|hllo|good morning|good afternoon|good evening)\b/i.test(query)) {
      const prefix = userName ? (isHindi ? `Namaste ${userName}! 👋` : `Hello ${userName}! 👋`) : (isHindi ? `Namaste! 👋` : `Hello! 👋`)
      return `${prefix} Welcome to our AI Assistant. How can I help you today? You can ask about our services, timings, appointments, or pricing!`
    }

    // 4. How are you / Casual chat
    if (/how are you|how r u|kaisa hai|kaise ho|kya haal hai/i.test(query)) {
      const prefix = userName ? `${userName}, ` : ''
      return `I'm doing great, ${prefix}thank you for asking! 😊 How can I help you today?`
    }

    // 5. Who are you / Bot capabilities
    if (/^(who are you|what can you do|help|what is this|aap kaun ho|tum kaun ho|kya kar sakte ho)\b/i.test(query)) {
      return "I am your AI business assistant! 🤖 I can answer your questions about our services, timings, pricing, appointments, and custom trained business information."
    }

    // 6. Thanks / Goodbye
    if (/thank|thanks|shukriya|dhanyawad/i.test(query)) {
      const prefix = userName ? `, ${userName}` : ''
      return `You're welcome${prefix}! 😊 Is there anything else I can help you with?`
    }
    if (/bye|goodbye|see you|alvida|cya/i.test(query)) {
      const prefix = userName ? `, ${userName}` : ''
      return `Goodbye${prefix}! Have a great day ahead. Feel free to reach out anytime! 👋`
    }

    // 7. Knowledge base search (scoring algorithm)
    const stopWords = new Set(['what', 'is', 'the', 'are', 'do', 'you', 'how', 'can', 'i', 'a', 'an', 'to', 'for', 'of', 'in', 'on', 'my', 'our', 'have', 'please', 'kya', 'hai', 'ko', 'se', 'me', 'par', 'hain', 'ka', 'ki', 'ke'])
    const queryWords = query.split(/\W+/).filter(w => w.length > 1 && !stopWords.has(w))

    let bestScore = 0
    let bestAnswer = null

    for (const item of kb) {
      const qText = (item.q || '').toLowerCase()
      const aText = (item.a || '').toLowerCase()
      const combined = `${qText} ${aText}`

      let score = 0
      for (const word of queryWords) {
        if (qText.includes(word)) score += 3
        else if (combined.includes(word)) score += 1
      }

      if (queryWords.length > 0) {
        const queryPhrase = queryWords.join(' ')
        if (qText.includes(queryPhrase) || combined.includes(queryPhrase)) score += 5
      }

      if (score > bestScore) {
        bestScore = score
        bestAnswer = item.a
      }
    }

    if (bestAnswer && bestScore >= 2) {
      return bestAnswer
    }

    // 8. Helpful conversational fallback with sample topics
    const sampleTopics = kb.map(k => `• ${k.q}`).slice(0, 3).join('\n')
    const prefix = userName ? `${userName}, ` : ''
    return `Thank you for your question, ${prefix}! Here are some topics I can answer for you:\n\n${sampleTopics}`
  }, [])

  const generateStreaming = useCallback(async (userMessage, history = [], onChunk) => {
    if (engineMode === 'fast' || !engineRef.current) {
      const response = generateFastResponse(userMessage, history)
      const words = response.split(' ')
      let currentText = ''
      for (let i = 0; i < words.length; i++) {
        currentText += (i === 0 ? '' : ' ') + words[i]
        onChunk(currentText)
        await new Promise(r => setTimeout(r, 25))
      }
      return response
    }

    try {
      const messages = [
        { role: 'system', content: systemPromptRef.current },
        ...history.map(h => ({ role: h.role === 'bot' ? 'assistant' : 'user', content: h.text })),
        { role: 'user', content: userMessage }
      ]
      const chunks = await engineRef.current.chat.completions.create({
        messages, temperature: 0.7, max_tokens: 400, stream: true
      })
      let fullResponse = ''
      for await (const chunk of chunks) {
        fullResponse += chunk.choices[0]?.delta.content || ''
        onChunk(fullResponse)
      }
      return fullResponse
    } catch (err) {
      console.error('WebLLM Generation Error, switching to fast mode:', err)
      const response = generateFastResponse(userMessage, history)
      onChunk(response)
      return response
    }
  }, [engineMode, generateFastResponse])

  return {
    isLoading,
    isReady,
    progress,
    progressText,
    error,
    engineMode,
    webGpuSupported,
    loadModel,
    generateStreaming,
    switchToFastMode
  }
}