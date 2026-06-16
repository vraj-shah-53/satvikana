import { API_BASE_URL } from './config';

// Fallback seed products list with the exact IDs from the live database
export const FALLBACK_PRODUCTS = [
  {
    "id": 141,
    "name": "Chaat Masala 70g | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack",
    "description": "Experience the rich crunch of Chaat Masala Flavoured Makhana. 100% natural, roasted to perfection, and coated with tangy chaat spices. A perfect guilt-free snack for every occasion.",
    "price": "189.00",
    "original_price": "199.00",
    "category": "flavoured",
    "image": "products/product_chaat_masala.webp"
  },
  {
    "id": 142,
    "name": "Cheesy Masti 70g | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack",
    "description": "Experience the rich crunch of Cheesy Masti Roasted Makhana. 100% natural, roasted to perfection, and coated with a delicious, savory cheese blend. A perfect guilt-free snack for every occasion.",
    "price": "189.00",
    "original_price": "199.00",
    "category": "flavoured",
    "image": "products/product_cheesy_masti.webp"
  },
  {
    "id": 143,
    "name": "Cream N Onion 70g | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack",
    "description": "Experience the rich crunch of Cream & Onion Roasted Makhana. 100% natural, roasted to perfection, and coated with sour cream and fresh onion flavors. A perfect guilt-free snack for every occasion.",
    "price": "189.00",
    "original_price": "199.00",
    "category": "flavoured",
    "image": "products/product_cream_n_onion.webp"
  },
  {
    "id": 144,
    "name": "Himalyan Salt 70g | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack",
    "description": "Experience the rich crunch of Himalayan Salt Flavoured Makhana. 100% natural, roasted to perfection, and coated with premium Himalayan pink salt. A perfect guilt-free snack for every occasion.",
    "price": "189.00",
    "original_price": "199.00",
    "category": "flavoured",
    "image": "products/product_himalayan_salt.webp"
  },
  {
    "id": 145,
    "name": "Mint Masala 70g | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack",
    "description": "Experience the rich crunch of Mint Masala Flavoured Makhana. 100% natural, roasted to perfection, and coated with refreshing mint and spice flavors. A perfect guilt-free snack for every occasion.",
    "price": "189.00",
    "original_price": "199.00",
    "category": "flavoured",
    "image": "products/product_mint_masala.webp"
  },
  {
    "id": 146,
    "name": "Pepper Punch 70g | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack",
    "description": "Experience the rich crunch of Pepper Punch Flavoured Makhana. 100% natural, roasted to perfection, and coated with spicy and aromatic ground black pepper. A perfect guilt-free snack for every occasion.",
    "price": "189.00",
    "original_price": "199.00",
    "category": "flavoured",
    "image": "products/product_pepper_punch.webp"
  },
  {
    "id": 147,
    "name": "Peri Peri Roasted Makhana 70g | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack",
    "description": "Experience the rich crunch of Peri Peri Flavoured Roasted Makhana. 100% natural, roasted to perfection, and coated with hot and fiery African Peri Peri spice. A perfect guilt-free snack for every occasion.",
    "price": "189.00",
    "original_price": "199.00",
    "category": "flavoured",
    "image": "products/product_peri_peri.webp"
  },
  {
    "id": 148,
    "name": "Tangy Tomato 70g | Gluten Free | High Protein & Fiber | Low Cholesterol",
    "description": "Experience the rich crunch of Tangy Tomato Flavoured Makhana. 100% natural, roasted to perfection, and coated with a mouth-watering sweet and tangy tomato spice. A perfect guilt-free snack for every occasion.",
    "price": "189.00",
    "original_price": "199.00",
    "category": "flavoured",
    "image": "products/product_tangy_tomato.webp"
  },
  {
    "id": 149,
    "name": "Raw Makhana 200g | 100% Natural Organic Fox Nuts | High Protein & Calcium",
    "description": "Enjoy the pure goodness of Satvikana Raw Makhana. Carefully selected, 100% organic and natural premium grade fox nuts. Rich in protein, calcium, and antioxidants. A perfect healthy ingredient or snack base.",
    "price": "330.00",
    "original_price": "430.00",
    "category": "raw",
    "image": "products/product_raw_makhana.webp"
  },
  {
    "id": 150,
    "name": "Satvikana Khapli Wheat flour (GMO FREE- LAB TESTED) - 2kg | 2kg Pack",
    "description": "Pure stoneground Khapli (Emmer) wheat flour, GMO free and lab tested. Rich in dietary fiber, vitamins, and minerals. Perfect for making soft, premium, and healthy chapatis and rotis.",
    "price": "399.00",
    "original_price": "499.00",
    "category": "flour",
    "image": "products/product_khapli_2kg.webp"
  },
  {
    "id": 151,
    "name": "Satvikana Khapli Wheat flour (GMO FREE- LAB TESTED) - 1kg | 1kg Pack",
    "description": "Pure stoneground Khapli (Emmer) wheat flour, GMO free and lab tested. Rich in dietary fiber, vitamins, and minerals. Perfect for making soft, premium, and healthy chapatis and rotis.",
    "price": "199.00",
    "original_price": "249.00",
    "category": "flour",
    "image": "products/product_khapli_1kg.webp"
  },
  {
    "id": 152,
    "name": "Satvikana Roasted Makhana Combo (Chaat Masala & Himalayan Salt) 70x2 gm | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack Combo",
    "description": "Get the best of both worlds with our Satvikana Roasted Makhana Combo. Contains 2 packs of 70g each: one delicious Chaat Masala & one delicious Himalayan Salt. 100% natural, roasted to perfection & coated with premium spices. The perfect guilt-free snack combo.",
    "price": "369.00",
    "original_price": "399.00",
    "category": "combo",
    "image": "products/product_chaat_himalayan.jpg"
  },
  {
    "id": 153,
    "name": "Satvikana Roasted Makhana Combo (Cream & Onion & Himalayan Salt) 70x2 gm | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack Combo",
    "description": "Get the best of both worlds with our Satvikana Roasted Makhana Combo. Contains 2 packs of 70g each: one delicious Cream & Onion & one delicious Himalayan Salt. 100% natural, roasted to perfection & coated with premium spices. The perfect guilt-free snack combo.",
    "price": "369.00",
    "original_price": "399.00",
    "category": "combo",
    "image": "products/product_cream_himalayan.jpg"
  },
  {
    "id": 154,
    "name": "Satvikana Roasted Makhana Combo (Himalayan Salt & Cheesy Masti) 70x2 gm | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack Combo",
    "description": "Get the best of both worlds with our Satvikana Roasted Makhana Combo. Contains 2 packs of 70g each: one delicious Himalayan Salt & one delicious Cheesy Masti. 100% natural, roasted to perfection & coated with premium spices. The perfect guilt-free snack combo.",
    "price": "369.00",
    "original_price": "399.00",
    "category": "combo",
    "image": "products/product_himalayan_cheesy.jpg"
  },
  {
    "id": 155,
    "name": "Satvikana Roasted Makhana Combo (Himalayan Salt & Mint Masala) 70x2 gm | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack Combo",
    "description": "Get the best of both worlds with our Satvikana Roasted Makhana Combo. Contains 2 packs of 70g each: one delicious Himalayan Salt & one delicious Mint Masala. 100% natural, roasted to perfection & coated with premium spices. The perfect guilt-free snack combo.",
    "price": "369.00",
    "original_price": "399.00",
    "category": "combo",
    "image": "products/product_himalayan_mint.jpg"
  },
  {
    "id": 156,
    "name": "Satvikana Roasted Makhana Combo (Pepper Punch & Himalayan Salt) 70x2 gm | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack Combo",
    "description": "Get the best of both worlds with our Satvikana Roasted Makhana Combo. Contains 2 packs of 70g each: one delicious Pepper Punch & one delicious Himalayan Salt. 100% natural, roasted to perfection & coated with premium spices. The perfect guilt-free snack combo.",
    "price": "369.00",
    "original_price": "399.00",
    "category": "combo",
    "image": "products/product_pepper_himalayan.jpg"
  },
  {
    "id": 157,
    "name": "Satvikana Roasted Makhana Combo (Peri Peri & Himalayan Salt) 70x2 gm | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack Combo",
    "description": "Get the best of both worlds with our Satvikana Roasted Makhana Combo. Contains 2 packs of 70g each: one delicious Peri Peri & one delicious Himalayan Salt. 100% natural, roasted to perfection & coated with premium spices. The perfect guilt-free snack combo.",
    "price": "369.00",
    "original_price": "399.00",
    "category": "combo",
    "image": "products/product_peri_himalayan.jpg"
  },
  {
    "id": 158,
    "name": "Satvikana Roasted Makhana Combo (Peri Peri & Mint Masala) 70x2 gm | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack Combo",
    "description": "Get the best of both worlds with our Satvikana Roasted Makhana Combo. Contains 2 packs of 70g each: one delicious Peri Peri & one delicious Mint Masala. 100% natural, roasted to perfection & coated with premium spices. The perfect guilt-free snack combo.",
    "price": "369.00",
    "original_price": "399.00",
    "category": "combo",
    "image": "products/product_peri_mint.jpg"
  }
];

/**
 * Retrieves the initial products from localStorage (cache) if present,
 * otherwise falls back to the static FALLBACK_PRODUCTS array.
 */
export const getInitialProducts = () => {
  try {
    const cached = localStorage.getItem('satvikana_products');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error loading cached products:", e);
  }
  return FALLBACK_PRODUCTS;
};

/**
 * Synchronizes the products list with the backend API in the background.
 * If fresh data is loaded, it caches it in localStorage and updates the state.
 */
export const syncProducts = (onUpdate) => {
  fetch(`${API_BASE_URL}/api/products/`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem('satvikana_products', JSON.stringify(data));
        if (onUpdate) {
          onUpdate(data);
        }
      }
    })
    .catch(err => {
      console.error("Error syncing products in background:", err);
    });
};
