import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, MessageCircle } from 'lucide-react';
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
  const ADMIN_EMAILS = ['vrajjshah53@gmail.com', 'diyajaventures@gmail.com'];
  const userEmail = (user?.email || user?.username || '').toLowerCase();
  const isAdmin = Boolean(user && (user.is_admin || ADMIN_EMAILS.includes(userEmail)));

  return (
    <header className="header">
      <div className="top-bar">
        Welcome to Satvikana - Discover the Pure & Natural Goodness of Premium Makhana
      </div>
      
      <div className="header-main">
        
        {/* Left - Hamburger and Dropdown */}
        <div className="header-left">
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button className="icon-btn header-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>

            {/* Invisible bridge to prevent hover loss */}
            {isMenuOpen && (
              <div style={{ position: 'absolute', top: '100%', left: '0', width: '100%', height: '15px', zIndex: 999 }}></div>
            )}

            {/* Dropdown Menu specifically anchored here */}
            {isMenuOpen && (
              <div className="nav-menu-dropdown">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <button 
                    className="nav-dropdown-link nav-dropdown-btn" 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsProductsSubmenuOpen(!isProductsSubmenuOpen);
                    }}
                  >
                    <span>Products</span>
                    <span className="submenu-arrow" style={{ transform: isProductsSubmenuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>&rarr;</span>
                  </button>
                  {isProductsSubmenuOpen && (
                    <div className="nav-submenu-container">
                      <Link to="/products/raw" className="nav-dropdown-link" onClick={() => { setIsMenuOpen(false); setIsProductsSubmenuOpen(false); }}>Raw Makhana</Link>
                      <Link to="/products/flavoured" className="nav-dropdown-link" onClick={() => { setIsMenuOpen(false); setIsProductsSubmenuOpen(false); }}>Flavoured Makhana</Link>
                      <Link to="/products/combo" className="nav-dropdown-link" onClick={() => { setIsMenuOpen(false); setIsProductsSubmenuOpen(false); }}>Makhana Combo</Link>
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
                      className="nav-dropdown-link nav-logout-link" 
                      onClick={() => {
                        setIsMenuOpen(false);
                        localStorage.removeItem('satvikana_token');
                        localStorage.removeItem('satvikana_user');
                        window.location.href = '/';
                      }} 
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
        <div className="header-center">
          <Link to="/" className="header-logo-link">
            <img src="/logo.jpeg" alt="Satvikana" className="logo" />
          </Link>
        </div>
        
        {/* Right - Bulk Order & Icons */}
        <div className="header-right">
          <a
            href="https://wa.me/918401430933?text=Hello%20Satvikana!%20I%20am%20interested%20in%20placing%20a%20Bulk%20Order."
            target="_blank"
            rel="noreferrer"
            className="bulk-order-btn"
            title="Place Bulk Order via WhatsApp (8401430933)"
          >
            <span className="bulk-order-dot"></span>
            <MessageCircle size={15} className="bulk-order-icon" />
            <span className="bulk-order-text">Bulk Order</span>
          </a>

          <Link to="/cart" className="icon-btn header-cart-btn" aria-label="Shopping Cart">
            <ShoppingCart size={22} />
            {cartItemCount > 0 && (
              <span className="cart-badge">
                {cartItemCount}
              </span>
            )}
          </Link>
          <Link to="/auth" className="icon-btn header-user-btn" aria-label="Account">
            <User size={22} />
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
