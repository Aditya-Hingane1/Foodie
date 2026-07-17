import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, ShoppingBag, ChevronRight, TrendingUp } from 'lucide-react';

export default function HomeLoggedIn({ authUser }) {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Burgers', 'Pizza', 'Healthy', 'Asian', 'Indian', 'Mexican', 'Desserts', 'BBQ', 'Breakfast', 'Middle Eastern', 'Italian', 'Steakhouse', 'Drinks', 'Seafood', 'French'];

  const STATUS_COLORS = {
    'Pending':         { bg: '#fef3c7', color: '#d97706' },
    'Preparing':       { bg: '#dbeafe', color: '#2563eb' },
    'Out for Delivery':{ bg: '#f3e8ff', color: '#7c3aed' },
    'Delivered':       { bg: '#d1fae5', color: '#059669' },
    'Canceled':        { bg: '#fee2e2', color: '#dc2626' },
  };

  const getTimeOfDay = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    Promise.all([
      fetch('http://localhost:5000/api/restaurants').then(r => r.json()),
      fetch('http://localhost:5000/api/reviews/latest').then(r => r.json()),
      fetch('http://localhost:5000/api/user/orders', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json()),
    ]).then(([rests, revs, orders]) => {
      setRestaurants(rests);
      setFilteredRestaurants(rests);
      setLatestReviews(revs);
      // Show only 2 most recent active orders
      const active = (Array.isArray(orders) ? orders : [])
        .filter(o => o.status !== 'Delivered' && o.status !== 'Canceled')
        .slice(0, 2);
      setRecentOrders(active);
      setLoading(false);
    }).catch(() => setLoading(false));
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
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh' }}>

      {/* ===== PERSONALISED HEADER ===== */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a2f 100%)',
        padding: '3rem 0 5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow */}
        <div style={{ position:'absolute', top:'-30%', right:'-5%', width:'500px', height:'500px',
          background:'radial-gradient(circle, rgba(22,163,74,0.2) 0%, transparent 70%)',
          borderRadius:'50%', pointerEvents:'none' }} />

        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <p style={{ color:'#4ade80', fontWeight:600, fontSize:'0.95rem', marginBottom:'0.5rem' }}>
            {getTimeOfDay()},
          </p>
          <h1 style={{ fontSize:'clamp(2rem,5vw,3rem)', fontWeight:900, color:'white',
            letterSpacing:'-1.5px', marginBottom:'0.75rem' }}>
            {authUser.name.split(' ')[0]} 👋
          </h1>
          <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'1.05rem' }}>
            What are you craving today?
          </p>

          {/* Quick-action chips */}
          <div style={{ display:'flex', gap:'0.75rem', marginTop:'2rem', flexWrap:'wrap' }}>
            {[
              { emoji:'🍔', label:'Burgers', to:'/restaurant/1' },
              { emoji:'🍕', label:'Pizza',   to:'/restaurant/2' },
              { emoji:'🥗', label:'Healthy', to:'/restaurant/3' },
              { emoji:'🍣', label:'Sushi',   to:'/restaurant/4' },
            ].map(c => (
              <Link key={c.label} to={c.to} style={{
                display:'flex', alignItems:'center', gap:'0.5rem',
                background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.14)',
                color:'white', padding:'0.55rem 1.1rem', borderRadius:'999px',
                fontSize:'0.9rem', fontWeight:600, transition:'all 0.2s',
                backdropFilter:'blur(6px)'
              }}>
                {c.emoji} {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'0 1.5rem', marginTop:'-2.5rem', paddingBottom:'4rem' }}>

        {/* ===== ACTIVE ORDERS BANNER ===== */}
        {recentOrders.length > 0 && (
          <div style={{ marginBottom:'2.5rem' }}>
            <h2 style={{ fontSize:'1.25rem', fontWeight:800, marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <TrendingUp size={20} color="var(--primary-color)" /> Active Orders
            </h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              {recentOrders.map(order => {
                const STATUS_STAGES = ['Pending','Preparing','Out for Delivery','Delivered'];
                const idx = STATUS_STAGES.indexOf(order.status);
                const pct = ((idx < 0 ? 0 : idx) / (STATUS_STAGES.length - 1)) * 100;
                const col = STATUS_COLORS[order.status] || { bg:'#f1f5f9', color:'#64748b' };
                return (
                  <div key={order.id} style={{
                    background:'white', borderRadius:'16px', padding:'1.5rem',
                    boxShadow:'0 4px 20px rgba(0,0,0,0.06)', border:'1px solid var(--border-color)',
                    display:'flex', alignItems:'center', gap:'1.5rem', flexWrap:'wrap'
                  }}>
                    <div style={{ flex:1, minWidth:'200px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.75rem' }}>
                        <span style={{ fontWeight:800, fontSize:'1rem' }}>Order #{order.id}</span>
                        <span style={{ padding:'0.2rem 0.75rem', borderRadius:'999px', fontSize:'0.78rem',
                          fontWeight:700, background:col.bg, color:col.color }}>
                          {order.status}
                        </span>
                      </div>
                      <div style={{ height:'6px', background:'#e2e8f0', borderRadius:'999px', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${pct}%`, background:'var(--primary-color)',
                          transition:'width 0.8s ease', borderRadius:'999px' }} />
                      </div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:'1.25rem', fontWeight:900, color:'var(--primary-color)' }}>
                        ${Number(order.total).toFixed(2)}
                      </div>
                      <Link to="/profile" style={{ display:'flex', alignItems:'center', gap:'0.2rem',
                        color:'var(--text-muted)', fontSize:'0.85rem', marginTop:'0.25rem', justifyContent:'flex-end' }}>
                        Track order <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== CATEGORY FILTER ===== */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
          <h2 style={{ fontSize:'1.4rem', fontWeight:800 }}>Explore Cuisines</h2>
        </div>
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

        {/* ===== RESTAURANT GRID ===== */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
          <h2 style={{ fontSize:'1.4rem', fontWeight:800 }}>Restaurants for you</h2>
          <span style={{ color:'var(--text-muted)', fontSize:'0.9rem' }}>{filteredRestaurants.length} matches</span>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'3rem', color:'var(--text-muted)' }}>Loading restaurants...</div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(290px,1fr))', gap:'1.75rem' }}>
            {filteredRestaurants.length > 0 ? filteredRestaurants.map((rest, idx) => (
              <Link to={`/restaurant/${rest.id}`} key={rest.id} className="pop-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="card">
                  <div style={{ overflow:'hidden' }}>
                    <img src={rest.image} alt={rest.name} className="card-img" />
                  </div>
                  <div className="card-content">
                    <div className="flex justify-between items-center" style={{ marginBottom:'0.4rem' }}>
                      <h3 className="title" style={{ margin:0 }}>{rest.name}</h3>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.3rem',
                        background:'#fef9c3', padding:'0.2rem 0.6rem', borderRadius:'8px' }}>
                        <Star size={12} color="#f59e0b" fill="#f59e0b" />
                        <span style={{ fontSize:'0.82rem', fontWeight:700, color:'#92400e' }}>{rest.rating}</span>
                      </div>
                    </div>
                    <p className="subtitle" style={{ marginBottom:'1rem' }}>{rest.description}</p>
                    <div style={{ display:'flex', gap:'1rem', fontSize:'0.8rem', color:'var(--text-muted)', marginTop:'auto' }}>
                      <span style={{ display:'flex', alignItems:'center', gap:'0.3rem' }}><Clock size={12}/> 30-45 min</span>
                      <span style={{ display:'flex', alignItems:'center', gap:'0.3rem' }}><MapPin size={12}/> 1.2 km</span>
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
        {/* ===== WHAT PEOPLE ARE SAYING ===== */}
        {latestReviews.length > 0 && (
          <div style={{ marginTop:'4rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <div>
                <h2 style={{ fontSize:'1.4rem', fontWeight:800 }}>What people are saying</h2>
                <p style={{ color:'var(--text-muted)', fontSize:'0.95rem' }}>Recent reviews from the Foodie community</p>
              </div>
            </div>
            <div className="review-grid">
              {latestReviews.map(rev => (
                <div key={rev.id} className="review-card">
                  <div className="review-header">
                    <span className="review-user">{rev.user_name}</span>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < rev.rating ? "#fbbf24" : "none"} stroke={i < rev.rating ? "#fbbf24" : "#e2e8f0"} />
                      ))}
                    </div>
                  </div>
                  <p className="review-comment">"{rev.comment}"</p>
                  <div className="review-footer">
                    <span>on <span className="review-rest-name">{rev.restaurant_name}</span></span>
                    <span>{new Date(rev.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== MY ORDERS CTA ===== */}
        <div style={{
          marginTop:'3rem', background:'linear-gradient(135deg, #16a34a, #15803d)',
          borderRadius:'20px', padding:'2.5rem', display:'flex',
          justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1.5rem'
        }}>
          <div>
            <h3 style={{ color:'white', fontSize:'1.4rem', fontWeight:800, marginBottom:'0.4rem' }}>
              View your full order history
            </h3>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.95rem' }}>
              Track active deliveries, check past meals, and leave reviews.
            </p>
          </div>
          <Link to="/profile" className="btn" style={{
            background:'white', color:'#16a34a', fontWeight:700,
            padding:'0.85rem 2rem', boxShadow:'0 8px 20px rgba(0,0,0,0.15)',
            display:'flex', alignItems:'center', gap:'0.5rem', flexShrink:0
          }}>
            <ShoppingBag size={18} /> My Orders
          </Link>
        </div>

      </div>
    </div>
  );
}
