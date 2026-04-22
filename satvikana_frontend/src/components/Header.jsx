import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { CartContext } from '../CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useContext(CartContext);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="top-bar">
        Welcome to Satvikana - Discover the Pure & Natural Goodness of Premium Makhana
      </div>
      
      <div className="header-main" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Left - Hamburger and Dropdown */}
        <div className="header-left" style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', position: 'relative' }}>
          <div style={{ position: 'relative' }}>
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
                <Link to="/products" className="nav-dropdown-link" onClick={() => setIsMenuOpen(false)}>Products</Link>
                <Link to="/recipe" className="nav-dropdown-link" onClick={() => setIsMenuOpen(false)}>Recipe with Makhana</Link>
                <Link to="/why-satvikana" className="nav-dropdown-link" onClick={() => setIsMenuOpen(false)}>Why Satvikana</Link>
                <Link to="/contact" className="nav-dropdown-link" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
                <Link to="/auth" className="nav-dropdown-link" onClick={() => setIsMenuOpen(false)}>Login/Register</Link>
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
    </header>
  );
};

export default Header;
