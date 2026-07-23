import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [regData, setRegData] = useState({ name: '', email: '', phone: '', password: '', confirm: '', role: 'patient' })
  const { login, loginAsAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Admin shortcut: admin@medisync.com / admin123
    if (loginData.email === 'admin@medisync.com' && loginData.password === 'admin123') {
      loginAsAdmin()
      navigate('/admin')
      return
    }
    login({ email: loginData.email, role: 'patient' })
    navigate('/dashboard')
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    login({ name: regData.name, email: regData.email, phone: regData.phone, role: regData.role as 'patient' | 'doctor' })
    navigate('/dashboard')
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left panel */}
      <div style={{ background: 'linear-gradient(150deg, #0a1628 0%, #1a3a6b 50%, #1a6fbf 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(0,198,174,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div style={{ position: 'relative' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem' }}>
            <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 2v18M2 11h18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>
              Medi<span style={{ color: '#00c6ae' }}>Sync</span>
            </span>
          </Link>

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: '1.2rem' }}>
            Your Health.<br />
            <span style={{ color: '#00c6ae' }}>Your Control.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.75, marginBottom: '2.5rem' }}>
            Join MediSync to access AI-powered health tools, book specialist appointments, order medical products, and manage your complete health journey in one place.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { icon: '🤖', text: 'AI health assistant available 24/7' },
              { icon: '👨‍⚕️', text: '350+ verified specialist doctors' },
              { icon: '📊', text: 'Personalized health dashboard after login' },
              { icon: '🔒', text: 'HIPAA-compliant, fully encrypted' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.92rem' }}>{item.text}</span>
              </div>
            ))}
          </div>

          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=200&fit=crop&auto=format"
            alt="Medical professionals"
            style={{ marginTop: '2.5rem', borderRadius: 16, width: '100%', objectFit: 'cover', height: 180, opacity: 0.6 }}
          />
        </div>
        <style>{`@media(max-width:768px){ main { grid-template-columns: 1fr !important; } main > div:first-child { display: none !important; } }`}</style>
      </div>

      {/* Right panel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', background: '#e8f4fd', borderRadius: 12, padding: '0.3rem', marginBottom: '2rem' }}>
            {(['login', 'register'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '0.6rem', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: '0.92rem', fontWeight: 700, fontFamily: 'inherit', background: tab === t ? '#fff' : 'transparent', color: tab === t ? '#1a6fbf' : '#5a7a9a', boxShadow: tab === t ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s', textTransform: 'capitalize' }}>
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.7rem', fontWeight: 700, color: '#0a1628', marginBottom: '0.4rem' }}>Welcome back</h2>
              <p style={{ color: '#5a7a9a', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Sign in to access your health dashboard.</p>

              <label style={labelStyle}>Email address</label>
              <input type="email" required value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} placeholder="you@example.com" style={inputStyle} />

              <label style={labelStyle}>Password</label>
              <input type="password" required value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} placeholder="••••••••" style={inputStyle} />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                <span style={{ color: '#1a6fbf', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>Forgot password?</span>
              </div>

              <button type="submit" style={btnPrimaryStyle}>Sign In → Go to Dashboard</button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.25rem 0' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ color: '#5a7a9a', fontSize: '0.82rem' }}>or continue with</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button type="button" style={socialBtnStyle}>🔵 Google</button>
                <button type="button" style={socialBtnStyle}>🍎 Apple</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.7rem', fontWeight: 700, color: '#0a1628', marginBottom: '0.4rem' }}>Create account</h2>
              <p style={{ color: '#5a7a9a', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Join thousands of patients on MediSync.</p>

              <label style={labelStyle}>I am a</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.2rem' }}>
                {[['patient', '🏥 Patient'], ['doctor', '👨‍⚕️ Doctor']].map(([val, label]) => (
                  <button key={val} type="button" onClick={() => setRegData({ ...regData, role: val })} style={{ padding: '0.65rem', border: `2px solid ${regData.role === val ? '#1a6fbf' : 'var(--border)'}`, borderRadius: 10, background: regData.role === val ? '#e8f4fd' : '#fff', color: regData.role === val ? '#1a6fbf' : '#5a7a9a', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem', transition: 'all 0.2s' }}>
                    {label}
                  </button>
                ))}
              </div>

              <label style={labelStyle}>Full name</label>
              <input type="text" required value={regData.name} onChange={e => setRegData({ ...regData, name: e.target.value })} placeholder="Jane Smith" style={inputStyle} />

              <label style={labelStyle}>Email address</label>
              <input type="email" required value={regData.email} onChange={e => setRegData({ ...regData, email: e.target.value })} placeholder="you@example.com" style={inputStyle} />

              <label style={labelStyle}>Phone number</label>
              <input type="tel" value={regData.phone} onChange={e => setRegData({ ...regData, phone: e.target.value })} placeholder="+1 (555) 000-0000" style={inputStyle} />

              <label style={labelStyle}>Password</label>
              <input type="password" required value={regData.password} onChange={e => setRegData({ ...regData, password: e.target.value })} placeholder="Minimum 8 characters" style={{ ...inputStyle, marginBottom: '1.5rem' }} />

              <p style={{ color: '#5a7a9a', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
                By creating an account, you agree to our <span style={{ color: '#1a6fbf', cursor: 'pointer' }}>Terms of Service</span> and <span style={{ color: '#1a6fbf', cursor: 'pointer' }}>Privacy Policy</span>.
              </p>

              <button type="submit" style={btnPrimaryStyle}>Create Account → Go to Dashboard</button>
            </form>
          )}

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#5a7a9a', fontSize: '0.875rem' }}>
            {tab === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setTab(tab === 'login' ? 'register' : 'login')} style={{ background: 'none', border: 'none', color: '#1a6fbf', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit' }}>
              {tab === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0a1628', marginBottom: '0.35rem' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.72rem 1rem', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: '0.95rem', marginBottom: '1.2rem', outline: 'none', color: '#0a1628', fontFamily: 'inherit', boxSizing: 'border-box' }
const btnPrimaryStyle: React.CSSProperties = { width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', color: '#fff', border: 'none', borderRadius: 12, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }
const socialBtnStyle: React.CSSProperties = { padding: '0.65rem', border: '1.5px solid var(--border)', borderRadius: 10, background: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'inherit', color: '#0a1628' }
