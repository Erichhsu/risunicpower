#!/bin/bash
# =============================================================
# RisunicPower 一键部署脚本
# Run on production server: bash deploy.sh
# =============================================================

set -e

echo "==================================="
echo " RisunicPower 部署脚本"
echo " $(date '+%Y-%m-%d %H:%M')"
echo "==================================="

# 1. Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "❌ Docker required"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || docker compose version >/dev/null 2>&1 || { echo "❌ docker-compose required"; exit 1; }

# 2. Load production env
if [ ! -f .env.production ]; then
  echo "❌ .env.production not found. Copy from .env.example and fill in secrets."
  exit 1
fi

# 3. Check for SSL certs
if [ ! -f ssl/fullchain.pem ] || [ ! -f ssl/privkey.pem ]; then
  echo "⚠️  SSL certs not found in ssl/ directory."
  echo "   Run: sudo ./scripts/ssl.sh"
  echo "   Or: Place fullchain.pem + privkey.pem in ssl/"
  echo ""
  read -p "Continue without SSL? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then exit 1; fi
fi

# 4. Pull & build
echo "🔨 Building Docker images..."
docker-compose build --pull

# 5. Start services
echo "🚀 Starting services..."
docker-compose up -d

# 6. Run database migration
echo "🗄️  Running database migration..."
docker-compose exec -T app npx prisma db push || echo "⚠️  Migration may have partial issues, check logs."

# 7. Seed data (if first deployment)
echo "🌱 Seeding data..."
docker-compose exec -T app npx tsx prisma/seed.ts || echo "⚠️  Seed may have already been run (ignore if duplicate errors)."

# 8. Health check
echo "🏥 Running health check..."
sleep 5
for i in {1..6}; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health 2>/dev/null || echo "000")
  if [ "$STATUS" = "200" ]; then
    echo "✅ App is healthy (HTTP $STATUS)"
    break
  fi
  if [ $i -eq 6 ]; then
    echo "❌ Health check failed after 5 retries"
    docker-compose logs app --tail=20
    exit 1
  fi
  echo "   Waiting... ($i)"
  sleep 5
done

# 9. Verify Stripe webhook
echo "🔔 To start Stripe webhook forwarding, run:"
echo "   stripe listen --forward-to https://risunicpower.com/api/stripe/webhook"

echo ""
echo "==================================="
echo " ✅ 部署完成！"
echo " https://risunicpower.com"
echo "==================================="
