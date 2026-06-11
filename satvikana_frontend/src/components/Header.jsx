import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { CartContext } from '../CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsSubmenuOpen, setIsProductsSubmenuOpen] = useState(false);
  const { cart } = useContext(CartContext);
  const menuRef = useRef(null);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setIsProductsSubmenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setIsProductsSubmenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  const token = localStorage.getItem('satvikana_token');
  const userStr = localStorage.getItem('satvikana_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user && user.email === 'vrajjshah53@gmail.com';

  return (
    <header className="header">
      <div className="top-bar">
        Welcome to Satvikana - Discover the Pure & Natural Goodness of Premium Makhana
      </div>
      
      <div className="header-main" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Left - Hamburger and Dropdown */}
        <div className="header-left" style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', position: 'relative' }}>
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button className="icon-btn" onClick={toggleMenu} style={{ padding: '10px 0' }}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
 
            {/* Invisible bridge to prevent hover loss */}
            {isMenuOpen && (
              <div style={{ position: 'absolute', top: '100%', left: '0', width: '100%', height: '15px', zIndex: 999 }}></div>
            )}
 
            {/* Dropdown Menu specifically anchored here */}
            {isMenuOpen && (
              <div 
                className="nav-menu-dropdown" 
                style={{ 
                  position: 'absolute', 
                  top: 'calc(100% + 15px)', 
                  left: '0', 
                  background: '#000', 
                  border: '1px solid #333',
                  borderRadius: '10px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  minWidth: '220px',
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '10px 0',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <button 
                    className="nav-dropdown-link" 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsProductsSubmenuOpen(!isProductsSubmenuOpen);
                    }}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      borderBottom: '1px solid #1A1A1A', 
                      color: '#FFFFFF', 
                      textAlign: 'left', 
                      cursor: 'pointer',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontFamily: 'inherit'
                    }}
                  >
                    <span>Products</span>
                    <span style={{ fontSize: '0.8rem', transition: 'transform 0.3s', transform: isProductsSubmenuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>&rarr;</span>
                  </button>
                  {isProductsSubmenuOpen && (
                    <div style={{ background: '#0a0a0a', display: 'flex', flexDirection: 'column' }}>
                      <Link to="/products/raw" className="nav-dropdown-link" onClick={() => { setIsMenuOpen(false); setIsProductsSubmenuOpen(false); }} style={{ paddingLeft: '40px', fontSize: '0.85rem', textTransform: 'uppercase', borderBottom: '1px solid #111' }}>Raw Makhana</Link>
                      <Link to="/products/flavoured" className="nav-dropdown-link" onClick={() => { setIsMenuOpen(false); setIsProductsSubmenuOpen(false); }} style={{ paddingLeft: '40px', fontSize: '0.85rem', textTransform: 'uppercase', borderBottom: '1px solid #111' }}>Flavoured Makhana</Link>
                      <Link to="/products/combo" className="nav-dropdown-link" onClick={() => { setIsMenuOpen(false); setIsProductsSubmenuOpen(false); }} style={{ paddingLeft: '40px', fontSize: '0.85rem', textTransform: 'uppercase', borderBottom: '1px solid #111' }}>Makhana Combo</Link>
                      <Link to="/products/flour" className="nav-dropdown-link" onClick={() => { setIsMenuOpen(false); setIsProductsSubmenuOpen(false); }} style={{ paddingLeft: '40px', fontSize: '0.85rem', textTransform: 'uppercase', borderBottom: '1px solid #111' }}>Khapli Wheat Flour</Link>
                    </div>
                  )}
                </div>
                <Link to="/recipe" className="nav-dropdown-link" onClick={() => setIsMenuOpen(false)}>Recipe with Makhana</Link>
                <Link to="/why-satvikana" className="nav-dropdown-link" onClick={() => setIsMenuOpen(false)}>Why Satvikana</Link>
                <Link to="/contact" className="nav-dropdown-link" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
                {token ? (
                  <>
                    <Link to="/order-history" className="nav-dropdown-link" onClick={() => setIsMenuOpen(false)}>Order History</Link>
                    <Link to="/auth" className="nav-dropdown-link" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                    {isAdmin && (
                      <Link to="/admin-orders" className="nav-dropdown-link" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>Admin Dashboard</Link>
                    )}
                    <span 
                      className="nav-dropdown-link" 
                      onClick={() => {
                        setIsMenuOpen(false);
                        localStorage.removeItem('satvikana_token');
                        localStorage.removeItem('satvikana_user');
                        window.location.href = '/';
                      }} 
                      style={{ cursor: 'pointer', color: '#ff4d4d' }}
                    >
                      Logout
                    </span>
                  </>
                ) : (
                  <Link to="/auth" className="nav-dropdown-link" onClick={() => setIsMenuOpen(false)}>Login/Register</Link>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Center - Logo */}
        <div className="header-center" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Link to="/">
            <img src="/logo.jpeg" alt="Satvikana" className="logo" />
          </Link>
        </div>
        
        {/* Right - Icons */}
        <div className="header-right" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
          <Link to="/cart" className="icon-btn" style={{ position: 'relative' }}>
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-10px',
                background: '#ff4d4d',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 7px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}>
                {cartItemCount}
              </span>
            )}
          </Link>
          <Link to="/auth" className="icon-btn">
            <User size={24} />
          </Link>
        </div>

      </div>
      <div className="ticker-bar">
        <div className="ticker-wrapper">
          <div className="ticker-text">
            <span className="ticker-item">100% Roasted &bull; Natural Spices &bull; Rich in Protein &bull; No Preservatives &bull; Made with Care &bull; 24/7 Customer support &nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span className="ticker-item">100% Roasted &bull; Natural Spices &bull; Rich in Protein &bull; No Preservatives &bull; Made with Care &bull; 24/7 Customer support &nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
