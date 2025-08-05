# Makefile for Django + React Monorepo (Poetry, Docker, Vite)
# Supports multi-env, .env loading, Docker/Poetry checks, and developer automation

# --- Settings ---
ENV ?= development
PYTHON = poetry run python
MANAGE = cd backend && poetry run python manage.py
FRONTEND_DIR = frontend
BACKEND_DIR = backend
DEPLOYMENT_DIR = deployment

# Load .env from project root
ifneq ("$(wildcard .env)","")
	include .env
	export $(shell sed 's/=.*//' .env | xargs)
endif

# --- Variables ---
DOCKER_COMPOSE = docker compose
BACKEND_CONTAINER = chariot_backend
FRONTEND_CONTAINER = chariot_frontend
DB_CONTAINER = chariot_db
REDIS_CONTAINER = chariot_redis

# Colors
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m

# --- Tool Check ---
check-tools:
	@command -v docker > /dev/null || (echo "❌ Docker is not installed"; exit 1)
	@command -v docker compose > /dev/null || (echo "❌ Docker Compose v2+ is not installed"; exit 1)
	@cd backend && command -v poetry > /dev/null || (echo "❌ Poetry is not installed or not in PATH"; exit 1)

# --- Help ---
.PHONY: help
help:
	@echo "$(BLUE)Usage: make [target] ENV=development|staging|production$(NC)"
	@echo ""
	@echo "$(BLUE)Backend (Django + Poetry):$(NC)"
	@echo "  $(GREEN)run$(NC)                Run Django dev server"
	@echo "  $(GREEN)migrate$(NC)            Run DB migrations"
	@echo "  $(GREEN)makemigrations$(NC)     Create migrations"
	@echo "  $(GREEN)createsuperuser$(NC)    Create admin user"
	@echo "  $(GREEN)shell$(NC)              Launch Django shell"
	@echo "  $(GREEN)test$(NC)               Run backend tests"
	@echo "  $(GREEN)lint$(NC)               Lint Python files"
	@echo "  $(GREEN)clean$(NC)              Remove __pycache__ and .pyc files"
	@echo "  $(GREEN)collectstatic$(NC)      Collect static files"
	@echo "  $(GREEN)loaddata$(NC)           Load sample payment data"
	@echo ""
	@echo "$(BLUE)Frontend (Vite + React):$(NC)"
	@echo "  $(GREEN)frontend$(NC)           Install frontend deps"
	@echo "  $(GREEN)vite$(NC)               Start Vite dev server"
	@echo "  $(GREEN)test-frontend$(NC)      Run frontend tests"
	@echo ""
	@echo "$(BLUE)Docker & Infra:$(NC)"
	@echo "  $(GREEN)up$(NC)                 Start Docker services"
	@echo "  $(GREEN)down$(NC)               Stop Docker services"
	@echo "  $(GREEN)build$(NC)              Rebuild containers"
	@echo "  $(GREEN)restart$(NC)            Restart containers"
	@echo "  $(GREEN)logs$(NC)               Tail container logs"
	@echo "  $(GREEN)dev$(NC)                Quick development start (build + up + logs)"
	@echo "  $(GREEN)health$(NC)             Check service health"
	@echo ""
	@echo "$(BLUE)Database:$(NC)"
	@echo "  $(GREEN)db-shell$(NC)           Open Postgres shell"
	@echo "  $(GREEN)db-status$(NC)          Check database status"
	@echo "  $(GREEN)db-verify$(NC)          Verify database setup"
	@echo "  $(GREEN)db-test$(NC)            Test database configuration"
	@echo "  $(GREEN)db-reset$(NC)           Reset database (WARNING: deletes data)"
	@echo "  $(GREEN)db-backup$(NC)          Backup database"
	@echo "  $(GREEN)db-restore$(NC)         Restore database from backup"
	@echo "  $(GREEN)db-postgis-check$(NC)   Check PostGIS installation"
	@echo "  $(GREEN)db-postgis-test$(NC)    Test PostGIS functionality"
	@echo "  $(GREEN)redis-cli$(NC)          Open Redis CLI"
	@echo ""
	@echo "$(BLUE)Utilities:$(NC)"
	@echo "  $(GREEN)backup-pgpass$(NC)      Run backup-pgpass script"
	@echo "  $(GREEN)status$(NC)             Show environment/debug info"
	@echo "  $(GREEN)check-tools$(NC)        Check Docker and Poetry availability"
	@echo "  $(GREEN)install$(NC)            Install all dependencies"
	@echo "  $(GREEN)prod-build$(NC)         Build production images"

# --- Backend Targets ---
run: check-tools
	$(MANAGE) runserver 0.0.0.0:8020

migrate: check-tools
	@echo "$(YELLOW)Running migrations...$(NC)"
	$(DOCKER_COMPOSE) exec $(BACKEND_CONTAINER) poetry run python manage.py migrate --settings=chariot_claims.settings.$(ENV)
	@echo "$(GREEN)✓ Migrations complete$(NC)"

makemigrations: check-tools
	$(DOCKER_COMPOSE) exec $(BACKEND_CONTAINER) poetry run python manage.py makemigrations --settings=chariot_claims.settings.$(ENV)

createsuperuser: check-tools
	$(DOCKER_COMPOSE) exec $(BACKEND_CONTAINER) poetry run python manage.py createsuperuser --settings=chariot_claims.settings.$(ENV)

shell: check-tools
	$(DOCKER_COMPOSE) exec $(BACKEND_CONTAINER) poetry run python manage.py shell --settings=chariot_claims.settings.$(ENV)

test: test-backend test-frontend

test-backend: check-tools
	@echo "$(YELLOW)Running backend tests...$(NC)"
	$(DOCKER_COMPOSE) exec $(BACKEND_CONTAINER) poetry run pytest -v
	@echo "$(GREEN)✓ Backend tests complete$(NC)"

lint: check-tools
	cd backend && poetry run flake8 .

clean:
	@echo "$(YELLOW)Cleaning up...$(NC)"
	find . -name '*.pyc' -delete
	find . -name '__pycache__' -delete
	rm -rf backend/staticfiles
	rm -rf backend/media
	@echo "$(GREEN)✓ Cleanup complete$(NC)"

collectstatic:
	@echo "$(YELLOW)Collecting static files...$(NC)"
	$(DOCKER_COMPOSE) exec $(BACKEND_CONTAINER) poetry run python manage.py collectstatic --noinput
	@echo "$(GREEN)✓ Static files collected$(NC)"

loaddata:
	@echo "$(YELLOW)Generating sample payment data...$(NC)"
	$(DOCKER_COMPOSE) exec $(BACKEND_CONTAINER) poetry run python manage.py generate_payments --count 1000
	@echo "$(GREEN)✓ Sample data loaded$(NC)"

# --- Frontend Targets ---
frontend:
	@echo "$(YELLOW)Installing frontend dependencies...$(NC)"
	cd $(FRONTEND_DIR) && npm install
	@echo "$(GREEN)✓ Frontend dependencies installed$(NC)"

vite:
	cd $(FRONTEND_DIR) && npm run dev

test-frontend:
	@echo "$(YELLOW)Running frontend tests...$(NC)"
	$(DOCKER_COMPOSE) exec $(FRONTEND_CONTAINER) npm test
	@echo "$(GREEN)✓ Frontend tests complete$(NC)"

# --- Docker Targets ---
up: check-tools
	@echo "$(YELLOW)Starting services...$(NC)"
	$(DOCKER_COMPOSE) --env-file .env up -d
	@echo "$(YELLOW)Waiting for services to start...$(NC)"
	@sleep 10
	@make migrate
	@make collectstatic
	@make loaddata
	@echo "$(GREEN)✓ Services are ready!$(NC)"
	@echo ""
	@echo "$(BLUE)Access Points:$(NC)"
	@echo "  Backend API: http://localhost:8020/api/"
	@echo "  API Docs:    http://localhost:8020/api/docs/"
	@echo "  Django Admin: http://localhost:8020/admin/"
	@echo "  Frontend:     http://localhost:3010"
	@echo "  pgAdmin:      http://localhost:5960"
	@echo ""
	@echo "$(BLUE)Service Ports:$(NC)"
	@echo "  PostgreSQL: localhost:5442"
	@echo "  Redis:      localhost:6389"
	@echo ""
	@echo "$(BLUE)Credentials:$(NC)"
	@echo "  Django: hibernard@protonmail.com / Mangoes4u#"
	@echo "  pgAdmin: hibernard@protonmail.com / Mangoes4u#"

down: check-tools
	@echo "$(YELLOW)Stopping services...$(NC)"
	$(DOCKER_COMPOSE) --env-file .env down
	@echo "$(GREEN)✓ Services stopped$(NC)"

build: check-tools
	@echo "$(YELLOW)Building Docker images...$(NC)"
	$(DOCKER_COMPOSE) --env-file .env build --parallel
	@echo "$(GREEN)✓ Docker images built$(NC)"

restart: check-tools
	$(DOCKER_COMPOSE) --env-file .env down
	$(DOCKER_COMPOSE) --env-file .env up -d --build

logs: check-tools
	$(DOCKER_COMPOSE) logs -f

# Development shortcuts
dev: check-tools build up migrate collectstatic loaddata
	@echo "$(GREEN)Development environment is ready!$(NC)"
	@echo "$(BLUE)Backend: http://localhost:8020$(NC)"
	@echo "$(BLUE)Frontend: http://localhost:3000$(NC)"
	@echo "$(BLUE)pgAdmin: http://localhost:5050$(NC)"
	@echo "$(YELLOW)Waiting for services to fully start...$(NC)"
	@sleep 5

# Check service health
health:
	@echo "$(BLUE)Checking service health...$(NC)"
	@echo -n "PostgreSQL: "
	@$(DOCKER_COMPOSE) exec -T $(DB_CONTAINER) pg_isready -U $(POSTGRES_USER) > /dev/null 2>&1 && echo "$(GREEN)✓ Healthy$(NC)" || echo "$(RED)✗ Unhealthy$(NC)"
	@echo -n "Redis: "
	@$(DOCKER_COMPOSE) exec -T $(REDIS_CONTAINER) redis-cli ping > /dev/null 2>&1 && echo "$(GREEN)✓ Healthy$(NC)" || echo "$(RED)✗ Unhealthy$(NC)"
	@echo -n "Backend: "
	@curl -s http://localhost:8020/api/health/ > /dev/null 2>&1 && echo "$(GREEN)✓ Healthy$(NC)" || echo "$(RED)✗ Unhealthy$(NC)"
	@echo -n "Frontend: "
	@curl -s http://localhost:3010 > /dev/null 2>&1 && echo "$(GREEN)✓ Healthy$(NC)" || echo "$(RED)✗ Unhealthy$(NC)"

# --- Database Management Commands ---
db-shell:
	$(DOCKER_COMPOSE) exec $(DB_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

db-logs:
	$(DOCKER_COMPOSE) logs -f db

db-reset:
	@echo "⚠️  WARNING: This will delete all database data!"
	@read -p "Are you sure? [y/N] " confirm && [ "$${confirm}" = "y" ] || exit 1
	$(DOCKER_COMPOSE) stop db
	$(DOCKER_COMPOSE) rm -f db
	docker volume rm chariot-claims_postgres_data || true
	@echo "Database volume removed. Run 'make up' to recreate."

db-test:
	@echo "Testing database setup..."
	@echo "1. Checking schemas..."
	@$(DOCKER_COMPOSE) exec $(DB_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c "\dn" || echo "Database not ready"
	@echo ""
	@echo "2. Checking extensions..."
	@$(DOCKER_COMPOSE) exec $(DB_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c "\dx" || echo "Extensions not ready"
	@echo ""
	@echo "3. Checking payments schema permissions..."
	@$(DOCKER_COMPOSE) exec $(DB_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c "\dp payments.*" 2>/dev/null || echo "No objects in payments schema yet"
	@echo ""
	@echo "4. Checking analytics schema permissions..."
	@$(DOCKER_COMPOSE) exec $(DB_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c "\dp analytics.*" 2>/dev/null || echo "No objects in analytics schema yet"

db-verify:
	@echo "Verifying database setup..."
	@$(DOCKER_COMPOSE) exec $(DB_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -t -c "SELECT 'Current Database: ' || current_database();"
	@$(DOCKER_COMPOSE) exec $(DB_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -t -c "SELECT 'Current User: ' || current_user;"
	@$(DOCKER_COMPOSE) exec $(DB_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -t -c "SELECT 'Database Owner: ' || pg_catalog.pg_get_userbyid(d.datdba) FROM pg_catalog.pg_database d WHERE d.datname = '$(POSTGRES_DB)';"
	@echo ""
	@echo "Schemas:"
	@$(DOCKER_COMPOSE) exec $(DB_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -t -c "SELECT '  - ' || schema_name || ' (owner: ' || schema_owner || ')' FROM information_schema.schemata WHERE schema_name IN ('payments', 'analytics') ORDER BY schema_name;"
	@echo ""
	@echo "Extensions:"
	@$(DOCKER_COMPOSE) exec $(DB_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -t -c "SELECT '  - ' || extname || ' ' || extversion FROM pg_extension WHERE extname != 'plpgsql' ORDER BY extname;"
	@echo ""
	@echo "PostGIS Version:"
	@$(DOCKER_COMPOSE) exec $(DB_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -t -c "SELECT '  ' || PostGIS_version();"

db-status:
	@$(DOCKER_COMPOSE) exec $(DB_CONTAINER) pg_isready -U $(POSTGRES_USER) -d $(POSTGRES_DB) && echo "✅ Database is ready" || echo "❌ Database is not ready"

db-stats:
	@echo "Database statistics:"
	@$(DOCKER_COMPOSE) exec $(DB_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c "SELECT schemaname, tablename, n_live_tup as rows FROM pg_stat_user_tables WHERE schemaname IN ('payments', 'analytics') ORDER BY schemaname, tablename;"

# PostGIS specific commands
db-postgis-check:
	@echo "PostGIS diagnostics:"
	@$(DOCKER_COMPOSE) exec $(DB_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c "SELECT PostGIS_full_version();"
	@$(DOCKER_COMPOSE) exec $(DB_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c "SELECT name, default_version, installed_version FROM pg_available_extensions WHERE name LIKE 'postgis%' ORDER BY name;"

# Create a test spatial table to verify PostGIS works
db-postgis-test:
	@echo "Testing PostGIS functionality..."
	@$(DOCKER_COMPOSE) exec $(DB_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c "CREATE TABLE IF NOT EXISTS payments.test_locations (id SERIAL PRIMARY KEY, name TEXT, location GEOMETRY(Point, 4326));"
	@$(DOCKER_COMPOSE) exec $(DB_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c "INSERT INTO payments.test_locations (name, location) VALUES ('Test Point', ST_GeomFromText('POINT(-73.935242 40.730610)', 4326)) ON CONFLICT DO NOTHING;"
	@$(DOCKER_COMPOSE) exec $(DB_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c "SELECT name, ST_AsText(location) FROM payments.test_locations;"
	@$(DOCKER_COMPOSE) exec $(DB_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c "DROP TABLE IF EXISTS payments.test_locations;"
	@echo "✅ PostGIS is working correctly"

# Development helper to create a database backup
db-backup:
	@echo "$(YELLOW)Creating database backup...$(NC)"
	@mkdir -p ./backups
	@$(DOCKER_COMPOSE) exec $(DB_CONTAINER) pg_dump -U $(POSTGRES_USER) -d $(POSTGRES_DB) -F c -f /tmp/backup.dump
	@docker cp $(DB_CONTAINER):/tmp/backup.dump ./backups/chariot_claims_$$(date +%Y%m%d_%H%M%S).dump
	@$(DOCKER_COMPOSE) exec $(DB_CONTAINER) rm /tmp/backup.dump
	@echo "$(GREEN)✓ Database backed up to ./backups/$(NC)"

# Restore from backup
db-restore:
	@echo "$(YELLOW)Available backups:$(NC)"
	@ls -la backups/*.dump 2>/dev/null || echo "No backups found"
	@echo ""
	@read -p "Enter backup filename (from ./backups/): " filename; \
	docker cp ./backups/$$filename $(DB_CONTAINER):/tmp/restore.dump && \
	$(DOCKER_COMPOSE) exec $(DB_CONTAINER) pg_restore -U $(POSTGRES_USER) -d $(POSTGRES_DB) -c /tmp/restore.dump && \
	$(DOCKER_COMPOSE) exec $(DB_CONTAINER) rm /tmp/restore.dump && \
	echo "$(GREEN)✓ Database restored from $$filename$(NC)"

# Redis CLI
redis-cli:
	$(DOCKER_COMPOSE) exec $(REDIS_CONTAINER) redis-cli

# --- Utility Commands ---
backup-pgpass:
	$(DEPLOYMENT_DIR)/scripts/backup-pgpass.sh

status: check-tools
	@echo "🧠 Environment: $(ENV)"
	@echo "🔁 Python version:" && cd backend && poetry run python --version
	@echo "📦 Poetry packages:" && cd backend && poetry show --no-dev | wc -l
	@echo "🐳 Docker containers:" && $(DOCKER_COMPOSE) ps
	@echo "💾 Postgres connection info:"
	@echo "   Host: localhost:5442"
	@echo "   DB:   $(POSTGRES_DB)"
	@echo "   User: $(POSTGRES_USER)"
	@echo "📡 Redis: localhost:6389"
	@echo "🌐 Backend: http://localhost:8020"
	@echo "⚛️  Frontend: http://localhost:3010"
	@echo "📊 pgAdmin: http://localhost:5960"

# Install all dependencies
install:
	@echo "$(YELLOW)Installing all dependencies...$(NC)"
	@echo "$(YELLOW)Installing backend dependencies...$(NC)"
	cd backend && poetry install
	@echo "$(YELLOW)Installing frontend dependencies...$(NC)"
	cd frontend && npm install
	@echo "$(YELLOW)Installing infrastructure dependencies...$(NC)"
	cd infrastructure && npm install
	@echo "$(GREEN)✓ All dependencies installed$(NC)"

# Production build
prod-build:
	@echo "$(YELLOW)Building production images...$(NC)"
	docker build -f deployment/docker/backend/backend.Dockerfile -t chariot-backend:latest backend/
	docker build -f deployment/docker/frontend/frontend.Dockerfile -t chariot-frontend:latest frontend/
	@echo "$(GREEN)✓ Production images built$(NC)"

# Production deploy with safety confirmation
prod-deploy: prod-build
	@echo "$(YELLOW)Deploying to production...$(NC)"
	@echo "$(RED)Warning: This will deploy to production environment$(NC)"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	ENV=production $(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml up -d
	@echo "$(GREEN)✓ Production deployment complete$(NC)"

# Add all phony targets
.PHONY: help check-tools run migrate makemigrations createsuperuser shell test test-backend lint clean
.PHONY: collectstatic loaddata frontend vite test-frontend
.PHONY: up down build restart logs dev health
.PHONY: db-shell db-logs db-reset db-test db-verify db-status db-stats
.PHONY: db-postgis-check db-postgis-test db-backup db-restore redis-cli
.PHONY: backup-pgpass status install prod-build
