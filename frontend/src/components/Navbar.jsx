import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function Navbar({ cartCount, authUser, handleLogout }) {
  return (
    <nav className="navbar">
      <div className="container flex items-center justify-between">
        <Link to="/" className="logo">Foodie<span>.</span></Link>
        
        {/* Nav Links */}
        <div className="flex items-center gap-4" style={{ fontSize: '0.9rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Restaurants</Link>
          {authUser && <Link to="/profile" style={{ color: 'var(--text-muted)', fontWeight: 500 }}>My Orders</Link>}
        </div>

        <div className="flex items-center gap-4">
          {authUser ? (
            <div className="flex items-center gap-4">
              <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Hi, {authUser.name.split(' ')[0]} 👋</span>
              {authUser.role === 'admin' && (
                <Link to="/admin" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Admin Panel</Link>
              )}
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn" style={{ color: 'var(--text-main)', padding: '0.4rem 1rem', background: 'transparent' }}>Log in</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '0.45rem 1.1rem', fontSize: '0.9rem' }}>Sign up</Link>
            </div>
          )}

          <Link to="/checkout" className="btn-icon" style={{ position: 'relative' }}>
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -5, right: -5,
                background: 'var(--primary-color)', color: 'white',
                fontSize: '0.65rem', fontWeight: 'bold',
                width: 18, height: 18, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
