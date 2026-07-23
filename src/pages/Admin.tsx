import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, type AdminUser, type AdminProduct, type AdminAppointment, type SubAdmin } from '../context/AuthContext'

type Tab = 'overview' | 'users' | 'admins' | 'appointments' | 'products' | 'homepage' | 'chatlogs' | 'settings'

const tabs: { id: Tab; icon: string; label: string; super?: boolean }[] = [
  { id: 'overview',     icon: '📊', label: 'Overview' },
  { id: 'users',        icon: '👥', label: 'Users & Doctors' },
  { id: 'admins',       icon: '🛡️', label: 'Admin Accounts', super: true },
  { id: 'appointments', icon: '📅', label: 'Appointments' },
  { id: 'products',     icon: '💊', label: 'Products' },
  { id: 'homepage',     icon: '🏠', label: 'Homepage Content', super: true },
  { id: 'chatlogs',     icon: '🤖', label: 'AI Chat Logs' },
  { id: 'settings',     icon: '⚙️', label: 'Platform Settings', super: true },
]

function Badge({ status, map }: { status: string; map: Record<string, { bg: string; color: string; label: string }> }) {
  const s = map[status] || { bg: '#1e293b', color: '#64748b', label: status }
  return <span style={{ background: s.bg, color: s.color, fontSize: '0.73rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: 20, whiteSpace: 'nowrap' }}>{s.label}</span>
}

const uStatus = { active: { bg: 'rgba(52,211,153,0.15)', color: '#34d399', label: 'Active' }, suspended: { bg: 'rgba(239,68,68,0.15)', color: '#f87171', label: 'Suspended' }, pending: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24', label: 'Pending' } }
const aStatus = { upcoming: { bg: 'rgba(96,165,250,0.15)', color: '#60a5fa', label: 'Upcoming' }, completed: { bg: 'rgba(52,211,153,0.15)', color: '#34d399', label: 'Completed' }, cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#f87171', label: 'Cancelled' } }
const pStatus = { active: { bg: 'rgba(52,211,153,0.15)', color: '#34d399', label: 'Active' }, out_of_stock: { bg: 'rgba(239,68,68,0.15)', color: '#f87171', label: 'Out of Stock' }, hidden: { bg: 'rgba(255,255,255,0.07)', color: '#64748b', label: 'Hidden' } }

// Reusable dark input style
const di: React.CSSProperties = { width: '100%', padding: '0.65rem 0.9rem', background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 9, color: '#e2e8f0', fontSize: '0.88rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }
const dl: React.CSSProperties = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: '0.3rem', letterSpacing: '0.05em', textTransform: 'uppercase' }

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
      <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: '2rem', width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontWeight: 700, fontSize: '1.2rem' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', color: 'rgba(255,255,255,0.5)', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: '1rem', fontFamily: 'inherit' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

const SPECIALTIES = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Oncology', 'Psychiatry', 'General Practice', 'Endocrinology', 'Gastroenterology']
const CATEGORIES = ['Supplements', 'Devices', 'Skincare', 'First Aid', 'Wellness', 'Prescriptions']
const ALL_PERMISSIONS = ['overview', 'users', 'appointments', 'products', 'chatlogs', 'settings', 'homepage']

export default function Admin() {
  const {
    user, logout,
    adminUsers, subAdmins, adminProducts, adminAppointments, adminChatLogs,
    siteAnnouncement, homepageAds, platformSettings,
    updateAdminUser, deleteAdminUser, addAdminUser,
    addSubAdmin, updateSubAdmin, deleteSubAdmin,
    updateAdminProduct, deleteAdminProduct, addAdminProduct,
    updateAdminAppointment, deleteAdminAppointment,
    deleteFlaggedLog, setSiteAnnouncement, updateHomepageAd, togglePlatformSetting,
  } = useAuth()

  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('overview')
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')
  const [userFilter, setUserFilter] = useState<'all' | 'patient' | 'doctor' | 'pending'>('all')

  // Modal states
  const [addUserModal, setAddUserModal] = useState(false)
  const [editUser, setEditUser] = useState<AdminUser | null>(null)
  const [addProductModal, setAddProductModal] = useState(false)
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null)
  const [addAdminModal, setAddAdminModal] = useState(false)
  const [editAdmin, setEditAdmin] = useState<SubAdmin | null>(null)
  const [announcementEdit, setAnnouncementEdit] = useState({ ...siteAnnouncement })

  // New user form
  const emptyUser = { name: '', email: '', phone: '', role: 'patient' as const, specialty: '', status: 'active' as const, joined: new Date().toISOString().split('T')[0], avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&auto=format', appointments: 0, verified: true }
  const [newUser, setNewUser] = useState({ ...emptyUser })

  // New product form
  const emptyProduct = { name: '', category: 'Supplements', price: '', stock: 0, status: 'active' as const, sales: 0, description: '', badge: '' }
  const [newProduct, setNewProduct] = useState({ ...emptyProduct })

  // New admin form
  const emptyAdmin = { name: '', email: '', password: '', permissions: [] as string[], status: 'active' as const, created: new Date().toISOString().split('T')[0], lastLogin: '—', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=60&h=60&fit=crop&auto=format' }
  const [newAdmin, setNewAdmin] = useState({ ...emptyAdmin })

  const isSuperAdmin = user?.email === 'admin@medisync.com'

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const handleLogout = () => { logout(); navigate('/') }

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1117', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ fontSize: '3rem' }}>🔒</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#fff' }}>Admin Access Only</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>You must be logged in as an administrator.</p>
        <Link to="/admin-login" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', color: '#fff', borderRadius: 10, padding: '0.75rem 2rem', fontWeight: 700, fontSize: '0.95rem' }}>Go to Admin Login</Link>
      </div>
    )
  }

  const totalRevenue = adminAppointments.filter(a => a.status === 'completed').reduce((s, a) => s + parseFloat(a.fee.replace('$', '')), 0)
  const filteredUsers = adminUsers.filter(u => {
    if (userFilter === 'pending') return !u.verified
    if (userFilter !== 'all') return u.role === userFilter
    return true
  }).filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  const visibleTabs = isSuperAdmin ? tabs : tabs.filter(t => !t.super)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d1117' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: 238, background: '#0a0f16', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 40 }}>
        <div style={{ padding: '1.4rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M1 8h14" stroke="white" strokeWidth="2.2" strokeLinecap="round" /></svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>Medi<span style={{ color: '#00c6ae' }}>Sync</span></div>
              <div style={{ fontSize: '0.6rem', color: '#00c6ae', fontWeight: 800, letterSpacing: '0.1em', marginTop: '0.1rem' }}>ADMIN PANEL</div>
            </div>
          </div>
        </div>

        {/* Admin identity */}
        <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img src={user.avatar} alt={user.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #1a6fbf' }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <div style={{ fontSize: '0.68rem', color: isSuperAdmin ? '#fbbf24' : '#a78bfa', fontWeight: 700 }}>
                {isSuperAdmin ? '⭐ Super Admin' : '🛡️ Sub-Admin'}
              </div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.18rem', overflowY: 'auto' }}>
          {visibleTabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', width: '100%', padding: '0.62rem 0.85rem', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.84rem', fontWeight: tab === t.id ? 700 : 500, background: tab === t.id ? 'rgba(26,111,191,0.22)' : 'transparent', color: tab === t.id ? '#60a5fa' : 'rgba(255,255,255,0.45)', transition: 'all 0.15s', textAlign: 'left', borderLeft: `3px solid ${tab === t.id ? '#1a6fbf' : 'transparent'}` }}>
              <span style={{ fontSize: '0.95rem', flexShrink: 0 }}>{t.icon}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.label}</span>
              {t.id === 'chatlogs' && adminChatLogs.filter(l => l.flagged).length > 0 && (
                <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: 8, flexShrink: 0 }}>{adminChatLogs.filter(l => l.flagged).length}</span>
              )}
              {t.id === 'users' && adminUsers.filter(u => !u.verified).length > 0 && (
                <span style={{ marginLeft: 'auto', background: '#f59e0b', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: 8, flexShrink: 0 }}>{adminUsers.filter(u => !u.verified).length}</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.85rem', borderRadius: 9, fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.35)', background: 'transparent' }}>
            🌐 View Public Site
          </Link>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', padding: '0.55rem 0.85rem', borderRadius: 9, border: 'none', cursor: 'pointer', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: '0.82rem', fontWeight: 700, fontFamily: 'inherit' }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ marginLeft: 238, flex: 1, padding: '2rem 2.5rem', minHeight: '100vh', overflowX: 'hidden' }}>

        {/* Toast */}
        {toast && (
          <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', color: '#fff', padding: '0.7rem 1.2rem', borderRadius: 12, fontWeight: 700, fontSize: '0.88rem', zIndex: 300, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', animation: 'slideIn 0.3s ease' }}>
            ✓ {toast}
          </div>
        )}

        {/* ══════════════ OVERVIEW ══════════════ */}
        {tab === 'overview' && (
          <section>
            <hgroup style={{ marginBottom: '2rem' }}>
              <p style={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Control Center</p>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: '#fff' }}>Platform Overview</h1>
            </hgroup>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Users', value: adminUsers.length, sub: `${adminUsers.filter(u => u.role === 'patient').length} patients · ${adminUsers.filter(u => u.role === 'doctor').length} doctors`, icon: '👥', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
                { label: 'Appointments', value: adminAppointments.length, sub: `${adminAppointments.filter(a => a.status === 'upcoming').length} upcoming today`, icon: '📅', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
                { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, sub: `${adminAppointments.filter(a => a.status === 'completed').length} completed visits`, icon: '💰', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
                { label: 'Products Active', value: adminProducts.filter(p => p.status === 'active').length, sub: `${adminProducts.filter(p => p.stock === 0).length} out of stock`, icon: '💊', color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
              ].map(k => (
                <div key={k.label} style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.3rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontWeight: 600 }}>{k.label}</span>
                    <div style={{ width: 34, height: 34, background: k.bg, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{k.icon}</div>
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.85rem', fontWeight: 700, color: k.color, lineHeight: 1 }}>{k.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem' }}>{k.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              {/* Recent appointments */}
              <div style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Recent Appointments</h2>
                  <button onClick={() => setTab('appointments')} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit' }}>View all →</button>
                </div>
                {adminAppointments.slice(0, 4).map(a => (
                  <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>{a.patient}</div>
                      <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.35)' }}>{a.doctor} · {a.date}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399' }}>{a.fee}</span>
                      <Badge status={a.status} map={aStatus} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Platform health */}
              <div style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.5rem' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '1.2rem' }}>Platform Health</h2>
                {[
                  { label: 'Active Users', val: adminUsers.filter(u => u.status === 'active').length, total: adminUsers.length, color: '#60a5fa' },
                  { label: 'Verified Doctors', val: adminUsers.filter(u => u.role === 'doctor' && u.verified).length, total: adminUsers.filter(u => u.role === 'doctor').length, color: '#34d399' },
                  { label: 'Active Products', val: adminProducts.filter(p => p.status === 'active').length, total: adminProducts.length, color: '#a78bfa' },
                  { label: 'Safe Chat Sessions', val: adminChatLogs.filter(l => !l.flagged).length, total: adminChatLogs.length, color: '#fbbf24' },
                ].map(item => (
                  <div key={item.label} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>{item.label}</span>
                      <span style={{ fontSize: '0.8rem', color: item.color, fontWeight: 700 }}>{item.val}/{item.total}</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3 }}>
                      <div style={{ height: '100%', borderRadius: 3, background: item.color, width: `${Math.round((item.val / item.total) * 100)}%`, transition: 'width 0.6s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top products */}
            <div style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Top Products by Sales</h2>
                <button onClick={() => setTab('products')} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit' }}>Manage →</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                {adminProducts.sort((a, b) => b.sales - a.sales).slice(0, 4).map(p => (
                  <div key={p.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '0.9rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.3rem' }}>{p.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>{p.category}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>{p.sales.toLocaleString()}</div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>units sold</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════ USERS & DOCTORS ══════════════ */}
        {tab === 'users' && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Management</p>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: '#fff' }}>Users & Doctors</h1>
              </div>
              <button onClick={() => { setNewUser({ ...emptyUser }); setAddUserModal(true) }} style={{ background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.65rem 1.3rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                + Add User / Doctor
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email..." style={{ ...di, flex: 1, minWidth: 200 }} />
              {(['all', 'patient', 'doctor', 'pending'] as const).map(f => (
                <button key={f} onClick={() => setUserFilter(f)} style={{ padding: '0.45rem 0.9rem', borderRadius: 20, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 700, background: userFilter === f ? '#1a6fbf' : 'rgba(255,255,255,0.07)', color: userFilter === f ? '#fff' : 'rgba(255,255,255,0.45)', transition: 'all 0.2s', textTransform: 'capitalize' }}>
                  {f === 'pending' ? '⚠️ Pending' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead><tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {['User', 'Role / Specialty', 'Contact', 'Status', 'Appts', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.8rem 1rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div style={{ position: 'relative' }}>
                            <img src={u.avatar} alt={u.name} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                            {!u.verified && <div style={{ position: 'absolute', bottom: -2, right: -2, width: 10, height: 10, background: '#f59e0b', borderRadius: '50%', border: '2px solid #161b22' }} />}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#e2e8f0', whiteSpace: 'nowrap' }}>{u.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: u.role === 'doctor' ? '#60a5fa' : '#a78bfa' }}>
                          {u.role === 'doctor' ? '👨‍⚕️' : '🏥'} {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                        {u.specialty && <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.1rem' }}>{u.specialty}</div>}
                      </td>
                      <td style={{ padding: '0.8rem 1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{u.phone || '—'}</td>
                      <td style={{ padding: '0.8rem 1rem' }}><Badge status={u.status} map={uStatus} /></td>
                      <td style={{ padding: '0.8rem 1rem', color: '#e2e8f0', fontWeight: 700, textAlign: 'center' }}>{u.appointments}</td>
                      <td style={{ padding: '0.8rem 1rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{u.joined}</td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'nowrap' }}>
                          <button onClick={() => setEditUser(u)} style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: 'none', borderRadius: 7, padding: '0.28rem 0.6rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Edit</button>
                          {!u.verified && <button onClick={() => { updateAdminUser(u.id, { verified: true, status: 'active' }); notify(`${u.name} approved`) }} style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: 'none', borderRadius: 7, padding: '0.28rem 0.6rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>✓ Approve</button>}
                          {u.status === 'active'
                            ? <button onClick={() => { updateAdminUser(u.id, { status: 'suspended' }); notify(`${u.name} suspended`) }} style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'none', borderRadius: 7, padding: '0.28rem 0.6rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Suspend</button>
                            : <button onClick={() => { updateAdminUser(u.id, { status: 'active' }); notify(`${u.name} reactivated`) }} style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: 'none', borderRadius: 7, padding: '0.28rem 0.6rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Reactivate</button>}
                          <button onClick={() => { if (confirm(`Delete ${u.name}?`)) { deleteAdminUser(u.id); notify(`${u.name} deleted`) } }} style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: 'none', borderRadius: 7, padding: '0.28rem 0.6rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)' }}>No users found.</div>}
            </div>
          </section>
        )}

        {/* ══════════════ ADMIN ACCOUNTS ══════════════ */}
        {tab === 'admins' && isSuperAdmin && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Access Control</p>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: '#fff' }}>Admin Accounts</h1>
              </div>
              <button onClick={() => { setNewAdmin({ ...emptyAdmin }); setAddAdminModal(true) }} style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.65rem 1.3rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'inherit' }}>
                + Create Sub-Admin
              </button>
            </div>

            {/* Super admin card */}
            <div style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(251,191,36,0.03))', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 14, padding: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img src={user.avatar} alt={user.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fbbf24' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>{user.name}</span>
                  <span style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', fontSize: '0.7rem', fontWeight: 800, padding: '0.1rem 0.55rem', borderRadius: 20 }}>⭐ SUPER ADMIN</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{user.email} · Full platform access · All permissions</div>
              </div>
              <span style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: 20 }}>Active</span>
            </div>

            {/* Sub-admins */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {subAdmins.map(s => (
                <div key={s.id} style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.3rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <img src={s.avatar} alt={s.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{s.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{s.email} · Last login: {s.lastLogin}</div>
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      {s.permissions.map(p => (
                        <span key={p} style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', fontSize: '0.68rem', fontWeight: 700, padding: '0.1rem 0.5rem', borderRadius: 12, textTransform: 'capitalize' }}>{p}</span>
                      ))}
                    </div>
                  </div>
                  <Badge status={s.status} map={{ active: { bg: 'rgba(52,211,153,0.15)', color: '#34d399', label: 'Active' }, suspended: { bg: 'rgba(239,68,68,0.15)', color: '#f87171', label: 'Suspended' } }} />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => setEditAdmin(s)} style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: 'none', borderRadius: 8, padding: '0.35rem 0.75rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
                    {s.status === 'active'
                      ? <button onClick={() => { updateSubAdmin(s.id, { status: 'suspended' }); notify(`${s.name} suspended`) }} style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'none', borderRadius: 8, padding: '0.35rem 0.75rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Suspend</button>
                      : <button onClick={() => { updateSubAdmin(s.id, { status: 'active' }); notify(`${s.name} reactivated`) }} style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: 'none', borderRadius: 8, padding: '0.35rem 0.75rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Reactivate</button>}
                    <button onClick={() => { if (confirm(`Remove ${s.name}?`)) { deleteSubAdmin(s.id); notify(`${s.name} removed`) } }} style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: 'none', borderRadius: 8, padding: '0.35rem 0.75rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══════════════ APPOINTMENTS ══════════════ */}
        {tab === 'appointments' && (
          <section>
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Appointments</p>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: '#fff' }}>All Appointments</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Upcoming', value: adminAppointments.filter(a => a.status === 'upcoming').length, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
                { label: 'Completed', value: adminAppointments.filter(a => a.status === 'completed').length, color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
                { label: 'Cancelled', value: adminAppointments.filter(a => a.status === 'cancelled').length, color: '#f87171', bg: 'rgba(239,68,68,0.1)' },
              ].map(s => (
                <div key={s.label} style={{ background: '#161b22', border: `1px solid ${s.bg}`, borderRadius: 12, padding: '1.2rem', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead><tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {['Patient', 'Doctor / Specialty', 'Date & Time', 'Fee', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.8rem 1rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {adminAppointments.map((a: AdminAppointment) => (
                    <tr key={a.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.8rem 1rem', color: '#e2e8f0', fontWeight: 600 }}>{a.patient}</td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <div style={{ color: '#e2e8f0', fontWeight: 600 }}>{a.doctor}</div>
                        <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.35)' }}>{a.specialty}</div>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{a.date} · {a.time}</td>
                      <td style={{ padding: '0.8rem 1rem', color: '#34d399', fontWeight: 700 }}>{a.fee}</td>
                      <td style={{ padding: '0.8rem 1rem' }}><Badge status={a.status} map={aStatus} /></td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'nowrap' }}>
                          {a.status === 'upcoming' && <>
                            <button onClick={() => { updateAdminAppointment(a.id, { status: 'completed' }); notify('Marked completed') }} style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: 'none', borderRadius: 7, padding: '0.28rem 0.6rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>✓ Done</button>
                            <button onClick={() => { updateAdminAppointment(a.id, { status: 'cancelled' }); notify('Appointment cancelled') }} style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'none', borderRadius: 7, padding: '0.28rem 0.6rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                          </>}
                          <button onClick={() => { if (confirm('Delete this appointment?')) { deleteAdminAppointment(a.id); notify('Appointment deleted') } }} style={{ background: 'rgba(239,68,68,0.07)', color: '#f87171', border: 'none', borderRadius: 7, padding: '0.28rem 0.6rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ══════════════ PRODUCTS ══════════════ */}
        {tab === 'products' && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Inventory</p>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: '#fff' }}>Product Management</h1>
              </div>
              <button onClick={() => { setNewProduct({ ...emptyProduct }); setAddProductModal(true) }} style={{ background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.65rem 1.3rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'inherit' }}>
                + Add Product
              </button>
            </div>

            <div style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead><tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {['Product', 'Category', 'Price', 'Stock', 'Sales', 'Badge', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.8rem 1rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {adminProducts.map((p: AdminProduct) => (
                    <tr key={p.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: '#e2e8f0' }}>{p.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{p.category}</td>
                      <td style={{ padding: '0.8rem 1rem', color: '#34d399', fontWeight: 700 }}>{p.price}</td>
                      <td style={{ padding: '0.8rem 1rem' }}><span style={{ color: p.stock === 0 ? '#f87171' : p.stock < 20 ? '#fbbf24' : '#e2e8f0', fontWeight: 700 }}>{p.stock}</span></td>
                      <td style={{ padding: '0.8rem 1rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{p.sales.toLocaleString()}</td>
                      <td style={{ padding: '0.8rem 1rem' }}>{p.badge ? <span style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 12 }}>{p.badge}</span> : <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>—</span>}</td>
                      <td style={{ padding: '0.8rem 1rem' }}><Badge status={p.status} map={pStatus} /></td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'nowrap' }}>
                          <button onClick={() => setEditProduct(p)} style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: 'none', borderRadius: 7, padding: '0.28rem 0.6rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
                          {p.status !== 'active' ? <button onClick={() => { updateAdminProduct(p.id, { status: 'active' }); notify(`${p.name} activated`) }} style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: 'none', borderRadius: 7, padding: '0.28rem 0.6rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Activate</button>
                            : <button onClick={() => { updateAdminProduct(p.id, { status: 'hidden' }); notify(`${p.name} hidden`) }} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)', border: 'none', borderRadius: 7, padding: '0.28rem 0.6rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Hide</button>}
                          {p.stock === 0 && <button onClick={() => { updateAdminProduct(p.id, { stock: 100, status: 'active' }); notify(`${p.name} restocked`) }} style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: 'none', borderRadius: 7, padding: '0.28rem 0.6rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Restock</button>}
                          <button onClick={() => { if (confirm(`Delete ${p.name}?`)) { deleteAdminProduct(p.id); notify(`${p.name} deleted`) } }} style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: 'none', borderRadius: 7, padding: '0.28rem 0.6rem', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ══════════════ HOMEPAGE CONTENT ══════════════ */}
        {tab === 'homepage' && isSuperAdmin && (
          <section>
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Content Control</p>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: '#fff' }}>Homepage Content</h1>
            </div>

            {/* Site Announcement Banner */}
            <div style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                  📢 Site-Wide Announcement Banner
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                    {announcementEdit.enabled ? 'Live' : 'Off'}
                  </span>
                  <button onClick={() => setAnnouncementEdit(p => ({ ...p, enabled: !p.enabled }))} style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', background: announcementEdit.enabled ? '#1a6fbf' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.2s' }}>
                    <div style={{ width: 18, height: 18, background: '#fff', borderRadius: '50%', position: 'absolute', top: 3, left: announcementEdit.enabled ? 23 : 3, transition: 'left 0.2s' }} />
                  </button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={dl}>Announcement Text</label>
                  <input value={announcementEdit.text} onChange={e => setAnnouncementEdit(p => ({ ...p, text: e.target.value }))} placeholder="e.g. 🎉 Free consultations this weekend! Book now." style={{ ...di, width: '100%' }} />
                </div>
                <div>
                  <label style={dl}>Type</label>
                  <select value={announcementEdit.type} onChange={e => setAnnouncementEdit(p => ({ ...p, type: e.target.value as any }))} style={{ ...di, width: 120 }}>
                    <option value="info">ℹ️ Info</option>
                    <option value="success">✅ Success</option>
                    <option value="warning">⚠️ Warning</option>
                  </select>
                </div>
              </div>
              {announcementEdit.text && (
                <div style={{ background: announcementEdit.type === 'warning' ? 'rgba(251,191,36,0.1)' : announcementEdit.type === 'success' ? 'rgba(52,211,153,0.1)' : 'rgba(96,165,250,0.1)', border: `1px solid ${announcementEdit.type === 'warning' ? 'rgba(251,191,36,0.3)' : announcementEdit.type === 'success' ? 'rgba(52,211,153,0.3)' : 'rgba(96,165,250,0.3)'}`, borderRadius: 10, padding: '0.7rem 1rem', marginBottom: '1rem', fontSize: '0.88rem', color: '#fff' }}>
                  Preview: {announcementEdit.text}
                </div>
              )}
              <button onClick={() => { setSiteAnnouncement(announcementEdit); notify('Announcement updated') }} style={{ background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', color: '#fff', border: 'none', borderRadius: 9, padding: '0.6rem 1.4rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'inherit' }}>
                Save & Publish
              </button>
            </div>

            {/* Homepage Ads */}
            <div style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.5rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1.2rem' }}>
                🎯 Homepage Advertisement Banners
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {homepageAds.map(ad => (
                  <div key={ad.id} style={{ background: ad.bg, borderRadius: 14, padding: '1.25rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        value={ad.badge}
                        onChange={e => updateHomepageAd(ad.id, { badge: e.target.value })}
                        style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '0.25rem 0.6rem', color: '#fff', fontSize: '0.75rem', fontFamily: 'inherit', marginBottom: '0.5rem', display: 'block', fontWeight: 700 }}
                        placeholder="Badge text"
                      />
                      <input
                        value={ad.title}
                        onChange={e => updateHomepageAd(ad.id, { title: e.target.value })}
                        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 8, padding: '0.4rem 0.8rem', color: '#fff', fontSize: '1rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, width: '100%', boxSizing: 'border-box', marginBottom: '0.5rem' }}
                        placeholder="Ad title"
                      />
                      <textarea
                        value={ad.desc}
                        onChange={e => updateHomepageAd(ad.id, { desc: e.target.value })}
                        rows={2}
                        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '0.4rem 0.8rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.84rem', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', resize: 'none', marginBottom: '0.5rem' }}
                        placeholder="Description"
                      />
                      <input
                        value={ad.cta}
                        onChange={e => updateHomepageAd(ad.id, { cta: e.target.value })}
                        style={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 7, padding: '0.35rem 0.8rem', color: '#0a1628', fontSize: '0.82rem', fontFamily: 'inherit', fontWeight: 700 }}
                        placeholder="CTA button text"
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', flexShrink: 0 }}>
                      <button onClick={() => { updateHomepageAd(ad.id, { active: !ad.active }); notify(`Ad ${!ad.active ? 'enabled' : 'disabled'}`) }} style={{ background: ad.active ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.15)', color: ad.active ? '#34d399' : 'rgba(255,255,255,0.6)', border: 'none', borderRadius: 8, padding: '0.4rem 0.8rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {ad.active ? '✓ Live' : 'Off'}
                      </button>
                      <button onClick={() => notify('Ad changes saved')} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.4rem 0.8rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════ CHAT LOGS ══════════════ */}
        {tab === 'chatlogs' && (
          <section>
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Moderation</p>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: '#fff' }}>AI Chat Logs</h1>
            </div>
            {adminChatLogs.filter(l => l.flagged).length > 0 && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '0.9rem 1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.1rem' }}>🚨</span>
                <span style={{ color: '#f87171', fontWeight: 600, fontSize: '0.88rem' }}>{adminChatLogs.filter(l => l.flagged).length} conversation(s) flagged for review — potential policy violation.</span>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {adminChatLogs.map(log => (
                <div key={log.id} style={{ background: '#161b22', border: `1px solid ${log.flagged ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ width: 40, height: 40, background: log.flagged ? 'rgba(239,68,68,0.15)' : 'rgba(96,165,250,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                    {log.flagged ? '🚨' : '🤖'}
                  </div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.88rem' }}>{log.user}</span>
                      {log.flagged && <span style={{ background: 'rgba(239,68,68,0.18)', color: '#f87171', fontSize: '0.68rem', fontWeight: 800, padding: '0.1rem 0.45rem', borderRadius: 20 }}>FLAGGED</span>}
                      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.74rem' }}>{log.date}</span>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400 }}>"{log.lastMessage}"</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: '#60a5fa' }}>{log.messages}</div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>messages</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {log.flagged && (
                      <>
                        <button onClick={() => { deleteFlaggedLog(log.id); notify('Log removed') }} style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'none', borderRadius: 8, padding: '0.38rem 0.8rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Remove</button>
                        <button onClick={() => { deleteFlaggedLog(log.id); notify('Log cleared — no violation') }} style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: 'none', borderRadius: 8, padding: '0.38rem 0.8rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Clear</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══════════════ SETTINGS ══════════════ */}
        {tab === 'settings' && isSuperAdmin && (
          <section>
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Configuration</p>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: '#fff' }}>Platform Settings</h1>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {Object.entries({
                doctorVerification: { label: 'Doctor Verification', desc: 'Require manual admin approval before new doctors can go live.' },
                aiChatModeration: { label: 'AI Chat Moderation', desc: 'Auto-flag AI conversations with sensitive keywords for review.' },
                newRegistrations: { label: 'New User Registrations', desc: 'Allow new patients and doctors to register on the platform.' },
                telehealthFeatures: { label: 'Telehealth Features', desc: 'Enable video/chat consultations across all specialties.' },
                productMarketplace: { label: 'Product Marketplace', desc: 'Allow users to browse and buy from the medical products store.' },
                emailNotifications: { label: 'Email Notifications', desc: 'Send transactional emails for appointments and orders.' },
                smsAlerts: { label: 'SMS Alerts', desc: 'Send appointment reminders via SMS (carrier charges may apply).' },
                maintenanceMode: { label: 'Maintenance Mode', desc: 'Take the platform offline — all users see a maintenance notice.' },
              }).map(([key, { label, desc }]) => (
                <div key={key} style={{ background: '#161b22', border: `1px solid ${platformSettings[key] && key === 'maintenanceMode' ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, padding: '1.3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: key === 'maintenanceMode' && platformSettings[key] ? '#f87171' : '#e2e8f0', marginBottom: '0.3rem', fontSize: '0.9rem' }}>{label}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{desc}</div>
                  </div>
                  <button onClick={() => { togglePlatformSetting(key); notify(`${label} ${!platformSettings[key] ? 'enabled' : 'disabled'}`) }} style={{ width: 46, height: 25, borderRadius: 13, border: 'none', cursor: 'pointer', background: platformSettings[key] ? (key === 'maintenanceMode' ? '#ef4444' : '#1a6fbf') : 'rgba(255,255,255,0.1)', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
                    <div style={{ width: 19, height: 19, background: '#fff', borderRadius: '50%', position: 'absolute', top: 3, left: platformSettings[key] ? 24 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                  </button>
                </div>
              ))}
            </div>
            <div style={{ background: '#161b22', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, padding: '1.5rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#f87171', marginBottom: '0.5rem', fontSize: '1rem' }}>Danger Zone</h3>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', marginBottom: '1rem' }}>These actions are irreversible. Proceed with caution.</p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {['Purge All Chat Logs', 'Reset Product Statistics', 'Export Full Data (JSON)', 'Backup Database'].map(action => (
                  <button key={action} onClick={() => notify(`${action} — logged & initiated`)} style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9, padding: '0.55rem 1.1rem', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ══════════════ MODALS ══════════════ */}

      {/* Add / Edit User */}
      {(addUserModal || editUser) && (
        <Modal title={editUser ? `Edit — ${editUser.name}` : 'Add New User / Doctor'} onClose={() => { setAddUserModal(false); setEditUser(null) }}>
          {(() => {
            const form = editUser ? { ...editUser } : newUser
            const setForm = editUser
              ? (updates: Partial<AdminUser>) => setEditUser(prev => prev ? { ...prev, ...updates } : null)
              : (updates: Partial<typeof newUser>) => setNewUser(prev => ({ ...prev, ...updates }))
            return (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem 1rem' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={dl}>Full Name</label>
                    <input value={form.name} onChange={e => setForm({ name: e.target.value })} style={di} placeholder="Dr. Jane Smith" />
                  </div>
                  <div>
                    <label style={dl}>Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({ email: e.target.value })} style={di} placeholder="jane@example.com" />
                  </div>
                  <div>
                    <label style={dl}>Phone</label>
                    <input value={form.phone || ''} onChange={e => setForm({ phone: e.target.value })} style={di} placeholder="+1 555 000 0000" />
                  </div>
                  <div>
                    <label style={dl}>Role</label>
                    <select value={form.role} onChange={e => setForm({ role: e.target.value as 'patient' | 'doctor' })} style={di}>
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                    </select>
                  </div>
                  <div>
                    <label style={dl}>Status</label>
                    <select value={form.status} onChange={e => setForm({ status: e.target.value as any })} style={di}>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  {form.role === 'doctor' && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={dl}>Specialty</label>
                      <select value={form.specialty || ''} onChange={e => setForm({ specialty: e.target.value })} style={di}>
                        <option value="">Select specialty…</option>
                        {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  )}
                  <div>
                    <label style={dl}>Verified</label>
                    <select value={String(form.verified)} onChange={e => setForm({ verified: e.target.value === 'true' })} style={di}>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label style={dl}>Join Date</label>
                    <input type="date" value={form.joined} onChange={e => setForm({ joined: e.target.value })} style={di} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => { setAddUserModal(false); setEditUser(null) }} style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', border: 'none', borderRadius: 9, padding: '0.65rem 1.3rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.88rem' }}>Cancel</button>
                  <button onClick={() => {
                    if (editUser) { updateAdminUser(editUser.id, form as AdminUser); notify(`${form.name} updated`) }
                    else { addAdminUser(form as Omit<AdminUser, 'id'>); notify(`${form.name} added`) }
                    setAddUserModal(false); setEditUser(null)
                  }} style={{ background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', color: '#fff', border: 'none', borderRadius: 9, padding: '0.65rem 1.3rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.88rem' }}>
                    {editUser ? 'Save Changes' : 'Add User'}
                  </button>
                </div>
              </div>
            )
          })()}
        </Modal>
      )}

      {/* Add / Edit Product */}
      {(addProductModal || editProduct) && (
        <Modal title={editProduct ? `Edit — ${editProduct.name}` : 'Add New Product'} onClose={() => { setAddProductModal(false); setEditProduct(null) }}>
          {(() => {
            const form = editProduct ?? newProduct
            const setForm = editProduct
              ? (u: Partial<AdminProduct>) => setEditProduct(prev => prev ? { ...prev, ...u } : null)
              : (u: Partial<typeof newProduct>) => setNewProduct(prev => ({ ...prev, ...u }))
            return (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem 1rem' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={dl}>Product Name</label>
                    <input value={form.name} onChange={e => setForm({ name: e.target.value })} style={di} placeholder="e.g. CardioGuard Omega-3" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={dl}>Description</label>
                    <textarea value={form.description} onChange={e => setForm({ description: e.target.value })} rows={2} style={{ ...di, resize: 'none' }} placeholder="Brief product description" />
                  </div>
                  <div>
                    <label style={dl}>Category</label>
                    <select value={form.category} onChange={e => setForm({ category: e.target.value })} style={di}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={dl}>Price</label>
                    <input value={form.price} onChange={e => setForm({ price: e.target.value })} style={di} placeholder="$29.99" />
                  </div>
                  <div>
                    <label style={dl}>Stock Units</label>
                    <input type="number" value={form.stock} onChange={e => setForm({ stock: parseInt(e.target.value) || 0 })} style={di} min={0} />
                  </div>
                  <div>
                    <label style={dl}>Badge (optional)</label>
                    <input value={form.badge || ''} onChange={e => setForm({ badge: e.target.value })} style={di} placeholder="e.g. New, Sale, Best Seller" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={dl}>Status</label>
                    <select value={form.status} onChange={e => setForm({ status: e.target.value as any })} style={di}>
                      <option value="active">Active</option>
                      <option value="hidden">Hidden</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => { setAddProductModal(false); setEditProduct(null) }} style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', border: 'none', borderRadius: 9, padding: '0.65rem 1.3rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.88rem' }}>Cancel</button>
                  <button onClick={() => {
                    if (editProduct) { updateAdminProduct(editProduct.id, form as AdminProduct); notify(`${form.name} updated`) }
                    else { addAdminProduct(form as Omit<AdminProduct, 'id'>); notify(`${form.name} added`) }
                    setAddProductModal(false); setEditProduct(null)
                  }} style={{ background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', color: '#fff', border: 'none', borderRadius: 9, padding: '0.65rem 1.3rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.88rem' }}>
                    {editProduct ? 'Save Changes' : 'Add Product'}
                  </button>
                </div>
              </div>
            )
          })()}
        </Modal>
      )}

      {/* Add / Edit Sub-Admin */}
      {(addAdminModal || editAdmin) && (
        <Modal title={editAdmin ? `Edit — ${editAdmin.name}` : 'Create Sub-Admin'} onClose={() => { setAddAdminModal(false); setEditAdmin(null) }}>
          {(() => {
            const form = editAdmin ?? newAdmin
            const setForm = editAdmin
              ? (u: Partial<SubAdmin>) => setEditAdmin(prev => prev ? { ...prev, ...u } : null)
              : (u: Partial<typeof newAdmin>) => setNewAdmin(prev => ({ ...prev, ...u }))
            return (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem 1rem' }}>
                  <div>
                    <label style={dl}>Full Name</label>
                    <input value={form.name} onChange={e => setForm({ name: e.target.value })} style={di} placeholder="Admin name" />
                  </div>
                  <div>
                    <label style={dl}>Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({ email: e.target.value })} style={di} placeholder="admin@medisync.com" />
                  </div>
                  <div>
                    <label style={dl}>Password</label>
                    <input type="password" value={form.password} onChange={e => setForm({ password: e.target.value })} style={di} placeholder="Min. 8 characters" />
                  </div>
                  <div>
                    <label style={dl}>Status</label>
                    <select value={form.status} onChange={e => setForm({ status: e.target.value as any })} style={di}>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ ...dl, marginBottom: '0.5rem' }}>Permissions</label>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {ALL_PERMISSIONS.map(p => {
                        const active = form.permissions.includes(p)
                        return (
                          <button key={p} type="button" onClick={() => setForm({ permissions: active ? form.permissions.filter(x => x !== p) : [...form.permissions, p] })} style={{ padding: '0.3rem 0.75rem', borderRadius: 20, border: `1.5px solid ${active ? '#1a6fbf' : 'rgba(255,255,255,0.1)'}`, background: active ? 'rgba(26,111,191,0.2)' : 'transparent', color: active ? '#60a5fa' : 'rgba(255,255,255,0.35)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize', transition: 'all 0.15s' }}>
                            {active ? '✓ ' : ''}{p}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => { setAddAdminModal(false); setEditAdmin(null) }} style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', border: 'none', borderRadius: 9, padding: '0.65rem 1.3rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.88rem' }}>Cancel</button>
                  <button onClick={() => {
                    if (editAdmin) { updateSubAdmin(editAdmin.id, form as SubAdmin); notify(`${form.name} updated`) }
                    else { addSubAdmin(form as Omit<SubAdmin, 'id'>); notify(`${form.name} created`) }
                    setAddAdminModal(false); setEditAdmin(null)
                  }} style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: '#fff', border: 'none', borderRadius: 9, padding: '0.65rem 1.3rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.88rem' }}>
                    {editAdmin ? 'Save Changes' : 'Create Admin'}
                  </button>
                </div>
              </div>
            )
          })()}
        </Modal>
      )}

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
