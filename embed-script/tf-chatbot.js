/**
 * TechFusionEra AI Chatbot Widget
 * Paste this script on any website to add an AI chatbot.
 *
 * Usage:
 *   <script src="http://localhost:3000/embed/tf-chatbot.js"
 *     data-api-key="YOUR_KEY"
 *     data-theme="hospital"
 *     data-position="bottom-right"
 *     data-title="Chat with us"
 *     data-greeting="Hello! How can I help you today?"
 *   ></script>
 */

(function () {
  'use strict';

  // Prevent duplicate initialization
  if (document.getElementById('tf-chatbot-widget')) return;

  // Get config from script tag
  const scriptTag = document.currentScript || document.querySelector('script[data-api-key]');
  if (!scriptTag) return;

  const scriptUrl = scriptTag.src || '';
  let defaultApiUrl = 'http://localhost:3000/api';
  if (scriptUrl) {
    try { defaultApiUrl = new URL(scriptUrl).origin + '/api'; } catch (e) { }
  }

  const config = {
    apiKey: scriptTag.getAttribute('data-api-key') || 'tf_demo_123456789',
    theme: scriptTag.getAttribute('data-theme') || 'hospital',
    position: scriptTag.getAttribute('data-position') || 'bottom-right',
    title: scriptTag.getAttribute('data-title') || 'Chat with us',
    greeting: scriptTag.getAttribute('data-greeting') || 'Hello! How can I help you today?',
    apiUrl: scriptTag.getAttribute('data-api-url') || defaultApiUrl
  };

  // Theme colors
  const themes = {
    hospital: { primary: '#0F9B8E', icon: '🏥' },
    hotel: { primary: '#D97706', icon: '🏨' },
    business: { primary: '#2563EB', icon: '💼' },
    dark: { primary: '#0B1220', icon: '💬' }
  };
  const theme = themes[config.theme] || themes.hospital;
  const isRight = config.position.includes('right');

  // ── Create widget HTML ────────────────────────────────────────────
  const container = document.createElement('div');
  container.id = 'tf-chatbot-widget';
  container.innerHTML = `
    <style>
      #tf-chatbot-widget {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        position: fixed;
        ${isRight ? 'right: 16px;' : 'left: 16px;'}
        bottom: 16px;
        z-index: 999999;
      }
      .tf-chat-btn {
        width: 56px; height: 56px; border-radius: 50%;
        background: ${theme.primary}; color: white; border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: transform 0.2s, box-shadow 0.2s; font-size: 24px;
      }
      .tf-chat-btn:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(0,0,0,0.25); }
      .tf-chat-btn:active { transform: scale(0.95); }
      .tf-chat-window {
        position: absolute; ${isRight ? 'right: 0;' : 'left: 0;'} bottom: 72px;
        width: 360px; max-width: calc(100vw - 32px);
        height: 520px; max-height: calc(100vh - 100px);
        background: white; border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        display: flex; flex-direction: column; overflow: hidden;
        opacity: 0; transform: translateY(20px) scale(0.95);
        transition: opacity 0.3s, transform 0.3s; pointer-events: none;
      }
      .tf-chat-window.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }
      .tf-chat-header {
        background: ${theme.primary}; color: white;
        padding: 14px 16px; display: flex; align-items: center; gap: 10px;
      }
      .tf-chat-header-icon {
        width: 32px; height: 32px; border-radius: 50%;
        background: rgba(255,255,255,0.2);
        display: flex; align-items: center; justify-content: center; font-size: 16px;
      }
      .tf-chat-header-text { flex: 1; }
      .tf-chat-header-title { font-weight: 600; font-size: 15px; }
      .tf-chat-header-status {
        font-size: 12px; opacity: 0.8;
        display: flex; align-items: center; gap: 4px;
      }
      .tf-chat-header-status::before {
        content: ''; width: 6px; height: 6px; border-radius: 50%; background: #34C759;
      }
      .tf-chat-close {
        background: none; border: none; color: white; cursor: pointer;
        padding: 4px; opacity: 0.7; transition: opacity 0.2s;
      }
      .tf-chat-close:hover { opacity: 1; }
      .tf-chat-messages {
        flex: 1; overflow-y: auto; padding: 16px; background: #F2F2F7;
        display: flex; flex-direction: column; gap: 12px;
      }
      .tf-chat-msg {
        max-width: 80%; padding: 10px 14px; border-radius: 18px;
        font-size: 14px; line-height: 1.5; word-wrap: break-word;
        white-space: pre-wrap;
      }
      .tf-chat-msg.bot {
        background: white; color: #1C1C1E;
        border-bottom-left-radius: 4px; align-self: flex-start;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      }
      .tf-chat-msg.user {
        background: ${theme.primary}; color: white;
        border-bottom-right-radius: 4px; align-self: flex-end;
      }
      .tf-chat-typing {
        display: flex; gap: 4px; padding: 12px 14px; background: white;
        border-radius: 18px; border-bottom-left-radius: 4px; align-self: flex-start;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      }
      .tf-chat-typing-dot {
        width: 6px; height: 6px; border-radius: 50%; background: #C7C7CC;
        animation: tf-typing 1.4s infinite;
      }
      .tf-chat-typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .tf-chat-typing-dot:nth-child(3) { animation-delay: 0.4s; }
      @keyframes tf-typing {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-4px); }
      }
      .tf-chat-suggestions-area {
        padding: 8px 12px;
        background: #F2F2F7;
        border-top: 1px solid rgba(0,0,0,0.05);
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        max-height: 100px;
        overflow-y: auto;
      }
      .tf-chat-chip {
        background: white;
        color: #0B1220;
        border: 1px solid rgba(15, 155, 142, 0.25);
        border-radius: 14px;
        padding: 4px 10px;
        font-size: 11.5px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
        line-height: 1.3;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      }
      .tf-chat-chip:hover {
        background: ${theme.primary};
        color: white;
        border-color: ${theme.primary};
        transform: translateY(-1px);
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      }
      .tf-chat-input-area {
        padding: 10px 12px; background: white; border-top: 1px solid #E5E5EA;
        display: flex; gap: 8px;
      }
      .tf-chat-input {
        flex: 1; border: 1px solid #E5E5EA; border-radius: 20px;
        padding: 8px 14px; font-size: 14px; outline: none; font-family: inherit;
      }
      .tf-chat-input:focus { border-color: ${theme.primary}; }
      .tf-chat-send {
        width: 36px; height: 36px; border-radius: 50%;
        background: ${theme.primary}; color: white; border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.2s, opacity 0.2s;
      }
      .tf-chat-send:hover { transform: scale(1.05); }
      .tf-chat-send:active { transform: scale(0.95); }
      .tf-chat-send:disabled { opacity: 0.5; cursor: not-allowed; }
      .tf-chat-powered {
        text-align: center; padding: 6px; font-size: 11px; color: #8E8E93; background: white;
      }
      .tf-chat-powered a { color: ${theme.primary}; text-decoration: none; }
      @media (max-width: 480px) {
        .tf-chat-window { width: calc(100vw - 32px); height: calc(100vh - 100px); border-radius: 16px; }
      }
    </style>

    <button class="tf-chat-btn" id="tf-chat-toggle" title="${config.title}">💬</button>

    <div class="tf-chat-window" id="tf-chat-window">
      <div class="tf-chat-header">
        <div class="tf-chat-header-icon">${theme.icon}</div>
        <div class="tf-chat-header-text">
          <div class="tf-chat-header-title">${config.title}</div>
          <div class="tf-chat-header-status" id="tf-chat-header-status">Loading AI…</div>
        </div>
        <button class="tf-chat-close" id="tf-chat-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="tf-chat-messages" id="tf-chat-messages"></div>
      <div class="tf-chat-suggestions-area" id="tf-chat-suggestions"></div>
      <div class="tf-chat-input-area">
        <input type="text" class="tf-chat-input" id="tf-chat-input" placeholder="Type a message..." />
        <button class="tf-chat-send" id="tf-chat-send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </div>
      <div class="tf-chat-powered">
        Powered by <a href="https://techfusionera.com" target="_blank">TechFusionEra AI</a>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  // ── Elements ───────────────────────────────────────────────────────
  const toggleBtn = document.getElementById('tf-chat-toggle');
  const windowEl = document.getElementById('tf-chat-window');
  const closeBtn = document.getElementById('tf-chat-close');
  const messagesEl = document.getElementById('tf-chat-messages');
  const suggestionsEl = document.getElementById('tf-chat-suggestions');
  const inputEl = document.getElementById('tf-chat-input');
  const sendBtn = document.getElementById('tf-chat-send');
  const statusEl = document.getElementById('tf-chat-header-status');

  let isOpen = false;
  let messages = [];
  let engine = null;      // WebLLM engine
  let isReady = false;
  let systemPrompt = '';

  // ── Helpers ────────────────────────────────────────────────────────
  function setStatus(text) { if (statusEl) statusEl.textContent = text; }

  function addMessage(text, isUser, id) {
    if (id) {
      const existing = document.getElementById(id);
      if (existing) { existing.textContent = text; messagesEl.scrollTop = messagesEl.scrollHeight; return; }
    }
    const msg = document.createElement('div');
    msg.className = `tf-chat-msg ${isUser ? 'user' : 'bot'}`;
    msg.textContent = text;
    if (id) msg.id = id;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    if (!id) messages.push({ role: isUser ? 'user' : 'bot', text });
  }

  function showTyping() {
    if (document.getElementById('tf-chat-typing')) return;
    const t = document.createElement('div');
    t.className = 'tf-chat-typing'; t.id = 'tf-chat-typing';
    t.innerHTML = '<div class="tf-chat-typing-dot"></div><div class="tf-chat-typing-dot"></div><div class="tf-chat-typing-dot"></div>';
    messagesEl.appendChild(t);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('tf-chat-typing');
    if (t) t.remove();
  }

  // ── Extract 4 trained questions dynamically ───────────────────────
  function getTrainedQuestions() {
    let questions = [];
    try {
      const saved = localStorage.getItem('tf-trained-config');
      if (saved) {
        const cfg = JSON.parse(saved);
        if (cfg && cfg.trainingData) {
          const parsed = JSON.parse(cfg.trainingData);
          if (Array.isArray(parsed)) {
            questions = parsed
              .map(item => item.q || item.question || '')
              .filter(q => q && q.trim().length > 3);
          } else if (typeof cfg.trainingData === 'string') {
            const lines = cfg.trainingData.split('\n').map(l => l.trim()).filter(l => l.length > 5);
            questions = lines.slice(0, 4);
          }
        }
      }
    } catch (e) { }

    const defaults = [
      'What are the visiting hours?',
      'How do I book an appointment?',
      'Is parking available?',
      'What insurance do you accept?'
    ];

    const result = [...questions];
    for (const d of defaults) {
      if (result.length >= 4) break;
      if (!result.includes(d)) result.push(d);
    }

    return result.slice(0, 4);
  }

  function renderSuggestions() {
    if (!suggestionsEl) return;
    const questions = getTrainedQuestions();
    suggestionsEl.innerHTML = '';

    questions.forEach(qText => {
      const chip = document.createElement('button');
      chip.className = 'tf-chat-chip';
      chip.textContent = '💡 ' + qText;
      chip.addEventListener('click', () => {
        inputEl.value = qText;
        sendMessage();
      });
      suggestionsEl.appendChild(chip);
    });
  }

  // ── Build system prompt from trained KB saved in localStorage ──────
  function buildSystemPrompt() {
    let kb = [];
    try {
      const saved = localStorage.getItem('tf-trained-config');
      if (saved) {
        const cfg = JSON.parse(saved);
        if (cfg && cfg.trainingData) {
          const parsed = JSON.parse(cfg.trainingData);
          if (Array.isArray(parsed)) kb = parsed;
        }
      }
    } catch (e) { }

    let prompt = `You are a helpful, friendly AI assistant for a business. Answer naturally and conversationally in the same language the user writes in (English or Hindi/Hinglish). Understand what the user means — don't just match keywords. You can also have normal conversation beyond business topics.`;

    if (kb.length > 0) {
      const knowledge = kb.map(d => `Q: ${d.q}\nA: ${d.a}`).join('\n\n');
      prompt += `\n\nBusiness knowledge base:\n\n${knowledge.slice(0, 6000)}`;
    }
    return prompt;
  }

  // ── Smart Conversational & KB Engine (Bilingual English + Hinglish) ──
  function generateSmartResponse(userText) {
    const query = userText.trim().toLowerCase();

    // 1. Load trained KB from localStorage
    let kb = [];
    try {
      const saved = localStorage.getItem('tf-trained-config');
      if (saved) {
        const cfg = JSON.parse(saved);
        if (cfg && cfg.trainingData) {
          const parsed = JSON.parse(cfg.trainingData);
          if (Array.isArray(parsed)) kb = parsed;
        }
      }
    } catch (e) { }

    if (kb.length === 0) {
      kb = [
        { q: 'visiting hours', a: 'General visiting hours are 4PM - 7PM daily. ICU visiting is 5PM - 6PM with 1 visitor only.' },
        { q: 'book appointment', a: 'You can book an appointment online through our portal or call 022-12345678. Walk-ins are also accepted.' },
        { q: 'parking available', a: 'Yes, we have free parking for 200 vehicles. Valet parking is available at ₹50.' },
        { q: 'insurance accept', a: 'We accept all major insurance providers including LIC, Star Health, and ICICI Lombard.' },
        { q: 'emergency contact number', a: 'Emergency: Dial 108 or call 022-12345600 (24/7). Our emergency ward is always open.' }
      ];
    }

    // 2. Scan entire widget conversation history for user's name!
    let userName = '';
    for (const msg of messages) {
      if (msg.role === 'user' && msg.text) {
        const t = msg.text.trim();
        const m = t.match(/(?:my name is|i am|i'm|mera na+m|mera na+me|main|mai)\s+([a-zA-Z\s]{2,30})(?:\s+hai|\s+hoon|\s+hu|$|\.)/i);
        if (m && m[1]) {
          const rawName = m[1].replace(/^(hai|hoon|hu|is)\s+/i, '').trim();
          if (rawName.length >= 2 && !['a', 'the', 'is', 'am', 'are', 'not', 'here', 'fine', 'good', 'asking'].includes(rawName.toLowerCase())) {
            userName = rawName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          }
        }
      }
    }

    const currentNameMatch = query.match(/(?:my name is|i am|i'm|mera na+m|mera na+me|main|mai)\s+([a-zA-Z\s]{2,30})(?:\s+hai|\s+hoon|\s+hu|$|\.)/i);
    if (currentNameMatch && currentNameMatch[1]) {
      const rawName = currentNameMatch[1].replace(/^(hai|hoon|hu|is)\s+/i, '').trim();
      if (rawName.length >= 2 && !['a', 'the', 'is', 'am', 'are', 'not', 'here', 'fine', 'good'].includes(rawName.toLowerCase())) {
        userName = rawName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      }
    }

    const isHindi = /(mera|naam|naam|hai|hu|hoon|kya|kaise|kaisa|batao|shukriya|dhanyawad|aap|tum|hum|ko|se|me|par|karo|bataiye)/i.test(query);

    // Intent 1: Name query (e.g. "mera name kya hai", "what is my name", "who am i")
    if (/(mera|my)\s+(na+m|na+me)\s+(kya|what)|what\s+is\s+my\s+name|who\s+am\s+i|mujhe\s+mera\s+naam\s+batao|do\s+you\s+know\s+my\s+name/i.test(query)) {
      if (userName) {
        return isHindi ? `Aapka naam ${userName} hai! 😊` : `Your name is ${userName}! 😊`;
      } else {
        return isHindi ? `Aapne abhi tak apna naam nahi bataya. Aapka naam kya hai?` : `You haven't told me your name yet! What is your name?`;
      }
    }

    // Intent 2: Name introduction (e.g. "my name is pranav vishwakarma", "mera name pranav hai")
    if (currentNameMatch && currentNameMatch[1] && userName) {
      if (isHindi) {
        return `Namaste ${userName}! 😊 Aapse milkar khushi hui. Main aapki kya sahayata kar sakta hoon?`;
      } else {
        return `Nice to meet you, ${userName}! 😊 How can I help you today?`;
      }
    }

    // Intent 3: Greetings (e.g. "hello", "hi", "hey", "namaste", "good morning")
    if (/^(hi|hello|hey|greetings|namaste|pranam|hii+|helo|hllo|good morning|good afternoon|good evening)\b/i.test(query)) {
      const prefix = userName ? (isHindi ? `Namaste ${userName}! 👋` : `Hello ${userName}! 👋`) : (isHindi ? `Namaste! 👋` : `Hello! 👋`);
      return `${prefix} Welcome to our AI Assistant. How can I help you today? Feel free to ask about our services, timings, appointments, or pricing!`;
    }

    // Intent 4: How are you / Casual chat
    if (/how are you|how r u|kaisa hai|kaise ho|kya haal hai/i.test(query)) {
      const prefix = userName ? `${userName}, ` : '';
      return `I'm doing great, ${prefix}thank you for asking! 😊 How can I help you today?`;
    }

    // Intent 5: Who are you / Bot capabilities
    if (/^(who are you|what can you do|help|what is this|aap kaun ho|tum kaun ho|kya kar sakte ho)\b/i.test(query)) {
      return "I am your AI business assistant! 🤖 I can answer your questions about our services, timings, pricing, appointments, and business info.";
    }

    // Intent 6: Thanks / Goodbye
    if (/thank|thanks|shukriya|dhanyawad/i.test(query)) {
      const prefix = userName ? `, ${userName}` : '';
      return `You're welcome${prefix}! 😊 Is there anything else I can help you with?`;
    }
    if (/bye|goodbye|see you|alvida|cya/i.test(query)) {
      const prefix = userName ? `, ${userName}` : '';
      return `Goodbye${prefix}! Have a great day ahead. Feel free to reach out anytime! 👋`;
    }

    // Intent 7: Fuzzy Knowledge base search
    const stopWords = new Set(['what', 'is', 'the', 'are', 'do', 'you', 'how', 'can', 'i', 'a', 'an', 'to', 'for', 'of', 'in', 'on', 'my', 'our', 'have', 'please', 'kya', 'hai', 'ko', 'se', 'me', 'par', 'hain', 'ka', 'ki', 'ke']);
    const queryWords = query.split(/\W+/).filter(w => w.length > 1 && !stopWords.has(w));

    let bestScore = 0;
    let bestAnswer = null;

    for (const item of kb) {
      const qText = (item.q || '').toLowerCase();
      const aText = (item.a || '').toLowerCase();
      const combined = qText + ' ' + aText;

      let score = 0;
      for (const word of queryWords) {
        if (qText.includes(word)) score += 3;
        else if (combined.includes(word)) score += 1;
      }

      if (queryWords.length > 0) {
        const queryPhrase = queryWords.join(' ');
        if (qText.includes(queryPhrase) || combined.includes(queryPhrase)) score += 5;
      }

      if (score > bestScore) {
        bestScore = score;
        bestAnswer = item.a;
      }
    }

    if (bestAnswer && bestScore >= 2) {
      return bestAnswer;
    }

    // Intent 8: Conversational fallback showing available topics
    const sampleTopics = kb.map(k => `• ${k.q}`).slice(0, 3).join('\n');
    const prefix = userName ? `${userName}, ` : '';
    return `Thank you for your question, ${prefix}! Here are some topics I can answer for you:\n\n${sampleTopics}`;
  }

  // ── WebLLM: load from IndexedDB cache (same cache as the Test page) ─
  const MODEL_ID = 'SmolLM2-360M-Instruct-q4f16_1-MLC';
  const WEB_LLM_CDN = 'https://esm.run/@mlc-ai/web-llm@0.2.84';

  async function initEngine() {
    setStatus('Loading AI…');
    try {
      const webllm = await import(WEB_LLM_CDN);
      systemPrompt = buildSystemPrompt();

      engine = await webllm.CreateMLCEngine(MODEL_ID, {
        initProgressCallback: (report) => {
          const pct = report.progress ? Math.round(report.progress * 100) : '';
          setStatus(pct ? `Loading ${pct}%…` : 'Loading AI…');
        },
        appConfig: {
          ...webllm.prebuiltAppConfig,
          useIndexedDBCache: true   // reuse same IndexedDB cache as the Test page ✅
        }
      });

      isReady = true;
      setStatus('Online');
      console.log('✅ TechFusionEra embed: WebLLM ready (from IndexedDB cache)');
    } catch (err) {
      console.warn('TechFusionEra embed: WebLLM not available, switching to Fast AI engine.', err);
      engine = null;
      isReady = true;
      setStatus('Online');
    }
  }

  // ── Streaming response with WebLLM ─────────────────────────────────
  async function sendWithEngine(userText) {
    const replyId = 'tf-reply-' + Date.now();
    addMessage('…', false, replyId);

    const chatHistory = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-10).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text
      })),
      { role: 'user', content: userText }
    ];

    try {
      const stream = await engine.chat.completions.create({
        messages: chatHistory,
        temperature: 0.7,
        max_tokens: 400,
        stream: true
      });

      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.choices[0]?.delta?.content || '';
        addMessage(fullText, false, replyId);
      }
      messages.push({ role: 'bot', text: fullText });
    } catch (err) {
      console.error('WebLLM generation error:', err);
      addMessage(generateSmartResponse(userText), false, replyId);
    }
  }

  // ── Main send handler ──────────────────────────────────────────────
  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || !isReady) return;

    addMessage(text, true);
    inputEl.value = '';
    sendBtn.disabled = true;

    if (engine) {
      await sendWithEngine(text);
    } else {
      showTyping();
      await new Promise(r => setTimeout(r, 400 + Math.random() * 500));
      hideTyping();
      addMessage(generateSmartResponse(text), false);
    }

    sendBtn.disabled = false;
    inputEl.focus();
  }

  // ── Event listeners ────────────────────────────────────────────────
  toggleBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    windowEl.classList.toggle('open', isOpen);
    if (isOpen && messages.length === 0) {
      setTimeout(() => addMessage(config.greeting, false), 300);
    }
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    windowEl.classList.remove('open');
  });

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

  // ── Restore chat history & render suggestion chips ─────────────────
  try {
    const saved = localStorage.getItem('tf-chat-history-' + config.apiKey);
    if (saved) {
      messages = JSON.parse(saved);
      messages.forEach(m => addMessage(m.text, m.role === 'user'));
    }
  } catch (e) { }

  renderSuggestions();

  setInterval(() => {
    try { localStorage.setItem('tf-chat-history-' + config.apiKey, JSON.stringify(messages)); } catch (e) { }
  }, 5000);

  // ── Start: initialize WebLLM engine in background ─────────────────
  initEngine();

  console.log('✅ TechFusionEra AI Chatbot loaded. API Key:', config.apiKey);
})();
