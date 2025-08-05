import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import prismaRandom from "prisma-extension-random";

export default fp(async (fastify, opts) => {
  // const prisma = new PrismaClient();
  const prisma = new PrismaClient().$extends(prismaRandom());
  await prisma.$connect();

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async (app) => {
    await app.prisma.$disconnect();
  });
});
