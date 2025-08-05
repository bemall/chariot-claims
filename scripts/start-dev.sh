#!/bin/bash
set -e

echo "🚀 Starting Chariot Claims Development Environment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please update with your values."
fi

# Start services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for database
echo "⏳ Waiting for database to be ready..."
until docker-compose exec -T db pg_isready -U postgres > /dev/null 2>&1; do
    sleep 1
done

# Run migrations
echo "🔄 Running database migrations..."
docker-compose exec backend poetry run python manage.py migrate

# Create superuser if needed
echo "👤 Checking for superuser..."
docker-compose exec backend poetry run python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(is_superuser=True).exists():
    User.objects.create_superuser('admin@chariot.com', 'admin@chariot.com', 'admin123')
    print('✅ Created superuser: admin@chariot.com / admin123')
else:
    print('✅ Superuser already exists')
"

# Generate sample data
echo "📊 Generating sample payment data..."
docker-compose exec backend poetry run python manage.py generate_payments --count 1000

# Show status
echo ""
echo "✅ Development environment is ready!"
echo ""
echo "🌐 Access points:"
echo "   - Backend API: http://localhost:8020/api/"
echo "   - API Docs: http://localhost:8020/api/docs/"
echo "   - Django Admin: http://localhost:8020/admin/"
echo "   - Frontend: http://localhost:3000"
echo "   - pgAdmin: http://localhost:5050"
echo ""
echo "📝 Credentials:"
echo "   - Django Admin: admin@chariot.com / admin123"
echo "   - pgAdmin: admin@chariot.com / admin123"
echo ""

# Follow logs
docker-compose logs -f