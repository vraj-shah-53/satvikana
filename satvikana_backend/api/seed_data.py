import os
import shutil
from .models import Product

def run_seed():
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

    # Frontend public directory path relative to settings or this file
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    frontend_public_dir = os.path.abspath(os.path.join(base_dir, '..', 'satvikana_frontend', 'public'))
    backend_media_products_dir = os.path.abspath(os.path.join(base_dir, 'media', 'products'))

    FLAVOR_MAP = {
        'chaat': 'Chaat Masala',
        'himalayan': 'Himalayan Salt',
        'cream': 'Cream & Onion',
        'cheesy': 'Cheesy Masti',
        'mint': 'Mint Masala',
        'pepper': 'Pepper Punch',
        'peri': 'Peri Peri',
        'tomato': 'Tangy Tomato'
    }

    # Scan for combo images in both directories
    combo_files = set()
    for folder in [frontend_public_dir, backend_media_products_dir]:
        if os.path.exists(folder):
            for filename in os.listdir(folder):
                name_part, ext = os.path.splitext(filename)
                ext = ext.lower()
                if ext in ['.jpg', '.jpeg', '.png', '.webp', '.avif']:
                    parts = name_part.split('_')
                    if len(parts) == 3 and parts[0] == 'product':
                        f1, f2 = parts[1], parts[2]
                        if f1 in FLAVOR_MAP and f2 in FLAVOR_MAP and f1 != f2:
                            combo_files.add((filename, f1, f2))

    for filename, f1, f2 in sorted(combo_files):
        flavor1 = FLAVOR_MAP[f1]
        flavor2 = FLAVOR_MAP[f2]
        combo_name = f"Satvikana Roasted Makhana Combo ({flavor1} & {flavor2}) 70x2 gm"
        
        # Copy to media if both exist (local dev workflow)
        if os.path.exists(frontend_public_dir) and os.path.exists(backend_media_products_dir):
            src_path = os.path.join(frontend_public_dir, filename)
            dest_path = os.path.join(backend_media_products_dir, filename)
            try:
                if not os.path.exists(dest_path):
                    shutil.copy2(src_path, dest_path)
            except Exception as e:
                print(f"Error copying {filename}: {e}")
                
        products.append({
            "name": f"{combo_name} | Gluten Free | No Added Preservatives | Rich in Protein & Calcium | Healthy Superfood Snack Combo",
            "price": 369.00,
            "original_price": 399.00,
            "category": "combo",
            "image": f"products/{filename}",
            "description": f"Get the best of both worlds with our Satvikana Roasted Makhana Combo. Contains 2 packs of 70g each: one delicious {flavor1} & one delicious {flavor2}. 100% natural, roasted to perfection & coated with premium spices. The perfect guilt-free snack combo."
        })

    for p in products:
        Product.objects.create(
            name=p["name"],
            price=p["price"],
            original_price=p["original_price"],
            category=p["category"],
            image=p["image"],
            description=p["description"]
        )

    return len(products)
