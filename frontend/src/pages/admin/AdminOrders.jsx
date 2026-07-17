import { useState, useEffect } from 'react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      // Refresh
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h1 className="title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Order Management</h1>
      
      <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: '#64748b' }}>Order ID</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: '#64748b' }}>Customer Name</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: '#64748b' }}>Customer Email</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: '#64748b' }}>Total</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: '#64748b' }}>Payment</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: '#64748b' }}>Status</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '600', color: '#64748b' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>#{order.id}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>{order.customer_name || 'Guest'}</td>
                <td style={{ padding: '1.25rem 1.5rem', color: '#64748b' }}>{order.email || 'N/A'}</td>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: '600' }}>${Number(order.total).toFixed(2)}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span style={{
                    padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: '700',
                    background: order.payment_status === 'paid' ? '#d1fae5' : '#fee2e2',
                    color: order.payment_status === 'paid' ? '#059669' : '#dc2626'
                  }}>
                    {order.payment_status === 'paid' ? '✓ Paid' : 'Unpaid'}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    background: order.status === 'Delivered' ? '#d1fae5' : order.status === 'Pending' ? '#fef3c7' : '#dbeafe',
                    color: order.status === 'Delivered' ? '#059669' : order.status === 'Pending' ? '#d97706' : '#2563eb'
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No incoming orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
