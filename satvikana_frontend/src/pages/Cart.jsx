import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useContext(CartContext);
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [finalPaidAmount, setFinalPaidAmount] = useState(0);
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    address: '',
    contact: '',
    instructions: '',
    paymentMethod: 'UPI'
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
  }, []);

  const totalPrice = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);

  const handleDisplayCheckoutForm = () => {
    if (cart.length === 0) return;
    if (!token) {
      alert("Please log in or register to proceed to checkout and save your order details.");
      window.location.href = '/auth';
      return;
    }
    setIsCheckoutMode(true);
  };

  const handleInputChange = (e) => {
    setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!orderDetails.name || !orderDetails.address || !orderDetails.contact) {
      alert("Please fill in all strictly required fields: Name, Address, and Contact Number.");
      return;
    }

    try {
      // 1. Submit order to backend
      const orderPayload = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_price: totalPrice,
        name: orderDetails.name,
        address: orderDetails.address,
        contact: orderDetails.contact,
        instructions: orderDetails.instructions,
        payment_method: orderDetails.paymentMethod
      };

      const orderRes = await fetch('https://satvikana-backend.onrender.com/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json();
        throw new Error(errData.detail || errData.error || 'Failed to place the order.');
      }

      // 2. Concurrently update profile if needed
      try {
        const profileRes = await fetch('https://satvikana-backend.onrender.com/api/auth/profile/', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          },
          body: JSON.stringify({
            name: orderDetails.name,
            address: orderDetails.address,
            contact: orderDetails.contact
          })
        });

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          const currentUser = JSON.parse(localStorage.getItem('satvikana_user') || '{}');
          currentUser.profile = profileData;
          localStorage.setItem('satvikana_user', JSON.stringify(currentUser));
        }
      } catch (profileErr) {
        console.error("Non-critical error saving user profile:", profileErr);
      }

      setFinalPaidAmount(totalPrice);
      setShowSuccessModal(true);
      clearCart();
      setIsCheckoutMode(false);
    } catch (err) {
      alert(`Error placing order: ${err.message}`);
    }
  };

  return (
    <div className="page-container" style={{ padding: '40px 20px', background: 'var(--bg-color)' }}>
      <h1 className="section-title">Your <span>Cart</span></h1>
      
      {cart.length === 0 ? (
        <div style={{ marginTop: '50px', textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          Your cart is currently empty.
          <br/><br/>
          <button className="shop-btn" style={{ marginTop: '20px' }} onClick={() => window.location.href='/products'}>Continue Shopping</button>
        </div>
      ) : (
        <div style={{ marginTop: '40px', maxWidth: '900px', margin: '40px auto 0', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          
          {/* Left Column: Cart Items (Always visible but shrinks if checkout is open) */}
          <div style={{ flex: '1.5', minWidth: '350px' }}>
            {cart.map(item => (
              <div key={item.id} className="cart-item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', marginBottom: '15px', borderRadius: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden' }}>
                    <img src={item.image ? (item.image.startsWith('http') ? item.image : `https://satvikana-backend.onrender.com${item.image}`) : "/best_image.png"} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ margin: '0 0 5px', color: 'var(--text-primary)', fontSize: '1rem' }}>{item.name.split('|')[0]}</h4>
                    {!isCheckoutMode ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginRight: '4px' }}>Qty:</span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          style={{
                            background: 'rgba(0,0,0,0.05)',
                            color: 'var(--text-primary)',
                            border: 'none',
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            transition: 'var(--transition)'
                          }}
                        >
                          -
                        </button>
                        <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '1rem' }}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          style={{
                            background: 'rgba(0,0,0,0.05)',
                            color: 'var(--text-primary)',
                            border: 'none',
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            transition: 'var(--transition)'
                          }}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Qty: {item.quantity}</p>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>₹{(item.price * item.quantity).toFixed(2)}</p>
                  {!isCheckoutMode && (
                    <button onClick={() => removeFromCart(item.id)} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', transition: 'var(--transition)' }}>Remove</button>
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

          {/* Right Column: Checkout Form (Expands only when button clicked) */}
          {isCheckoutMode && (
            <div style={{ flex: '1', minWidth: '350px', background: 'var(--surface-color)', padding: '35px', borderRadius: '20px', boxShadow: 'var(--shadow-custom)', border: '2px solid var(--border-color)' }}>
              <h2 style={{ marginBottom: '25px', color: 'var(--primary-color)', fontSize: '1.6rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>Checkout Details</h2>
              <h3 style={{ textAlign: 'left', marginBottom: '20px', color: 'var(--text-primary)' }}>Order Total: <span style={{ color: 'var(--accent-color)' }}>₹{totalPrice.toFixed(2)}</span></h3>
              
              <form onSubmit={handleConfirmOrder} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Full Name <span style={{color: 'red'}}>*</span></label>
                  <input type="text" name="name" required value={orderDetails.name} onChange={handleInputChange} placeholder="Enter your name" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: '#FFFFFF', color: '#1A1A1A' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Delivery Address <span style={{color: 'red'}}>*</span></label>
                  <textarea name="address" required value={orderDetails.address} onChange={handleInputChange} placeholder="Enter complete shipping address" rows="3" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical', background: '#FFFFFF', color: '#1A1A1A' }}></textarea>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Contact Number <span style={{color: 'red'}}>*</span></label>
                  <input type="tel" name="contact" required value={orderDetails.contact} onChange={handleInputChange} placeholder="+91 00000 00000" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: '#FFFFFF', color: '#1A1A1A' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Other Instructions (Optional)</label>
                  <input type="text" name="instructions" value={orderDetails.instructions} onChange={handleInputChange} placeholder="E.g., Leave at the door" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: '#FFFFFF', color: '#1A1A1A' }} />
                </div>

                <div style={{ marginTop: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Payment Method</label>
                  {orderDetails.showAllPayments ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {['UPI (GPay, PhonePe, Paytm)', 'Netbanking', 'Credit / Debit Card Pay', 'Cash on Delivery'].map(method => (
                        <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', cursor: 'pointer', color: '#1A1A1A' }}>
                          <input type="radio" name="paymentOption" value={method} checked={orderDetails.paymentMethod === method} onChange={(e) => {
                            setOrderDetails({...orderDetails, paymentMethod: e.target.value, showAllPayments: false});
                          }} />
                          <span style={{ fontWeight: orderDetails.paymentMethod === method ? 'bold' : 'normal' }}>{method}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px' }}>
                      <span style={{ color: '#1A1A1A', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ width: '12px', height: '12px', background: 'var(--primary-color)', borderRadius: '50%', display: 'inline-block' }}></span>
                        {orderDetails.paymentMethod}
                      </span>
                      <button type="button" onClick={() => setOrderDetails({...orderDetails, showAllPayments: true})} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontWeight: '600' }}>Change / More Options</button>
                    </div>
                  )}
                </div>

                <button type="submit" className="shop-btn" style={{ marginTop: '20px', width: '100%', padding: '15px', fontSize: '1.1rem', backgroundColor: '#1E88E5', boxShadow: '0 5px 15px rgba(30, 136, 229, 0.3)' }}>
                  Confirm Order & Pay ₹{totalPrice.toFixed(2)}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Beautiful Glassmorphic Success Modal */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease'
        }}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleUp {
              from { transform: scale(0.8); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}</style>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '40px 30px',
            width: '90%',
            maxWidth: '430px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            animation: 'scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            {/* Animated Checkmark Circle */}
            <div style={{
              width: '80px',
              height: '80px',
              background: '#E8F5E9',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 25px',
              border: '2px solid #2E7D32',
              boxShadow: '0 8px 20px rgba(46, 125, 50, 0.15)'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-color)', marginBottom: '15px', fontFamily: "'Playfair Display', serif" }}>Order Confirmed!</h2>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '25px', fontFamily: "'Outfit', sans-serif" }}>
              Thank you <strong style={{ color: 'var(--text-primary)' }}>{orderDetails.name}</strong>!<br/> Your order has been placed successfully via <strong style={{ color: 'var(--text-primary)' }}>{orderDetails.paymentMethod}</strong>.
            </p>
            
            <div style={{ background: '#F4F8F4', padding: '15px 25px', borderRadius: '15px', border: '1px solid #E2EFE2', marginBottom: '30px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Paid</span>
              <strong style={{ color: 'var(--accent-color)', fontSize: '1.8rem', fontFamily: "'Outfit', sans-serif" }}>Rs. {finalPaidAmount.toFixed(2)}</strong>
            </div>
            
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                window.location.href = '/order-history';
              }} 
              className="shop-btn" 
              style={{ width: '100%', padding: '15px', fontSize: '1.05rem', backgroundColor: '#2E7D32', border: 'none', borderRadius: '30px', boxShadow: '0 5px 15px rgba(46, 125, 50, 0.3)' }}
            >
              View Order History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
