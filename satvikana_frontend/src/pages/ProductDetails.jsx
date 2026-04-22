import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/${id}/`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <div className="page-container" style={{ textAlign: 'center', color: 'var(--text-primary)' }}>Loading...</div>;

  return (
    <div className="page-container" style={{ padding: '50px' }}>
      <Link to="/products" style={{ color: 'var(--primary-color)', marginBottom: '30px', display: 'inline-block', fontWeight: 'bold' }}>&larr; Back to Products</Link>
      <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap', background: 'var(--surface-color)', padding: '40px', borderRadius: '20px', boxShadow: 'var(--shadow-custom)', border: '1px solid var(--border-color)' }}>
        <div style={{ flex: '1', minWidth: '300px', borderRadius: '20px', overflow: 'hidden', background: 'var(--bg-color)' }}>
          <img src="/best_image.png" alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '15px', color: 'var(--primary-color)' }}>{product.name.split('|')[0]}</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.name.includes('|') ? product.name.substring(product.name.indexOf('|') + 1) : 'Healthy Fox Nuts 70g'}</p>
          <p style={{ color: 'var(--accent-color)', fontSize: '2.5rem', fontWeight: 'bold', margin: '20px 0' }}>₹{product.price}</p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '40px', color: 'var(--text-secondary)' }}>
            {product.description || `Experience the rich crunch of ${product.name.split('|')[0]}. Our makhana is carefully sourced, roasted to perfection, and coated with the finest spices. A perfect guilt-free snack for every occasion.`}
          </p>
          <button className="shop-btn" style={{ padding: '15px 40px', fontSize: '1.2rem', alignSelf: 'flex-start' }} onClick={() => {
            addToCart(product);
            alert(`${product.name.split('|')[0]} added to cart`);
          }}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
