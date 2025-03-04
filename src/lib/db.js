// src/lib/db.js
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global;
globalForPrisma.prisma = globalForPrisma.prisma || undefined;

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma