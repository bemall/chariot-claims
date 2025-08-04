#!/bin/bash
# Chariot Claims Database Setup with PostGIS
# This script runs automatically on first startup when mounted in docker-entrypoint-initdb.d/

set -euo pipefail

# Configuration
POSTGRES_DB="${POSTGRES_DB:-chariot_claims}"
POSTGRES_USER="${POSTGRES_USER:-chariot}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-claims4u#}"

# Logging
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "Starting Chariot Claims database initialization..."

# Since this runs in docker-entrypoint-initdb.d, we're already connected as superuser
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Make the user a database owner
    ALTER DATABASE "${POSTGRES_DB}" OWNER TO "${POSTGRES_USER}";
    
    -- Create schemas
    CREATE SCHEMA IF NOT EXISTS payments AUTHORIZATION "${POSTGRES_USER}";
    CREATE SCHEMA IF NOT EXISTS analytics AUTHORIZATION "${POSTGRES_USER}";
    
    -- Install extensions
    CREATE EXTENSION IF NOT EXISTS postgis;
    CREATE EXTENSION IF NOT EXISTS postgis_topology;
    CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
    CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;
    CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- For gen_random_uuid()
    CREATE EXTENSION IF NOT EXISTS pg_stat_statements;  -- For query monitoring
    
    -- Set search path for the database (removed postgis as it doesn't exist as a schema)
    ALTER DATABASE "${POSTGRES_DB}" SET search_path TO payments, analytics, public, topology;
    
    -- Grant all privileges on schemas to main user (as owner, already has these, but being explicit)
    GRANT ALL PRIVILEGES ON SCHEMA payments TO "${POSTGRES_USER}";
    GRANT ALL PRIVILEGES ON SCHEMA analytics TO "${POSTGRES_USER}";
    GRANT ALL PRIVILEGES ON SCHEMA public TO "${POSTGRES_USER}";
    -- REMOVED: GRANT USAGE ON SCHEMA postgis TO "${POSTGRES_USER}";  -- postgis schema doesn't exist
    GRANT USAGE ON SCHEMA topology TO "${POSTGRES_USER}";
    
    -- Grant all privileges on all existing tables/sequences/functions in schemas
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA payments TO "${POSTGRES_USER}";
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA payments TO "${POSTGRES_USER}";
    GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA payments TO "${POSTGRES_USER}";
    
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA analytics TO "${POSTGRES_USER}";
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA analytics TO "${POSTGRES_USER}";
    GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA analytics TO "${POSTGRES_USER}";
    
    -- REMOVED: Grant privileges on PostGIS objects - PostGIS functions are in public schema
    -- GRANT SELECT ON ALL TABLES IN SCHEMA postgis TO "${POSTGRES_USER}";
    GRANT SELECT ON ALL TABLES IN SCHEMA topology TO "${POSTGRES_USER}";
    
    -- Set default privileges for future objects
    ALTER DEFAULT PRIVILEGES IN SCHEMA payments 
        GRANT ALL PRIVILEGES ON TABLES TO "${POSTGRES_USER}";
    ALTER DEFAULT PRIVILEGES IN SCHEMA payments 
        GRANT ALL PRIVILEGES ON SEQUENCES TO "${POSTGRES_USER}";
    ALTER DEFAULT PRIVILEGES IN SCHEMA payments 
        GRANT ALL PRIVILEGES ON FUNCTIONS TO "${POSTGRES_USER}";
    ALTER DEFAULT PRIVILEGES IN SCHEMA payments 
        GRANT ALL PRIVILEGES ON TYPES TO "${POSTGRES_USER}";
    
    ALTER DEFAULT PRIVILEGES IN SCHEMA analytics 
        GRANT ALL PRIVILEGES ON TABLES TO "${POSTGRES_USER}";
    ALTER DEFAULT PRIVILEGES IN SCHEMA analytics 
        GRANT ALL PRIVILEGES ON SEQUENCES TO "${POSTGRES_USER}";
    ALTER DEFAULT PRIVILEGES IN SCHEMA analytics 
        GRANT ALL PRIVILEGES ON FUNCTIONS TO "${POSTGRES_USER}";
    ALTER DEFAULT PRIVILEGES IN SCHEMA analytics 
        GRANT ALL PRIVILEGES ON TYPES TO "${POSTGRES_USER}";
    
    -- Enable pg_stat_statements
    ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
    
    -- Create pg_stat_statements extension in the database
    CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
    
    -- Verification
    DO \$\$
    DECLARE
        v_postgis_version TEXT;
        v_schemas TEXT;
        v_extensions TEXT;
    BEGIN
        -- Get PostGIS version
        SELECT PostGIS_full_version() INTO v_postgis_version;
        
        -- Get schemas
        SELECT string_agg(schema_name, ', ' ORDER BY schema_name) 
        INTO v_schemas
        FROM information_schema.schemata 
        WHERE schema_name IN ('payments', 'analytics');
        
        -- Get extensions
        SELECT string_agg(extname || ' ' || extversion, ', ' ORDER BY extname)
        INTO v_extensions
        FROM pg_extension
        WHERE extname != 'plpgsql';
        
        RAISE NOTICE '======================================';
        RAISE NOTICE 'Database initialization completed';
        RAISE NOTICE '======================================';
        RAISE NOTICE 'Database: ${POSTGRES_DB}';
        RAISE NOTICE 'Owner: ${POSTGRES_USER}';
        RAISE NOTICE 'Schemas: %', v_schemas;
        RAISE NOTICE 'Extensions: %', v_extensions;
        RAISE NOTICE 'PostGIS: %', v_postgis_version;
        RAISE NOTICE '======================================';
    END
    \$\$;
EOSQL

log "✅ Chariot Claims database initialization completed"
