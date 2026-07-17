import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight, MapPin, Clock, Shield } from 'lucide-react';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Burgers', 'Pizza', 'Healthy', 'Asian', 'Indian', 'Mexican', 'Desserts', 'BBQ', 'Breakfast', 'Middle Eastern', 'Italian', 'Steakhouse', 'Drinks', 'Seafood', 'French'];

  useEffect(() => {
    fetch('http://localhost:5000/api/restaurants')
      .then(res => res.json())
      .then(data => { 
        setRestaurants(data); 
        setFilteredRestaurants(data);
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  const handleFilter = (cat) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      setFilteredRestaurants(restaurants);
    } else {
      setFilteredRestaurants(restaurants.filter(r => r.category === cat));
    }
  };

  return (
    <div>

      {/* ====== HERO ====== */}
      <div className="hero">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '4rem', width: '100%', position: 'relative', zIndex: 2 }}>
          <div>
            <div className="hero-badge">
              <span>🔥</span> Now serving 20+ restaurants near you
            </div>
            <h1>Delicious food,<br /><span>delivered fast</span></h1>
            <p>Order from your favorite local restaurants — burgers, pizza, sushi, and more — delivered straight to your door in under 45 minutes.</p>
            <div className="hero-cta">
              <Link to="/restaurant/1" className="btn btn-primary btn-lg">
                Order Now <ChevronRight size={18} />
              </Link>
              <Link to="/signup" className="btn btn-ghost btn-lg">Create Account</Link>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-value">20+</div>
                <div className="hero-stat-label">Restaurants</div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              <div>
                <div className="hero-stat-value">45 min</div>
                <div className="hero-stat-label">Avg. Delivery</div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              <div>
                <div className="hero-stat-value">4.8★</div>
                <div className="hero-stat-label">Avg. Rating</div>
              </div>
            </div>
          </div>

          <div className="hero-visual" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80" alt="Delicious Food" style={{ width: '420px', height: '420px', objectFit: 'cover', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }} />
            
            <div className="floating-card card-1" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '180px' }}>
              <span style={{ fontSize: '2rem' }}>🍔</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Burger Joint</div>
                <div style={{ color: '#fbbf24', fontSize: '0.8rem' }}>★★★★★ 4.5</div>
              </div>
            </div>
            
            <div className="floating-card card-2" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '180px' }}>
              <span style={{ fontSize: '2rem' }}>🍕</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Pizza Paradise</div>
                <div style={{ color: '#4ade80', fontSize: '0.8rem' }}>⚡ 35 min delivery</div>
              </div>
            </div>

            <div className="floating-card card-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '180px' }}>
              <span style={{ fontSize: '2rem' }}>🍣</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Sushi Bliss</div>
                <div style={{ color: '#a78bfa', fontSize: '0.8rem' }}>Premium quality</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== HOW IT WORKS ====== */}
      <div className="section" style={{ background: 'white', padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-badge">Simple & Fast</div>
          <h2 className="section-title">How it works</h2>
          <p className="section-subtitle">Get your food in 3 easy steps</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            <div className="how-card">
              <div className="how-icon">🔍</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Browse Restaurants</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Explore our curated selection of top-rated local restaurants and cuisines.</p>
            </div>
            <div className="how-card">
              <div className="how-icon">🛒</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Add to Cart</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Pick your favorite dishes and customize your order to your liking.</p>
            </div>
            <div className="how-card">
              <div className="how-icon">🚀</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Fast Delivery</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Sit back and track your order live as it makes its way to your door.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ====== RESTAURANTS ====== */}
      <div className="section">
        <div className="container">
          <div className="section-badge">Explore</div>
          <h2 className="section-title">Featured Restaurants</h2>
          <p className="section-subtitle">Handpicked restaurants delivering to you right now</p>
          
          <div className="category-container">
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => handleFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading restaurants...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '2rem' }}>
              {filteredRestaurants.length > 0 ? filteredRestaurants.map((rest, idx) => (
                <Link to={`/restaurant/${rest.id}`} key={rest.id} className="pop-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="card">
                    <div style={{ overflow: 'hidden' }}>
                      <img src={rest.image} alt={rest.name} className="card-img" />
                    </div>
                    <div className="card-content">
                      <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                        <h2 className="title" style={{ margin: 0 }}>{rest.name}</h2>
                        <div className="flex items-center gap-2" style={{ background: '#fef9c3', padding: '0.2rem 0.6rem', borderRadius: '8px' }}>
                          <Star size={13} color="#f59e0b" fill="#f59e0b" />
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400e' }}>{rest.rating}</span>
                        </div>
                      </div>
                      <p className="subtitle" style={{ marginBottom: '1rem' }}>{rest.description}</p>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={13} /> 30-45 min
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <MapPin size={13} /> 1.2 km away
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                  No restaurants found in this category yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ====== WHY US ====== */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a2f 100%)', padding: '5rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div className="section-badge" style={{ background: 'rgba(22,163,74,0.2)', color: '#4ade80' }}>Why Foodie?</div>
            <h2 className="section-title" style={{ color: 'white', marginTop: '0.5rem' }}>Your hunger,<br />our priority.</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: '1.8' }}>We partner with only the best local restaurants to ensure your meal arrives fresh, hot, and exactly as you ordered it.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { icon: <Clock size={20} />, title: 'Lightning Fast Delivery', desc: 'Average of 42 minutes from order to door.' },
                { icon: <Shield size={20} />, title: 'Secure Ordering', desc: 'Your data and orders are always protected.' },
                { icon: <Star size={20} />, title: 'Quality Guaranteed', desc: 'Real verified reviews from real customers like you.' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(22,163,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ color: 'white', fontWeight: 700, marginBottom: '0.2rem' }}>{item.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80" alt="Fresh Food" style={{ width: '100%', height: '450px', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      </div>

      {/* ====== CTA BANNER ====== */}
      <div style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', padding: '5rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', letterSpacing: '-1px', marginBottom: '1rem' }}>Ready to order?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>Join thousands of happy customers and get your food delivered today.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn btn-lg" style={{ background: 'white', color: '#16a34a', fontWeight: 700, boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
              Get Started — It's Free
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg">Sign In</Link>
          </div>
        </div>
      </div>

      {/* ====== FOOTER ====== */}
      <footer className="footer">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '2rem' }}>
            <div>
              <div className="footer-logo">Foodie<span>.</span></div>
              <div className="footer-tagline">Delivering happiness, one bite at a time. Available across your neighbourhood.</div>
            </div>
            <div>
              <div className="footer-heading">Explore</div>
              <Link to="/" className="footer-link">Restaurants</Link>
              <Link to="/signup" className="footer-link">Create Account</Link>
              <Link to="/login" className="footer-link">Sign In</Link>
            </div>
            <div>
              <div className="footer-heading">Account</div>
              <Link to="/profile" className="footer-link">My Orders</Link>
              <Link to="/login" className="footer-link">Settings</Link>
              <Link to="/admin/login" className="footer-link">Admin Login</Link>
            </div>
            <div>
              <div className="footer-heading">Support</div>
              <a href="#" className="footer-link">Help Center</a>
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
            </div>
          </div>
          <hr className="footer-divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
            <span>© 2025 Foodie. All rights reserved.</span>
            <span>Made with ❤️ for great food</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
