import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CartContext } from '../CartContext';

const Products = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  // Filter products by category if route parameter is present
  const filteredProducts = category 
    ? products.filter(p => p.category === category)
    : products;

  // Generate category-specific titles
  const getPageTitle = () => {
    switch (category) {
      case 'raw':
        return <>Raw <span>Makhana</span></>;
      case 'flavoured':
        return <>Flavoured <span>Makhana</span></>;
      case 'flour':
        return <>Khapli <span>Wheat Flour</span></>;
      default:
        return <>All <span>Products</span></>;
    }
  };

  return (
    <div className="page-container" style={{ padding: '50px' }}>
      <h1 className="section-title">{getPageTitle()}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '40px' }}>
        {filteredProducts.map(product => (
          <div key={product.id} className="testimonial-card" style={{ width: '100%', textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Link to={`/product/${product.id}`} style={{ display: 'block', color: 'inherit', textDecoration: 'none', flex: 1 }}>
              <div style={{ height: '240px', marginBottom: '20px', borderRadius: '10px', overflow: 'hidden', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
                <img src={product.image ? (product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`) : "/best_image.png"} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', transition: 'color 0.3s', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {product.name.split('|')[0]}
              </h3>
            </Link>
            <div>
              <p style={{ marginBottom: '15px' }}>
                {product.original_price && (
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', marginRight: '10px', fontSize: '1.1rem', fontWeight: 'normal' }}>
                    Rs. {product.original_price}
                  </span>
                )}
                <span style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '1.5rem' }}>Rs. {product.price}</span>
              </p>
              <button className="shop-btn" style={{ padding: '8px 20px', fontSize: '0.9rem', width: '100%' }} onClick={() => {
                addToCart(product);
              }}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
