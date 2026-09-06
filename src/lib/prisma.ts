import { PrismaClient } from '../generated/prisma/client';

// This creates a global object so Next.js doesn't spam connections
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use the existing connection if it exists, otherwise create a new one
export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
