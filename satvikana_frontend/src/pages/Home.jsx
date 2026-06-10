import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Hero Banner Section */}
      <section className="hero-banner-container">
        <img src="/home_banner.png" alt="Satvikana Banner" className="hero-banner-img" />
      </section>

      <section className="slider-container">
        <h2 className="section-title">Featured <span>Flavours</span></h2>
        <div className="slider-viewport" style={{ overflow: 'hidden', width: '100%', maxWidth: '800px', margin: '0 auto', position: 'relative', borderRadius: '20px', backgroundColor: 'var(--surface-color)', boxShadow: 'var(--shadow-custom)'}}>
          <div className="slider-track" style={{ display: 'flex', transition: 'transform 0.8s ease-in-out', transform: `translateX(-${currentSlide * 100}%)` }}>
            {products.length > 0 ? products.slice(0, 5).map(product => (
              <div key={product.id} className="slider-item" style={{ minWidth: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 20px 60px 20px' }}>
                <div style={{ height: '300px', width: '100%', overflow: 'hidden', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', position: 'relative', backgroundColor: '#FFFFFF' }}>
                  <img src={product.image ? (product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`) : "/best_image.png"} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '15px', color: 'var(--text-primary)', textAlign: 'center', maxWidth: '90%' }}>{product.name.split('|')[0]}</h3>
                <Link to={`/product/${product.id}`} style={{ zIndex: 10 }}>
                  <button className="shop-btn" style={{ padding: '12px 30px', fontSize: '1rem', boxShadow: '0 8px 25px rgba(212, 136, 6, 0.3)' }}>Shop Now</button>
                </Link>
              </div>
            )) : [1,2,3,4,5].map(i => (
              <div key={i} className="slider-item" style={{ minWidth: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 20px 60px 20px' }}>
                <div style={{ height: '300px', width: '100%', overflow: 'hidden', borderRadius: '15px', marginBottom: '20px', position: 'relative', backgroundColor: '#FFFFFF' }}>
                  <img src="/best_image.png" alt={`Flavour ${i}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '15px', color: 'var(--text-primary)', textAlign: 'center', maxWidth: '90%' }}>Premium Makhana Flavour {i}</h3>
                <button className="shop-btn" style={{ zIndex: 10, padding: '12px 30px', fontSize: '1rem', boxShadow: '0 8px 25px rgba(212, 136, 6, 0.3)' }}>Shop Now</button>
              </div>
            ))}
          </div>
          <div className="slider-dots" style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px' }}>
             {[0, 1, 2, 3, 4].map(idx => (
                <div key={idx} style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: currentSlide === idx ? 'var(--accent-color)' : '#CCC', transition: 'background-color 0.3s', cursor: 'pointer' }} onClick={() => setCurrentSlide(idx)}></div>
             ))}
          </div>
        </div>
      </section>

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
      <section className="factory-section" style={{ padding: '80px 20px', background: 'var(--surface-color)', display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ flex: '1.2', minWidth: '300px', maxWidth: '650px', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-custom)', aspectRatio: '4/3' }}>
          <img src="/factory.jpeg" alt="Satvikana Factory" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ flex: '1', minWidth: '300px', maxWidth: '600px' }}>
          <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>The <span>Makhana</span> Journey</h2>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            From the pristine ponds to our modern, hygienic processing facility, every Satvikana Makhana goes through rigorous quality checks. We ensure zero nutrient loss during the roasting process.
            <br/><br/>
            <strong>Why is Makhana great for your body?</strong><br/>
            Makhana (Fox Nuts) are considered a superfood in Ayurveda. They are packed with essential proteins, fiber, potassium, and magnesium. Eating makhana supports heart health, aids in weight loss, and provides anti-aging properties thanks to high antioxidant levels. It's a low-caloric, gluten-free snack that keeps you full and energized throughout the day!
          </p>
        </div>
      </section>

      {/* Khapli Wheat Info Section */}
      <section className="khapli-section" style={{ padding: '80px 20px', display: 'flex', flexWrap: 'wrap', gap: '50px', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ flex: '1.2', minWidth: '300px', maxWidth: '650px', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-custom)' }}>
          <img src="/khapli_story.jpg" alt="The Story of Khapli Wheat" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
        <div style={{ flex: '1', minWidth: '300px', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 className="section-title" style={{ textAlign: 'left', margin: 0 }}>Why Khapli Aata is <span>Better?</span></h2>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'var(--text-secondary)', margin: 0 }}>
            Khapli wheat, also known as ancient grain, is naturally richer in nutrients and easier to digest compared to regular wheat. With its low glycemic index and high fiber content, it supports better digestion and helps maintain balanced energy levels throughout the day.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'var(--text-secondary)', margin: 0, fontWeight: 'bold' }}>
            Make a healthier switch for your daily rotis with Satvikana Khapli Aata.
          </p>
          <Link to="/products/flour" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
            <button className="shop-btn" style={{ padding: '15px 35px', fontSize: '1.1rem', borderRadius: '30px', background: 'var(--accent-color)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 8px 25px rgba(212, 136, 6, 0.3)', transition: 'all 0.3s' }}>
              Switch to Gluten Free Flour
            </button>
          </Link>
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
