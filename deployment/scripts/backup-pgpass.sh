#!/bin/bash

# Backup .pgpass file daily
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

BACKUP_DIR="$PROJECT_ROOT/pgpass/shared/backup"
mkdir -p "$BACKUP_DIR"

# Create timestamped backup
cp "$PROJECT_ROOT/pgpass/shared/.pgpass" "$BACKUP_DIR/.pgpass.$(date +%Y%m%d_%H%M%S)"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name ".pgpass.*" -mtime +7 -delete

echo "✅ .pgpass backed up successfully"
