import { useForm } from '@inertiajs/react'
import logoImg from '@/assets/logo.jpg'

export default function AdminLogin() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    post('/login')
  }

  return (
    <div className="auth-layout">
      <div className="auth-card">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img
            src={logoImg}
            alt="Libas-E-Maryam"
            style={{
              width: 80, height: 80, borderRadius: '50%',
              objectFit: 'cover', margin: '0 auto 18px', display: 'block',
              border: '3px solid #D4AF37',
              boxShadow: '0 0 0 6px rgba(212,175,55,0.12)'
            }}
          />
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.75rem', fontWeight: 700,
            color: 'var(--text-primary)', marginBottom: 6
          }}>
            Administration Portal
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Sign in with your staff credentials to manage<br />boutique products, orders & content
          </p>
        </div>

        {/* Gold divider */}
        <div style={{
          height: 2,
          background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
          marginBottom: 28, borderRadius: 2
        }} />

        {/* Error */}
        {(errors.email || errors.password) && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            {errors.email || errors.password}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email" type="email" className="form-input"
              placeholder="admin@libasemaryam.com"
              value={data.email}
              onChange={e => setData('email', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password" type="password" className="form-input"
              placeholder="••••••••"
              value={data.password}
              onChange={e => setData('password', e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={processing}
            style={{
              width: '100%', padding: '13px',
              background: processing
                ? '#ccc'
                : 'linear-gradient(135deg, #1B365D, #0C1A2E)',
              color: '#fff', fontWeight: 700, fontSize: '0.95rem',
              border: 'none', borderRadius: 8, cursor: processing ? 'not-allowed' : 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: 'all 0.2s', letterSpacing: '0.02em',
              marginTop: 4,
              boxShadow: processing ? 'none' : '0 4px 16px rgba(27,54,93,0.3)'
            }}
          >
            {processing ? 'Signing in…' : '🔐  Access Portal'}
          </button>
        </form>

        {/* Notice */}
        <div style={{
          marginTop: 28, padding: '12px 16px',
          background: '#F8FAFD', borderRadius: 8,
          fontSize: '0.78rem', color: 'var(--text-muted)',
          border: '1px solid var(--border-color)',
          lineHeight: 1.6
        }}>
          <strong style={{ color: 'var(--text-primary)' }}>📢 Notice:</strong>{' '}
          Standard boutique customers sign in via the storefront pop-up modal, not this portal.
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <a href="/" style={{
            fontSize: '0.82rem', color: 'var(--text-muted)',
            textDecoration: 'none', transition: '0.15s'
          }}
            onMouseOver={e => e.target.style.color = '#1B365D'}
            onMouseOut={e => e.target.style.color = 'var(--text-muted)'}
          >
            ← Back to Libas-E-Maryam Boutique
          </a>
        </div>
      </div>
    </div>
  )
}
