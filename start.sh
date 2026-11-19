#!/bin/bash
set -e

echo "=================================================="
echo "    Starting Satvikana Backend Application        "
echo "=================================================="

# Determine base directory
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
    echo "ERROR: python3 or python command not found on system!"
    exit 1
fi

echo "Python version: $($PYTHON_EXEC --version)"

# 2. Virtual Environment
VENV_DIR="$ROOT_DIR/venv"
if [ ! -d "$VENV_DIR" ] || [ ! -f "$VENV_DIR/bin/gunicorn" ]; then
    echo "Creating virtual environment in $VENV_DIR..."
    $PYTHON_EXEC -m venv "$VENV_DIR"
    
    echo "Upgrading pip..."
    "$VENV_DIR/bin/pip" install --upgrade pip
    
    echo "Installing dependencies..."
    if [ -f "$ROOT_DIR/requirements.txt" ]; then
        "$VENV_DIR/bin/pip" install -r "$ROOT_DIR/requirements.txt"
    elif [ -f "$BACKEND_DIR/requirements.txt" ]; then
        "$VENV_DIR/bin/pip" install -r "$BACKEND_DIR/requirements.txt"
    fi
    
    # Ensure gunicorn is installed
    "$VENV_DIR/bin/pip" install "gunicorn>=21.2.0"
fi

# 3. Enter backend directory for Django operations
cd "$BACKEND_DIR"

# 4. Run migrations
echo "Applying database migrations..."
"$VENV_DIR/bin/python" manage.py migrate --noinput || true

# 5. Populate initial data if database is new
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