import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="page-container" style={{ padding: '50px' }}>
      <h1 className="section-title">All <span>Products</span></h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '40px' }}>
        {products.map(product => (
          <div key={product.id} className="testimonial-card" style={{ width: '100%', textAlign: 'center', position: 'relative' }}>
            <Link to={`/product/${product.id}`} style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
              <div style={{ height: '200px', marginBottom: '20px', borderRadius: '10px', overflow: 'hidden' }}>
                <img src="/best_image.png" alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', transition: 'color 0.3s' }}>{product.name.split('|')[0]}</h3>
            </Link>
            <p style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '15px' }}>₹{product.price}</p>
            <button className="shop-btn" style={{ padding: '8px 20px', fontSize: '0.9rem' }} onClick={() => {
              addToCart(product);
              alert(`${product.name.split('|')[0]} added to cart`);
            }}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
