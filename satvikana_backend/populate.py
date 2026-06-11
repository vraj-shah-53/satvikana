import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'satvikana_backend.settings')
django.setup()

from api.seed_data import run_seed

print("Seeding database...")
total = run_seed()
print(f"Products populated successfully. Total products: {total}")
