#!/bin/bash
# =============================================================
# RisunicPower SSL证书自动申请 (Let's Encrypt)
# Usage: bash scripts/ssl.sh yourdomain.com
# Required: Nginx running with port 80 accessible
# =============================================================

DOMAIN=${1:-risunicpower.com}
EMAIL=${2:-admin@risunicpower.com}

if ! command -v certbot &>/dev/null; then
  echo "Installing certbot..."
  apt-get update && apt-get install -y certbot python3-certbot-nginx
fi

echo "⏳ Requesting SSL certificate for $DOMAIN..."
certbot certonly --standalone --preferred-challenges http \
  -d "$DOMAIN" -d "www.$DOMAIN" \
  --email "$EMAIL" --agree-tos --non-interactive

echo "📋 Copying certificates to ssl/ directory..."
mkdir -p ssl
cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ssl/
cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" ssl/
chmod 600 ssl/privkey.pem

echo "✅ SSL certificates ready at ssl/"
echo "   fullchain.pem + privkey.pem"
echo ""
echo "🔄 Auto-renewal is set by certbot. Test with:"
echo "   certbot renew --dry-run"
