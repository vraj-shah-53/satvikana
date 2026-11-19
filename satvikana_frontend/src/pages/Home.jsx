import React from 'react';
import { Link } from 'react-router-dom';
import Makhana3DCarousel from '../components/Makhana3DCarousel';

const Home = () => {
  return (
    <div>
      {/* Hero Banner Section */}
      <section className="hero-banner-container">
        <img src="/home_banner.png" alt="Satvikana Banner" className="hero-banner-img" />
      </section>

      {/* 3D E-Commerce Carousel for Flavoured Makhana Products */}
      <Makhana3DCarousel />

      {/* Photos Section */}
      <section className="photos-section">
        <div className="photo-panel kid-panel">
          <img src="/kid.jpeg" alt="Kid loving Makhana" />
          <div className="photo-overlay">
            <h3>Joy in Every Bite</h3>
            <p>100% safe, nutritious, and loved by kids.</p>
          </div>
        </div>
        <div className="photo-panel">
          <img src="/family.png" alt="Family enjoying Makhana" />
          <div className="photo-overlay">
            <h3>Family Time Essential</h3>
            <p>The perfect guilt-free snack for your evenings.</p>
          </div>
        </div>
      </section>

      {/* Factory and Health Benefits Section */}
      <section className="factory-section home-section" style={{ background: 'var(--surface-color)' }}>
        <div className="home-section-img-wrapper" style={{ aspectRatio: '4/3' }}>
          <img src="/factory.jpeg" alt="Satvikana Factory" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="home-section-content">
          <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>The <span>Makhana</span> Journey</h2>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            From the pristine ponds to our modern, hygienic processing facility, every Satvikana Makhana goes through rigorous quality checks. We ensure zero nutrient loss during the roasting process.
            <br/><br/>
            <strong>Why is Makhana great for your body?</strong><br/>
            Makhana (Fox Nuts) are considered a superfood in Ayurveda. They are packed with essential proteins, fiber, potassium, and magnesium. Eating makhana supports heart health, aids in weight loss, and provides anti-aging properties thanks to high antioxidant levels. It's a low-caloric, gluten-free snack that keeps you full and energized throughout the day!
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2 className="section-title">What Our <span>Customers Say</span></h2>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p className="quote">"Absolutely love the peri peri flavour! Satvikana is my go-to snack."</p>
            <p className="author">- Priya Sharma</p>
          </div>
          <div className="testimonial-card">
            <p className="quote">"My kids can't get enough of the cheesy masti! Healthy and tasty."</p>
            <p className="author">- Rohan Gupta</p>
          </div>
          <div className="testimonial-card">
            <p className="quote">"Best makhana brand ever. The crunch is just perfect!"</p>
            <p className="author">- Aisha Khan</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
