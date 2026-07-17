import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, LogOut } from 'lucide-react';

export default function AdminLayout({ authUser, handleLogout }) {
  const navigate = useNavigate();

  if (!authUser || authUser.role !== 'admin') {
    return (
      <div className="card" style={{ maxWidth: '400px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ color: 'var(--danger-color)' }}>Access Denied</h2>
        <p>You must be an administrator to view this page.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1rem' }}>Go Home</button>
      </div>
    );
  }

  // A sleek dark sidebar like Enatega admin panel
  const sidebarStyle = {
    width: '260px',
    background: '#1e293b', /* Slate 800 */
    color: 'white',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column'
  };

  const navLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.85rem 1rem',
    color: '#cbd5e1',
    borderRadius: '8px',
    marginBottom: '0.5rem',
    transition: 'all 0.2s'
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      <aside style={sidebarStyle}>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '3rem', color: 'white' }}>
          Foodie<span style={{ color: 'var(--primary-color)' }}>.</span> Admin
        </div>
        
        <nav style={{ flex: 1 }}>
          <Link to="/admin" style={navLinkStyle} className="hover-bg-slate">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/admin/orders" style={navLinkStyle} className="hover-bg-slate">
            <ShoppingBag size={20} /> Orders
          </Link>
        </nav>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{authUser.name}</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Administrator</div>
          </div>
          <button onClick={() => { handleLogout(); navigate('/'); }} className="btn-icon" style={{ background: 'transparent', color: '#ef4444' }}>
            <LogOut size={20} />
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: '260px', padding: '2.5rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
