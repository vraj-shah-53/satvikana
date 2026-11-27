import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_SEO = {
  '/': {
    title: 'Satvikana | Buy Premium Roasted Makhana Online in India - 100% Natural Healthy Snacks',
    description: 'Shop 100% natural, crunchy hand-roasted Makhana (Fox Nuts / Phool Makhana) online from Satvikana. Available in Peri Peri, Cheesy Masti, Himalayan Pink Salt & Mint Masala. High protein, gluten-free, zero preservatives.',
    canonical: 'https://satvikana.com/'
  },
  '/products': {
    title: 'Buy Roasted & Raw Makhana Online | Satvikana Flavoured Snacks Store',
    description: "Explore Satvikana's range of crunchy roasted makhana flavours: Peri Peri, Himalayan Pink Salt, Mint Masala, Cheesy Masti, and 100% Organic Raw Makhana. Order online today!",
    canonical: 'https://satvikana.com/products'
  },
  '/products/flavoured': {
    title: 'Flavoured Roasted Makhana Snacks | Peri Peri, Cheese, Mint & Salt | Satvikana',
    description: 'Craving a crunchy, healthy snack? Discover Satvikana flavoured roasted fox nuts. Hand-roasted with natural spices, zero preservatives, and pure taste.',
    canonical: 'https://satvikana.com/products/flavoured'
  },
  '/products/raw': {
    title: 'Buy 100% Organic Raw Makhana 200g Online | Satvikana Natural Superfood',
    description: 'Shop premium grade unroasted raw makhana (phool makhana). High in protein, fiber, and calcium. Perfect for home roasting, kheer, and curries.',
    canonical: 'https://satvikana.com/products/raw'
  },
  '/recipe': {
    title: 'Healthy Makhana Recipes | Makhana Paneer Curry, Kheer & Bhel | Satvikana',
    description: 'Discover easy, delicious, and healthy recipes made with Satvikana Makhana: Makhana Paneer Curry, traditional Makhana Kheer, and crispy Makhana Bhel.',
    canonical: 'https://satvikana.com/recipe'
  },
  '/why-satvikana': {
    title: 'Health Benefits of Makhana & Why Satvikana | 100% Natural Roasted Superfood',
    description: 'Learn why Makhana is considered an Ayurvedic superfood. Discover the health benefits for weight loss, heart health, protein intake, and anti-aging with Satvikana.',
    canonical: 'https://satvikana.com/why-satvikana'
  },
  '/contact': {
    title: 'Contact Us & Bulk Makhana Orders | Satvikana Customer Support',
    description: 'Get in touch with Satvikana by Diyaja Ventures for customer support, bulk orders, distribution, and corporate gifting. Fast response guaranteed.',
    canonical: 'https://satvikana.com/contact'
  },
  '/cart': {
    title: 'Your Shopping Cart | Satvikana Makhana Store',
    description: 'Review your Satvikana cart and proceed to instant guest checkout with Cashfree UPI, Cards, and Netbanking.',
    canonical: 'https://satvikana.com/cart'
  },
  '/verify': {
    title: 'Product Information & Statutory Compliance | Satvikana',
    description: 'Official statutory packaging disclosures, FSSAI licensing, manufacturer details, and product information for Satvikana Makhana.',
    canonical: 'https://satvikana.com/verify'
  },
  '/product-info': {
    title: 'Product Information & Statutory Compliance | Satvikana',
    description: 'Official statutory packaging disclosures, FSSAI licensing, manufacturer details, and product information for Satvikana Makhana.',
    canonical: 'https://satvikana.com/product-info'
  }
};

const SEO = () => {
  const location = useLocation();

  useEffect(() => {
    const current = ROUTE_SEO[location.pathname] || ROUTE_SEO['/'];

    document.title = current.title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', current.description);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', current.title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', current.description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', current.canonical);

    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return null;
};

export default SEO;
