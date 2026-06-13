import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShoppingCart, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Star 
} from 'lucide-react';
import { CartContext } from '../CartContext';
import { API_BASE_URL } from '../config';
import './Makhana3DCarousel.css';

const Makhana3DCarousel = () => {
  const [products, setProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [wishlist, setWishlist] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { addToCart } = useContext(CartContext);
  const autoPlayRef = useRef(null);

  // Swipe & drag ref tracking
  const startX = useRef(0);
  const isDragging = useRef(false);

  // Track window size for dynamic responsive 3D transforms
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products/`)
      .then(res => res.json())
      .then(data => {
        const flavoured = data.filter(p => p.category === 'flavoured');
        setProducts(flavoured);
        
        if (flavoured.length > 0) {
          const periIdx = flavoured.findIndex(p => p.name.toLowerCase().includes('peri peri'));
          if (periIdx !== -1) {
            setActiveIndex(periIdx);
          } else {
            setActiveIndex(Math.floor(flavoured.length / 2));
          }
        }
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
      });
  }, []);

  // Autoplay functionality
  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 4000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [products, activeIndex]);

  const nextSlide = () => {
    if (products.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    if (products.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleCardClick = (index) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const toggleWishlist = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    stopAutoPlay();
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const currentX = e.touches[0].clientX;
    const diffX = startX.current - currentX;
    if (Math.abs(diffX) > 60) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      isDragging.current = false;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    startAutoPlay();
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    stopAutoPlay();
    startX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const currentX = e.clientX;
    const diffX = startX.current - currentX;
    if (Math.abs(diffX) > 60) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      isDragging.current = false;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    startAutoPlay();
  };

  // Helper values & styles
  const getFlavourGradient = (name) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('chaat') || lowercaseName.includes('masala')) {
      return 'linear-gradient(135deg, #ff9e2a 0%, #e65c00 100%)';
    }
    if (lowercaseName.includes('cheese') || lowercaseName.includes('cheesy')) {
      return 'linear-gradient(135deg, #ffd043 0%, #f59e0b 100%)';
    }
    if (lowercaseName.includes('cream') || lowercaseName.includes('onion')) {
      return 'linear-gradient(135deg, #a7f3d0 0%, #059669 100%)';
    }
    if (lowercaseName.includes('salt') || lowercaseName.includes('himalayan')) {
      return 'linear-gradient(135deg, #fecdd3 0%, #fb7185 100%)';
    }
    if (lowercaseName.includes('mint')) {
      return 'linear-gradient(135deg, #bbf7d0 0%, #22c55e 100%)';
    }
    if (lowercaseName.includes('pepper')) {
      return 'linear-gradient(135deg, #cbd5e1 0%, #64748b 100%)';
    }
    if (lowercaseName.includes('peri')) {
      return 'linear-gradient(135deg, #fca5a5 0%, #dc2626 100%)';
    }
    if (lowercaseName.includes('tomato')) {
      return 'linear-gradient(135deg, #fda4af 0%, #f43f5e 100%)';
    }
    return 'linear-gradient(135deg, #c084fc 0%, #7c3aed 100%)';
  };

  const getProductRating = (name) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('peri')) return { rating: 4.9, count: 312 };
    if (lowercaseName.includes('cheese') || lowercaseName.includes('cheesy')) return { rating: 4.9, count: 256 };
    if (lowercaseName.includes('chaat') || lowercaseName.includes('masala')) return { rating: 4.8, count: 142 };
    if (lowercaseName.includes('tomato')) return { rating: 4.8, count: 204 };
    if (lowercaseName.includes('salt') || lowercaseName.includes('himalayan')) return { rating: 4.8, count: 94 };
    if (lowercaseName.includes('cream') || lowercaseName.includes('onion')) return { rating: 4.7, count: 188 };
    if (lowercaseName.includes('pepper')) return { rating: 4.7, count: 83 };
    if (lowercaseName.includes('mint')) return { rating: 4.6, count: 112 };
    return { rating: 4.7, count: 120 };
  };

  const getCardStyle = (index) => {
    const total = products.length;
    if (total === 0) return {};
    
    // Circular offset calculation
    let offset = index - activeIndex;
    if (offset < -Math.floor(total / 2)) offset += total;
    if (offset > Math.floor(total / 2)) offset -= total;
    
    const absOffset = Math.abs(offset);
    
    // Hide cards that are out of bounds (showing active + 2 on left/right)
    if (absOffset > 2) {
      return {
        transform: `translateX(${offset * 120}px) scale(0.4) translateZ(-500px)`,
        opacity: 0,
        zIndex: 0,
        pointerEvents: 'none'
      };
    }
    
    let translateX = 0;
    let translateZ = 0;
    let scale = 1;
    let rotateY = 0;
    let opacity = 1;
    let zIndex = 10 - absOffset;
    
    // Dynamic responsive translations based on state windowWidth
    const isMobile = windowWidth <= 480;
    const isTablet = windowWidth <= 900;
    
    const xDist1 = isMobile ? 120 : (isTablet ? 170 : 220);
    const xDist2 = isMobile ? 220 : (isTablet ? 300 : 390);
    
    const zDist1 = isMobile ? -120 : -180;
    const zDist2 = isMobile ? -240 : -360;
    
    const rAngle1 = isMobile ? -15 : -24;
    const rAngle2 = isMobile ? -30 : -42;
    
    if (offset === 0) {
      translateX = 0;
      translateZ = 0;
      scale = 1;
      rotateY = 0;
      opacity = 1;
    } else if (offset === 1) {
      translateX = xDist1;
      translateZ = zDist1;
      scale = 0.84;
      rotateY = rAngle1;
      opacity = 0.85;
    } else if (offset === -1) {
      translateX = -xDist1;
      translateZ = zDist1;
      scale = 0.84;
      rotateY = -rAngle1;
      opacity = 0.85;
    } else if (offset === 2) {
      translateX = xDist2;
      translateZ = zDist2;
      scale = 0.69;
      rotateY = rAngle2;
      opacity = 0.5;
    } else if (offset === -2) {
      translateX = -xDist2;
      translateZ = zDist2;
      scale = 0.69;
      rotateY = -rAngle2;
      opacity = 0.5;
    }
    
    return {
      transform: `translateX(${translateX}px) scale(${scale}) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
      opacity: opacity,
      zIndex: zIndex,
      pointerEvents: offset === 0 ? 'auto' : 'auto'
    };
  };

  if (products.length === 0) {
    return (
      <section className="carousel-3d-section">
        <h2 className="section-title">Featured <span>Flavours</span></h2>
        <div style={{ color: 'white', padding: '40px 0' }}>Loading premium flavours...</div>
      </section>
    );
  }

  return (
    <section 
      className="carousel-3d-section"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      <h2 className="section-title">Featured <span>Flavours</span></h2>

      <div 
        className="carousel-3d-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Navigation Buttons */}
        <button className="carousel-nav-btn prev" onClick={prevSlide} aria-label="Previous Slide">
          <ChevronLeft size={30} />
        </button>

        {products.map((product, idx) => {
          const ratingInfo = getProductRating(product.name);
          const isCardActive = idx === activeIndex;
          const discountPct = product.original_price 
            ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
            : 5;
          const cleanName = product.name.split('|')[0].trim();
          
          return (
            <div 
              key={product.id}
              className={`carousel-3d-card ${isCardActive ? 'active' : ''}`}
              style={getCardStyle(idx)}
              onClick={() => handleCardClick(idx)}
            >
              {/* Product Card Image Wrapper */}
              <div 
                className="carousel-card-img-wrapper"
                style={{ background: getFlavourGradient(product.name) }}
              >
                {/* Wishlist Icon */}
                <button 
                  className={`wishlist-btn ${wishlist[product.id] ? 'active' : ''}`}
                  onClick={(e) => toggleWishlist(product.id, e)}
                  aria-label="Add to Wishlist"
                >
                  <Heart size={20} fill={wishlist[product.id] ? "#ef4444" : "none"} />
                </button>

                {/* Discount Tag */}
                {discountPct > 0 && (
                  <span className="discount-badge">-{discountPct}%</span>
                )}

                {/* Product Image */}
                <img
                  src={
                    product.image
                      ? `/${product.image.split('/').pop()}`
                      : "/best_image.png"
                  }
                  alt={cleanName}
                  className="carousel-card-img"
                  draggable="false"
                />
              </div>

              {/* Product Info Section */}
              <div className="carousel-card-info">
                <span className="carousel-card-category">Flavoured Makhana</span>
                <h3 className="carousel-card-title">{cleanName}</h3>

                {/* Ratings */}
                <div className="carousel-card-rating">
                  <div className="stars-list">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={15} 
                        fill={i < Math.round(ratingInfo.rating) ? "#fbbf24" : "none"} 
                        stroke="#fbbf24" 
                      />
                    ))}
                  </div>
                  <span className="rating-value">{ratingInfo.rating}</span>
                  <span className="rating-count">({ratingInfo.count} reviews)</span>
                </div>

                {/* Card Footer: Price & Actions */}
                <div className="carousel-card-footer">
                  <div className="carousel-card-price-box">
                    <div className="price-row">
                      <span className="current-price">Rs. {Math.round(product.price)}</span>
                      {product.original_price && (
                        <span className="original-price">Rs. {Math.round(product.original_price)}</span>
                      )}
                    </div>
                    {product.original_price && (
                      <span className="discount-text">Save Rs. {Math.round(product.original_price - product.price)}</span>
                    )}
                  </div>

                  <div className="carousel-card-actions">
                    <button 
                      className="carousel-add-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      disabled={!isCardActive}
                      title="Add to Cart"
                    >
                      <ShoppingCart size={16} />
                      Add
                    </button>
                    <Link 
                      to={`/product/${product.id}`}
                      className="carousel-view-btn"
                      onClick={(e) => {
                        if (!isCardActive) e.preventDefault();
                      }}
                      title="View Details"
                    >
                      <Eye size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <button className="carousel-nav-btn next" onClick={nextSlide} aria-label="Next Slide">
          <ChevronRight size={30} />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="carousel-3d-dots">
        {products.map((_, index) => (
          <div 
            key={index} 
            className={`carousel-dot ${activeIndex === index ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Makhana3DCarousel;
