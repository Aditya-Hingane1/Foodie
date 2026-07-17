import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';

export default function RestaurantMenu({ addToCart }) {
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:5000/api/restaurants/${id}/menu`).then(res => res.json()),
      fetch(`http://localhost:5000/api/restaurants/${id}/reviews`).then(res => res.json())
    ])
    .then(([menuData, reviewsData]) => {
      setMenuItems(menuData);
      setReviews(reviewsData);
      setLoading(false);
    })
    .catch(err => console.error(err));
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading restaurant...</div>;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <Link to="/" className="flex items-center gap-2" style={{ color: 'var(--text-muted)', marginBottom: '2rem', display: 'inline-flex' }}>
        <ArrowLeft size={16} /> Back to restaurants
      </Link>
      
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontWeight: 700 }}>Menu</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {menuItems.map(item => (
          <div key={item.id} className="card" style={{ flexDirection: 'row', height: '140px' }}>
            <img src={item.image} alt={item.name} style={{ width: '120px', height: '100%', objectFit: 'cover' }} />
            <div className="card-content flex" style={{ padding: '1rem', flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
              <h3 className="title" style={{ fontSize: '1.1rem', margin: 0 }}>{item.name}</h3>
              <p className="subtitle" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
              <div className="flex justify-between items-center" style={{ marginTop: 'auto' }}>
                <span style={{ fontWeight: 600, color: 'var(--success-color)' }}>${Number(item.price).toFixed(2)}</span>
                <button className="btn-icon" onClick={() => addToCart(item)} style={{ background: 'var(--primary-color)', color: 'white', width: '32px', height: '32px' }}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {menuItems.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No items found for this restaurant.</div>
      )}

      <div style={{ marginTop: '4rem', borderTop: '1px solid #e2e8f0', paddingTop: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', fontWeight: 700 }}>Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>This restaurant has no reviews yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {reviews.map(review => (
              <div key={review.id} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>{review.user_name}</span>
                  <span style={{ color: '#fbbf24' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                </div>
                <p style={{ color: '#475569', fontSize: '0.95rem' }}>{review.comment || <i>No comment provided.</i>}</p>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '1rem' }}>
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
