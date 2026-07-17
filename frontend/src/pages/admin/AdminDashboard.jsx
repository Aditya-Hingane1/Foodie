import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalOrders: 0, revenue: 0, activeUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/admin/analytics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const statCardStyle = {
    background: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  };

  const iconStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    borderRadius: '12px',
  };

  return (
    <div>
      <h1 className="title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={statCardStyle}>
          <div style={{ ...iconStyle, background: '#d1fae5', color: '#059669' }}><DollarSign size={28} /></div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Gross Revenue</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>${stats.revenue.toFixed(2)}</div>
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={{ ...iconStyle, background: '#dbeafe', color: '#2563eb' }}><ShoppingBag size={28} /></div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Total Orders</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>{stats.totalOrders}</div>
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={{ ...iconStyle, background: '#fef3c7', color: '#d97706' }}><Users size={28} /></div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Active Customers</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>{stats.activeUsers}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
