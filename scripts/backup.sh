#!/bin/bash
# =============================================================
# RisunicPower 数据库自动备份脚本
# Run via cron: 0 3 * * * /bin/bash /app/scripts/backup.sh
# =============================================================

BACKUP_DIR="/backups"
TIMESTAMP=$(date '+%Y-%m-%d_%H%M')
RETENTION_DAYS=30

mkdir -p "$BACKUP_DIR"

echo "⏳ Backing up PostgreSQL..."
docker-compose exec -T db pg_dump -U risunic risunicpower \
  | gzip > "$BACKUP_DIR/risunicpower_$TIMESTAMP.sql.gz"

if [ $? -eq 0 ]; then
  echo "✅ Backup created: risunicpower_$TIMESTAMP.sql.gz ($(du -h "$BACKUP_DIR/risunicpower_$TIMESTAMP.sql.gz" | cut -f1))"
else
  echo "❌ Backup failed!"
  exit 1
fi

# Clean old backups
echo "🧹 Cleaning backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "risunicpower_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "✅ Done"
