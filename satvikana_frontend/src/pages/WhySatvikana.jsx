import React from 'react';
import { Heart, Activity, Leaf, ShieldCheck, Sun } from 'lucide-react';

const WhySatvikana = () => {
  const benefits = [
    { icon: <Heart size={32} color="var(--accent-color)" />, title: "Heart Healthy", desc: "Low in cholesterol, sodium, and saturated fats. Makhana naturally keeps your heart beating strong." },
    { icon: <Activity size={32} color="var(--accent-color)" />, title: "Rich in Protein", desc: "An excellent source of pure plant-based protein, making it an ideal post-workout snack." },
    { icon: <Leaf size={32} color="var(--accent-color)" />, title: "100% Organic", desc: "Harvested directly from natural river ponds without the use of harsh synthetic chemicals." },
    { icon: <ShieldCheck size={32} color="var(--accent-color)" />, title: "High Antioxidants", desc: "Abundant in powerful antioxidants like kaempferol that prevent inflammation and aging." },
    { icon: <Sun size={32} color="var(--accent-color)" />, title: "Gluten-Free", desc: "A naturally gluten-free grain, perfect for those with celiac disease or gluten sensitivities." }
  ];

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Hero Header */}
      <div className="why-hero-header">
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="why-hero-title">Why <span>Satvikana?</span></h1>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.6', opacity: 0.9 }}>
            We believe that snacking shouldn't come with guilt. Satvikana brings you the purest, crunchiest, and most flavorful Fox Nuts—a superfood revered for centuries in Ayurveda, now perfected for the modern palate.
          </p>
        </div>
      </div>

      <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div className="why-flex-section">
          <div className="why-content-card">
            <h2 className="why-section-title">The Ancient <span style={{ color: 'var(--accent-color)' }}>Superfood</span></h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '20px' }}>
              Makhana, also known as Fox Nuts or Gorgon Nuts, are seeds derived from the Euryale ferox plant, which grows natively in stagnant water bodies across Eastern Asia. For over 2000 years, mankind has harvested them for their powerful medicinal properties.
            </p>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              Unlike heavily processed potato chips or artificial snacks, Makhana is incredibly light on the stomach, carries a lower glycemic index, and boasts an addictive natural crunch that satisfies your midnight cravings healthily!
            </p>
          </div>
          <div className="why-image-card">
            <img src="/best_image.png" alt="Premium Raw Makhana" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* Section 2: Core Health Benefits Grid */}
        <div style={{ marginBottom: '100px', textAlign: 'center' }}>
          <h2 className="why-section-title" style={{ marginBottom: '50px' }}>Why Your Body Loves <span style={{ color: 'var(--accent-color)' }}>Makhana</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {benefits.map((item, idx) => (
              <div key={idx} style={{ 
                background: 'var(--surface-color)', 
                padding: '40px 30px', 
                borderRadius: '15px', 
                boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
                border: '1px solid var(--border-color)',
                transition: 'transform 0.3s ease'
              }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ background: 'rgba(212, 136, 6, 0.1)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', marginBottom: '15px' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: The Satvikana Promise (Factory/Quality) */}
        <div className="why-promise-card">
          <div className="why-image-card">
            <img src="/factory.jpeg" alt="Satvikana Factory Quality Control" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="why-content-card">
            <h2 className="why-section-title">The <span style={{ color: 'var(--accent-color)' }}>Satvikana</span> Promise</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '20px' }}>
              At Satvikana, the journey from the pond to your pouch is governed by uncompromising hygiene protocols. We hand-pick only the largest, fluffiest Phool Makhana from our trusted farms.
            </p>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              They are slow-roasted perfectly to lock in the nutrients and uniquely flavored using 100% natural spices without any synthetic thickeners, preservatives, or artificial colors. We promise an elite snacking experience that bridges incredible taste with profound health over every bite.
            </p>
          </div>
        </div>
        
        {/* Call to action */}
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--primary-color)', marginBottom: '20px' }}>Ready to Switch Your Snack?</h2>
          <button 
            onClick={() => window.location.href='/products'}
            style={{ 
              background: 'var(--primary-color)', 
              color: 'white', 
              border: 'none', 
              padding: '18px 50px', 
              fontSize: '1.2rem', 
              borderRadius: '40px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 10px 25px rgba(47, 82, 51, 0.4)',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Explore Our Flavours
          </button>
        </div>

      </div>
    </div>
  );
};

export default WhySatvikana;
