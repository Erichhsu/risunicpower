FROM node:20-alpine AS base

# Alpine 3.21+ has OpenSSL 3.x; Prisma 5.x needs libssl
FROM base AS with-ssl
RUN apk add --no-cache openssl

# Install deps
FROM with-ssl AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
# Fix: lightningcss needs explicit native binary for musl
RUN npm install lightningcss

# Build
FROM with-ssl AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:/app/data/prod.db"
RUN mkdir -p /app/data && npx prisma db push --accept-data-loss && npx prisma generate && npm run build

# Production
FROM with-ssl AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
