#!/bin/bash
set -e

echo "=== Satvikana Build Hook ==="

if command -v python3 &>/dev/null; then
    PY=python3
elif command -v python &>/dev/null; then
    PY=python
else
    echo "Python not found!"
    exit 1
fi

if [ ! -d "venv" ]; then
    $PY -m venv venv
fi

./venv/bin/pip install --upgrade pip
if [ -f "requirements.txt" ]; then
    ./venv/bin/pip install -r requirements.txt
fi
./venv/bin/pip install "gunicorn>=21.2.0"

if [ -d "satvikana_backend" ]; then
    cd satvikana_backend
    ../venv/bin/python manage.py migrate --noinput || true
    ../venv/bin/python manage.py collectstatic --noinput || true
fi

echo "=== Build Complete ==="