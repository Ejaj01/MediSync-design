import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const sections = ['Personal Info', 'Health Details', 'Notifications', 'Security', 'Account']

export default function Profile() {
  const { user, updateProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState('Personal Info')
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ ...user })

  if (!user) return null

  const save = () => {
    updateProfile(form as typeof user)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const field = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: '1.2rem' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0a1628', marginBottom: '0.35rem' }}>{label}</label>
      <input
        type={type}
        value={(form[key] as string) || ''}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        style={{ width: '100%', padding: '0.72rem 1rem', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: '0.95rem', outline: 'none', color: '#0a1628', fontFamily: 'inherit', boxSizing: 'border-box', background: '#fff' }}
      />
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)', padding: '2.5rem 1.5rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ color: '#1a6fbf', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Account</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 700, color: '#0a1628', marginTop: '0.4rem' }}>
            Profile Settings
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* Avatar card */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid var(--border)', textAlign: 'center', marginBottom: '0.5rem' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.75rem' }}>
                <img src={user.avatar} alt={user.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e8f4fd' }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, background: '#00c6ae', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', fontSize: '0.65rem' }}>✏️</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0a1628' }}>{user.name}</div>
              <div style={{ fontSize: '0.78rem', color: '#5a7a9a', marginTop: '0.2rem' }}>{user.email}</div>
              <span style={{ display: 'inline-block', marginTop: '0.6rem', background: '#e8f4fd', color: '#1a6fbf', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: 20 }}>
                {user.role === 'doctor' ? '👨‍⚕️ Doctor' : '🏥 Patient'}
              </span>
            </div>

            {/* Nav */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
              {sections.map((s, i) => (
                <button
                  key={s}
                  onClick={() => setActive(s)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '0.8rem 1.2rem',
                    background: active === s ? '#e8f4fd' : 'transparent',
                    color: active === s ? '#1a6fbf' : '#0a1628',
                    fontWeight: active === s ? 700 : 600,
                    fontSize: '0.9rem', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    borderBottom: i < sections.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {['👤', '🩺', '🔔', '🔒', '⚙️'][i]} {s}
                </button>
              ))}
            </div>
          </div>

          {/* Main Panel */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', border: '1px solid var(--border)' }}>
            {saved && (
              <div style={{ background: '#e8fdf5', border: '1px solid #00c6ae', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00c6ae', fontWeight: 700, fontSize: '0.9rem' }}>
                ✅ Changes saved successfully.
              </div>
            )}

            {active === 'Personal Info' && (
              <>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#0a1628', marginBottom: '1.5rem' }}>Personal Information</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                  {field('Full Name', 'name', 'text', 'Your full name')}
                  {field('Email Address', 'email', 'email', 'your@email.com')}
                  {field('Phone Number', 'phone', 'tel', '+1 (555) 000-0000')}
                  {field('Date of Birth', 'dob', 'date')}
                </div>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0a1628', marginBottom: '0.5rem' }}>Account Type</label>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {[['patient', '🏥 Patient'], ['doctor', '👨‍⚕️ Doctor']].map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setForm({ ...form, role: val as 'patient' | 'doctor' })}
                        style={{ flex: 1, padding: '0.65rem', border: `2px solid ${form.role === val ? '#1a6fbf' : 'var(--border)'}`, borderRadius: 10, background: form.role === val ? '#e8f4fd' : '#fff', color: form.role === val ? '#1a6fbf' : '#5a7a9a', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.88rem', transition: 'all 0.2s' }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {active === 'Health Details' && (
              <>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#0a1628', marginBottom: '1.5rem' }}>Health Information</h2>
                <p style={{ color: '#5a7a9a', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.65 }}>
                  This information helps our AI assistant and doctors provide more accurate, personalized care. It is encrypted and HIPAA-compliant.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                  {field('Blood Type', 'bloodType', 'text', 'e.g. O+')}
                  {field('Known Allergies', 'allergies', 'text', 'e.g. Penicillin, Latex')}
                </div>
                {field('Current Medical Conditions', 'conditions', 'text', 'e.g. Hypertension, Type 2 Diabetes')}
                <div style={{ background: '#fff8e8', border: '1px solid #fcd34d', borderRadius: 10, padding: '0.9rem 1rem', fontSize: '0.85rem', color: '#92400e', marginBottom: '1.2rem' }}>
                  ⚠️ Always consult a physician before making medical decisions based on this information.
                </div>
              </>
            )}

            {active === 'Notifications' && (
              <>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#0a1628', marginBottom: '1.5rem' }}>Notification Preferences</h2>
                {[
                  { key: 'notifications', label: 'Appointment Reminders', desc: 'Get notified 24h and 1h before your appointments.' },
                  { key: 'newsletter', label: 'Health Newsletter', desc: 'Weekly digest of medical news and health tips from our doctors.' },
                ].map(n => (
                  <div key={n.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.1rem', background: 'var(--background)', borderRadius: 12, marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0a1628' }}>{n.label}</div>
                      <div style={{ fontSize: '0.82rem', color: '#5a7a9a', marginTop: '0.2rem' }}>{n.desc}</div>
                    </div>
                    <button
                      onClick={() => setForm({ ...form, [n.key]: !form[n.key as keyof typeof form] })}
                      style={{ width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer', background: form[n.key as keyof typeof form] ? '#1a6fbf' : '#cbd5e1', transition: 'background 0.2s', position: 'relative', flexShrink: 0 }}
                    >
                      <div style={{ width: 20, height: 20, background: '#fff', borderRadius: '50%', position: 'absolute', top: 3, left: form[n.key as keyof typeof form] ? 25 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                    </button>
                  </div>
                ))}
              </>
            )}

            {active === 'Security' && (
              <>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#0a1628', marginBottom: '1.5rem' }}>Security Settings</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                  <div style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0a1628', marginBottom: '0.35rem' }}>Current Password</label>
                    <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '0.72rem 1rem', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  </div>
                  <div />
                  <div style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0a1628', marginBottom: '0.35rem' }}>New Password</label>
                    <input type="password" placeholder="Minimum 8 characters" style={{ width: '100%', padding: '0.72rem 1rem', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0a1628', marginBottom: '0.35rem' }}>Confirm New Password</label>
                    <input type="password" placeholder="Repeat new password" style={{ width: '100%', padding: '0.72rem 1rem', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ background: '#e8f4fd', borderRadius: 10, padding: '0.9rem 1rem', fontSize: '0.85rem', color: '#1a6fbf', marginBottom: '1.2rem' }}>
                  🔒 Your data is encrypted with AES-256 and fully HIPAA-compliant.
                </div>
              </>
            )}

            {active === 'Account' && (
              <>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#0a1628', marginBottom: '1.5rem' }}>Account Management</h2>
                <div style={{ background: 'var(--background)', borderRadius: 12, padding: '1.2rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0a1628', fontSize: '0.92rem' }}>Download My Data</div>
                    <div style={{ fontSize: '0.82rem', color: '#5a7a9a' }}>Export all your health records and account data.</div>
                  </div>
                  <button style={{ background: '#e8f4fd', color: '#1a6fbf', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit' }}>Export</button>
                </div>
                <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 12, padding: '1.2rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#ef4444', fontSize: '0.92rem' }}>Sign Out</div>
                    <div style={{ fontSize: '0.82rem', color: '#5a7a9a' }}>Log out of your MediSync account on this device.</div>
                  </div>
                  <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit' }}>Sign Out</button>
                </div>
                <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 12, padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#ef4444', fontSize: '0.92rem' }}>Delete Account</div>
                    <div style={{ fontSize: '0.82rem', color: '#5a7a9a' }}>Permanently delete your account and all associated data.</div>
                  </div>
                  <button style={{ background: 'transparent', color: '#ef4444', border: '1.5px solid #ef4444', borderRadius: 8, padding: '0.5rem 1rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit' }}>Delete</button>
                </div>
              </>
            )}

            {active !== 'Account' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button onClick={save} style={{ background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', color: '#fff', border: 'none', borderRadius: 10, padding: '0.75rem 2rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'inherit' }}>
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
