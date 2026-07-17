import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, User, CreditCard, CheckCircle } from 'lucide-react';

export default function Checkout({ cart, cartTotal, authUser }) {
  const [formData, setFormData] = useState({ name: authUser?.name || '', address: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (document.querySelector('script[src*="razorpay"]')) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Your cart is empty!');
    if (!authUser) {
      alert('Please log in to place an order.');
      navigate('/login');
      return;
    }
    if (!formData.address.trim()) return alert('Please enter a delivery address.');

    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Razorpay SDK failed to load. Check your internet connection.');

      // Step 1 — Create Razorpay order on backend
      const orderRes = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: cartTotal }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      // Step 2 — Open Razorpay modal
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Foodie',
        description: `Order of ${cart.length} item(s)`,
        order_id: orderData.razorpay_order_id,
        handler: async (response) => {
          // Step 3 — Verify on backend and save order
          const verifyRes = await fetch('http://localhost:5000/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cart,
              total: cartTotal,
              customerDetails: formData,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) throw new Error(verifyData.error);
          setSuccess(true);
          setLoading(false);
        },
        prefill: {
          name: formData.name,
          email: authUser?.email || '',
        },
        theme: { color: '#16a34a' },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        alert(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      alert(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  // ===== SUCCESS STATE =====
  if (success) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%',
          background: '#d1fae5', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <CheckCircle size={44} color="#16a34a" />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem' }}>Order Placed! 🎉</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem' }}>
          Your payment was successful and your order is being prepared. You can track it live on the My Orders page.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/profile')} className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
            Track My Order
          </button>
          <button onClick={() => navigate('/')} className="btn btn-outline" style={{ padding: '0.85rem 2rem' }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ===== CHECKOUT FORM =====
  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1px' }}>Checkout</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Review your order and complete payment securely.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: '2.5rem', alignItems: 'start' }}>

        {/* ===== DELIVERY DETAILS ===== */}
        <form onSubmit={handlePayment}>
          <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} /> Delivery Details
            </h2>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={14} /> Delivery Address
              </label>
              <textarea
                rows="3"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter your full delivery address..."
                required
              />
            </div>
          </div>

          {/* ===== PAYMENT NOTICE ===== */}
          <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '12px',
            padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <CreditCard size={22} color="#16a34a" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, color: '#15803d', marginBottom: '0.2rem' }}>Secure Payment via Razorpay</div>
              <div style={{ fontSize: '0.85rem', color: '#166534' }}>
                You'll be redirected to Razorpay's secure checkout to pay with UPI, Card, Netbanking, or Wallet.
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || cart.length === 0}
            style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '⏳ Processing...' : `Pay ₹${cartTotal.toFixed(2)} with Razorpay`}
          </button>
        </form>

        {/* ===== ORDER SUMMARY ===== */}
        <div>
          <div className="card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={18} /> Order Summary
            </h2>

            {cart.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>Your cart is empty.</p>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span style={{ background: 'var(--primary-light)', color: 'var(--primary-color)',
                          fontWeight: 700, fontSize: '0.8rem', width: '24px', height: '24px',
                          borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {item.qty}
                        </span>
                        <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{item.name}</span>
                      </div>
                      <span style={{ fontWeight: 700 }}>₹{(Number(item.price) * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span>Delivery fee</span>
                    <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Free</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem',
                    paddingTop: '1rem', borderTop: '2px solid var(--border-color)' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Total</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary-color)' }}>
                      ₹{cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            🔒 256-bit SSL encrypted · Powered by Razorpay
          </div>
        </div>

      </div>
    </div>
  );
}
