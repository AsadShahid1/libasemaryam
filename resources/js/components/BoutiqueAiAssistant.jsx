import { useState, useRef, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import { getShopMetadata, getShopProducts } from '@/api'

export default function BoutiqueAiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [liveCategories, setLiveCategories] = useState([])
  const [liveProducts, setLiveProducts] = useState([])
  const [liveBrands, setLiveBrands] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false)

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Assalamu Alaikum! I am **Maryam AI**, your live store concierge. How can I assist your boutique shopping today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      links: [
        { label: "🗂️ How Many Categories?", query: "how many categories in store?" },
        { label: "👗 Popular Suits", query: "show all products" },
        { label: "🚚 Free Delivery Policy", query: "shipping policy" },
        { label: "🏷️ Promo Code", query: "promo code" }
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Fetch live store metadata and products on mount
  useEffect(() => {
    Promise.all([getShopMetadata(), getShopProducts()])
      .then(([metaRes, prodRes]) => {
        if (metaRes?.data) {
          setLiveCategories(metaRes.data.categories || [])
          setLiveBrands(metaRes.data.brands || [])
        }
        if (prodRes?.data) {
          setLiveProducts(prodRes.data || [])
        }
        setDataLoaded(true)
      })
      .catch((err) => {
        console.error("AI Assistant could not fetch live store data:", err)
      })
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen, isTyping])

  // Smart Response Engine powered by Live Store Data
  const generateResponse = (userText) => {
    const q = userText.toLowerCase().trim()

    // 1. Categories query
    if (q.includes('categor') || q.includes('catagor') || q.includes('collection type') || q.includes('types of suit') || q.includes('how many categories')) {
      if (liveCategories.length > 0) {
        const catList = liveCategories.map(c => `• **${c.name}**`).join('\n')
        return {
          response: `We currently have **${liveCategories.length} boutique categories** in store:\n\n${catList}\n\nAll collections feature authentic hand-embroidery and luxury Pakistani fabrics.`,
          links: [{ label: "🗂️ Explore All Categories", url: "/categories" }]
        }
      } else {
        return {
          response: "We feature **5 signature boutique categories**: Festive Velvet, Pure Raw Silk, Designer 3-Piece Lawn, Bridal Formals, and Luxury Pret.",
          links: [{ label: "🗂️ Explore Categories", url: "/categories" }]
        }
      }
    }

    // 2. Products / All Suits / What do you sell query
    if (q.includes('product') || q.includes('item') || q.includes('suit') || q.includes('dress') || q.includes('what do you sell') || q.includes('show all')) {
      if (liveProducts.length > 0) {
        const topProducts = liveProducts.slice(0, 5).map(p => 
          `• **${p.name}** — PKR ${p.price?.toLocaleString()}${p.is_on_sale ? ` (Sale: PKR ${p.sale_price?.toLocaleString()})` : ''}`
        ).join('\n')
        return {
          response: `✨ Here are our featured boutique ensembles in store:\n\n${topProducts}\n\nWe have **${liveProducts.length} total boutique designs** ready for express dispatch!`,
          links: [{ label: "👗 View Full Catalog", url: "/products" }]
        }
      }
    }

    // 3. Price / Cost / Cheap / Expensive / Range
    if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('pkr') || q.includes('cheap') || q.includes('budget') || q.includes('range')) {
      if (liveProducts.length > 0) {
        const prices = liveProducts.map(p => p.price).filter(Boolean)
        const minP = Math.min(...prices)
        const maxP = Math.max(...prices)
        return {
          response: `Our boutique prices range from **PKR ${minP.toLocaleString()}** for Designer 3-Piece Lawn to **PKR ${maxP.toLocaleString()}** for Hand-Worked Bridal Lehengas.\n\n🚚 Enjoy **Free Express Shipping** across Pakistan on all orders above **PKR 10,000**!`,
          links: [{ label: "🛍️ Shop Collection", url: "/products" }]
        }
      }
    }

    // 4. Bridal / Formal Suits
    if (q.includes('bridal') || q.includes('wedding') || q.includes('lehenga') || q.includes('peshwas') || q.includes('heavy') || q.includes('zardozi')) {
      const bridalProds = liveProducts.filter(p => p.category?.name?.toLowerCase().includes('bridal') || p.name?.toLowerCase().includes('bridal') || p.name?.toLowerCase().includes('peshwas'))
      const text = bridalProds.length > 0 
        ? bridalProds.map(p => `• **${p.name}** (PKR ${p.price?.toLocaleString()})`).join('\n')
        : "• **Exquisite Bridal Handcraft Lehenga** (PKR 125,000)\n• **Hand-Worked Organza Peshwas Ensemble** (PKR 55,000)"
      return {
        response: `✨ **Bridal & Festive Masterpieces**:\n\n${text}\n\nMeticulously embroidered with authentic zardozi, dabka, and tilla handwork.`,
        links: [
          { label: "✨ View Bridal Formals", url: "/products" },
          { label: "💬 Bespoke Bridal WhatsApp", external: "https://wa.me/923214676591?text=Hello!%20I%20want%20bridal%20customization." }
        ]
      }
    }

    // 5. Velvet / Raw Silk / Lawn / Fabrics
    if (q.includes('velvet') || q.includes('silk') || q.includes('lawn') || q.includes('fabric') || q.includes('material')) {
      return {
        response: "🌸 **Our Signature Fabrics**:\n• **Micro-Velvet 9000** (Festive Winter Wear)\n• **Pure 80g Raw Silk** (Formal Anarkalis)\n• **100% Premium Cotton Lawn** (Designer 3-Piece Sets)\n• **Pure Tissue Organza** (Handworked Dupattas)",
        links: [{ label: "🗂️ Explore Categories", url: "/categories" }]
      }
    }

    // 6. Shipping & Delivery
    if (q.includes('shipping') || q.includes('deliver') || q.includes('ship') || q.includes('cod') || q.includes('cash on delivery') || q.includes('time')) {
      return {
        response: "🚚 **Delivery Policies**:\n• **Free Express Shipping** across Pakistan on all orders over **PKR 10,000**!\n• Standard delivery timeframe: **3 to 5 business days**.\n• We accept **Cash on Delivery (COD)** and Bank Transfer at checkout.",
        links: [{ label: "🛒 Checkout", url: "/checkout" }]
      }
    }

    // 7. Discount / Promo Code
    if (q.includes('discount') || q.includes('coupon') || q.includes('promo') || q.includes('offer') || q.includes('code') || q.includes('sale')) {
      return {
        response: "🎉 **Special Boutique Promotion**!\nUse promo code **LIBAS10** or **MARYAM10** at checkout to receive **10% OFF** your entire order!",
        links: [{ label: "👗 Use Code on Catalog", url: "/products" }]
      }
    }

    // 8. Size / Sizing / Custom Stitching
    if (q.includes('size') || q.includes('sizing') || q.includes('stitch') || q.includes('custom') || q.includes('fit') || q.includes('alteration')) {
      return {
        response: "📏 **Sizing & Tailoring**:\n• Standard Ready-to-Wear sizes: **Small (S)**, **Medium (M)**, **Large (L)**, **Extra Large (XL)**.\n• We also offer **Bespoke Custom Tailoring** for all formal ensembles. Contact our master tailors directly on WhatsApp for custom measurements!",
        links: [{ label: "📞 WhatsApp Tailor Concierge", external: "https://wa.me/923214676591?text=Hello!%20I%20need%20custom%20stitching%20for%20my%20order." }]
      }
    }

    // 9. Location / Address / Contact / Shop / Atelier
    if (q.includes('location') || q.includes('address') || q.includes('where is') || q.includes('lahore') || q.includes('contact') || q.includes('phone') || q.includes('whatsapp') || q.includes('atelier')) {
      return {
        response: "📍 **Libas-E-Maryam Flagship Atelier**:\n• **Address**: DHA Phase 5, Lahore, Pakistan\n• **Helpline & WhatsApp**: +92 321 4676591\n• **Email**: concierge@libasemaryam.com\n• **Boutique Hours**: Mon - Sat (11:00 AM - 9:00 PM)",
        links: [{ label: "✉️ Send Direct Message", url: "/contact" }]
      }
    }

    // 10. Greetings
    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('aoa') || q.includes('assalam') || q.includes('help')) {
      return {
        response: `Assalamu Alaikum! Welcome to **Libas-E-Maryam**. I can tell you about our **${liveCategories.length || 5} boutique categories**, **${liveProducts.length || 6} designer suits**, prices in PKR, promo codes, or store location. What would you like to know?`,
        links: [
          { label: "🗂️ How Many Categories?", query: "how many categories in store?" },
          { label: "✨ Popular Suits", query: "show all products" }
        ]
      }
    }

    // 11. Generic Search Matching against Live Products & Categories
    const matchingProds = liveProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.category && p.category.name.toLowerCase().includes(q))
    )

    if (matchingProds.length > 0) {
      const prodList = matchingProds.slice(0, 4).map(p => `• **${p.name}** — PKR ${p.price?.toLocaleString()}`).join('\n')
      return {
        response: `I found **${matchingProds.length} matching boutique item(s)** for "${userText}":\n\n${prodList}`,
        links: [{ label: "👗 View Catalog", url: "/products" }]
      }
    }

    return {
      response: `I'm happy to help you with Libas-E-Maryam boutique dresses, bridal formals, categories (${liveCategories.length} categories), prices, or store location! You can explore our catalog or chat with our atelier concierge directly on WhatsApp.`,
      links: [
        { label: "👗 View Catalog", url: "/products" },
        { label: "💬 Chat on WhatsApp", external: "https://wa.me/923214676591?text=Hello!%20I%20have%20a%20question." }
      ]
    }
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
      const match = generateResponse(queryText)
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: match.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        links: match.links || []
      }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 400)
  }

  // Safe Text & Markdown Renderer (Converts **bold** to <strong> without exposing raw HTML tags)
  const renderFormattedText = (text) => {
    if (!text) return null
    // Clean raw HTML tags if any exist and convert to markdown bold
    let cleanText = text.replace(/<\/?strong>/gi, '**').replace(/<\/?b>/gi, '**')
    
    return cleanText.split('\n').map((line, lIdx) => {
      if (!line.trim()) return <div key={lIdx} style={{ height: 4 }} />

      const parts = line.split(/(\*\*.*?\*\*)/g)
      return (
        <p key={lIdx} style={{ margin: '0 0 4px 0', lineHeight: 1.5 }}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} style={{ fontWeight: 700, color: 'inherit' }}>{part.slice(2, -2)}</strong>
            }
            return part
          })}
        </p>
      )
    })
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
                <div className="ai-subtitle">● Live Store AI Assistant ({liveCategories.length} categories)</div>
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
                    {renderFormattedText(msg.text)}
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
            <button onClick={() => handleSend("how many categories in store?")}>🗂️ Store Categories</button>
            <button onClick={() => handleSend("show all products")}>👗 Boutique Suits</button>
            <button onClick={() => handleSend("shipping policy")}>🚚 Delivery</button>
            <button onClick={() => handleSend("promo code")}>🏷️ Discounts</button>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="ai-chat-footer"
          >
            <input
              type="text"
              placeholder="Ask Maryam AI about categories, suits, pricing..."
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
