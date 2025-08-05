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

# Wait for Redis to be ready
echo "Waiting for Redis to be ready..."
while ! poetry run python -c "import sys, redis; sys.exit(0 if redis.Redis(host='redis').ping() else 1)" 2>/dev/null; do
    echo "Redis not ready yet, waiting..."
    sleep 2
done
echo "Redis is ready!"

# Start the Celery worker
echo "Starting Celery worker..."
exec "$@"
