import { Link, router, usePage } from '@inertiajs/react'
import logoImg from '@/assets/logo.jpg'

const navItems = [
  { to: '/admin',               label: 'Dashboard',          icon: '📊' },
  { to: '/admin/brands',        label: 'Manage Brands',      icon: '🏷️' },
  { to: '/admin/categories',    label: 'Manage Categories',  icon: '🗂️' },
  { to: '/admin/products',      label: 'Manage Products',    icon: '👗' },
  { to: '/admin/banners',       label: 'Manage Banners',     icon: '🖼️' },
  { to: '/admin/administration',label: 'Admins / Staff',     icon: '🔑' },
  { to: '/admin/contacts',      label: 'Customer Inquiries', icon: '✉️' },
  { to: '/admin/settings',      label: 'Store Settings',     icon: '⚙️' },
  { to: '/admin/users',         label: 'Standard Users',     icon: '👤' },
  { to: '/admin/roles',         label: 'Roles & Permissions',icon: '🛡️' },
]

// Map path to readable page title
const pageTitles = {
  '/admin':               'Dashboard',
  '/admin/brands':        'Manage Brands',
  '/admin/categories':    'Manage Categories',
  '/admin/products':      'Manage Products',
  '/admin/banners':       'Manage Banners',
  '/admin/administration':'Administration',
  '/admin/contacts':      'Customer Inquiries',
  '/admin/settings':      'Store Settings',
  '/admin/users':         'Standard Users',
  '/admin/roles':         'Roles & Permissions',
}

export default function AdminLayout({ children }) {
  const { auth } = usePage().props
  const user = auth?.user
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'A'
  const currentPath = window.location.pathname
  const pageTitle = pageTitles[currentPath] || 'Admin Panel'

  const handleLogout = () => router.post('/logout')

  return (
    <div className="admin-layout">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        {/* Logo */}
        <div className="sidebar-logo-wrap">
          <img src={logoImg} alt="Libas-E-Maryam" className="sidebar-logo-img" />
          <div>
            <div className="sidebar-logo-name">LibaseMaryam</div>
            <div className="sidebar-logo-sub">Boutique Admin</div>
          </div>
        </div>

        {/* Nav */}
        <div className="sidebar-section-label">Modules</div>
        <nav className="sidebar-nav-list">
          {navItems.map(item => {
            const isActive = item.to === '/admin'
              ? currentPath === '/admin'
              : currentPath.startsWith(item.to)
            return (
              <Link
                key={item.to}
                href={item.to}
                className={`sidebar-nav-link${isActive ? ' active' : ''}`}
              >
                <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="sidebar-section-label">Navigation</div>
        <nav className="sidebar-nav-list" style={{ paddingBottom: 8 }}>
          <Link href="/" className="sidebar-nav-link">
            <span style={{ fontSize: '1rem' }}>🏠</span>
            Go to Website
          </Link>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user-row">
            <div className="sidebar-avatar">{initials}</div>
            <div>
              <div className="sidebar-user-name">{user?.name || 'Admin'}</div>
              <div className="sidebar-user-role">Staff Administrator</div>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <span className="admin-topbar-title">{pageTitle}</span>
          <div className="admin-topbar-right">
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Welcome, <strong style={{ color: 'var(--text-primary)' }}>{user?.name}</strong>
            </span>
            <div className="sidebar-avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
              {initials}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  )
}
