import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Building2, 
  Award, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShoppingBag,
  Leaf,
  Clock,
  Heart,
  FileText
} from 'lucide-react';

const ProductInfo = () => {
  return (
    <div style={{
      background: 'linear-gradient(180deg, #F9F6F0 0%, #F3ECE1 100%)',
      minHeight: '100vh',
      padding: '30px 16px 80px',
      fontFamily: "'ProperAmpersand', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#2B3329'
    }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>

        {/* Top Header Card */}
        <div style={{
          background: 'linear-gradient(135deg, #1E4620 0%, #2F5233 100%)',
          borderRadius: '24px',
          padding: '35px 25px',
          textAlign: 'center',
          color: '#FFFFFF',
          boxShadow: '0 12px 35px rgba(30, 70, 32, 0.25)',
          marginBottom: '25px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle background glow */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'rgba(255, 224, 130, 0.15)',
            filter: 'blur(30px)'
          }} />

          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', borderRadius: '18px', padding: '10px 18px', marginBottom: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <img src="/logo.jpeg" alt="Satvikana" style={{ height: '55px', objectFit: 'contain' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShieldCheck size={20} color="#FFE082" />
            <span style={{ color: '#FFE082', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
              100% Genuine Certified Product
            </span>
          </div>

          <h1 style={{ margin: '0 0 10px', fontSize: '2.1rem', fontWeight: '700', fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '-0.3px' }}>
            Statutory <span className="amp">&</span> Product Compliance
          </h1>
          <p style={{ margin: 0, fontSize: '0.98rem', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '540px', margin: '0 auto', lineHeight: '1.5' }}>
            Official packaging disclosures, statutory licensing, manufacturer information, and quality parameters.
          </p>
        </div>

        {/* Veg Badge & Certification Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          flexWrap: 'wrap',
          marginBottom: '25px'
        }}>
          {/* Green Veg Symbol */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1.5px solid #A5D6A7',
            padding: '6px 14px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              width: '18px',
              height: '18px',
              border: '2px solid #2E7D32',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2E7D32' }} />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#2E7D32' }}>100% Vegetarian</span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1.5px solid #FFE082',
            padding: '6px 14px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <Leaf size={16} color="#2E7D32" />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1E4620' }}>Zero Preservatives</span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1.5px solid #CE93D8',
            padding: '6px 14px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <Sparkles size={16} color="#7B1FA2" />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#7B1FA2' }}>Hand Roasted</span>
          </div>
        </div>

        {/* Card 1: Statutory Manufacturer & FSSAI Details */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '28px 24px',
          border: '1.5px solid #EAE5DC',
          boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
          marginBottom: '22px'
        }}>
          <h2 style={{
            margin: '0 0 20px',
            fontSize: '1.25rem',
            fontWeight: '700',
            fontFamily: "'Playfair Display', Georgia, serif",
            color: '#1E4620',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderBottom: '1.5px solid #F0ECE4',
            paddingBottom: '12px'
          }}>
            <Building2 size={22} color="#D48806" />
            Manufacturer <span className="amp">&</span> Regulatory Disclosures
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
            {/* Brand Name */}
            <div style={{ background: '#FAF8F5', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ECE7DE' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#7A8277', fontWeight: '700', letterSpacing: '0.5px' }}>
                Brand Name
              </span>
              <p style={{ margin: '3px 0 0', fontSize: '1.2rem', fontWeight: '800', color: '#1E4620' }}>
                Satvikana
              </p>
            </div>

            {/* Firm Name */}
            <div style={{ background: '#FAF8F5', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ECE7DE' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#7A8277', fontWeight: '700', letterSpacing: '0.5px' }}>
                Marketed <span className="amp">&</span> Packed By (Firm Name)
              </span>
              <p style={{ margin: '3px 0 0', fontSize: '1.2rem', fontWeight: '800', color: '#1E4620' }}>
                Diyaja Ventures
              </p>
            </div>

            {/* Manufacturer Name */}
            <div style={{ background: '#FAF8F5', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ECE7DE' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#7A8277', fontWeight: '700', letterSpacing: '0.5px' }}>
                Manufacturer Name
              </span>
              <p style={{ margin: '3px 0 0', fontSize: '1.2rem', fontWeight: '800', color: '#1E4620' }}>
                Flavoures mukhvas
              </p>
            </div>

            {/* FSSAI License */}
            <div style={{ 
              background: '#FFFDE7', 
              padding: '14px 16px', 
              borderRadius: '12px', 
              border: '1.5px solid #FFF59D'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#827717', fontWeight: '800', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={16} /> FSSAI License Number
                </span>
                <span style={{ background: '#2E7D32', color: '#FFFFFF', fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '10px' }}>
                  CERTIFIED
                </span>
              </div>
              <p style={{ margin: '6px 0 2px', fontSize: '1.35rem', fontWeight: '900', color: '#33691E', letterSpacing: '1.5px' }}>
                10722026000979
              </p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#689F38' }}>
                Food Safety and Standards Authority of India
              </p>
            </div>

            {/* Manufacturer Address */}
            <div style={{ 
              background: '#FAF8F5', 
              padding: '16px', 
              borderRadius: '12px', 
              border: '1px solid #ECE7DE',
              gridColumn: '1 / -1'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <MapPin size={17} color="#D48806" />
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#7A8277', fontWeight: '700' }}>
                  Manufacturer Address
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: '#2B3329', lineHeight: '1.6' }}>
                321, 3rd Floor, Satyam Mall, Mansi Circle, Satellite, Ahmedabad – 380015, Gujarat, India.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Customer Care & Official Contacts */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '28px 24px',
          border: '1.5px solid #EAE5DC',
          boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
          marginBottom: '22px'
        }}>
          <h2 style={{
            margin: '0 0 20px',
            fontSize: '1.25rem',
            fontWeight: '700',
            fontFamily: "'Playfair Display', Georgia, serif",
            color: '#1E4620',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderBottom: '1.5px solid #F0ECE4',
            paddingBottom: '12px'
          }}>
            <Phone size={22} color="#D48806" />
            Customer Support <span className="amp">&</span> Grievance Redressal
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {/* Helpline / Phone */}
            <a 
              href="tel:+918401430933" 
              style={{
                textDecoration: 'none',
                background: '#FAF8F5',
                border: '1.5px solid #E0DCD4',
                padding: '14px 16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#E8F5E9', color: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#7A8277', fontWeight: '700' }}>
                  Customer Care Helpline
                </span>
                <p style={{ margin: 0, fontSize: '0.98rem', fontWeight: '800', color: '#1E4620' }}>
                  +91 8401430933
                </p>
              </div>
            </a>

            {/* Email */}
            <a 
              href="mailto:diyajaventures@gmail.com" 
              style={{
                textDecoration: 'none',
                background: '#FAF8F5',
                border: '1.5px solid #E0DCD4',
                padding: '14px 16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FFF3E0', color: '#D48806', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#7A8277', fontWeight: '700' }}>
                  Official Email
                </span>
                <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: '800', color: '#1E4620', wordBreak: 'break-all' }}>
                  diyajaventures@gmail.com
                </p>
              </div>
            </a>

            {/* Official Website */}
            <a 
              href="https://satvikana.com" 
              target="_blank" 
              rel="noreferrer" 
              style={{
                textDecoration: 'none',
                background: '#FAF8F5',
                border: '1.5px solid #E0DCD4',
                padding: '14px 16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                gridColumn: '1 / -1'
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#E3F2FD', color: '#1565C0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#7A8277', fontWeight: '700' }}>
                  Official Store Website
                </span>
                <p style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#1565C0' }}>
                  https://satvikana.com
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Card 3: Product Information & Standards */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '28px 24px',
          border: '1.5px solid #EAE5DC',
          boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
          marginBottom: '30px'
        }}>
          <h2 style={{
            margin: '0 0 20px',
            fontSize: '1.25rem',
            fontWeight: '700',
            fontFamily: "'Playfair Display', Georgia, serif",
            color: '#1E4620',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderBottom: '1.5px solid #F0ECE4',
            paddingBottom: '12px'
          }}>
            <Sparkles size={22} color="#D48806" />
            Product Specifications <span className="amp">&</span> Nutrition Guide
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E0DCD4', paddingBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ fontWeight: '700', color: '#7A8277' }}>Product Name</span>
              <strong style={{ color: '#1E4620' }}>Satvikana 100% Hand-Roasted Premium Makhana</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E0DCD4', paddingBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ fontWeight: '700', color: '#7A8277' }}>Common Names</span>
              <strong style={{ color: '#1E4620' }}>Fox Nuts / Gorgon Nuts / Phool Makhana</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E0DCD4', paddingBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ fontWeight: '700', color: '#7A8277' }}>Available Flavours</span>
              <strong style={{ color: '#1E4620', textAlign: 'right' }}>
                Peri Peri • Cheesy Masti • Himalayan Salt • Mint Masala • Raw Organic
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E0DCD4', paddingBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ fontWeight: '700', color: '#7A8277' }}>Net Pack Sizes</span>
              <strong style={{ color: '#1E4620' }}>70g (Airtight Jars) | 200g (Raw Organic Pack)</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E0DCD4', paddingBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ fontWeight: '700', color: '#7A8277' }}>Dietary Properties</span>
              <strong style={{ color: '#2E7D32' }}>Gluten-Free • High Protein • High Fiber • Low Calorie</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E0DCD4', paddingBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ fontWeight: '700', color: '#7A8277' }}>Shelf Life / Best Before</span>
              <strong style={{ color: '#1E4620' }}>6 Months from Date of Packaging</strong>
            </div>

            <div style={{ background: '#FAF8F5', padding: '14px 16px', borderRadius: '12px', marginTop: '6px' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#7A8277', fontWeight: '800' }}>
                Storage <span className="amp">&</span> Handling Instructions:
              </span>
              <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#555', lineHeight: '1.5' }}>
                Store in a cool, hygienic, and dry place. Keep away from direct sunlight, high heat, and humidity. Once opened, keep the jar tightly sealed to maintain maximum crunch and freshness.
              </p>
            </div>
          </div>
        </div>

        {/* Big Bottom Action Button: Check Products */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '18px 45px',
              background: 'linear-gradient(135deg, #D48806 0%, #B77405 100%)',
              color: '#FFFFFF',
              borderRadius: '35px',
              textDecoration: 'none',
              fontSize: '1.25rem',
              fontWeight: '800',
              letterSpacing: '0.3px',
              boxShadow: '0 10px 30px rgba(212, 136, 6, 0.4)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              width: '90%',
              maxWidth: '420px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(212, 136, 6, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(212, 136, 6, 0.4)';
            }}
          >
            <ShoppingBag size={24} />
            Check Products
            <ArrowRight size={22} />
          </Link>
          <p style={{ margin: '12px 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Explore all freshly roasted flavours <span className="amp">&</span> order online with fast doorstep delivery.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ProductInfo;
