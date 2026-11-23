import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../CartContext';
import { API_BASE_URL } from '../config';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useContext(CartContext);
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    address: '',
    contact: '',
    instructions: '',
    paymentMethod: 'Cashfree PG'
  });

  const token = localStorage.getItem('satvikana_token');
  const userStr = localStorage.getItem('satvikana_user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (user && user.profile) {
      setOrderDetails(prev => ({
        ...prev,
        name: user.profile.name || prev.name,
        address: user.profile.address || prev.address,
        contact: user.profile.contact || prev.contact
      }));
    }

    // Check for return_url redirect from Cashfree (?cf_order_id=...)
    const urlParams = new URLSearchParams(window.location.search);
    const cfOrderId = urlParams.get('cf_order_id');
    if (cfOrderId) {
      // Clean query parameter from address bar
      window.history.replaceState({}, document.title, window.location.pathname);
      verifyPaymentFromRedirect(cfOrderId);
    }
  }, []);

  const verifyPaymentFromRedirect = async (cfOrderId) => {
    setIsPaying(true);
    try {
      const savedShipping = JSON.parse(localStorage.getItem('satvikana_pending_shipping') || '{}');
      const savedItems = JSON.parse(localStorage.getItem('satvikana_pending_items') || '[]');

      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/api/payment/verify/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          order_id: cfOrderId,
          shipping: savedShipping,
          items: savedItems
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Payment verification failed.');
      }

      setConfirmedOrder(data.order);
      setShowSuccessModal(true);
      clearCart();
      localStorage.removeItem('satvikana_pending_shipping');
      localStorage.removeItem('satvikana_pending_items');
      setIsCheckoutMode(false);
    } catch (err) {
      alert(`Payment Notice: ${err.message}`);
    } finally {
      setIsPaying(false);
    }
  };

  const totalPrice = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);

  // Directly allows guest checkout without forcing login
  const handleDisplayCheckoutForm = () => {
    if (cart.length === 0) return;
    setIsCheckoutMode(true);
  };

  const handleInputChange = (e) => {
    setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
  };

  const handleInitiateCashfreePayment = async (e) => {
    e.preventDefault();
    if (!orderDetails.name.trim() || !orderDetails.address.trim() || !orderDetails.contact.trim()) {
      alert("Please fill in all required fields: Full Name, Delivery Address, and Contact Number.");
      return;
    }

    const cleanContact = orderDetails.contact.replace(/\D/g, '');
    if (cleanContact.length < 10) {
      alert("Please enter a valid 10-digit Indian mobile number for order delivery updates.");
      return;
    }

    setIsPaying(true);

    try {
      // Save pending shipping details in case of bank redirect
      const cartItemsPayload = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));
      localStorage.setItem('satvikana_pending_shipping', JSON.stringify(orderDetails));
      localStorage.setItem('satvikana_pending_items', JSON.stringify(cartItemsPayload));

      // 1. Request Cashfree order from backend (supports guest and logged-in users)
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/api/payment/create-order/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items: cartItemsPayload,
          name: orderDetails.name,
          address: orderDetails.address,
          contact: orderDetails.contact,
          instructions: orderDetails.instructions
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initiate payment with Cashfree.');
      }

      const { payment_session_id, order_id } = data;

      if (!payment_session_id) {
        throw new Error('Cashfree did not return a valid payment session.');
      }

      // Check if Cashfree SDK is loaded
      if (!window.Cashfree) {
        throw new Error('Cashfree Payment Gateway SDK is loading. Please try again in a few seconds.');
      }

      // 2. Open Cashfree Production Checkout Modal
      const cashfree = window.Cashfree({ mode: "production" });

      cashfree.checkout({
        paymentSessionId: payment_session_id,
        redirectTarget: "_modal"
      }).then(async (result) => {
        if (result.error) {
          console.warn("Cashfree checkout error:", result.error);
          alert(result.error.message || "Payment cancelled or incomplete.");
          setIsPaying(false);
          return;
        }

        if (result.redirect) {
          // If browser redirects, return_url handles it automatically
          return;
        }

        if (result.paymentDetails) {
          // 3. Payment succeeded in modal, verify and record with backend!
          await verifyPaymentSuccess(order_id);
        }
      }).catch(err => {
        console.error("Cashfree popup error:", err);
        setIsPaying(false);
      });

    } catch (err) {
      alert(`Payment Gateway Error: ${err.message}`);
      setIsPaying(false);
    }
  };

  const verifyPaymentSuccess = async (cfOrderId) => {
    try {
      const cartItemsPayload = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/api/payment/verify/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          order_id: cfOrderId,
          shipping: orderDetails,
          items: cartItemsPayload
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Unable to confirm payment status.');
      }

      setConfirmedOrder(data.order);
      setShowSuccessModal(true);
      clearCart();
      localStorage.removeItem('satvikana_pending_shipping');
      localStorage.removeItem('satvikana_pending_items');
      setIsCheckoutMode(false);
    } catch (err) {
      alert(`Verification Error: ${err.message}`);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="cart-page page-container" style={{ minHeight: '80vh', padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-color)' }}>
        Your Shopping Cart
      </h1>
      
      {cart.length === 0 ? (
        <div className="empty-cart" style={{ textAlign: 'center', padding: '50px 20px', background: 'var(--surface-color)', borderRadius: '15px', boxShadow: 'var(--shadow-custom)', border: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Your cart is empty.</p>
          <a href="/products" className="shop-btn" style={{ textDecoration: 'none', display: 'inline-block', padding: '12px 30px' }}>
            Explore Our Products
          </a>
        </div>
      ) : (
        <div className={`cart-layout ${isCheckoutMode ? 'checkout-active' : ''}`} style={{ display: 'grid', gridTemplateColumns: isCheckoutMode ? '1fr 1fr' : '1fr', gap: '40px' }}>
          
          {/* Left Column: Cart Items */}
          <div className="cart-left-col">
            <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', color: 'var(--text-primary)', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
              Items in Cart ({cart.reduce((t, i) => t + i.quantity, 0)})
            </h2>

            {cart.map((item) => (
              <div key={item.id} className="cart-item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'var(--surface-color)', borderRadius: '15px', marginBottom: '15px', boxShadow: 'var(--shadow-custom)', border: '1px solid var(--border-color)' }}>
                <div className="cart-item-left" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <img src={item.image} alt={item.name} className="cart-item-img" style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '10px' }} />
                  <div>
                    <h3 className="cart-item-title" style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '5px' }}>{item.name}</h3>
                    <p className="cart-item-unit-price" style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>₹{parseFloat(item.price).toFixed(2)}</p>
                    
                    {!isCheckoutMode ? (
                      <div className="qty-control" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="qty-btn"
                        >
                          -
                        </button>
                        <span className="qty-val">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="qty-btn"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <p className="qty-display" style={{ marginTop: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Qty: <strong>{item.quantity}</strong></p>
                    )}
                  </div>
                </div>
                <div className="cart-item-right" style={{ textAlign: 'right' }}>
                  <p className="cart-item-price" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>₹{(item.price * item.quantity).toFixed(2)}</p>
                  {!isCheckoutMode && (
                    <button onClick={() => removeFromCart(item.id)} className="cart-remove-btn" style={{ background: 'none', border: 'none', color: '#e53935', cursor: 'pointer', marginTop: '10px', fontSize: '0.9rem' }}>Remove</button>
                  )}
                </div>
              </div>
            ))}
            
            {/* Total Block when NOT in checkout */}
            {!isCheckoutMode && (
              <div style={{ marginTop: '30px', textAlign: 'right', padding: '30px', background: 'var(--surface-color)', borderRadius: '15px', boxShadow: 'var(--shadow-custom)', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Total: <span style={{ color: 'var(--accent-color)' }}>₹{totalPrice.toFixed(2)}</span></h3>
                <button className="shop-btn" style={{ marginTop: '20px', padding: '15px 40px', fontSize: '1.2rem', width: '100%' }} onClick={handleDisplayCheckoutForm}>
                  PROCEED TO CHECKOUT
                </button>
                <p style={{ marginTop: '12px', fontSize: '0.85rem', color: '#2E7D32', textAlign: 'center', fontWeight: '600' }}>
                  ✓ Instant Guest Checkout • No Account or Password Needed
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Checkout Form (Instant Guest Checkout) */}
          {isCheckoutMode && (
            <div className="cart-right-col" style={{ background: 'var(--surface-color)', padding: '35px', borderRadius: '20px', boxShadow: 'var(--shadow-custom)', border: '2px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px', marginBottom: '15px' }}>
                <div>
                  <h2 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1.5rem' }}>Checkout & Delivery</h2>
                  <span style={{ fontSize: '0.8rem', color: '#2E7D32', fontWeight: '700' }}>
                    ● Quick Guest Checkout (Direct Order)
                  </span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setIsCheckoutMode(false)}
                  style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
                >
                  Edit Cart
                </button>
              </div>

              <div style={{ background: '#FAF7F2', padding: '14px 20px', borderRadius: '12px', border: '1px solid #EAE3D6', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Total Payable Amount:</span>
                <strong style={{ fontSize: '1.45rem', color: 'var(--accent-color)' }}>₹{totalPrice.toFixed(2)}</strong>
              </div>
              
              <form onSubmit={handleInitiateCashfreePayment} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Full Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    value={orderDetails.name} 
                    onChange={handleInputChange} 
                    placeholder="Enter your full name" 
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: '#FFFFFF', color: '#1A1A1A' }} 
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Contact Phone Number <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input 
                    type="tel" 
                    name="contact" 
                    required 
                    value={orderDetails.contact} 
                    onChange={handleInputChange} 
                    placeholder="10-digit mobile number for order delivery" 
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: '#FFFFFF', color: '#1A1A1A' }} 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Delivery Address <span style={{ color: 'red' }}>*</span>
                  </label>
                  <textarea 
                    name="address" 
                    required 
                    value={orderDetails.address} 
                    onChange={handleInputChange} 
                    placeholder="House / Flat No., Street, Landmark, City, State, Pincode" 
                    rows="3" 
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical', background: '#FFFFFF', color: '#1A1A1A' }}
                  ></textarea>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Delivery Instructions (Optional)
                  </label>
                  <input 
                    type="text" 
                    name="instructions" 
                    value={orderDetails.instructions} 
                    onChange={handleInputChange} 
                    placeholder="E.g., Ring doorbell, leave with security" 
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: '#FFFFFF', color: '#1A1A1A' }} 
                  />
                </div>

                {/* Cashfree Payment Gateway Box */}
                <div style={{
                  background: '#F0F9F4',
                  border: '1.5px solid #A7F3D0',
                  borderRadius: '12px',
                  padding: '16px',
                  marginTop: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700', color: '#065F46', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
                      Cashfree Official Gateway
                    </span>
                    <span style={{ background: '#10B981', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase' }}>
                      100% Secure
                    </span>
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: '0.82rem', color: '#047857', lineHeight: '1.4' }}>
                    All Indian payment modes supported: <strong>UPI (GPay, PhonePe, Paytm, QR), Cards & Netbanking</strong>.
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ background: '#FFFFFF', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700', color: '#333', border: '1px solid #D1FAE5' }}>UPI Apps</span>
                    <span style={{ background: '#FFFFFF', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700', color: '#333', border: '1px solid #D1FAE5' }}>Google Pay</span>
                    <span style={{ background: '#FFFFFF', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700', color: '#333', border: '1px solid #D1FAE5' }}>PhonePe</span>
                    <span style={{ background: '#FFFFFF', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700', color: '#333', border: '1px solid #D1FAE5' }}>Paytm</span>
                    <span style={{ background: '#FFFFFF', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '700', color: '#333', border: '1px solid #D1FAE5' }}>Cards & Netbanking</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isPaying}
                  className="shop-btn" 
                  style={{ 
                    marginTop: '15px', 
                    width: '100%', 
                    padding: '16px', 
                    fontSize: '1.1rem', 
                    fontWeight: '700', 
                    backgroundColor: isPaying ? '#888' : '#1E88E5', 
                    boxShadow: '0 5px 15px rgba(30, 136, 229, 0.3)',
                    cursor: isPaying ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isPaying ? 'Connecting to Cashfree Gateway...' : `Proceed to Pay ₹${totalPrice.toFixed(2)} via Cashfree`}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Glassmorphic Order Confirmation Modal */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease',
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '40px 30px',
            width: '100%',
            maxWidth: '470px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            border: '2px solid #E8F5E9'
          }}>
            {/* Green Checkmark Badge */}
            <div style={{
              width: '80px',
              height: '80px',
              background: '#E8F5E9',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '2px solid #2E7D32',
              boxShadow: '0 8px 20px rgba(46, 125, 50, 0.2)'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-color)', marginBottom: '8px', fontFamily: "'Playfair Display', serif" }}>
              Order Confirmed & Paid!
            </h2>
            <p style={{ color: '#2E7D32', fontSize: '0.95rem', fontWeight: '700', marginBottom: '20px' }}>
              Thank you {confirmedOrder?.name || 'Customer'}! Your order has been placed with Satvikana.
            </p>

            {confirmedOrder && (
              <div style={{ background: '#F9FBF9', padding: '16px 20px', borderRadius: '14px', border: '1px solid #E0EFE0', textAlign: 'left', marginBottom: '20px', fontSize: '0.88rem' }}>
                <p style={{ margin: '4px 0', color: '#333' }}><strong>Order ID:</strong> #{confirmedOrder.id}</p>
                <p style={{ margin: '4px 0', color: '#333' }}><strong>Amount Paid:</strong> <span style={{ color: 'var(--accent-color)', fontWeight: '800' }}>₹{parseFloat(confirmedOrder.total_price || 0).toFixed(2)}</span></p>
                <p style={{ margin: '4px 0', color: '#333' }}><strong>Payment Mode:</strong> {confirmedOrder.payment_method}</p>
                {confirmedOrder.payment_id && (
                  <p style={{ margin: '4px 0', color: '#666', fontSize: '0.8rem', wordBreak: 'break-all' }}>
                    <strong>Ref ID:</strong> {confirmedOrder.payment_id}
                  </p>
                )}
                <p style={{ margin: '4px 0', color: '#333' }}><strong>Delivery to:</strong> {confirmedOrder.name} ({confirmedOrder.contact})</p>
                {confirmedOrder.address && (
                  <p style={{ margin: '4px 0', color: '#555', fontSize: '0.83rem' }}><strong>Address:</strong> {confirmedOrder.address}</p>
                )}
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* WhatsApp Support Button */}
              <a
                href={`https://wa.me/918401430933?text=${encodeURIComponent(`Hello Satvikana! I placed Order #${confirmedOrder?.id || ''} for ₹${parseFloat(confirmedOrder?.total_price || 0).toFixed(2)}. Please share dispatch updates.`)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '13px',
                  fontSize: '0.95rem',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '25px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                }}
              >
                💬 Get WhatsApp Delivery Updates
              </a>

              {token ? (
                <button 
                  onClick={() => {
                    setShowSuccessModal(false);
                    window.location.href = '/order-history';
                  }} 
                  className="shop-btn" 
                  style={{ width: '100%', padding: '13px', fontSize: '0.95rem', backgroundColor: '#2E7D32', border: 'none', borderRadius: '25px' }}
                >
                  View in Order History
                </button>
              ) : null}

              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  window.location.href = '/products';
                }} 
                style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', textDecoration: 'underline' }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
