import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SUPER_ADMIN = { email: 'admin@medisync.com', password: 'admin123', name: 'Super Admin' }

// Sub-admin credentials map (in a real app this would come from a DB)
const SUB_ADMINS = [
  { email: 'kwame@medisync.com', password: 'kwame2026', name: 'Dr. Kwame Boateng' },
  { email: 'ling@medisync.com', password: 'ling2026', name: 'Ling Wei' },
]

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginAsAdmin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      if (email === SUPER_ADMIN.email && password === SUPER_ADMIN.password) {
        loginAsAdmin(SUPER_ADMIN.email, SUPER_ADMIN.name)
        navigate('/admin')
        return
      }
      const sub = SUB_ADMINS.find(s => s.email === email && s.password === password)
      if (sub) {
        loginAsAdmin(sub.email, sub.name)
        navigate('/admin')
        return
      }
      setError('Invalid administrator credentials. Access denied.')
    }, 900)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1017', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(26,111,191,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(26,111,191,0.07) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(26,111,191,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '8%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(0,198,174,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2v18M2 11h18" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
              Medi<span style={{ color: '#00c6ae' }}>Sync</span>
            </span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(26,111,191,0.15)', border: '1px solid rgba(26,111,191,0.3)', borderRadius: 20, padding: '0.3rem 1rem' }}>
            <div style={{ width: 7, height: 7, background: '#00c6ae', borderRadius: '50%' }} />
            <span style={{ color: '#60a5fa', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Administrator Portal
            </span>
          </div>
        </div>

        {/* Card */}
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '2.5rem', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
              Admin Sign In
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
              Restricted access — authorized personnel only.
            </p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1rem' }}>🚫</span>
              <span style={{ color: '#f87171', fontSize: '0.875rem', fontWeight: 600 }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 700, color: 'rgba(255,255,255,0.55)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                ADMIN EMAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@medisync.com"
                style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: '0.95rem', color: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border 0.2s' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#1a6fbf')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.83rem', fontWeight: 700, color: 'rgba(255,255,255,0.55)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                PASSWORD
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: '0.95rem', color: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border 0.2s' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#1a6fbf')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '0.9rem', background: loading ? 'rgba(26,111,191,0.4)' : 'linear-gradient(135deg, #1a6fbf, #00c6ae)', color: '#fff', border: 'none', borderRadius: 12, fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
            >
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Authenticating...
                </>
              ) : '🔐 Access Admin Panel'}
            </button>
          </form>

          {/* Credentials hint */}
          <div style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '0.5rem' }}>DEMO CREDENTIALS</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
              <div><span style={{ color: '#60a5fa' }}>Super Admin:</span> admin@medisync.com / admin123</div>
              <div><span style={{ color: '#a78bfa' }}>Sub-Admin 1:</span> kwame@medisync.com / kwame2026</div>
              <div><span style={{ color: '#34d399' }}>Sub-Admin 2:</span> ling@medisync.com / ling2026</div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textDecoration: 'none' }}>
            ← Back to public site
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
