import { useState } from 'react'
import { Link } from 'react-router-dom'

const categories = ['All', 'Supplements', 'Devices', 'Skincare', 'First Aid', 'Wellness', 'Prescriptions']

const products = [
  { id: 1, name: 'CardioGuard Omega-3', category: 'Supplements', price: '$34.99', oldPrice: '$44.99', rating: 4.8, reviews: 1204, badge: 'Best Seller', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&auto=format', desc: 'Pharmaceutical-grade omega-3 fatty acids for cardiovascular and cognitive support.' },
  { id: 2, name: 'SmartBP Monitor Pro', category: 'Devices', price: '$89.99', oldPrice: null, rating: 4.9, reviews: 876, badge: 'New', img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop&auto=format', desc: 'Clinical-accuracy blood pressure monitor with Bluetooth app sync and trend analysis.' },
  { id: 3, name: 'VitaD3 + K2 Complex', category: 'Supplements', price: '$22.50', oldPrice: null, rating: 4.7, reviews: 567, badge: null, img: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=400&fit=crop&auto=format', desc: 'Synergistic vitamin D3 and K2 formula for bone density and immune system strength.' },
  { id: 4, name: 'DermaClear SPF50 Cream', category: 'Skincare', price: '$45.00', oldPrice: '$58.00', rating: 4.8, reviews: 923, badge: 'Sale', img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop&auto=format', desc: 'Dermatologist-formulated broad-spectrum SPF50 sunscreen for sensitive and acne-prone skin.' },
  { id: 5, name: 'Advanced First Aid Kit', category: 'First Aid', price: '$55.00', oldPrice: null, rating: 4.9, reviews: 312, badge: 'Essential', img: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=400&fit=crop&auto=format', desc: '120-piece comprehensive first aid kit meeting OSHA standards for home and workplace safety.' },
  { id: 6, name: 'MindCalm Ashwagandha', category: 'Wellness', price: '$28.00', oldPrice: null, rating: 4.6, reviews: 789, badge: null, img: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&h=400&fit=crop&auto=format', desc: 'KSM-66 standardized ashwagandha root extract for cortisol reduction and stress resilience.' },
  { id: 7, name: 'GlucoTrack Sensor Kit', category: 'Devices', price: '$129.99', oldPrice: '$149.99', rating: 4.8, reviews: 445, badge: 'Sale', img: 'https://images.unsplash.com/photo-1581093806997-124204d9fa9d?w=400&h=400&fit=crop&auto=format', desc: 'Continuous glucose monitoring kit with 14-day sensors and real-time alerts.' },
  { id: 8, name: 'ProBiome Defense 50B', category: 'Supplements', price: '$38.00', oldPrice: null, rating: 4.7, reviews: 634, badge: null, img: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop&auto=format', desc: '50 billion CFU probiotic with 12 clinically validated strains for gut and immune health.' },
]

type CartItem = { id: number; name: string; price: string; qty: number }

export default function Products() {
  const [cat, setCat] = useState('All')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)

  const filtered = products.filter(p => cat === 'All' || p.category === cat)

  const addToCart = (p: typeof products[0]) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === p.id)
      if (existing) return prev.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }]
    })
  }

  const totalItems = cart.reduce((a, c) => a + c.qty, 0)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--background)', padding: '2.5rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ color: '#1a6fbf', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Medical Store</span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700, color: '#0a1628', marginTop: '0.4rem' }}>
              Certified Health Products
            </h1>
            <p style={{ color: '#5a7a9a', fontSize: '1rem', marginTop: '0.5rem' }}>FDA-reviewed, clinician-approved products delivered to your door.</p>
          </div>
          <button
            onClick={() => setShowCart(!showCart)}
            style={{ position: 'relative', background: '#1a6fbf', color: '#fff', border: 'none', borderRadius: 12, padding: '0.7rem 1.4rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            🛒 Cart
            {totalItems > 0 && (
              <span style={{ background: '#00c6ae', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Cart Dropdown */}
        {showCart && (
          <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#0a1628', marginBottom: '1rem', fontSize: '1.1rem' }}>Your Cart</h3>
            {cart.length === 0 ? (
              <p style={{ color: '#5a7a9a' }}>Your cart is empty.</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                    <span style={{ color: '#0a1628', fontWeight: 600 }}>{item.name} × {item.qty}</span>
                    <span style={{ color: '#00c6ae', fontWeight: 700 }}>{item.price}</span>
                  </div>
                ))}
                <div style={{ marginTop: '1rem' }}>
                  <Link to="/auth" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', color: '#fff', padding: '0.7rem', borderRadius: 10, fontWeight: 700 }}>
                    Proceed to Checkout
                  </Link>
                </div>
              </>
            )}
          </div>
        )}

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{ padding: '0.4rem 1rem', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, background: cat === c ? '#1a6fbf' : '#fff', color: cat === c ? '#fff' : '#1a6fbf', border: cat === c ? 'none' : '1.5px solid var(--border)', transition: 'all 0.2s', fontFamily: 'inherit' }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(p => (
            <div
              key={p.id}
              style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', transition: 'box-shadow 0.2s, transform 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(26,111,191,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
            >
              <div style={{ position: 'relative' }}>
                <img src={p.img} alt={p.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                {p.badge && (
                  <span style={{ position: 'absolute', top: 10, left: 10, background: p.badge === 'Sale' ? '#ef4444' : p.badge === 'New' ? '#00c6ae' : '#f59e0b', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: 20 }}>
                    {p.badge}
                  </span>
                )}
              </div>
              <div style={{ padding: '1.2rem' }}>
                <span style={{ display: 'inline-block', background: '#e8f4fd', color: '#1a6fbf', fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.6rem', borderRadius: 20, marginBottom: '0.5rem' }}>{p.category}</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 700, color: '#0a1628', marginBottom: '0.5rem' }}>{p.name}</h3>
                <p style={{ color: '#5a7a9a', fontSize: '0.83rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{p.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>★ {p.rating}</span>
                  <span style={{ color: '#5a7a9a', fontSize: '0.8rem' }}>({p.reviews})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0a1628' }}>{p.price}</span>
                    {p.oldPrice && <span style={{ color: '#94a3b8', fontSize: '0.85rem', marginLeft: '0.4rem', textDecoration: 'line-through' }}>{p.oldPrice}</span>}
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    style={{ background: 'linear-gradient(135deg, #1a6fbf, #00c6ae)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit' }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
