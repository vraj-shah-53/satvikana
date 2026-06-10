import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'satvikana_backend.settings')
django.setup()

from api.models import Product

# Clear existing products to ensure clean database state
Product.objects.all().delete()

products = [
    # Flavoured Makhana
    {
        "name": "Chaat Masala 70g | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack",
        "price": 189.00,
        "original_price": 199.00,
        "category": "flavoured",
        "image": "products/product_chaat_masala.webp",
        "description": "Experience the rich crunch of Chaat Masala Flavoured Makhana. 100% natural, roasted to perfection, and coated with tangy chaat spices. A perfect guilt-free snack for every occasion."
    },
    {
        "name": "Cheesy Masti 70g | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack",
        "price": 189.00,
        "original_price": 199.00,
        "category": "flavoured",
        "image": "products/product_cheesy_masti.webp",
        "description": "Experience the rich crunch of Cheesy Masti Roasted Makhana. 100% natural, roasted to perfection, and coated with a delicious, savory cheese blend. A perfect guilt-free snack for every occasion."
    },
    {
        "name": "Cream N Onion 70g | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack",
        "price": 189.00,
        "original_price": 199.00,
        "category": "flavoured",
        "image": "products/product_cream_n_onion.webp",
        "description": "Experience the rich crunch of Cream & Onion Roasted Makhana. 100% natural, roasted to perfection, and coated with sour cream and fresh onion flavors. A perfect guilt-free snack for every occasion."
    },
    {
        "name": "Himalyan Salt 70g | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack",
        "price": 189.00,
        "original_price": 199.00,
        "category": "flavoured",
        "image": "products/product_himalayan_salt.webp",
        "description": "Experience the rich crunch of Himalayan Salt Flavoured Makhana. 100% natural, roasted to perfection, and coated with premium Himalayan pink salt. A perfect guilt-free snack for every occasion."
    },
    {
        "name": "Mint Masala 70g | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack",
        "price": 189.00,
        "original_price": 199.00,
        "category": "flavoured",
        "image": "products/product_mint_masala.webp",
        "description": "Experience the rich crunch of Mint Masala Flavoured Makhana. 100% natural, roasted to perfection, and coated with refreshing mint and spice flavors. A perfect guilt-free snack for every occasion."
    },
    {
        "name": "Pepper Punch 70g | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack",
        "price": 189.00,
        "original_price": 199.00,
        "category": "flavoured",
        "image": "products/product_pepper_punch.webp",
        "description": "Experience the rich crunch of Pepper Punch Flavoured Makhana. 100% natural, roasted to perfection, and coated with spicy and aromatic ground black pepper. A perfect guilt-free snack for every occasion."
    },
    {
        "name": "Peri Peri Roasted Makhana 70g | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack",
        "price": 189.00,
        "original_price": 199.00,
        "category": "flavoured",
        "image": "products/product_peri_peri.webp",
        "description": "Experience the rich crunch of Peri Peri Flavoured Roasted Makhana. 100% natural, roasted to perfection, and coated with hot and fiery African Peri Peri spice. A perfect guilt-free snack for every occasion."
    },
    {
        "name": "Tangy Tomato 70g | Gluten Free | High Protein & Fiber | Low Cholesterol",
        "price": 189.00,
        "original_price": 199.00,
        "category": "flavoured",
        "image": "products/product_tangy_tomato.webp",
        "description": "Experience the rich crunch of Tangy Tomato Flavoured Makhana. 100% natural, roasted to perfection, and coated with a mouth-watering sweet and tangy tomato spice. A perfect guilt-free snack for every occasion."
    },
    
    # Raw Makhana
    {
        "name": "Raw Makhana 200g | 100% Natural Organic Fox Nuts | High Protein & Calcium",
        "price": 330.00,
        "original_price": 430.00,
        "category": "raw",
        "image": "products/product_raw_makhana.webp",
        "description": "Enjoy the pure goodness of Satvikana Raw Makhana. Carefully selected, 100% organic and natural premium grade fox nuts. Rich in protein, calcium, and antioxidants. A perfect healthy ingredient or snack base."
    },
    
    # Khapli Wheat Flour
    {
        "name": "Satvikana Khapli Wheat flour (GMO FREE- LAB TESTED) - 2kg | 2kg Pack",
        "price": 399.00,
        "original_price": 499.00,
        "category": "flour",
        "image": "products/product_khapli_2kg.webp",
        "description": "Pure stoneground Khapli (Emmer) wheat flour, GMO free and lab tested. Rich in dietary fiber, vitamins, and minerals. Perfect for making soft, premium, and healthy chapatis and rotis."
    },
    {
        "name": "Satvikana Khapli Wheat flour (GMO FREE- LAB TESTED) - 1kg | 1kg Pack",
        "price": 199.00,
        "original_price": 249.00,
        "category": "flour",
        "image": "products/product_khapli_1kg.webp",
        "description": "Pure stoneground Khapli (Emmer) wheat flour, GMO free and lab tested. Rich in dietary fiber, vitamins, and minerals. Perfect for making soft, premium, and healthy chapatis and rotis."
    }
]

for p in products:
    Product.objects.create(
        name=p["name"],
        price=p["price"],
        original_price=p["original_price"],
        category=p["category"],
        image=p["image"],
        description=p["description"]
    )

print("Products populated successfully.")
