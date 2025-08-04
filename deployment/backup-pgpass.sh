#!/bin/bash

# Backup .pgpass file daily
BACKUP_DIR="pgpass/shared/backup"
mkdir -p "$BACKUP_DIR"

# Create timestamped backup
cp pgpass/shared/.pgpass "$BACKUP_DIR/.pgpass.$(date +%Y%m%d_%H%M%S)"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name ".pgpass.*" -mtime +7 -delete

echo "✅ .pgpass backed up successfully"
