import { useState } from 'react'
import { Link } from 'react-router-dom'

const specialties = ['All', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Oncology', 'Psychiatry']

const doctors = [
  { id: 1, name: 'Dr. Elena Vasquez', specialty: 'Cardiology', rating: 4.9, reviews: 312, exp: '18 yrs', fee: '$150', available: true, img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=280&h=280&fit=crop&auto=format', bio: 'Board-certified cardiologist specializing in interventional cardiology and heart failure management.' },
  { id: 2, name: 'Dr. Marcus Chen', specialty: 'Neurology', rating: 4.8, reviews: 278, exp: '15 yrs', fee: '$180', available: true, img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=280&h=280&fit=crop&auto=format', bio: 'Expert neurologist focused on stroke prevention, epilepsy, and movement disorders.' },
  { id: 3, name: 'Dr. Amara Osei', specialty: 'Pediatrics', rating: 4.9, reviews: 445, exp: '12 yrs', fee: '$120', available: true, img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=280&h=280&fit=crop&auto=format', bio: 'Compassionate pediatrician dedicated to child wellness from newborns through adolescents.' },
  { id: 4, name: 'Dr. Raj Patel', specialty: 'Orthopedics', rating: 4.7, reviews: 198, exp: '20 yrs', fee: '$200', available: false, img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=280&h=280&fit=crop&auto=format', bio: 'Orthopedic surgeon specializing in sports injuries, joint replacement, and spine surgery.' },
  { id: 5, name: 'Dr. Sophia Laurent', specialty: 'Dermatology', rating: 4.8, reviews: 356, exp: '10 yrs', fee: '$140', available: true, img: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=280&h=280&fit=crop&auto=format', bio: 'Dermatologist specializing in medical and cosmetic dermatology, skin cancer screenings.' },
  { id: 6, name: 'Dr. James Adeyemi', specialty: 'Oncology', rating: 4.9, reviews: 189, exp: '22 yrs', fee: '$220', available: true, img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=280&h=280&fit=crop&auto=format', bio: 'Oncologist with deep expertise in breast cancer, lymphoma, and precision immunotherapy.' },
  { id: 7, name: 'Dr. Mei Lin Zhang', specialty: 'Psychiatry', rating: 4.7, reviews: 234, exp: '14 yrs', fee: '$160', available: true, img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=280&h=280&fit=crop&auto=format', bio: 'Psychiatrist specializing in anxiety, depression, PTSD, and integrative mental health.' },
  { id: 8, name: 'Dr. Omar Hassan', specialty: 'Cardiology', rating: 4.8, reviews: 267, exp: '16 yrs', fee: '$165', available: false, img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=280&h=280&fit=crop&auto=format', bio: 'Cardiologist focused on preventive cardiology, echocardiography, and cardiac rehab.' },
]

export default function Doctors() {
  const [selected, setSelected] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = doctors.filter(d =>
    (selected === 'All' || d.specialty === selected) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)', padding: '2.5rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ color: '#1a6fbf', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Our Network</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, color: '#0a1628', marginTop: '0.4rem' }}>
            Find Your Specialist
          </h1>
          <p style={{ color: '#5a7a9a', fontSize: '1rem', marginTop: '0.5rem' }}>
            Browse 350+ board-certified doctors across 45 specialties. Book in minutes.
          </p>
        </div>

        {/* Filters */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Search by doctor name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: '0.95rem', marginBottom: '1rem', outline: 'none', color: '#0a1628', fontFamily: 'inherit' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {specialties.map(s => (
              <button
                key={s}
                onClick={() => setSelected(s)}
                style={{
                  padding: '0.4rem 1rem', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600,
                  background: selected === s ? '#1a6fbf' : '#e8f4fd',
                  color: selected === s ? '#fff' : '#1a6fbf',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(doc => (
            <div
              key={doc.id}
              style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', transition: 'box-shadow 0.2s, transform 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(26,111,191,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
            >
              <div style={{ position: 'relative' }}>
                <img src={doc.img} alt={doc.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: 12, right: 12, background: doc.available ? '#00c6ae' : '#e2e8f0', color: doc.available ? '#fff' : '#94a3b8', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.7rem', borderRadius: 20 }}>
                  {doc.available ? 'Available' : 'Busy'}
                </span>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: '#0a1628', marginBottom: '0.25rem' }}>{doc.name}</h3>
                <span style={{ display: 'inline-block', background: '#e8f4fd', color: '#1a6fbf', fontSize: '0.78rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: 20, marginBottom: '0.75rem' }}>{doc.specialty}</span>
                <p style={{ color: '#5a7a9a', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>{doc.bio}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#0a1628', fontWeight: 600 }}>⭐ {doc.rating} <span style={{ color: '#5a7a9a', fontWeight: 400 }}>({doc.reviews})</span></span>
                  <span style={{ color: '#5a7a9a' }}>{doc.exp} exp</span>
                  <span style={{ fontWeight: 700, color: '#00c6ae' }}>{doc.fee}</span>
                </div>
                <Link
                  to="/auth"
                  style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '0.6rem', background: doc.available ? 'linear-gradient(135deg, #1a6fbf, #00c6ae)' : '#e2e8f0', color: doc.available ? '#fff' : '#94a3b8', borderRadius: 10, fontWeight: 700, fontSize: '0.9rem' }}
                >
                  {doc.available ? 'Book Appointment' : 'Join Waitlist'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#5a7a9a' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p>No doctors found matching your search.</p>
          </div>
        )}
      </div>
    </main>
  )
}
