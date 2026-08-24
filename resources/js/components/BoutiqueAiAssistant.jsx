import { useState, useRef, useEffect } from 'react'
import { Link } from '@inertiajs/react'

const KNOWLEDGE_BASE = [
  {
    keywords: ['hi', 'hello', 'hey', 'start', 'assalam', 'aoa', 'help'],
    response: "Assalamu Alaikum! Welcome to **Libas-E-Maryam** Luxury Boutique Concierge. I am your personal AI Stylist. How may I assist you today with our suits, bridal formals, orders, or sizing?",
    links: [
      { label: "👗 View Catalog", url: "/products" },
      { label: "🗂️ Explore Categories", url: "/categories" }
    ]
  },
  {
    keywords: ['price', 'cost', 'rate', 'pkr', 'expensive', 'cheap', 'budget'],
    response: "Our boutique collections range from **PKR 11,500** for Designer 3-Piece Lawn up to **PKR 125,000** for Hand-Worked Bridal Lehengas. We offer Free Express Shipping across Pakistan on all orders over **PKR 10,000**!",
    links: [{ label: "🛍️ Shop Collection", url: "/products" }]
  },
  {
    keywords: ['shipping', 'delivery', 'deliv', 'ship', 'time', 'cod', 'cash'],
    response: "🚚 **Delivery Information**:\n• **Free Express Shipping** on orders above **PKR 10,000**!\n• Standard delivery time across Pakistan is **3 to 5 business days**.\n• We accept **Cash on Delivery (COD)** and Direct Bank Transfer at checkout.",
    links: [{ label: "🛒 Checkout Flow", url: "/checkout" }]
  },
  {
    keywords: ['discount', 'coupon', 'promo', 'code', 'offer', 'sale'],
    response: "🎉 Special Boutique Offer!\nUse promo code **LIBAS10** or **MARYAM10** at checkout to get an instant **10% OFF** your entire order!",
    links: [{ label: "👗 Claim Offer on Products", url: "/products" }]
  },
  {
    keywords: ['size', 'sizing', 'stitch', 'custom', 'fit', 'measurement', 'alteration'],
    response: "📏 We provide standard sizes: **Small (S)**, **Medium (M)**, **Large (L)**, and **Extra Large (XL)**.\n\nWe also offer **Bespoke Custom Tailoring** for bridal and formal ensembles. Contact our master tailors directly via WhatsApp for custom sizing!",
    links: [{ label: "📞 Whatsapp Custom Orders", external: "https://wa.me/923214676591?text=Hello%20Libas-E-Maryam!%20I%20need%20custom%20stitching%20details." }]
  },
  {
    keywords: ['bridal', 'wedding', 'lehenga', 'peshwas', 'formal', 'heavy', 'organza'],
    response: "✨ **Bridal & Formal Artistry**:\n• **Exquisite Bridal Handcraft Lehenga** (PKR 125,000)\n• **Hand-Worked Organza Peshwas Ensemble** (PKR 55,000)\n• **Royal Velvet Gilded Festive Suit** (PKR 32,000)\n\nEach heirloom piece is meticulously hand-embroidered with zardozi, dabka, and tilla work.",
    links: [{ label: "✨ View Bridal Formals", url: "/products?category=Bridal+Formals" }]
  },
  {
    keywords: ['velvet', 'silk', 'lawn', 'material', 'fabric', 'quality', 'pret'],
    response: "🌸 **Luxury Fabrics Offered**:\n• Micro-Velvet 9000 Festive Suits\n• Pure 80g Raw Silk Anarkalis\n• Premium 100% Cotton Designer Lawn\n• Pure Tissue Organza & Chiffon Dupattas",
    links: [{ label: "🗂️ Browse All Fabrics", url: "/categories" }]
  },
  {
    keywords: ['contact', 'address', 'location', 'phone', 'whatsapp', 'lahore', 'shop', 'store'],
    response: "📍 **Libas-E-Maryam Atelier**:\n• **Address**: DHA Phase 5, Lahore, Pakistan\n• **Helpline & WhatsApp**: +92 321 4676591\n• **Email**: concierge@libasemaryam.com",
    links: [{ label: "✉️ Send Inquiry", url: "/contact" }]
  }
]

const DEFAULT_RESPONSE = {
  response: "I'd be delighted to assist you with Libas-E-Maryam boutique dresses, bridal formals, PKR pricing, or orders! You can browse our full catalog or contact our boutique concierge directly on WhatsApp.",
  links: [
    { label: "👗 View Catalog", url: "/products" },
    { label: "💬 Chat on WhatsApp", external: "https://wa.me/923214676591?text=Hello%20Libas-E-Maryam!%20I%20have%20a%20question." }
  ]
}

export default function BoutiqueAiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Assalamu Alaikum! I am **Maryam AI**, your boutique stylist. How can I assist your shopping experience today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      links: [
        { label: "👗 Festive & Bridal Suits", query: "bridal" },
        { label: "🚚 Shipping & COD", query: "shipping" },
        { label: "🏷️ Promo Code", query: "discount" },
        { label: "📍 Store Location", query: "contact" }
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen, isTyping])

  const findResponse = (userText) => {
    const textLower = userText.toLowerCase()
    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.some(kw => textLower.includes(kw))) {
        return item
      }
    }
    return DEFAULT_RESPONSE
  }

  const handleSend = (textToSend) => {
    const queryText = textToSend || input
    if (!queryText.trim()) return

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    if (!textToSend) setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const match = findResponse(queryText)
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: match.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        links: match.links || []
      }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 600)
  }

  return (
    <>
      {/* ── FLOATING WIDGET BUTTONS (BOTTOM RIGHT) ── */}
      <div className="floating-widgets-container">
        
        {/* WhatsApp Float Button */}
        <a
          href="https://wa.me/923214676591?text=Hello%20Libas-E-Maryam!%20I%20have%20an%20inquiry%20about%20your%20boutique%20suits."
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-float-btn"
          title="Chat on WhatsApp (+92 321 4676591)"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <span className="whatsapp-tooltip">WhatsApp Concierge</span>
        </a>

        {/* AI Assistant Float Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`ai-assistant-btn ${isOpen ? 'active' : ''}`}
          title="Libas-E-Maryam AI Stylist"
        >
          <span className="ai-btn-sparkle">✨</span>
          <span className="ai-btn-label">Maryam AI</span>
          <span className="ai-status-dot" />
        </button>

      </div>

      {/* ── AI CHAT DRAWER / POPUP ── */}
      {isOpen && (
        <div className="ai-chat-window">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-header-info">
              <div className="ai-avatar">✨</div>
              <div>
                <div className="ai-title">Maryam AI — Boutique Concierge</div>
                <div className="ai-subtitle">● Online | Instant Boutique Assistant</div>
              </div>
            </div>
            <button className="ai-close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Messages Body */}
          <div className="ai-chat-body">
            {messages.map(msg => (
              <div key={msg.id} className={`ai-msg-wrap ${msg.sender}`}>
                <div className="ai-msg-bubble">
                  <div className="ai-msg-text">
                    {msg.text.split('\n').map((line, idx) => (
                      <p key={idx} style={{ marginBottom: line ? 6 : 0 }}>
                        {line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                      </p>
                    ))}
                  </div>
                  
                  {/* Action Links & Quick Chips */}
                  {msg.links && msg.links.length > 0 && (
                    <div className="ai-msg-chips">
                      {msg.links.map((link, lIdx) => (
                        link.query ? (
                          <button
                            key={lIdx}
                            className="ai-chip-btn"
                            onClick={() => handleSend(link.query)}
                          >
                            {link.label}
                          </button>
                        ) : link.external ? (
                          <a
                            key={lIdx}
                            href={link.external}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ai-chip-link"
                          >
                            {link.label} ↗
                          </a>
                        ) : (
                          <Link
                            key={lIdx}
                            href={link.url}
                            className="ai-chip-link"
                            onClick={() => setIsOpen(false)}
                          >
                            {link.label} →
                          </Link>
                        )
                      ))}
                    </div>
                  )}

                  <span className="ai-msg-time">{msg.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="ai-msg-wrap ai">
                <div className="ai-msg-bubble typing">
                  <span className="dot" /><span className="dot" /><span className="dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="ai-quick-bar">
            <button onClick={() => handleSend("Tell me about bridal suits")}>👗 Bridal Wear</button>
            <button onClick={() => handleSend("Free shipping policy")}>🚚 Delivery</button>
            <button onClick={() => handleSend("What is the promo code?")}>🏷️ Discounts</button>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="ai-chat-footer"
          >
            <input
              type="text"
              placeholder="Ask Maryam AI about suits, orders, sizing..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="ai-input"
            />
            <button type="submit" className="ai-send-btn">
              Send ➤
            </button>
          </form>
        </div>
      )}
    </>
  )
}
