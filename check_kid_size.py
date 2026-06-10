import os
from PIL import Image

pub_dir = r'c:\Users\Vraj\Desktop\simple e-commerce store\satvikana_frontend\public'
for name in ['kid.jpeg', 'kiddd.png']:
    path = os.path.join(pub_dir, name)
    if os.path.exists(path):
        with Image.open(path) as img:
            print(f"{name}: {img.format} | Size: {img.size} | Aspect: {img.size[0]/img.size[1]:.3f}")
