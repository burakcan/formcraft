import "server-only";
import { PrismaClient } from "@prisma/client";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

const prismaClientSingleton = () => {
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    return {} as PrismaClient;
  }
  console.log("Creating new PrismaClient!");
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;
