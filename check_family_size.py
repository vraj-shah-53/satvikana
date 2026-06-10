import os
from PIL import Image

path = r'c:\Users\Vraj\Desktop\simple e-commerce store\satvikana_frontend\public\family.png'
if os.path.exists(path):
    with Image.open(path) as img:
        print(f"family.png: {img.format} | Size: {img.size} | Aspect: {img.size[0]/img.size[1]:.3f}")
