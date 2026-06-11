import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../CartContext';
import { API_BASE_URL } from '../config';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products/${id}/`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <div className="page-container" style={{ textAlign: 'center', color: 'var(--text-primary)' }}>Loading...</div>;

  return (
    <div className="page-container" style={{ padding: '50px' }}>
      <Link to="/products" style={{ color: 'var(--primary-color)', marginBottom: '30px', display: 'inline-block', fontWeight: 'bold' }}>&larr; Back to Products</Link>
      <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap', background: 'var(--surface-color)', padding: '40px', borderRadius: '20px', boxShadow: 'var(--shadow-custom)', border: '1px solid var(--border-color)' }}>
        <div style={{ flex: '1', minWidth: '300px', borderRadius: '20px', overflow: 'hidden', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px', border: '1px solid var(--border-color)' }}>
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
        <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '800', fontSize: '3rem', marginBottom: '15px', color: 'var(--primary-color)' }}>{product.name.split('|')[0]}</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.name.includes('|') ? product.name.substring(product.name.indexOf('|') + 1) : 'Premium Quality Healthy Food'}</p>
          <p style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: '15px' }}>
            {product.original_price && (
              <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '1.6rem', fontWeight: 'normal' }}>Rs. {product.original_price}</span>
            )}
            <span style={{ color: 'var(--accent-color)', fontSize: '2.5rem', fontWeight: 'bold' }}>Rs. {product.price}</span>
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '40px', color: 'var(--text-secondary)' }}>
            {product.description || `Experience the pure and natural goodness of ${product.name.split('|')[0]}. Sourced from the finest ingredients, processed with care, and packed for premium freshness. A perfect guilt-free choice.`}
          </p>
          <button className="shop-btn" style={{ padding: '15px 40px', fontSize: '1.2rem', alignSelf: 'flex-start' }} onClick={() => {
            addToCart(product);
          }}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
