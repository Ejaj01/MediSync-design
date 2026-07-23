import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/products', label: 'Products' },
  { to: '/chatbot', label: 'AI Assistant' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  const isActive = (to: string) => to === '/'
    ? location.pathname === '/' || location.pathname === '/dashboard'
    : location.pathname === to

  return (
    <nav style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        {/* Logo */}
        <Link to={user ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2v16M2 10h16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#1a6fbf', letterSpacing: '-0.02em' }}>
            Medi<span style={{ color: '#00c6ae' }}>Sync</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden-mobile">
          {user && (
            <Link to="/dashboard" style={{ textDecoration: 'none', padding: '0.45rem 1rem', borderRadius: 8, fontSize: '0.9rem', fontWeight: 600, color: location.pathname === '/dashboard' ? '#1a6fbf' : '#5a7a9a', backgroundColor: location.pathname === '/dashboard' ? '#e8f4fd' : 'transparent', transition: 'all 0.2s' }}>
              Dashboard
            </Link>
          )}
          {links.map(link => (
            <Link key={link.to} to={link.to} style={{ textDecoration: 'none', padding: '0.45rem 1rem', borderRadius: 8, fontSize: '0.9rem', fontWeight: 600, color: isActive(link.to) && !user ? '#1a6fbf' : location.pathname === link.to ? '#1a6fbf' : '#5a7a9a', backgroundColor: location.pathname === link.to ? '#e8f4fd' : 'transparent', transition: 'all 0.2s' }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }} className="hidden-mobile">
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#f0f7ff', border: '1.5px solid var(--border)', borderRadius: 10, padding: '0.4rem 0.8rem 0.4rem 0.5rem', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <img src={user.avatar} alt={user.name} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0a1628', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#5a7a9a' }}>▼</span>
              </button>

              {dropdownOpen && (
                <div style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', border: '1px solid var(--border)', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', minWidth: 200, overflow: 'hidden', zIndex: 100 }}>
                  <div style={{ padding: '0.9rem 1rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0a1628' }}>{user.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#5a7a9a' }}>{user.email}</div>
                    <span style={{ display: 'inline-block', marginTop: '0.4rem', background: '#e8f4fd', color: '#1a6fbf', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.6rem', borderRadius: 20 }}>
                      {user.role === 'doctor' ? '👨‍⚕️ Doctor' : '🏥 Patient'}
                    </span>
                  </div>
                  {[
                    ...(user.role === 'admin' ? [{ label: '🛡️ Admin Panel', to: '/admin' }] : [{ label: '🏠 Dashboard', to: '/dashboard' }, { label: '📅 My Appointments', to: '/dashboard' }]),
                    { label: '👤 Profile Settings', to: '/profile' },
                    { label: '🤖 AI Assistant', to: '/chatbot' },
                  ].map(item => (
                    <Link key={item.to + item.label} to={item.to} onClick={() => setDropdownOpen(false)} style={{ display: 'block', padding: '0.7rem 1rem', textDecoration: 'none', fontSize: '0.88rem', color: '#0a1628', fontWeight: 600, borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f0f7ff')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button onClick={handleLogout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.7rem 1rem', background: 'none', border: 'none', fontSize: '0.88rem', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/auth" style={{ textDecoration: 'none', padding: '0.45rem 1.2rem', border: '1.5px solid #1a6fbf', borderRadius: 8, fontSize: '0.9rem', fontWeight: 600, color: '#1a6fbf' }}>
                Login
              </Link>
              <Link to="/auth?tab=register" style={{ textDecoration: 'none', padding: '0.45rem 1.2rem', background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', borderRadius: 8, fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button onClick={() => setOpen(!open)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }} className="show-mobile" aria-label="Toggle menu">
          <div style={{ width: 24, height: 2, background: '#1a6fbf', marginBottom: 5, borderRadius: 2 }} />
          <div style={{ width: 24, height: 2, background: '#1a6fbf', marginBottom: 5, borderRadius: 2 }} />
          <div style={{ width: 24, height: 2, background: '#1a6fbf', borderRadius: 2 }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ backgroundColor: '#fff', borderTop: '1px solid var(--border)', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f0f7ff', borderRadius: 10, marginBottom: '0.25rem' }}>
              <img src={user.avatar} alt={user.name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0a1628' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#5a7a9a' }}>{user.role === 'doctor' ? '👨‍⚕️ Doctor' : '🏥 Patient'}</div>
              </div>
            </div>
          )}
          {user && <Link to="/dashboard" onClick={() => setOpen(false)} style={{ textDecoration: 'none', padding: '0.6rem 1rem', borderRadius: 8, fontSize: '0.95rem', fontWeight: 600, color: '#1a6fbf', backgroundColor: '#e8f4fd' }}>🏠 Dashboard</Link>}
          {links.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setOpen(false)} style={{ textDecoration: 'none', padding: '0.6rem 1rem', borderRadius: 8, fontSize: '0.95rem', fontWeight: 600, color: location.pathname === link.to ? '#1a6fbf' : '#0a1628', backgroundColor: location.pathname === link.to ? '#e8f4fd' : 'transparent' }}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)} style={{ textDecoration: 'none', padding: '0.6rem 1rem', borderRadius: 8, fontSize: '0.95rem', fontWeight: 600, color: '#0a1628' }}>👤 Profile Settings</Link>
              <button onClick={() => { handleLogout(); setOpen(false) }} style={{ textAlign: 'left', background: 'none', border: '1.5px solid #ef4444', borderRadius: 8, padding: '0.6rem 1rem', fontSize: '0.95rem', fontWeight: 700, color: '#ef4444', cursor: 'pointer', fontFamily: 'inherit' }}>🚪 Sign Out</button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
              <Link to="/auth" onClick={() => setOpen(false)} style={{ textDecoration: 'none', flex: 1, textAlign: 'center', padding: '0.55rem', border: '1.5px solid #1a6fbf', borderRadius: 8, fontSize: '0.9rem', fontWeight: 600, color: '#1a6fbf' }}>Login</Link>
              <Link to="/auth?tab=register" onClick={() => setOpen(false)} style={{ textDecoration: 'none', flex: 1, textAlign: 'center', padding: '0.55rem', background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', borderRadius: 8, fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>Register</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
