import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin({ setAuthUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      if (data.user.role !== 'admin') {
        throw new Error('Access denied. You are not an administrator.');
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAuthUser(data.user);
      navigate('/admin');
    } catch(err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#1e293b' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', background: 'white' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', textAlign: 'center', marginBottom: '2rem', color: '#1e293b' }}>
          Foodie<span style={{ color: 'var(--primary-color)' }}>.</span> Admin Portal
        </h1>
        {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#475569' }}>Admin Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={{ border: '2px solid #e2e8f0' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ color: '#475569' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ border: '2px solid #e2e8f0' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
