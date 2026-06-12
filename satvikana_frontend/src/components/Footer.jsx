import React from 'react';
import { Mail, Phone, Truck, Star, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerBgColor = '#1a1612'; // Dark olive-brown/black background
  const mutedBeige = '#a09c90'; // Muted text color
  const accentGold = '#c5a880'; // Heading and accent color
  
  const linkStyle = {
    color: mutedBeige,
    textDecoration: 'none',
    fontSize: '0.9rem',
    display: 'block',
    marginBottom: '12px',
    transition: 'color 0.2s ease',
    textAlign: 'left'
  };

  const handleLinkHover = (e, hover) => {
    e.target.style.color = hover ? '#ffffff' : mutedBeige;
  };

  const socialLinkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: mutedBeige,
    transition: 'all 0.3s ease',
  };

  const handleSocialHover = (e, hover) => {
    e.currentTarget.style.color = hover ? '#ffffff' : mutedBeige;
    e.currentTarget.style.borderColor = hover ? '#ffffff' : 'rgba(255, 255, 255, 0.15)';
    e.currentTarget.style.backgroundColor = hover ? 'rgba(255, 255, 255, 0.05)' : 'transparent';
  };

  const columnTitleStyle = {
    color: accentGold,
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginBottom: '20px',
    fontFamily: "'Outfit', sans-serif",
    textAlign: 'left'
  };

  const paymentBadgeStyle = {
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    padding: '3px 10px',
    background: 'rgba(255, 255, 255, 0.03)',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    letterSpacing: '0.5px'
  };

  return (
    <footer style={{ background: footerBgColor, color: '#ffffff', fontFamily: "'Outfit', sans-serif" }}>
      {/* Top Footer Section */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', padding: '60px 40px 30px', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Brand Info */}
        <div style={{ flex: '1.5', minWidth: '260px', textAlign: 'left' }}>
          <h2 style={{ color: '#ffffff', fontSize: '2.2rem', fontFamily: "'Playfair Display', serif", margin: '0 0 15px', fontWeight: '500' }}>
            Satvikana
          </h2>
          <p style={{ color: mutedBeige, fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px', maxWidth: '320px' }}>
            Pure, natural & organic food products crafted for healthy living. From farm to your table — with love.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a 
              href="https://www.instagram.com/satvikana_1?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
              target="_blank" 
              rel="noreferrer" 
              style={socialLinkStyle}
              onMouseEnter={(e) => handleSocialHover(e, true)}
              onMouseLeave={(e) => handleSocialHover(e, false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noreferrer" 
              style={socialLinkStyle}
              onMouseEnter={(e) => handleSocialHover(e, true)}
              onMouseLeave={(e) => handleSocialHover(e, false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          </div>
        </div>

        {/* SHOP Links */}
        <div style={{ flex: '1', minWidth: '150px' }}>
          <h4 style={columnTitleStyle}>SHOP</h4>
          <Link 
            to="/products" 
            style={linkStyle}
            onMouseEnter={(e) => handleLinkHover(e, true)}
            onMouseLeave={(e) => handleLinkHover(e, false)}
          >
            All Products
          </Link>
          <Link 
            to="/products" 
            style={linkStyle}
            onMouseEnter={(e) => handleLinkHover(e, true)}
            onMouseLeave={(e) => handleLinkHover(e, false)}
          >
            Makhana
          </Link>
          <Link 
            to="/products" 
            style={linkStyle}
            onMouseEnter={(e) => handleLinkHover(e, true)}
            onMouseLeave={(e) => handleLinkHover(e, false)}
          >
            Cookies
          </Link>
          <Link 
            to="/products" 
            style={linkStyle}
            onMouseEnter={(e) => handleLinkHover(e, true)}
            onMouseLeave={(e) => handleLinkHover(e, false)}
          >
            Millets
          </Link>
        </div>

        {/* COMPANY Links */}
        <div style={{ flex: '1', minWidth: '150px' }}>
          <h4 style={columnTitleStyle}>COMPANY</h4>
          <Link 
            to="/why-satvikana" 
            style={linkStyle}
            onMouseEnter={(e) => handleLinkHover(e, true)}
            onMouseLeave={(e) => handleLinkHover(e, false)}
          >
            Our Story
          </Link>
          <Link 
            to="/contact" 
            style={linkStyle}
            onMouseEnter={(e) => handleLinkHover(e, true)}
            onMouseLeave={(e) => handleLinkHover(e, false)}
          >
            Contact
          </Link>
          <Link 
            to="/contact" 
            style={linkStyle}
            onMouseEnter={(e) => handleLinkHover(e, true)}
            onMouseLeave={(e) => handleLinkHover(e, false)}
          >
            FAQ & Help
          </Link>
          <Link 
            to="/auth" 
            style={linkStyle}
            onMouseEnter={(e) => handleLinkHover(e, true)}
            onMouseLeave={(e) => handleLinkHover(e, false)}
          >
            Privacy Policy
          </Link>
          <Link 
            to="/auth" 
            style={linkStyle}
            onMouseEnter={(e) => handleLinkHover(e, true)}
            onMouseLeave={(e) => handleLinkHover(e, false)}
          >
            Returns
          </Link>
          <Link 
            to="/auth" 
            style={linkStyle}
            onMouseEnter={(e) => handleLinkHover(e, true)}
            onMouseLeave={(e) => handleLinkHover(e, false)}
          >
            Shipping Info
          </Link>
        </div>

        {/* CONTACT Info */}
        <div style={{ flex: '1.5', minWidth: '250px', textAlign: 'left' }}>
          <h4 style={columnTitleStyle}>CONTACT</h4>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: mutedBeige, marginBottom: '12px', fontSize: '0.9rem' }}>
            <Mail size={16} style={{ color: accentGold }} />
            <a 
              href="mailto:diyajaventures@gmail.com" 
              style={{ color: mutedBeige, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = mutedBeige}
            >
              diyajaventures@gmail.com
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: mutedBeige, marginBottom: '20px', fontSize: '0.9rem' }}>
            <Phone size={16} style={{ color: accentGold }} />
            <span>+91 79908 06243</span>
          </div>

          <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '20px 0' }} />

          {/* Special features badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: mutedBeige, fontSize: '0.9rem' }}>
              <Truck size={16} style={{ color: accentGold }} />
              <span>Free shipping above ₹499</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: mutedBeige, fontSize: '0.9rem' }}>
              <Star size={16} style={{ color: accentGold }} />
              <span>100% Natural & Organic</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: mutedBeige, fontSize: '0.9rem' }}>
              <RotateCcw size={16} style={{ color: accentGold }} />
              <span>Easy returns policy</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Footer Section */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '20px 40px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', maxWidth: '1200px', margin: '0 auto', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.4)' }}>
          
          <div>
            &copy; 2026 Satvikana. All rights reserved.
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="/auth" style={{ color: 'rgba(255, 255, 255, 0.4)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.4)'}>Privacy Policy</a>
            <a href="/auth" style={{ color: 'rgba(255, 255, 255, 0.4)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.4)'}>Terms of Service</a>
            <a href="/auth" style={{ color: 'rgba(255, 255, 255, 0.4)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.4)'}>Refund Policy</a>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={paymentBadgeStyle}>UPI</span>
            <span style={paymentBadgeStyle}>Razorpay</span>
            <span style={paymentBadgeStyle}>Visa</span>
            <span style={paymentBadgeStyle}>Mastercard</span>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
