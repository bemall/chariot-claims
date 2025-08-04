# Chariot Claims Management System

A modern full-stack claims management application built with Django REST Framework and Next.js.

## 🏗️ Architecture

- **Backend**: Django 5.0+ with Django REST Framework
- **Frontend**: Next.js with React 19, TypeScript, and Tailwind CSS
- **Database**: PostgreSQL with PostGIS extensions
- **Task Queue**: Celery with Redis
- **Deployment**: Docker Compose with production-ready configuration

## 📁 Project Structure

```
chariot-claims/
├── backend/                 # Django REST API
│   ├── apps/
│   │   ├── accounts/       # User management
│   │   └── payments/       # Payment processing & claims
│   ├── chariot_claims/     # Django project settings
│   ├── deployment/         # Docker configurations
│   └── README.md          # Backend documentation
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   ├── components/    # React components
│   │   └── lib/           # Utilities
│   └── README.md          # Frontend documentation
├── deployment/             # Docker configurations
├── scripts/               # Utility scripts
└── docker-compose.yml     # Development environment
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chariot-claims
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the development environment**
   ```bash
   docker-compose up --build -d
   ```

4. **Access the applications**
   - **Frontend**: http://localhost:3010
   - **Backend API**: http://localhost:8020/api/
   - **API Documentation**: http://localhost:8020/api/docs/
   - **Django Admin**: http://localhost:8020/admin/
   - **pgAdmin**: http://localhost:5960
   - **PostgreSQL**: localhost:5442
   - **Redis**: localhost:6389

### Initial Setup

1. **Run database migrations**
   ```bash
   docker-compose exec backend poetry run python manage.py migrate
   ```

2. **Create a superuser**
   ```bash
   docker-compose exec backend poetry run python manage.py createsuperuser
   ```

3. **Load sample data (optional)**
   ```bash
   docker-compose exec backend poetry run python manage.py loaddata fixtures/sample_data.json
   ```

## 🛠️ Development

### Backend Development

For detailed backend development instructions, see [backend/README.md](./backend/README.md).

**Key commands:**
```bash
# Run tests
docker-compose exec backend poetry run pytest

# Django shell
docker-compose exec backend poetry run python manage.py shell

# Create new migration
docker-compose exec backend poetry run python manage.py makemigrations

# Apply migrations
docker-compose exec backend poetry run python manage.py migrate
```

### Frontend Development

For detailed frontend development instructions, see [frontend/README.md](./frontend/README.md).

**Key commands:**
```bash
# Install dependencies
docker-compose exec frontend npm install

# Run tests
docker-compose exec frontend npm test

# Build for production
docker-compose exec frontend npm run build
```

## 📊 API Documentation

- **Swagger UI**: http://localhost:8020/api/docs/
- **ReDoc**: http://localhost:8020/api/redoc/
- **OpenAPI Schema**: http://localhost:8020/api/schema/

### Key API Endpoints

```
# Payments API
GET    /api/payments/              # List payments (with filtering)
POST   /api/payments/              # Create payment
GET    /api/payments/{id}/         # Get payment details
PATCH  /api/payments/{id}/         # Update payment
DELETE /api/payments/{id}/         # Delete payment
GET    /api/payments/summary/      # Get summary statistics

# Authentication
POST   /api/auth/login/            # User login
POST   /api/auth/logout/           # User logout
POST   /api/auth/register/         # User registration
```

## 🐳 Docker Services

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| Backend | `chariot_backend` | 8020 | Django REST API |
| Frontend | `chariot_frontend` | 3010 | Next.js application |
| Database | `chariot_db` | 5442 | PostgreSQL with PostGIS |
| Redis | `chariot_redis` | 6389 | Cache and task queue |
| pgAdmin | `chariot_pgadmin` | 5960 | Database administration |
| Celery Worker | `chariot_celery_worker` | - | Background task processing |
| Celery Beat | `chariot_celery_beat` | - | Scheduled task management |

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
docker-compose exec backend poetry run pytest

# Run with coverage
docker-compose exec backend poetry run pytest --cov

# Run specific test file
docker-compose exec backend poetry run pytest apps/payments/tests.py
```

### Frontend Tests
```bash
# Run all tests
docker-compose exec frontend npm test

# Run with coverage
docker-compose exec frontend npm run test:coverage

# Run tests in watch mode
docker-compose exec frontend npm run test:watch
```

## 🔧 Common Commands

```bash
# View logs
docker-compose logs -f [service-name]

# Restart a service
docker-compose restart [service-name]

# Rebuild and restart
docker-compose up --build -d [service-name]

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Access container shell
docker-compose exec [service-name] /bin/bash
```

## 🌍 Environment Variables

Key environment variables (see `.env.example` for complete list):

```bash
# Django
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Database
POSTGRES_DB=chariot_claims
POSTGRES_USER=chariot
POSTGRES_PASSWORD=your-password

# Redis
REDIS_URL=redis://redis:6379/0

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8020/api
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Convention

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

## 🔒 Security

- Environment variables for sensitive data
- CORS protection configured
- CSRF protection enabled
- SQL injection protection via Django ORM
- Input validation and sanitization
- Rate limiting on API endpoints

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3010, 5442, 5960, 6389, 8020 are available
2. **Permission issues**: Run `docker-compose down -v` and rebuild
3. **Database connection**: Check PostgreSQL container is healthy
4. **Poetry issues**: Rebuild backend container with `--no-cache`

### Getting Help

- Check the logs: `docker-compose logs -f [service-name]`
- Restart services: `docker-compose restart`
- Full reset: `docker-compose down -v && docker-compose up --build -d`

For more detailed information, see the individual README files in the `backend/` and `frontend/` directories.
