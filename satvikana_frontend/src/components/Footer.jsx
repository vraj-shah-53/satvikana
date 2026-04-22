import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>Satvikana</h2>
          <p style={{color: '#999', marginTop: '10px'}}>Nourishing lives with the purest makhana directly from nature.</p>
        </div>
        
        <div className="newsletter">
          <input type="email" placeholder="Enter your email to connect with Satvikana" />
          <button type="button">Connect</button>
        </div>
        
        <div className="socials">
          <a href="https://www.instagram.com/satvikana_1?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" className="social-link" title="Follow us on Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="mailto:contact@satvikana.com" className="social-link" title="Email Us">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </a>
        </div>
      </div>
      
      <div className="footer-bottom">
        &copy; 2026, Satvikana. All rights reserved. Let the natural crunch refresh your day!
      </div>
    </footer>
  );
};

export default Footer;
