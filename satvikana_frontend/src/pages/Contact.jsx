import React, { useState } from 'react';
import { Mail, MapPin, Phone, Building2 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${formData.name}! Your message has been sent successfully. We will get back to you soon.`);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="page-container" style={{ background: 'var(--bg-color)', minHeight: '80vh', padding: '60px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '3.5rem', color: 'var(--primary-color)', marginBottom: '15px' }}>Contact <span>Us</span></h1>
        <h3 style={{ fontSize: '1.3rem', color: 'var(--accent-color)', fontWeight: '600' }}>We'd Love to Hear From You</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '15px auto 0' }}>
          For product inquiries, support, or any questions, feel free to get in touch with us. 
        </p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '50px', background: 'var(--surface-color)', borderRadius: '25px', boxShadow: 'var(--shadow-custom)', overflow: 'hidden' }}>
        
        {/* Left Information Panel */}
        <div style={{ flex: '1', minWidth: '350px', background: 'var(--primary-color)', color: 'white', padding: '50px', display: 'flex', flexDirection: 'column', gap: '35px' }}>
          
          <div>
            <h3 style={{ color: 'var(--accent-color)', fontSize: '1.4rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 size={24} /> B2B & Bulk Orders
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', opacity: 0.9 }}>
              <strong>For Bulk Orders, please contact us directly.</strong><br/>
              Dealers & Distributors are Welcome.
            </p>
          </div>

          <div>
            <h3 style={{ color: 'var(--accent-color)', fontSize: '1.4rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={24} /> Contact Details
            </h3>
            <p style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '15px', opacity: 0.9 }}>
              <a href="mailto:diyajaventures@gmail.com" style={{ color: 'white', textDecoration: 'none' }}>diyajaventures@gmail.com</a>
            </p>
          </div>

          <div>
            <h3 style={{ color: 'var(--accent-color)', fontSize: '1.4rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={24} /> Our Office Address
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.9 }}>
              Shaligram,<br/>
              Nikol<br/>
              Ahmedabad – 382350<br/>
              Gujarat, India
            </p>
          </div>
          
        </div>

        {/* Right Form Panel */}
        <div style={{ flex: '1.2', minWidth: '350px', padding: '50px' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '30px' }}>Send us a Message</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Your Name *" 
                  required 
                  style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '1rem' }} 
                />
              </div>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="Phone Number" 
                  style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '1rem' }} 
                />
              </div>
            </div>

            <div>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Email Address *" 
                required 
                style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '1rem' }} 
              />
            </div>

            <div>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                placeholder="How can we help you?" 
                rows="5" 
                required
                style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '1rem', resize: 'vertical' }}
              ></textarea>
            </div>

            <button type="submit" className="shop-btn" style={{ padding: '18px', fontSize: '1.1rem', borderRadius: '40px', width: '200px', fontWeight: 'bold' }}>
              Send Message
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
