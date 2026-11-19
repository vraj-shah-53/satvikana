import React, { useEffect, useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Search, 
  RefreshCw, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  MapPin, 
  CreditCard, 
  DollarSign, 
  Package, 
  ShoppingBag,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const ADMIN_EMAILS = ['vrajjshah53@gmail.com', 'diyajaventures@gmail.com'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Admin login details state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const token = localStorage.getItem('satvikana_token');
  const userStr = localStorage.getItem('satvikana_user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  
  const userEmail = (currentUser?.email || currentUser?.username || '').toLowerCase().trim();
  const isAdmin = Boolean(currentUser && (currentUser.is_admin || ADMIN_EMAILS.includes(userEmail)));

  const fetchAllOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('Failed to retrieve system orders. Ensure you are logged in as an authorized owner.');
      }

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
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
    
    const cleanEmail = adminEmail.toLowerCase().trim();
    if (!ADMIN_EMAILS.includes(cleanEmail)) {
      setLoginError('Access Denied: Only Satvikana store owners (diyajaventures@gmail.com or vrajjshah53@gmail.com) are authorized.');
      return;
    }

    setLoginSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: cleanEmail,
          password: adminPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check your password.');
      }

      localStorage.setItem('satvikana_token', data.token);
      localStorage.setItem('satvikana_user', JSON.stringify(data.user));
      
      // Reload so header and state synchronize
      window.location.reload();
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update order status.');
      }

      // Update state locally
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert(`Status Update Error: ${err.message}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to permanently delete Order #${orderId}? This cannot be undone.`)) {
      return;
    }
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok && res.status !== 204) {
        throw new Error('Failed to delete order.');
      }

      setOrders(prevOrders => prevOrders.filter(o => o.id !== orderId));
    } catch (err) {
      alert(`Delete Error: ${err.message}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('satvikana_token');
    localStorage.removeItem('satvikana_user');
    window.location.reload();
  };

  const getStatusBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    if (s === 'FINISHED') {
      return {
        bg: '#E8F5E9',
        color: '#2E7D32',
        border: '#A5D6A7',
        icon: <CheckCircle2 size={15} style={{ marginRight: '5px' }} />,
        label: 'Finished / Delivered'
      };
    }
    if (s === 'DISPATCHED') {
      return {
        bg: '#E3F2FD',
        color: '#1565C0',
        border: '#90CAF9',
        icon: <Truck size={15} style={{ marginRight: '5px' }} />,
        label: 'Dispatched'
      };
    }
    return {
      bg: '#FFF8E1',
      color: '#B78103',
      border: '#FFE082',
      icon: <Clock size={15} style={{ marginRight: '5px' }} />,
      label: 'Pending'
    };
  };

  // Metrics calculations
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => (o.status || '').toUpperCase() === 'PENDING').length;
  const dispatchedOrdersCount = orders.filter(o => (o.status || '').toUpperCase() === 'DISPATCHED').length;
  const finishedOrdersCount = orders.filter(o => (o.status || '').toUpperCase() === 'FINISHED').length;
  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);

  // Filter & Search logic
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (statusFilter !== 'ALL' && (order.status || '').toUpperCase() !== statusFilter) {
      return false;
    }
    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const orderIdMatch = String(order.id).includes(q);
    const nameMatch = (order.name || '').toLowerCase().includes(q);
    const contactMatch = (order.contact || '').toLowerCase().includes(q);
    const addressMatch = (order.address || '').toLowerCase().includes(q);
    const paymentMatch = (order.payment_method || '').toLowerCase().includes(q);
    const itemMatch = (order.items || []).some(item => (item.product_name || '').toLowerCase().includes(q));

    return orderIdMatch || nameMatch || contactMatch || addressMatch || paymentMatch || itemMatch;
  });

  const inputStyle = {
    padding: '14px 16px',
    background: '#FFFFFF',
    border: '1.5px solid #E0DCD5',
    color: '#1A1A1A',
    borderRadius: '10px',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
  };

  // 1. RENDER OWNER LOGIN SCREEN (if not logged in as authorized owner)
  if (!token || !isAdmin) {
    return (
      <div style={{ 
        minHeight: '85vh', 
        background: 'linear-gradient(135deg, #FAF8F5 0%, #EFEBE4 100%)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '40px 15px' 
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '460px', 
          background: '#FFFFFF', 
          borderRadius: '24px', 
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08)', 
          padding: '45px 35px', 
          border: '1.5px solid #EAE5DC',
          textAlign: 'center'
        }}>
          {/* Logo & Shield Icon */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <img src="/logo.jpeg" alt="Satvikana" style={{ height: '65px', objectFit: 'contain' }} />
          </div>

          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            background: 'rgba(30, 70, 32, 0.08)', 
            color: 'var(--primary-color)', 
            padding: '6px 14px', 
            borderRadius: '20px', 
            fontSize: '0.82rem', 
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '15px'
          }}>
            <ShieldCheck size={16} /> Satvikana Owner Portal
          </div>

          <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-color)', margin: '0 0 10px 0', fontFamily: 'Outfit, sans-serif', fontWeight: '800' }}>
            Authorized Sign In
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '25px', lineHeight: '1.5' }}>
            Secure order & payment management dashboard for Satvikana store owners.
          </p>

          {/* Alert if logged in as a regular customer */}
          {currentUser && !isAdmin && (
            <div style={{ 
              marginBottom: '20px', 
              padding: '12px 14px', 
              background: '#FFF5F5', 
              border: '1px solid #FFD2D2', 
              borderRadius: '10px', 
              fontSize: '0.85rem', 
              color: '#C53030',
              textAlign: 'left'
            }}>
              Currently logged in as <strong>{currentUser.email || currentUser.username}</strong>. This account does not have store owner privileges.
            </div>
          )}

          {loginError && (
            <div style={{ 
              marginBottom: '20px', 
              padding: '12px 14px', 
              background: '#FFF3E0', 
              border: '1px solid #FFE0B2', 
              borderRadius: '10px', 
              fontSize: '0.85rem', 
              color: '#D84315', 
              fontWeight: '600',
              textAlign: 'left'
            }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#4A5647', marginBottom: '6px' }}>
                Owner Email ID
              </label>
              <input 
                type="email" 
                placeholder="Diyajaventures@gmail.com or vrajjshah53@gmail.com" 
                value={adminEmail} 
                onChange={(e) => setAdminEmail(e.target.value)} 
                style={inputStyle} 
                required 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#4A5647', marginBottom: '6px' }}>
                Owner Password
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your owner password" 
                  value={adminPassword} 
                  onChange={(e) => setAdminPassword(e.target.value)} 
                  style={{ ...inputStyle, paddingRight: '45px' }} 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#666',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loginSubmitting}
              style={{
                width: '100%',
                padding: '14px',
                marginTop: '10px',
                background: 'linear-gradient(135deg, #1E4620 0%, #2F5233 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: loginSubmitting ? 'not-allowed' : 'pointer',
                opacity: loginSubmitting ? 0.7 : 1,
                boxShadow: '0 8px 20px rgba(30, 70, 32, 0.25)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              {loginSubmitting ? 'Verifying Credentials...' : 'Sign In to Owner Portal'}
            </button>
          </form>

          {currentUser && (
            <button 
              onClick={handleLogout}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#C53030', 
                cursor: 'pointer', 
                marginTop: '22px', 
                fontSize: '0.85rem',
                fontWeight: '600', 
                textDecoration: 'underline' 
              }}
            >
              Sign out of current account
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. RENDER LOADING STATE
  if (loading) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center', minHeight: '80vh', background: 'var(--bg-color)' }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <RefreshCw size={36} className="spin-icon" style={{ color: 'var(--primary-color)' }} />
          <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', margin: 0 }}>
            Syncing Customer Orders & Payments...
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Connecting securely to Satvikana database
          </p>
        </div>
      </div>
    );
  }

  // 3. RENDER ERROR STATE
  if (error) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: '80vh', background: 'var(--bg-color)' }}>
        <div style={{ 
          maxWidth: '520px', 
          margin: '0 auto', 
          background: '#FFFFFF', 
          borderRadius: '20px', 
          padding: '40px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          border: '1.5px solid #FFD2D2'
        }}>
          <h2 style={{ color: '#D32F2F', marginTop: 0 }}>Dashboard Connection Error</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '25px', lineHeight: '1.6' }}>{error}</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button 
              onClick={fetchAllOrders}
              className="shop-btn"
              style={{ padding: '10px 20px' }}
            >
              Retry Connection
            </button>
            <button 
              onClick={handleLogout}
              style={{ 
                padding: '10px 20px', 
                background: '#F0ECE1', 
                border: 'none', 
                borderRadius: '8px', 
                color: '#333', 
                fontWeight: '600', 
                cursor: 'pointer' 
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. MAIN ADMIN DASHBOARD UI
  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #F9F6F0 0%, #F4EFE6 100%)', 
      minHeight: '90vh', 
      padding: '30px 15px 80px' 
    }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>

        {/* Top Header Bar */}
        <div style={{ 
          background: '#FFFFFF', 
          borderRadius: '20px', 
          padding: '24px 30px', 
          boxShadow: '0 6px 25px rgba(0,0,0,0.04)', 
          border: '1px solid #EBE7DC',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '20px',
          marginBottom: '25px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ 
                background: 'rgba(30, 70, 32, 0.1)', 
                color: 'var(--primary-color)', 
                padding: '4px 10px', 
                borderRadius: '12px', 
                fontSize: '0.75rem', 
                fontWeight: '800',
                textTransform: 'uppercase'
              }}>
                Owner Portal
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Live Store Dashboard
              </span>
            </div>
            <h1 style={{ 
              fontSize: '2rem', 
              color: 'var(--primary-color)', 
              margin: 0, 
              fontFamily: 'Outfit, sans-serif', 
              fontWeight: '800' 
            }}>
              Order & Payment <span style={{ color: 'var(--accent-color)' }}>Management</span>
            </h1>
            <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Logged in as: <strong style={{ color: '#1A1A1A' }}>{currentUser.email || currentUser.username}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={fetchAllOrders}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '10px 18px', 
                background: '#FFFFFF', 
                border: '1.5px solid #D6D0C4', 
                borderRadius: '12px', 
                color: 'var(--primary-color)', 
                fontWeight: '700', 
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Refresh Orders"
            >
              <RefreshCw size={16} /> Refresh
            </button>
            <button 
              onClick={handleLogout}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '10px 18px', 
                background: '#FFF5F5', 
                border: '1.5px solid #FFCDD2', 
                borderRadius: '12px', 
                color: '#C62828', 
                fontWeight: '700', 
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Sign Out of Owner Account"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* KPI / Summary Metrics Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px', 
          marginBottom: '25px' 
        }}>
          {/* Card 1: Total Orders */}
          <div style={{ 
            background: '#FFFFFF', 
            borderRadius: '16px', 
            padding: '20px', 
            border: '1px solid #EBE7DC', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              background: 'rgba(30, 70, 32, 0.1)', 
              color: 'var(--primary-color)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <ShoppingBag size={24} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>TOTAL ORDERS</p>
              <h3 style={{ margin: '2px 0 0', fontSize: '1.6rem', color: 'var(--primary-color)', fontWeight: '800' }}>{totalOrdersCount}</h3>
            </div>
          </div>

          {/* Card 2: Pending Orders */}
          <div style={{ 
            background: '#FFFFFF', 
            borderRadius: '16px', 
            padding: '20px', 
            border: '1px solid #FFE082', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              background: '#FFF8E1', 
              color: '#B78103', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Clock size={24} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#B78103', fontWeight: '700' }}>PENDING DISPATCH</p>
              <h3 style={{ margin: '2px 0 0', fontSize: '1.6rem', color: '#B78103', fontWeight: '800' }}>{pendingOrdersCount}</h3>
            </div>
          </div>

          {/* Card 3: Dispatched Orders */}
          <div style={{ 
            background: '#FFFFFF', 
            borderRadius: '16px', 
            padding: '20px', 
            border: '1px solid #90CAF9', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              background: '#E3F2FD', 
              color: '#1565C0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Truck size={24} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#1565C0', fontWeight: '700' }}>IN TRANSIT</p>
              <h3 style={{ margin: '2px 0 0', fontSize: '1.6rem', color: '#1565C0', fontWeight: '800' }}>{dispatchedOrdersCount}</h3>
            </div>
          </div>

          {/* Card 4: Finished Orders */}
          <div style={{ 
            background: '#FFFFFF', 
            borderRadius: '16px', 
            padding: '20px', 
            border: '1px solid #A5D6A7', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              background: '#E8F5E9', 
              color: '#2E7D32', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#2E7D32', fontWeight: '700' }}>COMPLETED</p>
              <h3 style={{ margin: '2px 0 0', fontSize: '1.6rem', color: '#2E7D32', fontWeight: '800' }}>{finishedOrdersCount}</h3>
            </div>
          </div>

          {/* Card 5: Total Revenue */}
          <div style={{ 
            background: 'linear-gradient(135deg, #1E4620 0%, #2F5233 100%)', 
            borderRadius: '16px', 
            padding: '20px', 
            boxShadow: '0 8px 20px rgba(30, 70, 32, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            color: '#FFFFFF'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              background: 'rgba(255, 255, 255, 0.15)', 
              color: '#FFFFFF', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <DollarSign size={24} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>TOTAL REVENUE</p>
              <h3 style={{ margin: '2px 0 0', fontSize: '1.6rem', color: '#FFE082', fontWeight: '800' }}>
                ₹{totalRevenue.toFixed(2)}
              </h3>
            </div>
          </div>
        </div>

        {/* Control Bar: Filters & Search */}
        <div style={{ 
          background: '#FFFFFF', 
          borderRadius: '16px', 
          padding: '16px 20px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)', 
          border: '1px solid #EBE7DC',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '15px',
          marginBottom: '25px'
        }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Orders', count: totalOrdersCount },
              { id: 'PENDING', label: 'Pending', count: pendingOrdersCount },
              { id: 'DISPATCHED', label: 'Dispatched', count: dispatchedOrdersCount },
              { id: 'FINISHED', label: 'Finished', count: finishedOrdersCount }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: statusFilter === tab.id ? 'none' : '1px solid #E0DCD5',
                  background: statusFilter === tab.id ? 'var(--primary-color)' : '#F9F7F2',
                  color: statusFilter === tab.id ? '#FFFFFF' : '#4A5647',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{tab.label}</span>
                <span style={{
                  background: statusFilter === tab.id ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)',
                  padding: '2px 7px',
                  borderRadius: '10px',
                  fontSize: '0.75rem'
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '280px', flex: '1', maxWidth: '420px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input 
              type="text" 
              placeholder="Search by Order ID, name, phone, address..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: '10px',
                border: '1.5px solid #E0DCD5',
                fontSize: '0.88rem',
                outline: 'none',
                background: '#FAF8F5',
                boxSizing: 'border-box'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  padding: '4px'
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Orders List View */}
        {filteredOrders.length === 0 ? (
          <div style={{ 
            background: '#FFFFFF', 
            borderRadius: '20px', 
            padding: '60px 20px', 
            textAlign: 'center', 
            border: '1px solid #EBE7DC',
            boxShadow: '0 6px 20px rgba(0,0,0,0.03)'
          }}>
            <Package size={48} style={{ color: '#C0B7A8', marginBottom: '15px' }} />
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-color)', margin: '0 0 8px 0' }}>
              No Orders Found
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
              {searchQuery || statusFilter !== 'ALL' 
                ? 'No customer orders match your current filter or search criteria.' 
                : 'No customer orders have been placed in the store yet.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {filteredOrders.map(order => {
              const statusInfo = getStatusBadge(order.status);
              const orderDate = new Date(order.created_at);
              const cleanContact = (order.contact || '').replace(/[^0-9]/g, '');
              const whatsappLink = cleanContact 
                ? `https://wa.me/91${cleanContact.slice(-10)}?text=${encodeURIComponent(`Hello ${order.name || 'Customer'}, this is Satvikana regarding your Order #${order.id}.`)}`
                : null;

              return (
                <div 
                  key={order.id} 
                  style={{ 
                    background: '#FFFFFF', 
                    borderRadius: '20px', 
                    padding: '24px 28px', 
                    border: '1px solid #E8E3D8', 
                    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.04)',
                    transition: 'box-shadow 0.2s ease'
                  }}
                >
                  {/* Row 1: Order Header & Status Controls */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    borderBottom: '1.5px solid #F0ECE4', 
                    paddingBottom: '16px', 
                    flexWrap: 'wrap', 
                    gap: '15px' 
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ 
                          background: 'var(--primary-color)', 
                          color: '#FFFFFF', 
                          fontWeight: '800', 
                          padding: '3px 10px', 
                          borderRadius: '8px', 
                          fontSize: '0.95rem' 
                        }}>
                          #{order.id}
                        </span>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--primary-color)', fontWeight: '800' }}>
                          Order #{order.id}
                        </h3>
                      </div>
                      <p style={{ margin: '5px 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        Placed on: <strong>{orderDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong> at {orderDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {/* Status Display & Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{
                        background: statusInfo.bg,
                        color: statusInfo.color,
                        border: `1.5px solid ${statusInfo.border}`,
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'inline-flex',
                        alignItems: 'center'
                      }}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>

                      <div style={{ position: 'relative' }}>
                        <select 
                          value={order.status} 
                          disabled={updatingOrderId === order.id}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)} 
                          style={{ 
                            padding: '7px 12px', 
                            borderRadius: '10px', 
                            border: '1.5px solid #D6D0C4', 
                            outline: 'none', 
                            background: '#FAF8F5', 
                            color: '#1A1A1A', 
                            fontWeight: '700', 
                            fontSize: '0.85rem',
                            cursor: updatingOrderId === order.id ? 'not-allowed' : 'pointer' 
                          }}
                        >
                          <option value="PENDING">⏳ Pending</option>
                          <option value="DISPATCHED">🚚 Dispatched</option>
                          <option value="FINISHED">✅ Finished</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Items Ordered */}
                  <div style={{ margin: '18px 0' }}>
                    <h4 style={{ margin: '0 0 10px', color: 'var(--primary-color)', fontSize: '0.95rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Products Ordered ({order.items?.length || 0})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {order.items && order.items.map(item => (
                        <div 
                          key={item.id} 
                          style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            padding: '10px 14px', 
                            background: '#FBF9F6', 
                            border: '1px solid #EFEAE2', 
                            borderRadius: '10px' 
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ 
                              width: '32px', 
                              height: '32px', 
                              borderRadius: '8px', 
                              background: 'rgba(30, 70, 32, 0.08)', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              color: 'var(--primary-color)'
                            }}>
                              <Package size={16} />
                            </div>
                            <div>
                              <p style={{ margin: 0, fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                                {item.product_name ? item.product_name.split('|')[0].trim() : 'Makhana Item'}
                              </p>
                              <p style={{ margin: '2px 0 0', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                                Qty: <strong>{item.quantity}</strong> × ₹{parseFloat(item.price).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div>
                            <span style={{ fontWeight: '800', color: 'var(--accent-color)', fontSize: '0.95rem' }}>
                              ₹{(item.quantity * parseFloat(item.price)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Row 3: Shipping & Payment Gateway Details Grid */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                    gap: '16px', 
                    background: '#FAF8F4', 
                    padding: '18px', 
                    borderRadius: '14px', 
                    border: '1.5px solid #EBE5DA' 
                  }}>
                    {/* Delivery Information */}
                    <div>
                      <h4 style={{ 
                        margin: '0 0 10px', 
                        color: 'var(--primary-color)', 
                        fontSize: '0.9rem', 
                        fontWeight: '800', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px' 
                      }}>
                        <MapPin size={16} /> Delivery Information
                      </h4>
                      <p style={{ margin: '4px 0', fontSize: '0.88rem', color: '#2B3329' }}>
                        <strong>Recipient:</strong> {order.name || 'Not provided'}
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '0.88rem', color: '#2B3329', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span><strong>Phone:</strong> {order.contact || 'Not provided'}</span>
                        {whatsappLink && (
                          <a 
                            href={whatsappLink} 
                            target="_blank" 
                            rel="noreferrer"
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '4px', 
                              padding: '2px 8px', 
                              background: '#25D366', 
                              color: '#FFFFFF', 
                              borderRadius: '12px', 
                              fontSize: '0.75rem', 
                              fontWeight: '700', 
                              textDecoration: 'none' 
                            }}
                          >
                            <MessageSquare size={12} /> WhatsApp
                          </a>
                        )}
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '0.88rem', color: '#2B3329' }}>
                        <strong>Address:</strong> {order.address || 'Not provided'}
                      </p>
                      {order.instructions && (
                        <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                          <strong>Notes:</strong> {order.instructions}
                        </p>
                      )}
                    </div>

                    {/* Payment Details & Gateway Info */}
                    <div style={{ borderLeft: '1px solid #E0DCD4', paddingLeft: '16px' }}>
                      <h4 style={{ 
                        margin: '0 0 10px', 
                        color: 'var(--primary-color)', 
                        fontSize: '0.9rem', 
                        fontWeight: '800', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px' 
                      }}>
                        <CreditCard size={16} /> Payment & Gateway Details
                      </h4>
                      <p style={{ margin: '4px 0', fontSize: '0.88rem', color: '#2B3329' }}>
                        <strong>Method:</strong> {order.payment_method || 'UPI'}
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '0.88rem', color: '#2B3329', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong>Payment Status:</strong> 
                        <span style={{ 
                          background: (order.payment_status || 'PAID') === 'PAID' ? '#E8F5E9' : '#FFF3E0', 
                          color: (order.payment_status || 'PAID') === 'PAID' ? '#2E7D32' : '#E65100', 
                          padding: '1px 8px', 
                          borderRadius: '10px', 
                          fontSize: '0.78rem', 
                          fontWeight: '800' 
                        }}>
                          {order.payment_status || 'PAID'}
                        </span>
                      </p>
                      {order.payment_id && (
                        <p style={{ margin: '4px 0', fontSize: '0.82rem', color: '#555', wordBreak: 'break-all' }}>
                          <strong>Transaction / Ref ID:</strong> {order.payment_id}
                        </p>
                      )}
                      
                      <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #D6D0C4' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Order Value:</span>
                        <div style={{ fontSize: '1.6rem', color: 'var(--accent-color)', fontWeight: '800' }}>
                          ₹{parseFloat(order.total_price || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Quick Workflow Action Buttons */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    alignItems: 'center', 
                    gap: '10px', 
                    marginTop: '16px', 
                    flexWrap: 'wrap' 
                  }}>
                    {order.status === 'PENDING' && (
                      <button 
                        onClick={() => handleStatusUpdate(order.id, 'DISPATCHED')}
                        disabled={updatingOrderId === order.id}
                        style={{ 
                          padding: '8px 18px', 
                          fontSize: '0.85rem', 
                          fontWeight: '700',
                          backgroundColor: '#1565C0', 
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 10px rgba(21, 101, 192, 0.25)' 
                        }}
                      >
                        <Truck size={15} /> Mark as Dispatched
                      </button>
                    )}

                    {order.status === 'DISPATCHED' && (
                      <button 
                        onClick={() => handleStatusUpdate(order.id, 'FINISHED')}
                        disabled={updatingOrderId === order.id}
                        style={{ 
                          padding: '8px 18px', 
                          fontSize: '0.85rem', 
                          fontWeight: '700',
                          backgroundColor: '#2E7D32', 
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 10px rgba(46, 125, 50, 0.25)' 
                        }}
                      >
                        <CheckCircle2 size={15} /> Mark as Completed / Delivered
                      </button>
                    )}

                    {order.status === 'FINISHED' && (
                      <button 
                        onClick={() => handleStatusUpdate(order.id, 'PENDING')}
                        disabled={updatingOrderId === order.id}
                        style={{ 
                          padding: '6px 14px', 
                          fontSize: '0.8rem', 
                          fontWeight: '600',
                          backgroundColor: '#F5F5F5', 
                          color: '#666',
                          border: '1px solid #DDD',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        Reset to Pending
                      </button>
                    )}

                    <button 
                      onClick={() => handleDeleteOrder(order.id)}
                      disabled={updatingOrderId === order.id}
                      style={{ 
                        padding: '7px 14px', 
                        fontSize: '0.82rem', 
                        fontWeight: '600',
                        backgroundColor: '#FFF5F5', 
                        color: '#D32F2F', 
                        border: '1px solid #FFCDD2', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'background 0.2s ease'
                      }}
                      title="Permanently delete this order"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminOrders;
