import { Link, router, usePage } from '@inertiajs/react'
import { useCart } from '@/contexts/CartContext'
import { useState, useEffect, useRef } from 'react'
import { getSearchSuggestions } from '@/api'
import logoFallback from '@/assets/logo.jpg'
import BoutiqueAiAssistant from '@/components/BoutiqueAiAssistant'

export default function UserLayout({ children }) {
  const { auth, settings: sharedSettings = {} } = usePage().props
  const user = auth?.user

  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartCount, cartTotal } = useCart()

  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  // Login & Register Modal Popup States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [registerError, setRegisterError] = useState('')
  const [registerLoading, setRegisterLoading] = useState(false)

  const suggestionRef = useRef(null)
  const userMenuRef = useRef(null)

  // Auto-suggestion search
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      getSearchSuggestions(searchQuery)
        .then(res => { setSuggestions(res.data || []); setShowSuggestions(true) })
        .catch(() => setSuggestions([]))
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchQuery])

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSuggestions(false)
      setMobileMenuOpen(false)
      router.get('/products', { search: searchQuery })
    }
  }

  const handleLogout = () => {
    router.post('/logout')
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    router.post('/login', loginForm, {
      onSuccess: () => {
        setIsLoginModalOpen(false)
        setLoginForm({ email: '', password: '' })
      },
      onError: (errs) => {
        setLoginError(errs.email || errs.password || 'Invalid credentials. Please try again.')
      },
      onFinish: () => setLoginLoading(false)
    })
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    setRegisterLoading(true)
    setRegisterError('')
    router.post('/register', registerForm, {
      onSuccess: () => {
        setIsRegisterModalOpen(false)
        setRegisterForm({ name: '', email: '', password: '', password_confirmation: '' })
      },
      onError: (errs) => {
        setRegisterError(errs.email || errs.password || 'Registration failed. Please check details.')
      },
      onFinish: () => setRegisterLoading(false)
    })
  }

  const handleCheckoutClick = (e) => {
    if (!user) {
      e.preventDefault()
      setIsCartOpen(false)
      setIsLoginModalOpen(true)
    } else {
      setIsCartOpen(false)
      router.get('/checkout')
    }
  }

  const applyPromo = (e) => {
    e.preventDefault()
    if (promoCode.trim().toUpperCase() === 'MARYAM10' || promoCode.trim().toUpperCase() === 'LIBAS10') {
      setPromoApplied(true)
    } else {
      alert('Invalid promo code. Try "MARYAM10"')
    }
  }

  const finalTotal = promoApplied ? Math.max(0, cartTotal * 0.9) : cartTotal

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-canvas)' }}>

      {/* ── 1. Announcement Bar ── */}
      <div style={{
        background: 'var(--primary-sage)',
        color: '#fff',
        fontSize: '0.78rem',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        padding: '8px 24px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '24px'
      }}>
        <span>✨ Free Express Shipping on Orders PKR 10,000+</span>
        <span style={{ opacity: 0.6 }}>|</span>
        <span>30-Day Easy Returns & Exchange</span>
        <span className="desktop-only" style={{ opacity: 0.6 }}>|</span>
        <span className="desktop-only">🔒 Secure Checkout</span>
      </div>

      {/* ── 2. Sticky Header ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        transition: 'all var(--transition-fast)'
      }}>
        <div style={{
          maxWidth: 1320,
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20
        }}>

          {/* Left: Mobile Hamburger & Original Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-only-btn"
              style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-primary)' }}
              aria-label="Toggle menu"
            >
              ☰
            </button>

            {/* Original Brand Logo Aligned */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img
                src={logoFallback}
                alt="Libas-E-Maryam Brand Logo"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid var(--primary-sage)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-primary)', lineHeight: 1 }}>
                  LIBAS-E-MARYAM
                </span>
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--primary-sage)', fontWeight: 700 }}>
                  A Tradition of Elegance
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation Links (Home, Products, Categories, About, Contact Us) */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: '0.88rem', fontWeight: 600 }}>
            <Link href="/" style={{ color: 'var(--text-primary)' }}>Home</Link>
            <Link href="/products" style={{ color: 'var(--text-primary)' }}>Products</Link>
            <Link href="/categories" style={{ color: 'var(--text-primary)' }}>Categories</Link>
            <Link href="/about" style={{ color: 'var(--text-secondary)' }}>About</Link>
            <Link href="/contact" style={{ color: 'var(--text-secondary)' }}>Contact Us</Link>
          </nav>

          {/* Right Action Icons & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

            {/* Live Search Input */}
            <div ref={suggestionRef} style={{ position: 'relative', width: 200 }} className="desktop-search">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search suits…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{
                    padding: '8px 14px 8px 34px',
                    fontSize: '0.82rem',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--bg-subtle)'
                  }}
                />
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  🔍
                </span>
              </form>

              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '115%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#fff',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  zIndex: 1100
                }}>
                  {suggestions.map((item) => (
                    <Link
                      key={item.id}
                      href={`/product/${item.id}`}
                      onClick={() => setShowSuggestions(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 14px',
                        borderBottom: '1px solid var(--border-color-light)',
                        textDecoration: 'none'
                      }}
                    >
                      <img src={item.image} alt={item.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4 }} />
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary-sage)', fontWeight: 700 }}>PKR {item.price?.toLocaleString()}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Account Icon / Dropdown */}
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', color: 'var(--text-primary)' }}
                title="Account"
              >
                <span style={{ fontSize: '1.25rem', color: 'var(--primary-sage)' }}>👤</span>
                {user && <span className="desktop-only" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{user.name.split(' ')[0]}</span>}
              </button>

              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  width: 200,
                  backgroundColor: '#fff',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-color)',
                  padding: '8px 0',
                  zIndex: 1100
                }}>
                  {user ? (
                    <>
                      <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-color-light)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Signed in as <strong>{user.email}</strong>
                      </div>
                      {user.is_admin && (
                        <Link href="/admin" className="dropdown-item" style={{ display: 'block', padding: '10px 16px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-sage)' }}>
                          ⚙️ Admin Dashboard
                        </Link>
                      )}
                      <Link href="/dashboard" className="dropdown-item" style={{ display: 'block', padding: '10px 16px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        My Orders
                      </Link>
                      <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '10px 16px', fontSize: '0.85rem', color: '#D9534F', cursor: 'pointer', fontWeight: 600 }}>
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { setShowUserMenu(false); setIsLoginModalOpen(true) }}
                        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '10px 16px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
                      >
                        Sign In 🔑
                      </button>
                      <button
                        onClick={() => { setShowUserMenu(false); setIsRegisterModalOpen(true) }}
                        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '10px 16px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-sage)', cursor: 'pointer' }}
                      >
                        Create Account ✨
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="btn btn-dark btn-sm"
              style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span>🛒</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Cart</span>
              {cartCount > 0 && (
                <span style={{
                  backgroundColor: 'var(--primary-sage)',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Navigation Drawer ── */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex' }}>
          <div onClick={() => setMobileMenuOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(25,28,25,0.5)' }} />
          <div style={{ position: 'relative', width: 280, backgroundColor: '#fff', height: '100%', padding: 24, display: 'flex', flexDirection: 'column', gap: 20, zIndex: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 16 }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }} className="font-display">Navigation</div>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search suits…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.85rem' }}
              />
            </form>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: '1rem', fontWeight: 600 }}>
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/products" onClick={() => setMobileMenuOpen(false)}>Products</Link>
              <Link href="/categories" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
            </nav>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {!user ? (
                <>
                  <button onClick={() => { setMobileMenuOpen(false); setIsLoginModalOpen(true) }} className="btn btn-dark btn-full btn-sm">Sign In</button>
                  <button onClick={() => { setMobileMenuOpen(false); setIsRegisterModalOpen(true) }} className="btn btn-outline btn-full btn-sm">Create Account</button>
                </>
              ) : (
                <button onClick={handleLogout} className="btn btn-outline btn-full btn-sm" style={{ color: '#D9534F' }}>Sign Out</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Main Page Content ── */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* ── 3. CUSTOMER LOGIN POPUP MODAL ── */}
      {isLoginModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsLoginModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsLoginModalOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <img src={logoFallback} alt="Logo" style={{ width: 54, height: 54, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', border: '1.5px solid var(--primary-sage)' }} />
              <h3 className="font-display" style={{ fontSize: '1.4rem' }}>Welcome Back</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Please sign in to proceed to checkout</p>
            </div>

            {loginError && <div className="badge badge-sale" style={{ width: '100%', marginBottom: 16, padding: '8px 12px' }}>{loginError}</div>}

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="admin@libasemaryam.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>

              <button type="submit" disabled={loginLoading} className="btn btn-dark btn-full btn-lg" style={{ borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
                {loginLoading ? 'Signing In…' : 'Sign In 🔑'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              New customer?{' '}
              <button onClick={() => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true) }} style={{ background: 'none', border: 'none', color: 'var(--primary-sage)', fontWeight: 700, cursor: 'pointer' }}>
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. CUSTOMER REGISTER POPUP MODAL ── */}
      {isRegisterModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsRegisterModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsRegisterModalOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h3 className="font-display" style={{ fontSize: '1.4rem' }}>Create Account</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Join Libas-E-Maryam for exclusive boutique collections</p>
            </div>

            {registerError && <div className="badge badge-sale" style={{ width: '100%', marginBottom: 16, padding: '8px 12px' }}>{registerError}</div>}

            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Your Name"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="you@example.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="••••••••"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="••••••••"
                  value={registerForm.password_confirmation}
                  onChange={(e) => setRegisterForm({ ...registerForm, password_confirmation: e.target.value })}
                />
              </div>

              <button type="submit" disabled={registerLoading} className="btn btn-primary btn-full btn-lg" style={{ borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>
                {registerLoading ? 'Creating Account…' : 'Create Account ✨'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <button onClick={() => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true) }} style={{ background: 'none', border: 'none', color: 'var(--primary-sage)', fontWeight: 700, cursor: 'pointer' }}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. Slide-over Shopping Cart Drawer ── */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', justifyContent: 'flex-end' }}>
          <div
            onClick={() => setIsCartOpen(false)}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(25, 28, 25, 0.45)', backdropFilter: 'blur(3px)' }}
          />

          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: 440,
            backgroundColor: '#fff',
            height: '100%',
            boxShadow: 'var(--shadow-drawer)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Shopping Cart</h3>
                <span className="badge badge-new">{cartCount} items</span>
              </div>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>

            <div style={{ padding: '12px 24px', backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color-light)', fontSize: '0.8rem' }}>
              {cartTotal >= 10000 ? (
                <span style={{ color: 'var(--primary-sage-dark)', fontWeight: 700 }}>🎉 You qualify for FREE Express Shipping!</span>
              ) : (
                <span>Add <strong>PKR {(10000 - cartTotal).toLocaleString()}</strong> more to unlock FREE Shipping!</span>
              )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>🛒</div>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 8 }}>Your cart is empty</h4>
                  <p style={{ fontSize: '0.85rem', marginBottom: 20 }}>Explore our boutique collections and add to cart.</p>
                  <button onClick={() => setIsCartOpen(false)} className="btn btn-primary btn-sm">Start Shopping</button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.cartLineId} style={{ display: 'flex', gap: 16, paddingBottom: 16, borderBottom: '1px solid var(--border-color-light)' }}>
                    <img src={item.image} alt={item.name} style={{ width: 80, height: 100, objectFit: 'cover', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-subtle)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                        <span>Size: {item.selectedSize || 'M'}</span>
                        <span style={{ marginLeft: 12 }}>Color: {item.selectedColor || 'Maroon'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, color: 'var(--primary-sage)', fontSize: '0.95rem' }}>PKR {(item.sale_price || item.price)?.toLocaleString()}</span>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button onClick={() => updateQuantity(item.cartLineId, -1)} style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid var(--border-color)', background: 'none', cursor: 'pointer' }}>−</button>
                          <span style={{ fontSize: '0.88rem', fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartLineId, 1)} style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid var(--border-color)', background: 'none', cursor: 'pointer' }}>+</button>
                          <button onClick={() => removeFromCart(item.cartLineId)} style={{ background: 'none', border: 'none', color: '#D9534F', cursor: 'pointer', marginLeft: 8, fontSize: '0.85rem' }}>✕</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div style={{ padding: 24, borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-subtle)' }}>
                <form onSubmit={applyPromo} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  <input
                    type="text"
                    placeholder="Promo code (try LIBAS10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="form-input"
                    style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                  />
                  <button type="submit" className="btn btn-outline btn-sm">Apply</button>
                </form>

                {promoApplied && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--primary-sage-dark)', fontWeight: 700, marginBottom: 12 }}>
                    ✓ 10% Discount Applied!
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <span>Subtotal</span>
                  <span>PKR {cartTotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary-sage)' }}>PKR {finalTotal.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleCheckoutClick}
                  className="btn btn-dark btn-full btn-lg"
                  style={{ borderRadius: 'var(--radius-pill)' }}
                >
                  Proceed to Checkout →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 6. Multi-column Footer ── */}
      <footer style={{ backgroundColor: '#191C19', color: '#EBECE8', paddingTop: 64, paddingBottom: 36, borderTop: '1px solid #2D322B' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
          
          <div>
            <h3 className="font-display" style={{ color: '#fff', fontSize: '1.3rem', marginBottom: 12, letterSpacing: '0.05em' }}>
              LIBAS-E-MARYAM
            </h3>
            <p style={{ color: '#A0A69A', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: 20 }}>
              Traditional Eastern boutique attire. Crafted with luxury raw silks, plush micro-velvet, and designer cotton lawn.
            </p>
            <div style={{ fontSize: '0.82rem', color: '#C4C8C0' }}>
              📍 DHA Phase 5, Lahore, Pakistan<br />
              📞 Helpline: 0321-4676591
            </div>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>NAVIGATION</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem', color: '#A0A69A' }}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/products">Products</Link></li>
              <li><Link href="/categories">Categories</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>CUSTOMER SERVICE</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem', color: '#A0A69A' }}>
              <li><Link href="/contact">Contact Concierge</Link></li>
              <li><Link href="/contact">Shipping & Returns</Link></li>
              <li><Link href="/contact">Size Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>BOUTIQUE</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem', color: '#A0A69A' }}>
              <li><Link href="/about">Our Legacy</Link></li>
              <li><Link href="/about">Handwork Artistry</Link></li>
            </ul>
          </div>
        </div>

        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '24px 24px 0', borderTop: '1px solid #2D322B', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, fontSize: '0.78rem', color: '#889085' }}>
          <div>© {new Date().getFullYear()} Libas-E-Maryam. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>🇵🇰 PKR</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* Floating AI Stylist & WhatsApp Widgets */}
      <BoutiqueAiAssistant />

    </div>
  )
}
