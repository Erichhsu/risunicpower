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
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/tsx ./node_modules/tsx
COPY --from=builder /app/node_modules/esbuild ./node_modules/esbuild
COPY --from=builder /app/node_modules/@esbuild ./node_modules/@esbuild
COPY --from=builder /app/node_modules/get-tsconfig ./node_modules/get-tsconfig
COPY --from=builder /app/node_modules/resolve-pkg-maps ./node_modules/resolve-pkg-maps

RUN mkdir -p /app/data && chown nextjs:nodejs /app/data
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL="file:/app/data/prod.db"

CMD ["sh", "-c", "DATABASE_URL=file:/app/data/prod.db node node_modules/prisma/build/index.js db push --accept-data-loss --skip-generate && DATABASE_URL=file:/app/data/prod.db node node_modules/tsx/dist/cli.mjs prisma/seed.ts && node server.js"]
