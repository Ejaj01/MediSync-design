import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const suggestions = [
  'What are symptoms of high blood pressure?',
  'How can I improve my sleep quality?',
  'What vitamins should I take daily?',
  'When should I see a cardiologist?',
  'How to manage type 2 diabetes?',
]

const botReplies: Record<string, string> = {
  'blood pressure': 'High blood pressure (hypertension) symptoms can include severe headaches, shortness of breath, nosebleeds, flushing, dizziness, and chest pain. Many people have no symptoms at all — that is why it is called the "silent killer." I recommend regular monitoring and consulting with one of our cardiologists if you are concerned.',
  'sleep': 'Improving sleep quality involves maintaining a consistent sleep schedule, keeping your bedroom cool and dark, avoiding screens 1 hour before bed, limiting caffeine after 2 PM, and practicing relaxation techniques. If insomnia persists beyond 3 weeks, a sleep specialist may help.',
  'vitamin': 'The core daily supplements most adults benefit from include: Vitamin D3 (1000–2000 IU), Magnesium glycinate (300–400mg), Omega-3 fatty acids (1–2g EPA+DHA), and a quality B-complex. Always consult a physician before starting new supplements.',
  'cardiologist': 'You should see a cardiologist if you experience: chest pain or tightness, unexplained shortness of breath, irregular heartbeat, dizziness or fainting, a family history of heart disease, or risk factors like diabetes or high cholesterol.',
  'diabetes': 'Managing type 2 diabetes centers on: maintaining blood glucose in target range, following a low-glycemic diet rich in fiber, regular aerobic exercise (150+ min/week), monitoring HbA1c every 3 months, and consistent medication adherence.',
}

function getBotReply(msg: string, userName?: string): string {
  const lower = msg.toLowerCase()
  const prefix = userName ? `Hi ${userName.split(' ')[0]}! ` : ''
  for (const key of Object.keys(botReplies)) {
    if (lower.includes(key)) return prefix + botReplies[key]
  }
  return `${prefix}Thank you for your question about "${msg}". Based on general medical guidelines, I recommend consulting with one of our specialist physicians who can review your complete medical history and provide personalized advice. Would you like me to connect you with an available doctor?`
}

const nowStr = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export default function Chatbot() {
  const { user, chatHistory, addChatMsg } = useAuth()
  const [localMessages, setLocalMessages] = useState(() =>
    chatHistory.length > 0 ? chatHistory : [{
      role: 'bot' as const,
      text: user
        ? `Hello ${user.name.split(' ')[0]}! I'm MediSync AI, your personal health assistant. I can see your health profile — blood type ${user.bloodType}, known allergies: ${user.allergies}. How can I help you today?`
        : "Hello! I'm MediSync AI, your personal health assistant. I can help you understand symptoms, suggest specialists, and answer health questions. How can I help you today?",
      time: nowStr(),
    }]
  )
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [localMessages, typing])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg = { role: 'user' as const, text: text.trim(), time: nowStr() }
    setLocalMessages(prev => [...prev, userMsg])
    addChatMsg(userMsg)
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const botMsg = { role: 'bot' as const, text: getBotReply(text, user?.name), time: nowStr() }
      setLocalMessages(prev => [...prev, botMsg])
      addChatMsg(botMsg)
    }, 1200 + Math.random() * 800)
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', width: '100%', padding: '2rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', borderRadius: '16px 16px 0 0', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 50, height: 50, background: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
            🤖
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: '#fff', margin: 0 }}>MediSync AI Assistant</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
              <div style={{ width: 8, height: 8, background: '#7fffda', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>
                {user ? `Personalized for ${user.name.split(' ')[0]}` : 'Online — Clinical AI'}
              </span>
            </div>
          </div>
          {user && (
            <img src={user.avatar} alt={user.name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.4)' }} />
          )}
          <Link to="/doctors" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
            See a Doctor →
          </Link>
        </div>

        {/* User health context banner */}
        {user && (
          <div style={{ background: '#fff8e8', borderBottom: '1px solid #fcd34d', padding: '0.6rem 1.5rem', display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: '#92400e', fontWeight: 600, borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', flexWrap: 'wrap' }}>
            <span>🩸 Blood: {user.bloodType}</span>
            <span>⚠️ Allergies: {user.allergies}</span>
            <span>🏥 Conditions: {user.conditions}</span>
            <Link to="/profile" style={{ marginLeft: 'auto', color: '#1a6fbf', textDecoration: 'none', fontWeight: 700 }}>Update Profile →</Link>
          </div>
        )}

        {/* Chat Area */}
        <div style={{ background: '#fff', flex: 1, padding: '1.5rem', overflowY: 'auto', maxHeight: user ? '52vh' : '60vh', minHeight: 280, display: 'flex', flexDirection: 'column', gap: '1.2rem', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
          {localMessages.map((m, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                {m.role === 'user' && user
                  ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', background: m.role === 'bot' ? 'linear-gradient(135deg, #1a6fbf, #00c6ae)' : '#e8f4fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{m.role === 'bot' ? '🤖' : '👤'}</div>
                }
              </div>
              <div style={{ maxWidth: '78%' }}>
                <div style={{ background: m.role === 'bot' ? 'var(--background)' : 'linear-gradient(135deg, #1a6fbf, #00c6ae)', borderRadius: m.role === 'bot' ? '4px 16px 16px 16px' : '16px 4px 16px 16px', padding: '0.9rem 1.1rem', color: m.role === 'bot' ? '#0a1628' : '#fff', fontSize: '0.92rem', lineHeight: 1.7 }}>
                  {m.text}
                </div>
                <div style={{ fontSize: '0.73rem', color: '#5a7a9a', marginTop: '0.25rem', textAlign: m.role === 'user' ? 'right' : 'left' }}>{m.time}</div>
              </div>
            </div>
          ))}

          {typing && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🤖</div>
              <div style={{ background: 'var(--background)', borderRadius: '4px 16px 16px 16px', padding: '0.9rem 1.2rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#1a6fbf', animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        <div style={{ background: '#f8faff', padding: '0.9rem 1.5rem', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => sendMessage(s)} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: '0.3rem 0.8rem', fontSize: '0.8rem', color: '#1a6fbf', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ background: '#fff', borderRadius: '0 0 16px 16px', padding: '1rem 1.5rem', border: '1px solid var(--border)', borderTop: 'none', display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder={user ? `Ask your health question, ${user.name.split(' ')[0]}...` : 'Ask about symptoms, medications, or health advice...'}
            style={{ flex: 1, border: '1.5px solid var(--border)', borderRadius: 10, padding: '0.7rem 1rem', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', color: '#0a1628' }}
          />
          <button onClick={() => sendMessage(input)} disabled={!input.trim()} style={{ background: input.trim() ? 'linear-gradient(135deg, #1a6fbf, #00c6ae)' : '#e2e8f0', color: input.trim() ? '#fff' : '#94a3b8', border: 'none', borderRadius: 10, padding: '0.7rem 1.4rem', fontWeight: 700, cursor: input.trim() ? 'pointer' : 'not-allowed', fontSize: '0.95rem', fontFamily: 'inherit', transition: 'all 0.2s' }}>
            Send
          </button>
        </div>

        <p style={{ textAlign: 'center', color: '#5a7a9a', fontSize: '0.78rem', marginTop: '0.75rem' }}>
          ⚠️ MediSync AI provides general health information only and is not a substitute for professional medical advice.
        </p>
      </div>

      <style>{`
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </main>
  )
}
