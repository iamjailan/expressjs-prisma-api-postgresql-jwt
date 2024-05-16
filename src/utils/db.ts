import { PrismaClient } from "@prisma/client";

const prismaClientSkeleton = () => {
  return new PrismaClient();
};

type PrismaClientSkeleton = ReturnType<typeof prismaClientSkeleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSkeleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSkeleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
