import { Link } from 'react-router-dom'

const stats = [
  { value: '12,000+', label: 'Patients Served' },
  { value: '350+', label: 'Specialist Doctors' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'AI Support' },
]

const services = [
  {
    icon: '🤖',
    title: 'AI Health Assistant',
    desc: 'Get instant medical guidance, symptom checks, and personalized health advice powered by advanced AI.',
    link: '/chatbot',
    cta: 'Start Chat',
  },
  {
    icon: '👨‍⚕️',
    title: 'Expert Doctors',
    desc: 'Connect with verified specialists across cardiology, neurology, orthopedics, and 40+ more departments.',
    link: '/doctors',
    cta: 'Find Doctors',
  },
  {
    icon: '💊',
    title: 'Medical Products',
    desc: 'Shop certified medical supplies, wellness products, and prescription medications — delivered to your door.',
    link: '/products',
    cta: 'Browse Products',
  },
]

const ads = [
  {
    bg: 'linear-gradient(135deg, #1a6fbf 0%, #0d4a8a 100%)',
    badge: 'Special Offer',
    title: 'Free Annual Health Checkup',
    desc: 'Book a comprehensive health screening package for you and your family. Limited slots available.',
    cta: 'Book Now — Free',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=280&fit=crop&auto=format',
  },
  {
    bg: 'linear-gradient(135deg, #00c6ae 0%, #008f7e 100%)',
    badge: 'New Service',
    title: 'Telehealth Consultations',
    desc: 'See a doctor from home in under 15 minutes. Available 24/7 with board-certified physicians.',
    cta: 'Try Telehealth',
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=280&fit=crop&auto=format',
  },
]

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Patient — Cardiology',
    text: "MediSync connected me with a cardiologist within hours. The AI chatbot identified my symptoms accurately and guided me to the right specialist.",
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format',
    stars: 5,
  },
  {
    name: 'James Okonkwo',
    role: 'Patient — Orthopedics',
    text: "The online prescription service saved me so much time. Products were delivered next day, and the doctor consultation was seamless.",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format',
    stars: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Patient — Pediatrics',
    text: "As a parent, having 24/7 AI support for my children's health questions is invaluable. The doctors are responsive and genuinely caring.",
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format',
    stars: 5,
  },
]

export default function Home() {
  return (
    <main style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ position: 'relative', background: 'linear-gradient(150deg, #0a1628 0%, #1a3a6b 50%, #1a6fbf 100%)', padding: '5rem 1.5rem 4rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(0,198,174,0.08) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', position: 'relative' }}>
          <div>
            <span style={{ display: 'inline-block', background: 'rgba(0,198,174,0.2)', color: '#00c6ae', padding: '0.3rem 0.9rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.2rem', border: '1px solid rgba(0,198,174,0.3)' }}>
              Healthcare Reimagined
            </span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 700, color: '#ffffff', lineHeight: 1.15, marginBottom: '1.25rem' }}>
              Your Complete<br />
              <span style={{ color: '#00c6ae' }}>Medical Platform</span><br />
              — All in One Place
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 480 }}>
              From AI-powered symptom checks to connecting with world-class specialists and ordering certified medications — MediSync is your health partner, always available.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/chatbot" style={{ textDecoration: 'none', padding: '0.8rem 1.8rem', background: '#00c6ae', borderRadius: 10, fontWeight: 700, color: '#fff', fontSize: '1rem', transition: 'transform 0.2s' }}>
                Talk to AI Doctor
              </Link>
              <Link to="/doctors" style={{ textDecoration: 'none', padding: '0.8rem 1.8rem', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 10, fontWeight: 600, color: '#fff', fontSize: '1rem' }}>
                Find a Specialist
              </Link>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=620&h=480&fit=crop&auto=format"
              alt="Medical professionals collaborating"
              style={{ width: '100%', borderRadius: 20, boxShadow: '0 32px 80px rgba(0,0,0,0.4)', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', bottom: -20, left: -20, background: '#fff', borderRadius: 14, padding: '1rem 1.4rem', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🤖</div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#5a7a9a', fontWeight: 600 }}>AI Response Time</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1a6fbf' }}>&lt; 2 seconds</div>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){section > div { grid-template-columns: 1fr !important; }}`}</style>
      </section>

      {/* Stats */}
      <section style={{ background: '#ffffff', padding: '2.5rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
          {stats.map(s => (
            <div key={s.label} style={{ padding: '1rem' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, color: '#1a6fbf' }}>{s.value}</div>
              <div style={{ color: '#5a7a9a', fontSize: '0.9rem', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:600px){section > div { grid-template-columns: 1fr 1fr !important; }}`}</style>
      </section>

      {/* Services */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--background)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: '#1a6fbf', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Our Services</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: '#0a1628', marginTop: '0.5rem' }}>
              Everything You Need for Better Health
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {services.map(s => (
              <div key={s.title} style={{ background: '#fff', borderRadius: 16, padding: '2rem', border: '1px solid var(--border)', transition: 'box-shadow 0.2s, transform 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(26,111,191,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#0a1628', marginBottom: '0.75rem' }}>{s.title}</h3>
                <p style={{ color: '#5a7a9a', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>{s.desc}</p>
                <Link to={s.link} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#1a6fbf', fontWeight: 700, fontSize: '0.9rem' }}>
                  {s.cta} →
                </Link>
              </div>
            ))}
          </div>
          <style>{`@media(max-width:768px){div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }}`}</style>
        </div>
      </section>

      {/* Ads / Promotions */}
      <section style={{ padding: '3rem 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '1.5rem', color: '#0a1628' }}>
            Current Offers
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {ads.map(ad => (
              <div key={ad.title} style={{ background: ad.bg, borderRadius: 20, padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0.25rem 0.75rem', borderRadius: 20, display: 'inline-block', marginBottom: '0.75rem' }}>{ad.badge}</span>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem' }}>{ad.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>{ad.desc}</p>
                  <Link to="/auth" style={{ textDecoration: 'none', display: 'inline-block', background: '#fff', color: '#1a6fbf', padding: '0.55rem 1.3rem', borderRadius: 8, fontWeight: 700, fontSize: '0.9rem' }}>
                    {ad.cta}
                  </Link>
                </div>
                <img src={ad.img} alt={ad.title} style={{ width: 160, height: 140, objectFit: 'cover', borderRadius: 12, flexShrink: 0 }} />
              </div>
            ))}
          </div>
          <style>{`@media(max-width:768px){div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }}`}</style>
        </div>
      </section>

      {/* About RE SEEN */}
      <section style={{ padding: '5rem 1.5rem', background: 'linear-gradient(180deg, var(--background) 0%, #e8f4fd 100%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=580&h=480&fit=crop&auto=format"
              alt="Medical team at MediSync"
              style={{ width: '100%', borderRadius: 20, objectFit: 'cover', boxShadow: '0 20px 60px rgba(26,111,191,0.15)' }}
            />
            <div style={{ position: 'absolute', top: -16, right: -16, background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', borderRadius: 14, padding: '1.2rem 1.5rem', color: '#fff', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700 }}>RE SEEN</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.85, letterSpacing: '0.05em' }}>CERTIFIED PARTNER</div>
            </div>
          </div>
          <div>
            <span style={{ color: '#1a6fbf', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>About RE SEEN</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 700, color: '#0a1628', marginTop: '0.6rem', marginBottom: '1.2rem', lineHeight: 1.2 }}>
              Precision Medicine,<br />Human Touch
            </h2>
            <p style={{ color: '#5a7a9a', fontSize: '1rem', lineHeight: 1.8, marginBottom: '1rem' }}>
              RE SEEN is MediSync's founding partner — a network of precision-care clinics committed to seeing every patient as a whole person, not just a diagnosis. With over a decade of clinical research and evidence-based practices, RE SEEN brings hospital-grade care directly to your screen.
            </p>
            <p style={{ color: '#5a7a9a', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
              Our doctors are board-certified across 45+ specialties. Every recommendation is backed by real clinical data, reviewed by senior physicians, and tailored to your unique health profile.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              {[['45+', 'Specialties'], ['ISO 27001', 'Data Security'], ['HIPAA', 'Compliant'], ['10 Years', 'Clinical Research']].map(([v, l]) => (
                <div key={l} style={{ background: '#fff', borderRadius: 12, padding: '1rem', border: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: '#1a6fbf' }}>{v}</div>
                  <div style={{ fontSize: '0.82rem', color: '#5a7a9a', fontWeight: 600 }}>{l}</div>
                </div>
              ))}
            </div>
            <Link to="/doctors" style={{ textDecoration: 'none', display: 'inline-block', background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', color: '#fff', padding: '0.8rem 2rem', borderRadius: 10, fontWeight: 700, fontSize: '1rem' }}>
              Meet Our Doctors
            </Link>
          </div>
        </div>
        <style>{`@media(max-width:768px){section > div { grid-template-columns: 1fr !important; }}`}</style>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '5rem 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: '#1a6fbf', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Patient Stories</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: '#0a1628', marginTop: '0.5rem' }}>
              Real People, Real Results
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {testimonials.map(t => (
              <div key={t.name} style={{ background: 'var(--background)', borderRadius: 16, padding: '1.75rem', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {Array(t.stars).fill(0).map((_, i) => (
                    <span key={i} style={{ color: '#f59e0b', fontSize: '1rem' }}>★</span>
                  ))}
                </div>
                <p style={{ color: '#0a1628', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={t.avatar} alt={t.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0a1628' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#5a7a9a' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <style>{`@media(max-width:768px){div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }}`}</style>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ padding: '4rem 1.5rem', background: 'linear-gradient(135deg, #0a1628 0%, #1a3a6b 100%)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
          Ready to Take Control of Your Health?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', marginBottom: '2rem', maxWidth: 520, margin: '0 auto 2rem' }}>
          Join over 12,000 patients who trust MediSync for their complete healthcare journey.
        </p>
        <Link to="/auth?tab=register" style={{ textDecoration: 'none', display: 'inline-block', background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', color: '#fff', padding: '0.9rem 2.5rem', borderRadius: 12, fontWeight: 700, fontSize: '1.05rem' }}>
          Create Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0a1628', padding: '2rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Medi<span style={{ color: '#00c6ae' }}>Sync</span></span>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Terms of Service', 'Contact Us', 'Accessibility'].map(item => (
              <span key={item} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', cursor: 'pointer' }}>{item}</span>
            ))}
          </div>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>© 2026 MediSync. All rights reserved.</span>
        </div>
      </footer>
    </main>
  )
}
