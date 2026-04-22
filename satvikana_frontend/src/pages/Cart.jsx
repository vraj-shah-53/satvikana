import React, { useContext, useState } from 'react';
import { CartContext } from '../CartContext';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    address: '',
    contact: '',
    instructions: '',
    paymentMethod: 'UPI'
  });

  const totalPrice = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);

  const handleDisplayCheckoutForm = () => {
    if (cart.length === 0) return;
    setIsCheckoutMode(true);
  };

  const handleInputChange = (e) => {
    setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (!orderDetails.name || !orderDetails.address || !orderDetails.contact) {
      alert("Please fill in all strictly required fields: Name, Address, and Contact Number.");
      return;
    }
    
    alert(`Thank you ${orderDetails.name}! Your order has been placed via ${orderDetails.paymentMethod}.\n\nTotal paid: ₹${totalPrice.toFixed(2)}`);
    clearCart();
    setIsCheckoutMode(false);
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
                    <img src="/best_image.png" alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ margin: '0 0 5px', color: 'var(--text-primary)', fontSize: '1rem' }}>{item.name.split('|')[0]}</h4>
                    <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Qty: {item.quantity}</p>
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
    </div>
  );
};

export default Cart;
