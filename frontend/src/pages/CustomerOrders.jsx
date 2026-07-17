import { useState, useEffect } from 'react';

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/user/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          // Normalize items (some might be strings if JSON parsing weirdly)
          const normalized = data.map(o => ({
            ...o, 
            items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items
          }));
          setOrders(normalized);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
    
    // Auto refresh every 10 seconds for live tracking
    const interval = setInterval(fetchMyOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const submitReview = async (restaurantId, rating, comment) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ restaurant_id: restaurantId, rating, comment })
      });
      if(res.ok) alert('Thank you for rating!');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Loading your orders...</div>;

  const STATUS_STAGES = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 className="title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Orders & Tracking</h1>
      
      {orders.length === 0 ? (
        <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders yet. Time to get hungry!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {orders.map(order => {
            const currentStageIdx = STATUS_STAGES.indexOf(order.status) !== -1 ? STATUS_STAGES.indexOf(order.status) : 0;
            const progressPercentage = ((currentStageIdx) / (STATUS_STAGES.length - 1)) * 100;
            
            // Calculate a pseudo ETA based on created_at
            const orderTime = new Date(order.created_at);
            const eta = new Date(orderTime.getTime() + 45 * 60000); // 45 mins later

            return (
              <div key={order.id} className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '2rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Order #{order.id}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{orderTime.toLocaleString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-color)' }}>${Number(order.total).toFixed(2)}</div>
                    {order.status !== 'Delivered' && order.status !== 'Canceled' && (
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>ETA: {eta.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    )}
                  </div>
                </div>

                <div style={{ padding: '1rem 0' }}>
                  {order.items && order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      <span>{item.qty}x {item.item_name} <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>({item.restaurant_name})</span></span>
                    </div>
                  ))}
                </div>

                {order.status === 'Canceled' ? (
                  <div style={{ color: 'var(--danger-color)', fontWeight: '700', textAlign: 'center', padding: '1rem', background: '#fee2e2', borderRadius: '8px' }}>
                    This order was canceled.
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      {STATUS_STAGES.map((stage, idx) => (
                        <div key={stage} style={{ 
                          fontSize: '0.85rem', 
                          fontWeight: idx <= currentStageIdx ? '700' : '500',
                          color: idx <= currentStageIdx ? '#1e293b' : '#94a3b8' 
                        }}>
                          {stage}
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: 'full', overflow: 'hidden', marginBottom: '1.5rem' }}>
                      <div style={{ 
                        height: '100%', 
                        background: 'var(--primary-color)', 
                        width: `${progressPercentage}%`,
                        transition: 'width 1s ease-in-out'
                      }}></div>
                    </div>

                    {order.status === 'Delivered' && order.items && order.items.length > 0 && (
                      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem' }}>Rate your experience</h4>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {[1,2,3,4,5].map(star => (
                            <button 
                              key={star}
                              onClick={() => {
                                const comment = prompt('Any comments? (Optional)');
                                submitReview(order.items[0].restaurant_id, star, comment);
                              }}
                              style={{ background: 'none', border: '1px solid #cbd5e1', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '1.2rem' }}
                            >⭐</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
