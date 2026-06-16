import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../CartContext';
import { API_BASE_URL } from '../config';
import { getInitialProducts, syncProducts } from '../productHelper';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(() => {
    const initial = getInitialProducts();
    return initial.find(p => String(p.id) === String(id)) || null;
  });
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    // Sync cached products list in case anything changed
    syncProducts((data) => {
      const updated = data.find(p => String(p.id) === String(id));
      if (updated) {
        setProduct(updated);
      }
    });

    // Also fetch the individual endpoint to refresh extra details
    fetch(`${API_BASE_URL}/api/products/${id}/`)
      .then(res => res.json())
      .then(data => {
        if (data && data.id) {
          setProduct(data);
        }
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <div className="page-container" style={{ textAlign: 'center', color: 'var(--text-primary)' }}>Loading...</div>;

  return (
    <div className="page-container">
      <Link to="/products" style={{ color: 'var(--primary-color)', marginBottom: '30px', display: 'inline-block', fontWeight: 'bold' }}>&larr; Back to Products</Link>
      <div className="product-details-card">
        <div className="product-details-image-section">
          <img
            src={
              product.image
                ? `/${product.image.split('/').pop()}`
                : "/best_image.png"
            }
            alt={product.name}
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              objectFit: 'contain'
            }}
          />
        </div>
        <div className="product-details-info-section">
          <h1 className="product-details-title">{product.name.split('|')[0]}</h1>
          <p className="product-details-subtitle">
            {product.name.includes('|') ? product.name.substring(product.name.indexOf('|') + 1) : 'Premium Quality Healthy Food'}
          </p>
          <div className="product-details-price-container">
            {product.original_price && (
              <span className="product-details-original-price">Rs. {product.original_price}</span>
            )}
            <span className="product-details-price">Rs. {product.price}</span>
          </div>
          <p className="product-details-description">
            {product.description || `Experience the pure and natural goodness of ${product.name.split('|')[0]}. Sourced from the finest ingredients, processed with care, and packed for premium freshness. A perfect guilt-free choice.`}
          </p>
          <button className="shop-btn product-details-btn" onClick={() => {
            addToCart(product);
          }}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
