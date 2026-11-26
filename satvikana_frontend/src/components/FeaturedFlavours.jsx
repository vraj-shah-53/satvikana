import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Check, ArrowRight } from 'lucide-react';
import { CartContext } from '../CartContext';
import { getInitialProducts, syncProducts } from '../productHelper';
import './FeaturedFlavours.css';

const FLAVOUR_DEFINITIONS = [
  {
    key: 'raw',
    title: 'Raw Makhana',
    subtitle: '100% Organic Fox Nuts',
    weight: '200g',
    badge: 'Pure Organic',
    badgeClass: 'badge-organic',
    rating: 4.9,
    reviews: 420,
    match: (p) => {
      const n = (p.name || '').toLowerCase();
      return n.includes('raw');
    },
    fallback: {
      id: 203,
      name: 'Raw Makhana 200g | 100% Natural Organic Fox Nuts',
      price: '330.00',
      original_price: '430.00',
      image: 'products/product_raw_makhana.webp',
      category: 'raw'
    }
  },
  {
    key: 'peri',
    title: 'Peri Peri Makhana',
    subtitle: 'Fiery African Spices',
    weight: '70g',
    badge: 'Bestseller',
    badgeClass: 'badge-peri',
    rating: 4.9,
    reviews: 312,
    match: (p) => {
      const n = (p.name || '').toLowerCase();
      return n.includes('peri peri') && !n.includes('combo');
    },
    fallback: {
      id: 201,
      name: 'Peri Peri Roasted Makhana 70g | Gluten Free | Healthy Superfood Snack',
      price: '189.00',
      original_price: '199.00',
      image: 'products/product_peri_peri.webp',
      category: 'flavoured'
    }
  },
  {
    key: 'fudina',
    title: 'Fudina / Mint Masala',
    subtitle: 'Cooling Herbs & Spices',
    weight: '70g',
    badge: 'Refreshing',
    badgeClass: 'badge-mint',
    rating: 4.8,
    reviews: 142,
    match: (p) => {
      const n = (p.name || '').toLowerCase();
      return (n.includes('mint') || n.includes('fudina')) && !n.includes('combo');
    },
    fallback: {
      id: 199,
      name: 'Mint Masala 70g | Gluten Free | Healthy Superfood Snack',
      price: '189.00',
      original_price: '199.00',
      image: 'products/product_mint_masala.webp',
      category: 'flavoured'
    }
  },
  {
    key: 'salt',
    title: 'Himalayan Pink Salt',
    subtitle: 'Pure Rock Salt Crunch',
    weight: '70g',
    badge: 'Classic',
    badgeClass: 'badge-salt',
    rating: 4.8,
    reviews: 194,
    match: (p) => {
      const n = (p.name || '').toLowerCase();
      return (n.includes('salt') || n.includes('himalayan') || n.includes('himalyan')) && !n.includes('combo');
    },
    fallback: {
      id: 198,
      name: 'Himalyan Salt 70g | Gluten Free | Healthy Superfood Snack',
      price: '189.00',
      original_price: '199.00',
      image: 'products/product_himalayan_salt.webp',
      category: 'flavoured'
    }
  },
  {
    key: 'cheese',
    title: 'Cheesy Masti',
    subtitle: 'Rich Creamy Cheddar',
    weight: '70g',
    badge: "Kids' Favourite",
    badgeClass: 'badge-cheese',
    rating: 4.9,
    reviews: 256,
    match: (p) => {
      const n = (p.name || '').toLowerCase();
      return (n.includes('cheese') || n.includes('cheesy')) && !n.includes('combo');
    },
    fallback: {
      id: 196,
      name: 'Cheesy Masti 70g | Gluten Free | Healthy Superfood Snack',
      price: '189.00',
      original_price: '199.00',
      image: 'products/product_cheesy_masti.webp',
      category: 'flavoured'
    }
  }
];

const FeaturedFlavours = () => {
  const [products, setProducts] = useState(getInitialProducts);
  const [wishlist, setWishlist] = useState({});
  const [justAdded, setJustAdded] = useState({});
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    syncProducts((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      }
    });
  }, []);

  const toggleWishlist = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);

    // Provide immediate visual feedback on the button
    setJustAdded(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setJustAdded(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const getProductImage = (product) => {
    if (!product || !product.image) return '/best_image.png';
    const filename = product.image.split('/').pop();
    return `/${filename}`;
  };

  return (
    <section className="featured-flavours-section">
      <div className="featured-header">
        <span className="featured-badge-tag">100% Roasted Superfood</span>
        <h2 className="section-title">
          Featured <span>Flavours</span>
        </h2>
        <p className="featured-subtitle">
          Hand-roasted to crunchy perfection with pure, natural ingredients and zero preservatives.
        </p>
      </div>

      <div className="featured-flavours-grid">
        {FLAVOUR_DEFINITIONS.map((def) => {
          // Find matching live product or fallback
          const matched = products.find(def.match);
          const product = matched || def.fallback;

          const currentPrice = parseFloat(product.price || def.fallback.price);
          const originalPrice = product.original_price ? parseFloat(product.original_price) : parseFloat(def.fallback.original_price);
          const hasDiscount = originalPrice && originalPrice > currentPrice;
          const discountPct = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
          const savings = hasDiscount ? Math.round(originalPrice - currentPrice) : 0;
          const isAdded = Boolean(justAdded[product.id]);

          return (
            <div key={def.key} className="featured-card">
              {/* Card Top Row: Flavour Badge & Wishlist */}
              <div className="featured-card-top">
                <span className={`flavour-pill ${def.badgeClass}`}>
                  {def.badge}
                </span>
                <button 
                  className={`featured-wishlist-btn ${wishlist[product.id] ? 'active' : ''}`}
                  onClick={(e) => toggleWishlist(product.id, e)}
                  aria-label="Add to Wishlist"
                  title="Save to Wishlist"
                >
                  <Heart size={18} fill={wishlist[product.id] ? "#EF4444" : "none"} stroke={wishlist[product.id] ? "#EF4444" : "currentColor"} />
                </button>
              </div>

              {/* Product Image Link */}
              <Link to={`/product/${product.id}`} className="featured-img-link" title={`View ${def.title} details`}>
                {discountPct > 0 && (
                  <span className="discount-badge-mini">-{discountPct}%</span>
                )}
                <span className="weight-tag-mini">{def.weight}</span>
                <img 
                  src={getProductImage(product)} 
                  alt={`Satvikana ${def.title} ${def.weight} - 100% Roasted Natural Makhana Snack`} 
                  loading="lazy"
                />
              </Link>

              {/* Card Body */}
              <div className="featured-card-body">
                <Link to={`/product/${product.id}`} className="featured-card-title-link">
                  <h3 className="featured-product-title">{def.title}</h3>
                </Link>
                <p className="featured-product-subtitle">{def.subtitle}</p>

                {/* Rating */}
                <div className="featured-rating-row">
                  <div className="featured-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={13} 
                        fill="#FBBF24" 
                        stroke="#FBBF24" 
                      />
                    ))}
                  </div>
                  <span className="featured-rating-num">{def.rating}</span>
                  <span className="featured-reviews-count">({def.reviews})</span>
                </div>

                {/* Price Row */}
                <div className="featured-price-row">
                  <span className="featured-current-price">₹{Math.round(currentPrice)}</span>
                  {hasDiscount && (
                    <span className="featured-original-price">₹{Math.round(originalPrice)}</span>
                  )}
                  {savings > 0 && (
                    <span className="featured-save-pill">Save ₹{savings}</span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  className={`featured-add-btn ${isAdded ? 'added-success' : ''}`}
                  onClick={(e) => handleAddToCart(product, e)}
                  title={`Add ${def.title} to Cart`}
                >
                  {isAdded ? (
                    <>
                      <Check size={16} />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Button for More Products */}
      <div className="featured-more-container">
        <Link to="/products" className="featured-more-btn" title="Explore all Satvikana products">
          <span>More Products</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedFlavours;
