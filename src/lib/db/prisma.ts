// src/lib/db/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getDbUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL
  // Fallback: use local SQLite file relative to project root
  return 'file:./dev.db'
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    datasources: { db: { url: getDbUrl() } },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
