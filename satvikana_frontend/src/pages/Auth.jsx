import React, { useState, useEffect } from 'react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errorMSG, setErrorMSG] = useState('');
  const [successMSG, setSuccessMSG] = useState('');
  
  const token = localStorage.getItem('satvikana_token');
  const userStr = localStorage.getItem('satvikana_user');
  const user = userStr ? JSON.parse(userStr) : null;

  const [profileData, setProfileData] = useState({
    name: user?.profile?.name || '',
    address: user?.profile?.address || '',
    contact: user?.profile?.contact || ''
  });
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  useEffect(() => {
    if (token) {
      fetch('http://127.0.0.1:8000/api/auth/profile/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      .then(res => {
        if (res.status === 401) {
          // Token is invalid/expired in the database. Log out to reset state!
          localStorage.removeItem('satvikana_token');
          localStorage.removeItem('satvikana_user');
          window.location.reload();
          throw new Error("Session expired. Please log in again.");
        }
        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return res.json();
        }
        throw new Error("Invalid response format from server.");
      })
      .then(data => {
        if (data && !data.error) {
          setProfileData({
            name: data.name || '',
            address: data.address || '',
            contact: data.contact || ''
          });
          const currentUser = JSON.parse(localStorage.getItem('satvikana_user') || '{}');
          currentUser.profile = data;
          localStorage.setItem('satvikana_user', JSON.stringify(currentUser));
        }
      })
      .catch(err => console.error("Error fetching profile:", err));
    }
  }, [token]);

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

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem('satvikana_token');
    localStorage.removeItem('satvikana_user');
    window.location.reload();
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    setProfileErrorMsg('');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('satvikana_token');
            localStorage.removeItem('satvikana_user');
            window.location.reload();
            return;
          }
          throw new Error(data.detail || data.error || 'Failed to update profile details.');
        }
        setProfileSuccessMsg('Profile details saved successfully!');
        const currentUser = JSON.parse(localStorage.getItem('satvikana_user') || '{}');
        currentUser.profile = data;
        localStorage.setItem('satvikana_user', JSON.stringify(currentUser));
      } else {
        const text = await res.text();
        throw new Error(`Server error (${res.status}): ${text.substring(0, 50)}...`);
      }
    } catch (err) {
      setProfileErrorMsg(err.message);
    }
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
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', background: 'var(--bg-color)', padding: '40px 20px' }}>
        <div className="testimonial-card" style={{ width: '100%', maxWidth: '600px', padding: '40px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          <div style={{ textAlign: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '20px' }}>
            <h2 style={{ color: 'var(--primary-color)', fontSize: '2.2rem', marginBottom: '8px' }}>My Account</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Welcome back, <strong>{user.username}</strong> ({user.email})</p>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              onClick={() => window.location.href = '/order-history'} 
              className="shop-btn" 
              style={{ flex: 1, backgroundColor: 'var(--accent-color)', boxShadow: '0 4px 15px rgba(212, 136, 6, 0.3)' }}
            >
              View Order History
            </button>
            <button 
              onClick={handleLogout} 
              className="shop-btn" 
              style={{ background: '#ff4d4d', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '30px', boxShadow: '0 4px 15px rgba(255, 77, 77, 0.3)' }}
            >
              Logout
            </button>
          </div>

          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px', borderTop: '1px solid var(--border-color)', paddingTop: '25px' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', marginBottom: '5px' }}>Default Delivery Details</h3>
            
            {profileSuccessMsg && <p style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>{profileSuccessMsg}</p>}
            {profileErrorMsg && <p style={{ color: '#ff4d4d', fontWeight: 'bold' }}>{profileErrorMsg}</p>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={profileData.name} 
                onChange={handleProfileChange} 
                placeholder="Enter default recipient name" 
                style={inputStyle} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Contact Number</label>
              <input 
                type="tel" 
                name="contact" 
                value={profileData.contact} 
                onChange={handleProfileChange} 
                placeholder="+91 00000 00000" 
                style={inputStyle} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Delivery Address</label>
              <textarea 
                name="address" 
                value={profileData.address} 
                onChange={handleProfileChange} 
                placeholder="Enter default delivery address" 
                rows="3" 
                style={{ ...inputStyle, resize: 'vertical' }} 
              />
            </div>

            <button type="submit" className="shop-btn" style={{ marginTop: '10px' }}>
              Save Profile Details
            </button>
          </form>

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
