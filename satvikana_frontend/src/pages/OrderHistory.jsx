import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('satvikana_token');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error('Failed to retrieve order history.');
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (!token) {
    return (
      <div className="page-container" style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--bg-color)' }}>
        <div className="testimonial-card" style={{ maxWidth: '500px', margin: '40px auto', padding: '40px 30px' }}>
          <h2 style={{ color: '#ff4d4d', marginBottom: '20px' }}>Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Please log in to view your order history.</p>
          <button className="shop-btn" onClick={() => window.location.href = '/auth'}>Login / Register</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container" style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>Loading your order history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="testimonial-card" style={{ maxWidth: '500px', margin: '40px auto', border: '1px solid #ff4d4d' }}>
          <h2 style={{ color: '#ff4d4d', marginBottom: '20px' }}>Error</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>{error}</p>
          <button className="shop-btn" onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'FINISHED': return '#2E7D32';
      case 'DISPATCHED': return '#1565C0';
      default: return '#D48806'; // Pending / default
    }
  };

  return (
    <div className="page-container" style={{ padding: '40px 20px', background: 'var(--bg-color)' }}>
      <h1 className="section-title">Order <span>History</span></h1>
      
      {orders.length === 0 ? (
        <div style={{ marginTop: '50px', textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          You have not placed any orders yet.
          <br/><br/>
          <button className="shop-btn" style={{ marginTop: '20px' }} onClick={() => window.location.href='/products'}>Shop Now</button>
        </div>
      ) : (
        <div style={{ maxWidth: '850px', margin: '40px auto 0', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {orders.map(order => (
            <div key={order.id} className="testimonial-card" style={{ width: '100%', maxWidth: 'none', padding: '30px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Order Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--primary-color)' }}>Order #{order.id}</h3>
                  <p style={{ margin: '5px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Placed on: {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div>
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
                <div style={{ flex: '0.8', minWidth: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem' }}>Total Paid</p>
                  <h3 style={{ margin: '5px 0 0', fontSize: '2rem', color: 'var(--accent-color)' }}>₹{parseFloat(order.total_price).toFixed(2)}</h3>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
