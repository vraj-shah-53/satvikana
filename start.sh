#!/bin/bash
set -e

echo "=================================================="
echo "    Starting Satvikana Backend Application        "
echo "=================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ -d "satvikana_backend" ]; then
    ROOT_DIR="$SCRIPT_DIR"
    BACKEND_DIR="$SCRIPT_DIR/satvikana_backend"
elif [ -f "manage.py" ]; then
    ROOT_DIR="$(dirname "$SCRIPT_DIR")"
    BACKEND_DIR="$SCRIPT_DIR"
else
    ROOT_DIR="$SCRIPT_DIR"
    BACKEND_DIR="$SCRIPT_DIR"
fi

echo "Working directory: $(pwd)"
echo "Backend directory: $BACKEND_DIR"

# 1. Locate Python 3
if command -v python3 &>/dev/null; then
    PYTHON_EXEC=python3
elif command -v python &>/dev/null; then
    PYTHON_EXEC=python
else
    echo "ERROR: python3 not found!"
    exit 1
fi

echo "Python: $($PYTHON_EXEC --version)"

# 2. Virtual Environment Setup
VENV_DIR="$ROOT_DIR/venv"
if [ ! -f "$VENV_DIR/bin/gunicorn" ] || [ ! -f "$VENV_DIR/bin/python" ]; then
    echo "Configuring virtual environment in $VENV_DIR..."
    rm -rf "$VENV_DIR"
    
    # Try standard venv; fallback to --without-pip when ensurepip is missing on Debian/Ubuntu
    if ! $PYTHON_EXEC -m venv "$VENV_DIR" 2>/dev/null; then
        echo "ensurepip unavailable on system. Creating venv with --without-pip..."
        $PYTHON_EXEC -m venv --without-pip "$VENV_DIR"
        
        echo "Bootstrapping pip into virtual environment..."
        if [ -f "$ROOT_DIR/get-pip.py" ]; then
            "$VENV_DIR/bin/python" "$ROOT_DIR/get-pip.py" --no-setuptools --no-wheel
        elif [ -f "$BACKEND_DIR/get-pip.py" ]; then
            "$VENV_DIR/bin/python" "$BACKEND_DIR/get-pip.py" --no-setuptools --no-wheel
        else
            curl -sS https://bootstrap.pypa.io/get-pip.py -o /tmp/get-pip.py || wget -qO /tmp/get-pip.py https://bootstrap.pypa.io/get-pip.py
            "$VENV_DIR/bin/python" /tmp/get-pip.py --no-setuptools --no-wheel
            rm -f /tmp/get-pip.py
        fi
    fi
    
    echo "Installing project dependencies..."
    if [ -f "$ROOT_DIR/requirements.txt" ]; then
        "$VENV_DIR/bin/pip" install --no-cache-dir -r "$ROOT_DIR/requirements.txt"
    elif [ -f "$BACKEND_DIR/requirements.txt" ]; then
        "$VENV_DIR/bin/pip" install --no-cache-dir -r "$BACKEND_DIR/requirements.txt"
    fi
    
    "$VENV_DIR/bin/pip" install --no-cache-dir "gunicorn>=21.2.0"
fi

# 3. Enter backend directory
cd "$BACKEND_DIR"

# 4. Run migrations
echo "Applying database migrations..."
"$VENV_DIR/bin/python" manage.py migrate --noinput || true

# 5. Populate initial data if needed
if [ -f "populate.py" ]; then
    echo "Checking initial seed data..."
    "$VENV_DIR/bin/python" populate.py || true
fi

# 6. Collect static files
echo "Collecting static files..."
"$VENV_DIR/bin/python" manage.py collectstatic --noinput || true

# 7. Start Gunicorn
PORT="${PORT:-3000}"
echo "Launching Gunicorn on 0.0.0.0:$PORT..."
exec "$VENV_DIR/bin/gunicorn" satvikana_backend.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 2 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -