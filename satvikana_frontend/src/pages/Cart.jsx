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
        name: user.profile.name || '',
        address: user.profile.address || '',
        contact: user.profile.contact || ''
      }));
    }

    // Check for return_url redirect from Cashfree (?cf_order_id=...)
    const urlParams = new URLSearchParams(window.location.search);
    const cfOrderId = urlParams.get('cf_order_id');
    if (cfOrderId && token) {
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

      const res = await fetch(`${API_BASE_URL}/api/payment/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
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

  const handleDisplayCheckoutForm = () => {
    if (cart.length === 0) return;
    if (!token) {
      alert("Please log in or register to proceed to checkout and secure your order.");
      window.location.href = '/auth';
      return;
    }
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
      // Save pending shipping details in case of redirect
      const cartItemsPayload = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));
      localStorage.setItem('satvikana_pending_shipping', JSON.stringify(orderDetails));
      localStorage.setItem('satvikana_pending_items', JSON.stringify(cartItemsPayload));

      // 1. Request Cashfree order from backend
      const res = await fetch(`${API_BASE_URL}/api/payment/create-order/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
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
          // If browser redirects, return_url handles it
          return;
        }

        if (result.paymentDetails) {
          // 3. Payment succeeded in modal, verify with backend!
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

      const res = await fetch(`${API_BASE_URL}/api/payment/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
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
    <div className="page-container">
      <h1 className="section-title">Your <span>Cart</span></h1>
      
      {cart.length === 0 && !showSuccessModal ? (
        <div style={{ marginTop: '50px', textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          Your cart is currently empty.
          <br/><br/>
          <button className="shop-btn" style={{ marginTop: '20px' }} onClick={() => window.location.href='/products'}>Continue Shopping</button>
        </div>
      ) : (
        <div className="cart-layout-container">
          
          {/* Left Column: Cart Items */}
          <div className="cart-left-col">
            {cart.map(item => (
              <div key={item.id} className="cart-item-row">
                <div className="cart-item-left">
                  <div className="cart-item-img-wrapper">
                    <img src={item.image ? `/${item.image.split('/').pop()}` : "/best_image.png"} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{item.name.split('|')[0]}</h4>
                    {!isCheckoutMode ? (
                      <div className="cart-qty-selector">
                        <span className="qty-label">Qty:</span>
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
                      <p className="qty-display">Qty: {item.quantity}</p>
                    )}
                  </div>
                </div>
                <div className="cart-item-right">
                  <p className="cart-item-price">₹{(item.price * item.quantity).toFixed(2)}</p>
                  {!isCheckoutMode && (
                    <button onClick={() => removeFromCart(item.id)} className="cart-remove-btn">Remove</button>
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
              </div>
            )}
          </div>

          {/* Right Column: Checkout Form */}
          {isCheckoutMode && (
            <div className="cart-right-col" style={{ background: 'var(--surface-color)', padding: '35px', borderRadius: '20px', boxShadow: 'var(--shadow-custom)', border: '2px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1.6rem' }}>Checkout & Payment</h2>
                <button 
                  type="button" 
                  onClick={() => setIsCheckoutMode(false)}
                  style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
                >
                  Edit Cart
                </button>
              </div>

              <div style={{ background: '#FAF7F2', padding: '15px 20px', borderRadius: '12px', border: '1px solid #EAE3D6', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Total Payable Amount:</span>
                <strong style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>₹{totalPrice.toFixed(2)}</strong>
              </div>
              
              <form onSubmit={handleInitiateCashfreePayment} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Full Name <span style={{color: 'red'}}>*</span></label>
                  <input type="text" name="name" required value={orderDetails.name} onChange={handleInputChange} placeholder="Enter your full name" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: '#FFFFFF', color: '#1A1A1A' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Delivery Address <span style={{color: 'red'}}>*</span></label>
                  <textarea name="address" required value={orderDetails.address} onChange={handleInputChange} placeholder="House / Flat No., Street, Landmark, City, State, Pincode" rows="3" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical', background: '#FFFFFF', color: '#1A1A1A' }}></textarea>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Contact Phone Number <span style={{color: 'red'}}>*</span></label>
                  <input type="tel" name="contact" required value={orderDetails.contact} onChange={handleInputChange} placeholder="10-digit mobile number" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: '#FFFFFF', color: '#1A1A1A' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Delivery Instructions (Optional)</label>
                  <input type="text" name="instructions" value={orderDetails.instructions} onChange={handleInputChange} placeholder="E.g., Ring doorbell, leave with neighbor" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: '#FFFFFF', color: '#1A1A1A' }} />
                </div>

                {/* Cashfree Payment Gateway Box */}
                <div style={{
                  background: '#F0F9F4',
                  border: '1.5px solid #A7F3D0',
                  borderRadius: '12px',
                  padding: '16px',
                  marginTop: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700', color: '#065F46', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
                      Cashfree Official Gateway
                    </span>
                    <span style={{ background: '#10B981', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase' }}>
                      100% Secure
                    </span>
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: '0.82rem', color: '#047857', lineHeight: '1.4' }}>
                    All Indian payment modes supported: <strong>UPI (GPay, PhonePe, Paytm), Debit/Credit Cards, Netbanking & QR Code</strong>.
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
                    marginTop: '20px', 
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
            maxWidth: '460px',
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
              Payment Successful!
            </h2>
            <p style={{ color: '#2E7D32', fontSize: '0.95rem', fontWeight: '700', marginBottom: '20px' }}>
              Your order has been placed with Satvikana
            </p>

            {confirmedOrder && (
              <div style={{ background: '#F9FBF9', padding: '16px 20px', borderRadius: '14px', border: '1px solid #E0EFE0', textAlign: 'left', marginBottom: '25px', fontSize: '0.88rem' }}>
                <p style={{ margin: '4px 0', color: '#333' }}><strong>Order ID:</strong> #{confirmedOrder.id}</p>
                <p style={{ margin: '4px 0', color: '#333' }}><strong>Amount Paid:</strong> <span style={{ color: 'var(--accent-color)', fontWeight: '800' }}>₹{parseFloat(confirmedOrder.total_price || 0).toFixed(2)}</span></p>
                <p style={{ margin: '4px 0', color: '#333' }}><strong>Payment Mode:</strong> {confirmedOrder.payment_method}</p>
                {confirmedOrder.payment_id && (
                  <p style={{ margin: '4px 0', color: '#666', fontSize: '0.8rem', wordBreak: 'break-all' }}>
                    <strong>Ref ID:</strong> {confirmedOrder.payment_id}
                  </p>
                )}
                <p style={{ margin: '4px 0', color: '#333' }}><strong>Delivery to:</strong> {confirmedOrder.name} ({confirmedOrder.contact})</p>
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  window.location.href = '/order-history';
                }} 
                className="shop-btn" 
                style={{ width: '100%', padding: '14px', fontSize: '1rem', backgroundColor: '#2E7D32', border: 'none', borderRadius: '25px', boxShadow: '0 5px 15px rgba(46, 125, 50, 0.3)' }}
              >
                View in Order History
              </button>
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
