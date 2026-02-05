import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

let prismaInstance: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prismaInstance = new PrismaClient();
} else {
    // In dev, check if we have a cached client and if it's stale
    const cached = globalForPrisma.prisma as any;
    const isStale = cached && (
        !cached.studioSection ||
        !cached.processSection ||
        !cached.storySection ||
        !cached.bTSSection ||
        !cached.servicesSection
    );

    if (isStale || !globalForPrisma.prisma) {
        console.log('DEBUG: Prisma client stale or missing models, refreshing...');
        globalForPrisma.prisma = new PrismaClient({ log: ['query'] });
    }
    prismaInstance = globalForPrisma.prisma;
}

export const prisma = prismaInstance;
export const PRISMA_VERSION = 'v1.0.2';
