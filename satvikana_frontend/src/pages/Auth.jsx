import React, { useState } from 'react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errorMSG, setErrorMSG] = useState('');
  const [successMSG, setSuccessMSG] = useState('');
  
  const token = localStorage.getItem('satvikana_token');
  const userStr = localStorage.getItem('satvikana_user');
  const user = userStr ? JSON.parse(userStr) : null;

  const inputStyle = {
    padding: '15px',
    background: 'var(--bg-color)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    borderRadius: '8px',
    fontFamily: 'inherit',
    fontSize: '1rem',
    outline: 'none',
    transition: 'var(--transition)'
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem('satvikana_token');
    localStorage.removeItem('satvikana_user');
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMSG('');
    setSuccessMSG('');
    
    const url = isLogin 
      ? 'http://127.0.0.1:8000/api/auth/login/' 
      : 'http://127.0.0.1:8000/api/auth/register/';
      
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.username?.[0] || 'Authentication failed. Please try again.');
      }
      
      localStorage.setItem('satvikana_token', data.token);
      localStorage.setItem('satvikana_user', JSON.stringify(data.user));
      setSuccessMSG(isLogin ? 'Successfully logged in!' : 'Registered & Logged in successfully!');
      
      // Reload after slight delay
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      
    } catch (err) {
      setErrorMSG(err.message);
    }
  };

  if (token && user) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="testimonial-card" style={{ width: '100%', maxWidth: '450px', padding: '50px 40px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--primary-color)', fontSize: '2rem', marginBottom: '20px' }}>Welcome, {user.username}!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>You are currently logged into Satvikana.</p>
          <button onClick={handleLogout} className="shop-btn" style={{ background: '#ff4d4d', color: '#fff', width: '100%' }}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="testimonial-card" style={{ width: '100%', maxWidth: '450px', padding: '50px 40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-color)', fontSize: '2rem' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        {errorMSG && <p style={{ color: '#ff4d4d', textAlign: 'center', marginBottom: '15px', fontWeight: 'bold' }}>{errorMSG}</p>}
        {successMSG && <p style={{ color: 'var(--secondary-color)', textAlign: 'center', marginBottom: '15px', fontWeight: 'bold' }}>{successMSG}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" style={inputStyle} required={!isLogin} />
          )}
          <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" style={inputStyle} required />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" style={inputStyle} required />
          <button type="submit" className="shop-btn" style={{ marginTop: '10px', width: '100%' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '25px', color: 'var(--text-secondary)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => { setIsLogin(!isLogin); setErrorMSG(''); }} 
            style={{ color: 'var(--accent-color)', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
