#!/bin/bash
set -e

# Function to wait for the database to be ready
wait_for_db() {
    echo "Waiting for database to be ready..."
    while ! poetry run python -c "import sys, psycopg2; sys.exit(0 if psycopg2.connect(dbname='${POSTGRES_DB}', user='${POSTGRES_USER}', password='${POSTGRES_PASSWORD}', host='db') else 1)" 2>/dev/null; do
        echo "Database not ready yet, waiting..."
        sleep 2
    done
    echo "Database is ready!"
}

# Wait for database to be ready
wait_for_db

# Apply database migrations
echo "Applying database migrations..."
poetry run python manage.py migrate

# Collect static files if in production
if [ "$DJANGO_SETTINGS_MODULE" = "chariot_claims.settings.production" ]; then
    echo "Collecting static files..."
    poetry run python manage.py collectstatic --noinput
fi

# Start the Django server
echo "Starting Django server..."
exec "$@"
