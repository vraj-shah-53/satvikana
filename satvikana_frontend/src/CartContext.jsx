import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('satvikana_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [toast, setToast] = useState({ show: false, message: '', productName: '' });

  useEffect(() => {
    localStorage.setItem('satvikana_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    
    // Trigger toast notification
    const shortName = product.name.split('|')[0].trim();
    setToast({ show: true, message: 'Added to cart successfully!', productName: shortName });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast(prev => {
        if (prev.productName === shortName) {
          return { ...prev, show: false };
        }
        return prev;
      });
    }, 3000);
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(prevCart => prevCart.map(item => item.id === id ? { ...item, quantity: quantity } : item));
    }
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartQuantity, clearCart, toast, setToast }}>
      {children}
      
      {/* Beautiful Global Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: '#FFFFFF',
          color: '#1A1A1A',
          padding: '16px 24px',
          borderRadius: '16px',
          boxShadow: '0 10px 35px rgba(0,0,0,0.15)',
          borderLeft: '5px solid #2F5233',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          zIndex: 10000,
          animation: 'slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          <style>{`
            @keyframes slideIn {
              from { transform: translateY(50px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
          
          {/* Cart Icon wrapper */}
          <div style={{
            width: '40px',
            height: '40px',
            background: 'rgba(47, 82, 51, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2F5233'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </div>
          
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.95rem', color: '#1A1A1A', fontFamily: "'Outfit', sans-serif" }}>{toast.productName}</p>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#555555', fontFamily: "'Outfit', sans-serif" }}>{toast.message}</p>
          </div>
          
          {/* View Cart link */}
          <a href="/cart" style={{
            marginLeft: '15px',
            background: '#2F5233',
            color: '#FFFFFF',
            padding: '8px 18px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            textDecoration: 'none',
            boxShadow: '0 4px 10px rgba(47, 82, 51, 0.2)',
            fontFamily: "'Outfit', sans-serif"
          }}>
            View Cart
          </a>
        </div>
      )}
    </CartContext.Provider>
  );
};
