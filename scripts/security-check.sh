#!/bin/bash
echo "=== RisunicPower Security Check ==="
echo ""
echo "1. Checking RCE vulnerability (CVE-2025-66478)..."
RSC_VER=$(npm ls react-server-dom-webpack --depth=0 2>/dev/null | grep react-server-dom-webpack | head -1 | grep -oP '\d+\.\d+\.\d+')
if [ -z "$RSC_VER" ]; then
  # Try from node_modules
  RSC_VER=$(node -e "try{console.log(require('react-server-dom-webpack/package.json').version)}catch(e){console.log('NOT_FOUND')}" 2>/dev/null)
fi
echo "  react-server-dom-webpack version: ${RSC_VER:-NOT_FOUND}"
if [ "$RSC_VER" != "NOT_FOUND" ]; then
  MAJOR=$(echo $RSC_VER | cut -d. -f1)
  MINOR=$(echo $RSC_VER | cut -d. -f2)
  PATCH=$(echo $RSC_VER | cut -d. -f3)
  if [ "$MAJOR" -ge 20 ] && [ "$MINOR" -ge 2 ] && [ "$PATCH" -ge 1 ]; then
    echo "  ✅ Version appears patched (>=19.2.1 required, found $RSC_VER)"
  elif [ "$MINOR" -ge 3 ]; then
    echo "  ✅ Version appears patched"
  else
    echo "  ❌ VULNERABLE! Upgrade Next.js immediately."
  fi
fi
echo ""
echo "2. Checking for .env files in git history..."
if git log --all --full-history -- .env .env.production .env.local 2>/dev/null | head -5 | grep -q "commit"; then
  echo "  ❌ WARNING: .env files found in git history! Rotate all keys immediately."
  git log --all --oneline -- .env .env.production .env.local 2>/dev/null | head -5
else
  echo "  ✅ No .env files found in git history."
fi
echo ""
echo "3. Checking exposed ports..."
if grep -q 'ports:.*3000:3000' docker-compose.yml 2>/dev/null && ! grep -q '127.0.0.1:3000' docker-compose.yml 2>/dev/null; then
  echo "  ❌ Port 3000 is exposed to 0.0.0.0! Restrict to 127.0.0.1."
else
  echo "  ✅ Port 3000 is not exposed externally."
fi
echo ""
echo "4. Node.js security audit..."
npm audit --production 2>/dev/null | tail -10
echo ""
echo "=== Check Complete ==="
