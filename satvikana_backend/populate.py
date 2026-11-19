import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'satvikana_backend.settings')
django.setup()

from api.seed_data import run_seed
from django.contrib.auth.models import User
from api.models import UserProfile

print("Seeding database products...")
total = run_seed()
print(f"Products populated successfully. Total products: {total}")

print("Ensuring Satvikana owner accounts...")
admins = [
    {
        'email': 'diyajaventures@gmail.com',
        'username': 'diyajaventures@gmail.com',
        'password': 'Ditya@2505',
        'name': 'Diyaja Ventures (Satvikana Owner)'
    },
    {
        'email': 'vrajjshah53@gmail.com',
        'username': 'vrajjshah53@gmail.com',
        'password': 'vrajshah53',
        'name': 'Vraj Shah (Satvikana Owner)'
    }
]

for a in admins:
    user = User.objects.filter(email__iexact=a['email']).first() or \
           User.objects.filter(username__iexact=a['username']).first()
    if not user:
        user = User.objects.create_user(username=a['username'], email=a['email'])
        print(f"Created owner account: {a['email']}")
    else:
        user.email = a['email']
        user.username = a['username']
    
    user.set_password(a['password'])
    user.is_staff = True
    user.is_superuser = True
    user.save()
    
    profile, _ = UserProfile.objects.get_or_create(user=user)
    profile.name = a['name']
    profile.save()

print("Owner accounts successfully verified.")
