import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'satvikana_backend.settings')
django.setup()

from api.models import Product

products = [
    "chat masala flavoured makhana | healthy fox nuts 70g",
    "cheesy masti roasted makhana | healthy fox nuts 70g",
    "cream & onion roasted makhana | healthy fox nuts 70g",
    "himalayan salt flavoured makhana | healthy fox nuts 70g",
    "mint masala flavoured makhana | healthy fox nuts 70g",
    "pepper punch flavoured makhana | healthy fox nuts 70g",
    "peri peri flavoured makhana | healthy fox nuts 70g",
    "tangy tomato flavoured makhana | healthy fox nuts 70g",
]

for name in products:
    Product.objects.get_or_create(
        name=name,
        defaults={
            'description': f"Delicious {name}. 100% natural and healthy.",
            'price': 99.00
        }
    )

print("Products populated successfully.")
