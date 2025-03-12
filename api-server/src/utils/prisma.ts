export * from '@headless-gamify/prisma-client';
import { PrismaClient } from '@headless-gamify/prisma-client';
//  TODO extends to handle levels computation
const prisma = new PrismaClient();
export { prisma };
