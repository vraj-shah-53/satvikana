import os
from PIL import Image

brain_dir = r'C:\Users\Vraj\.gemini\antigravity\brain\44ddb33e-f2d6-4cf8-8729-31513870905c'
print("Scanning recursively...")
for root, dirs, files in os.walk(brain_dir):
    for f in files:
        if f.endswith('.png') or f.endswith('.jpg') or f.endswith('.jpeg'):
            path = os.path.join(root, f)
            try:
                with Image.open(path) as img:
                    print(f"File: {os.path.relpath(path, brain_dir)} | Format: {img.format} | Size: {img.size} | Bytes: {os.path.getsize(path)}")
            except Exception as e:
                print(f"Error reading {f}: {e}")
