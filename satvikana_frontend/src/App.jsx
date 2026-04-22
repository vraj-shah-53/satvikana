import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import Recipe from './pages/Recipe';
import WhySatvikana from './pages/WhySatvikana';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import { CartProvider } from './CartContext';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/recipe" element={<Recipe />} />
              <Route path="/why-satvikana" element={<WhySatvikana />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
