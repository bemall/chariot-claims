# Chariot Claims

A production-ready monorepo for a claims and payment management system built with Django, Next.js, and AWS infrastructure.

## 🏗️ Architecture

- **Backend**: Django 5.0 with Django REST Framework, Poetry for dependency management
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Database**: PostgreSQL with PostGIS
- **Cache/Queue**: Redis with Celery
- **Infrastructure**: AWS CDK with ECS, RDS, and S3
- **Development**: Docker Compose orchestration

## 📋 Prerequisites

Ensure you have the following installed:
- Docker Desktop 28.3.2+
- Docker Compose v2.38.2+
- Python 3.13.5+
- Poetry 2.1.3+
- Node.js 24.3.0+
- Git

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url> chariot-claims
cd chariot-claims

# Copy environment files
cp .env.example .env
cp .env.example .env.development

# Make scripts executable
chmod +x scripts/*.sh

## 2. Install Dependencies
```# Backend dependencies (Poetry)
cd backend
poetry install
cd ..

# Frontend dependencies
```cd frontend
npm install
cd ..

# Infrastructure dependencies (if using CDK)
cd infrastructure/cdk
npm install
cd ../..```


## 3. Start Development Environment
```# Using the start script
./scripts/start-dev.sh

# Or using Make
make dev```

# Or using docker-compose directly
docker-compose up -d```


## 4. Access Points
Once running, you can access:

- Backend API: http://localhost:8000/api/
- API Documentation: http://localhost:8000/api/docs/
- Django Admin: http://localhost:8000/admin/
- Frontend Application: http://localhost:3000
- pgAdmin: http://localhost:5050

Default Credentials

- Django Admin: admin@chariot.com / admin123
- pgAdmin: admin@chariot.com / admin123

## 5. Project Structure
```chariot-claims/
├── backend/                    # Django backend service
│   ├── apps/                  # Django applications
│   │   ├── accounts/         # User management
│   │   └── payments/         # Payment processing
│   ├── chariot_claims/       # Django project settings
│   ├── tests/                # Backend tests
│   ├── pyproject.toml        # Poetry dependencies
│   └── manage.py
├── frontend/                  # Next.js frontend
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   ├── components/      # React components
│   │   └── lib/            # Utilities and API
│   └── package.json
├── infrastructure/            # Infrastructure as Code
│   └── cdk/                  # AWS CDK definitions
├── deployment/               # Deployment configurations
│   └── docker/              # Docker files
│       ├── backend.Dockerfile
│       ├── frontend.Dockerfile
│       └── celery.Dockerfile
├── scripts/                  # Utility scripts
├── docker-compose.yml        # Local development orchestration
├── Makefile                  # Common commands
└── README.md```

## 6. Development
Common Commands
```# Service Management
make up          # Start all services
make down        # Stop all services
make logs        # View logs
make ps          # Check service status

# Django Commands
make shell       # Django shell
make migrate     # Run migrations
make makemigrations  # Create migrations
make createsuperuser # Create admin user
make loaddata    # Load sample data

# Testing
make test        # Run all tests
make test-backend    # Backend tests only
make test-frontend   # Frontend tests only

# Code Quality
make format      # Format code
make lint        # Run linters```

### Backend Development (Poetry)
```# Add a package
cd backend
poetry add <package-name>

# Add dev dependency
poetry add --group dev <package-name>

# Update dependencies
poetry update

# Show installed packages
poetry show

# Run Django commands
poetry run python manage.py <command>```


### Frontend Development
```# Development server
cd frontend
npm run dev

# Add dependencies
npm install <package-name>

# Build for production
npm run build

# Run tests
npm test```


## 📊 API Documentation
Interactive Documentation

Swagger UI: http://localhost:8020/api/docs/
ReDoc: http://localhost:8020/api/redoc/
OpenAPI Schema: http://localhost:8020/api/schema/
Backend API: http://localhost:8020/api/
API Documentation: http://localhost:8020/api/docs/
Django Admin: http://localhost:8020/admin/
pgAdmin4 http://localhost:5960
PostgreSQL Port : 5442
Frontend Application: http://localhost:3010
Redis redis://redis:6379/0

Key Endpoints
Payments API

```GET    /api/payments/              # List payments (with filtering)
POST   /api/payments/              # Create payment
GET    /api/payments/{id}/         # Get payment details
PATCH  /api/payments/{id}/         # Update payment
DELETE /api/payments/{id}/         # Delete payment
GET    /api/payments/summary/      # Get summary statistics```

### Filtering Examples
```# Filter by recipient
GET /api/payments/?recipient=John

# Filter by date
GET /api/payments/?after=2025-07-30

# Filter by status
GET /api/payments/?status=pending

# Combined filters
GET /api/payments/?recipient=John&status=pending&after=2025-07-30```

## Testing
Running Tests

```# All tests
make test

# Backend tests with coverage
docker-compose exec backend poetry run pytest --cov=apps --cov-report=html

# Frontend tests with watch mode
docker-compose exec frontend npm test -- --watch

# Specific test file
docker-compose exec backend poetry run pytest tests/test_payments_api.py -v```

### Test Structure

Backend tests: backend/tests/
Frontend tests: frontend/src/components/__tests__/

🚀 Deployment
Docker Images
Build production images:
```Test Structure

Backend tests: backend/tests/
Frontend tests: frontend/src/components/__tests__/

🚀 Deployment
Docker Images
Build production images:```

## AWS CDK Deployment

```cd infrastructure/cdk
npm run cdk synth              # Synthesize CloudFormation
npm run cdk deploy             # Deploy to AWS
npm run cdk destroy            # Tear down resources```

## 🔧 Configuration
Environment Variables
Key variables (see .env.example):

```# Django
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=True
DATABASE_URL=postgresql://user:pass@host:port/dbname

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Services
REDIS_URL=redis://redis:6379/0
CELERY_BROKER_URL=redis://redis:6379/0

# AWS (for deployment)
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012```

## Django Settings
Settings are split into modules:

base.py - Common settings
development.py - Local development
production.py - Production settings

🐛 Troubleshooting
Common Issues
Port conflicts
```# Find process using port
lsof -i :8000
# Change ports in docker-compose.yml if needed```

## Database connection errors
```# Check database is running
docker-compose ps db
# Check logs
docker-compose logs db
# Restart database
docker-compose restart db```


### Poetry/Python version issues
```# Ensure using correct Python version
poetry env use python3.13
# Reinstall dependencies
poetry install```


### Frontend build errors
```# Clear cache and reinstall
cd frontend
rm -rf node_modules .next
npm install```

## Useful Debug Commands
```# Container shell access
docker-compose exec backend bash
docker-compose exec frontend sh

# Database access
docker-compose exec db psql -U postgres chariot_claims

# Redis CLI
docker-compose exec redis redis-cli

# View real-time logs
docker-compose logs -f backend
docker-compose logs -f frontend```

📈 Performance Optimization

Database indexes on frequently queried fields
Redis caching for session and API responses
Static file serving via WhiteNoise
Frontend code splitting and lazy loading
Docker layer caching for faster builds

🔒 Security Considerations

Environment variables for secrets
CORS configuration for API access
Django security middleware enabled
SQL injection protection via ORM
XSS protection in templates
HTTPS enforcement in production

🤝 Contributing

Create a feature branch (git checkout -b feature/amazing-feature)
Make your changes
Run tests (make test)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

📚 Additional Resources

Django Documentation
Next.js Documentation
Poetry Documentation
Docker Documentation
AWS CDK Documentation

📄 License
[Chariot-Claims-Bemall44]

```This README is tailored to your specific setup with:
- Updated project name: `chariot-claims`
- Your directory structure with `deployment/docker/` for Dockerfiles
- Your specific versions (Python 3.13.5, Poetry 2.1.3, etc.)
- All the key information from the setup guide
- Clear sections for quick reference
- Troubleshooting for common issues```
