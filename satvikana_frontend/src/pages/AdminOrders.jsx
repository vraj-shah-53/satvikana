import React, { useEffect, useState } from 'react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Admin login details state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const token = localStorage.getItem('satvikana_token');
  const userStr = localStorage.getItem('satvikana_user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const isAdmin = currentUser && currentUser.email === 'vrajjshah53@gmail.com';

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://satvikana-backend.onrender.com/api/orders/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('Failed to retrieve system orders. Ensure you are logged in as admin.');
      }

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && isAdmin) {
      fetchAllOrders();
    } else {
      setLoading(false);
    }
  }, [token, isAdmin]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (adminEmail !== 'vrajjshah53@gmail.com') {
      setLoginError('Invalid Admin Email. Access denied.');
      return;
    }

    try {
      const res = await fetch('https://satvikana-backend.onrender.com/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: adminEmail,
          password: adminPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      localStorage.setItem('satvikana_token', data.token);
      localStorage.setItem('satvikana_user', JSON.stringify(data.user));
      
      // Force reload to refresh header and state
      window.location.reload();
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await fetch(`https://satvikana-backend.onrender.com/api/orders/${orderId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        throw new Error('Failed to update order status.');
      }

      // Update state locally
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'FINISHED': return '#2E7D32';
      case 'DISPATCHED': return '#1565C0';
      default: return '#D48806';
    }
  };

  const inputStyle = {
    padding: '15px',
    background: 'var(--bg-color)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    borderRadius: '8px',
    fontFamily: 'inherit',
    fontSize: '1rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  };

  // Render Admin Login Form if not logged in as the specified admin
  if (!token || !isAdmin) {
    return (
      <div className="page-container" style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', background: 'var(--bg-color)' }}>
        <div className="testimonial-card" style={{ width: '100%', maxWidth: '450px', padding: '50px 40px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '15px', color: 'var(--primary-color)', fontSize: '2rem' }}>Admin Portal</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '0.95rem' }}>
            Please log in with your Admin Email ID to manage orders.
          </p>

          {currentUser && (
            <div style={{ marginBottom: '20px', padding: '12px', background: '#fff5f5', border: '1px solid #ffcccc', borderRadius: '8px', fontSize: '0.85rem', color: '#c53030' }}>
              Logged in as <strong>{currentUser.username}</strong>. You must log out or log in with the admin email to view this panel.
            </div>
          )}

          {loginError && (
            <p style={{ color: '#ff4d4d', fontWeight: 'bold', marginBottom: '15px' }}>{loginError}</p>
          )}

          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input 
              type="email" 
              placeholder="Admin Email ID" 
              value={adminEmail} 
              onChange={(e) => setAdminEmail(e.target.value)} 
              style={inputStyle} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={adminPassword} 
              onChange={(e) => setAdminPassword(e.target.value)} 
              style={inputStyle} 
              required 
            />
            <button type="submit" className="shop-btn" style={{ width: '100%', padding: '15px', marginTop: '10px' }}>
              Sign In as Admin
            </button>
          </form>
          
          {currentUser && (
            <button 
              onClick={() => {
                localStorage.removeItem('satvikana_token');
                localStorage.removeItem('satvikana_user');
                window.location.reload();
              }}
              style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', marginTop: '20px', fontWeight: '600', textDecoration: 'underline' }}
            >
              Sign Out of Current Account
            </button>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container" style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>Retrieving customer orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="testimonial-card" style={{ maxWidth: '500px', margin: '40px auto', border: '1px solid #ff4d4d' }}>
          <h2 style={{ color: '#ff4d4d', marginBottom: '20px' }}>System Error</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>{error}</p>
          <button className="shop-btn" onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '40px 20px', background: 'var(--bg-color)', minHeight: '80vh' }}>
      <h1 className="section-title">Admin <span>Orders Dashboard</span></h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '-15px', marginBottom: '40px' }}>
        Authorized Admin: <strong>{currentUser.email}</strong>
      </p>

      {orders.length === 0 ? (
        <div style={{ marginTop: '50px', textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          No orders have been placed by users yet.
        </div>
      ) : (
        <div style={{ maxWidth: '950px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {orders.map(order => (
            <div key={order.id} className="testimonial-card" style={{ width: '100%', maxWidth: 'none', padding: '30px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Order Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--primary-color)' }}>Order #{order.id}</h3>
                  <p style={{ margin: '5px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Placed on: {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Status Dropdown selector & Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                  <span style={{
                    background: getStatusColor(order.status) + '15',
                    color: getStatusColor(order.status),
                    border: `1px solid ${getStatusColor(order.status)}40`,
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {order.status}
                  </span>

                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)} 
                    style={{ 
                      padding: '8px 12px', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)', 
                      outline: 'none', 
                      background: '#FFFFFF', 
                      color: 'var(--text-primary)', 
                      fontWeight: 'bold', 
                      cursor: 'pointer' 
                    }}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="DISPATCHED">Dispatched</option>
                    <option value="FINISHED">Finished</option>
                  </select>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ margin: '0 0 5px', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Items Ordered</h4>
                {order.items && order.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', background: '#fcfcfc', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        {item.product_name.split('|')[0]}
                      </p>
                      <p style={{ margin: '2px 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        Qty: {item.quantity} × ₹{parseFloat(item.price).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--accent-color)', fontSize: '1rem' }}>
                        ₹{(item.quantity * parseFloat(item.price)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Shipping and Total */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '10px', background: '#F8FAF7', padding: '20px', borderRadius: '12px', border: '1px solid #E8EFE8' }}>
                <div style={{ flex: '1', minWidth: '250px' }}>
                  <h4 style={{ margin: '0 0 10px', color: 'var(--primary-color)', fontSize: '1rem' }}>Delivery Information</h4>
                  <p style={{ margin: '3px 0', fontSize: '0.9rem', color: '#333' }}><strong>Recipient:</strong> {order.name}</p>
                  <p style={{ margin: '3px 0', fontSize: '0.9rem', color: '#333' }}><strong>Contact:</strong> {order.contact}</p>
                  <p style={{ margin: '3px 0', fontSize: '0.9rem', color: '#333' }}><strong>Address:</strong> {order.address}</p>
                  {order.instructions && (
                    <p style={{ margin: '3px 0', fontSize: '0.9rem', color: '#333' }}><strong>Instructions:</strong> {order.instructions}</p>
                  )}
                  <p style={{ margin: '3px 0', fontSize: '0.9rem', color: '#333' }}><strong>Payment:</strong> {order.payment_method}</p>
                </div>
                
                <div style={{ flex: '0.8', minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'center', alignItems: 'flex-end', borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem' }}>Total Amount</p>
                    <h3 style={{ margin: '5px 0 0', fontSize: '2rem', color: 'var(--accent-color)' }}>₹{parseFloat(order.total_price).toFixed(2)}</h3>
                  </div>

                  {/* Quick-action workflow buttons */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    {order.status === 'PENDING' && (
                      <button 
                        onClick={() => handleStatusUpdate(order.id, 'DISPATCHED')}
                        className="shop-btn"
                        style={{ padding: '8px 16px', fontSize: '0.85rem', backgroundColor: '#1565C0', boxShadow: '0 4px 10px rgba(21, 101, 192, 0.2)' }}
                      >
                        Dispatch Order
                      </button>
                    )}
                    {order.status === 'DISPATCHED' && (
                      <button 
                        onClick={() => handleStatusUpdate(order.id, 'FINISHED')}
                        className="shop-btn"
                        style={{ padding: '8px 16px', fontSize: '0.85rem', backgroundColor: '#2E7D32', boxShadow: '0 4px 10px rgba(46, 125, 50, 0.2)' }}
                      >
                        Complete Order
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
