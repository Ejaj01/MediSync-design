import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const healthTips = [
  { icon: '💧', tip: 'You logged only 4 glasses of water yesterday. Aim for 8.', color: '#e8f4fd' },
  { icon: '🏃', tip: 'A 20-minute walk today would meet your weekly activity goal.', color: '#e8fdf5' },
  { icon: '💊', tip: 'Your Omega-3 supplement is running low — reorder soon.', color: '#fff8e8' },
]

const recentProducts = [
  { name: 'CardioGuard Omega-3', date: 'Jul 8, 2026', status: 'Delivered', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=80&h=80&fit=crop&auto=format' },
  { name: 'VitaD3 + K2 Complex', date: 'Jun 25, 2026', status: 'Delivered', img: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=80&h=80&fit=crop&auto=format' },
]

export default function Dashboard() {
  const { user, appointments, chatHistory } = useAuth()

  if (!user) return null

  const upcoming = appointments.filter(a => a.status === 'upcoming')
  const completed = appointments.filter(a => a.status === 'completed')
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)', padding: '2.5rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Welcome Banner */}
        <div style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a6fbf 100%)', borderRadius: 20, padding: '2rem 2.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(0,198,174,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div style={{ position: 'relative' }}>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{greeting},</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: '#fff', margin: '0 0 0.6rem' }}>
              {user.name} 👋
            </h1>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.8rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: 20 }}>
                {user.role === 'doctor' ? '👨‍⚕️ Doctor Account' : '🏥 Patient Account'}
              </span>
              <span style={{ background: 'rgba(0,198,174,0.25)', color: '#00c6ae', fontSize: '0.8rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: 20 }}>
                Member since {user.joinedDate}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
            <Link to="/profile" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: 10, fontWeight: 600, fontSize: '0.88rem', border: '1px solid rgba(255,255,255,0.2)' }}>
              Edit Profile
            </Link>
            <Link to="/chatbot" style={{ textDecoration: 'none', background: '#00c6ae', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: 10, fontWeight: 700, fontSize: '0.88rem' }}>
              Chat with AI
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Upcoming Appointments', value: upcoming.length, icon: '📅', color: '#1a6fbf', bg: '#e8f4fd' },
            { label: 'Completed Visits', value: completed.length, icon: '✅', color: '#00c6ae', bg: '#e8fdf5' },
            { label: 'AI Chats', value: chatHistory.filter(m => m.role === 'user').length, icon: '🤖', color: '#7c3aed', bg: '#f0ebff' },
            { label: 'Orders Placed', value: recentProducts.length, icon: '📦', color: '#f59e0b', bg: '#fff8e8' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '1.25rem', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
              <div style={{ width: 46, height: 46, background: s.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: '#5a7a9a', fontWeight: 600, marginTop: '0.2rem' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:768px){ .stats-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

          {/* Appointments */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#0a1628' }}>Your Appointments</h2>
              <Link to="/doctors" style={{ textDecoration: 'none', fontSize: '0.82rem', color: '#1a6fbf', fontWeight: 600 }}>+ Book New</Link>
            </div>
            {appointments.length === 0 ? (
              <p style={{ color: '#5a7a9a', fontSize: '0.9rem' }}>No appointments yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {appointments.map(a => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem', background: 'var(--background)', borderRadius: 12 }}>
                    <div style={{ width: 42, height: 42, background: a.status === 'upcoming' ? '#e8f4fd' : a.status === 'completed' ? '#e8fdf5' : '#fee2e2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                      {a.status === 'upcoming' ? '📅' : a.status === 'completed' ? '✅' : '❌'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0a1628', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.doctor}</div>
                      <div style={{ fontSize: '0.78rem', color: '#5a7a9a' }}>{a.specialty} · {a.date} at {a.time}</div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: 20, background: a.status === 'upcoming' ? '#e8f4fd' : a.status === 'completed' ? '#e8fdf5' : '#fee2e2', color: a.status === 'upcoming' ? '#1a6fbf' : a.status === 'completed' ? '#00c6ae' : '#ef4444', flexShrink: 0 }}>
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Health Profile Snapshot */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#0a1628' }}>Health Profile</h2>
              <Link to="/profile" style={{ textDecoration: 'none', fontSize: '0.82rem', color: '#1a6fbf', fontWeight: 600 }}>Edit</Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
              <img src={user.avatar} alt={user.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e8f4fd' }} />
              <div>
                <div style={{ fontWeight: 700, color: '#0a1628' }}>{user.name}</div>
                <div style={{ fontSize: '0.82rem', color: '#5a7a9a' }}>{user.email}</div>
              </div>
            </div>
            {[
              ['Date of Birth', user.dob],
              ['Blood Type', user.bloodType],
              ['Allergies', user.allergies],
              ['Conditions', user.conditions],
              ['Phone', user.phone],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
                <span style={{ color: '#5a7a9a', fontWeight: 600 }}>{k}</span>
                <span style={{ color: '#0a1628', fontWeight: 600, textAlign: 'right', maxWidth: '55%' }}>{v || '—'}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* AI Chat History */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#0a1628' }}>Recent AI Chats</h2>
              <Link to="/chatbot" style={{ textDecoration: 'none', fontSize: '0.82rem', color: '#1a6fbf', fontWeight: 600 }}>Open Chat →</Link>
            </div>
            {chatHistory.filter(m => m.role === 'user').length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: '#5a7a9a' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🤖</div>
                <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>No chat history yet. Ask our AI assistant your first health question.</p>
                <Link to="/chatbot" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', color: '#fff', padding: '0.55rem 1.2rem', borderRadius: 8, fontWeight: 700, fontSize: '0.88rem' }}>
                  Start Chatting
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 240, overflowY: 'auto' }}>
                {chatHistory.filter(m => m.role === 'user').slice(-5).reverse().map((m, i) => (
                  <div key={i} style={{ background: 'var(--background)', borderRadius: 10, padding: '0.7rem 0.9rem', fontSize: '0.88rem' }}>
                    <div style={{ color: '#0a1628', fontWeight: 600, marginBottom: '0.2rem' }}>You asked:</div>
                    <div style={{ color: '#5a7a9a', lineHeight: 1.5 }}>{m.text}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.3rem' }}>{m.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Health Tips + Orders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Personalized Tips */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid var(--border)' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#0a1628', marginBottom: '1rem' }}>
                Tips for You
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {healthTips.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.7rem', background: t.color, borderRadius: 10 }}>
                    <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{t.icon}</span>
                    <span style={{ fontSize: '0.85rem', color: '#0a1628', lineHeight: 1.55 }}>{t.tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#0a1628' }}>Recent Orders</h2>
                <Link to="/products" style={{ textDecoration: 'none', fontSize: '0.82rem', color: '#1a6fbf', fontWeight: 600 }}>Shop →</Link>
              </div>
              {recentProducts.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', paddingBottom: i < recentProducts.length - 1 ? '0.75rem' : 0, marginBottom: i < recentProducts.length - 1 ? '0.75rem' : 0, borderBottom: i < recentProducts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <img src={p.img} alt={p.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0a1628', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize: '0.76rem', color: '#5a7a9a' }}>{p.date}</div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00c6ae', background: '#e8fdf5', padding: '0.2rem 0.65rem', borderRadius: 20 }}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
