#!/bin/bash
# Chariot Claims Development Environment Startup Script
# This script starts all services and provides a convenient development experience

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="Chariot Claims"
DJANGO_USER="hibernard@protonmail.com"
DJANGO_PASS="Mangoes4u#"

# Print colored output
print_color() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# Print header
print_header() {
    echo ""
    print_color "$BLUE" "========================================"
    print_color "$BLUE" "$1"
    print_color "$BLUE" "========================================"
    echo ""
}

# Check if .env exists
check_env() {
    if [ ! -f .env ]; then
        print_color "$RED" "❌ .env file not found. Creating from .env.example..."
        cp .env.example .env
        print_color "$GREEN" "✅ Created .env file. Please update with your values if needed."
    fi
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_color "$RED" "❌ Docker is not running. Please start Docker Desktop and try again."
        exit 1
    fi
    print_color "$GREEN" "✅ Docker is running"
}

# Main execution
print_header "🚀 Starting $PROJECT_NAME Development Environment"

# Pre-flight checks
check_env
check_docker

# Stop any existing containers
print_color "$YELLOW" "🛑 Stopping any existing containers..."
docker-compose down

# Start services
print_color "$YELLOW" "🐳 Starting Docker services..."
docker-compose up -d

# Wait for database
print_color "$YELLOW" "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose exec -T db pg_isready -U chariot -d chariot_claims > /dev/null 2>&1; do
    echo -n "."
    sleep 1
done
echo ""
print_color "$GREEN" "✅ PostgreSQL is ready"

# Wait for Redis
print_color "$YELLOW" "⏳ Waiting for Redis to be ready..."
until docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; do
    echo -n "."
    sleep 1
done
echo ""
print_color "$GREEN" "✅ Redis is ready"

# Run migrations
print_color "$YELLOW" "🔄 Running database migrations..."
docker-compose exec backend poetry run python manage.py migrate

# Collect static files
print_color "$YELLOW" "📦 Collecting static files..."
docker-compose exec backend poetry run python manage.py collectstatic --noinput

# Create/verify superuser
print_color "$YELLOW" "👤 Checking for superuser..."
docker-compose exec backend poetry run python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='$DJANGO_USER').exists():
    User.objects.create_superuser(
        username='admin',
        email='$DJANGO_USER',
        password='$DJANGO_PASS'
    )
    print('✅ Created superuser: $DJANGO_USER')
else:
    print('✅ Superuser already exists: $DJANGO_USER')
"

# Load sample data
print_color "$YELLOW" "📊 Loading sample payment data..."
docker-compose exec backend poetry run python manage.py load_sample_payments

# Show service status
print_header "📋 Service Status"
docker-compose ps

# Display access information
print_header "🌐 Access Points"
echo "Backend API:          http://localhost:8020/api/"
echo "API Documentation:    http://localhost:8020/api/docs/"
echo "Django Admin:         http://localhost:8020/admin/"
echo "Frontend Application: http://localhost:3010"
echo "pgAdmin:             http://localhost:5960"
echo "PostgreSQL:          localhost:5442"
echo "Redis:               localhost:6389"

print_header "🔑 Credentials"
echo "Django Admin: $DJANGO_USER / $DJANGO_PASS"
echo "pgAdmin:      $DJANGO_USER / $DJANGO_PASS"

print_header "🚀 Quick Commands"
echo "View logs:        docker-compose logs -f"
echo "Stop all:         docker-compose down"
echo "Django shell:     docker-compose exec backend poetry run python manage.py shell"
echo "Run tests:        docker-compose exec backend poetry run pytest"
echo "Make migrations:  docker-compose exec backend poetry run python manage.py makemigrations"

print_color "$GREEN" ""
print_color "$GREEN" "✅ $PROJECT_NAME development environment is ready!"
print_color "$GREEN" "✅ Frontend should be accessible at http://localhost:3010"
print_color "$GREEN" ""

# Optionally follow logs
read -p "Would you like to follow the logs? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose logs -f
fi
