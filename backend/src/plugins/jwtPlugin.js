import fastifyJwt from "@fastify/jwt";
import fp from "fastify-plugin";
import { config } from "../config/index.js";
import redis from './redisClient.js';

async function jwtPlugin(app) {
  app.register(fastifyJwt, {
    secret: config.jwt.secret,
  });

  app.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
      // Check Redis blacklist for jti
      const jti = request.user?.jti;
      if (jti) {
        const isBlacklisted = await redis.get(`blacklist:jti:${jti}`);
        if (isBlacklisted) {
          return reply.code(401).send({ error: "Token revoked" });
        }
      }
    } catch (err) {
      return reply.code(401).send({ error: "Unauthorized" });
    }
  });
}

export default fp(jwtPlugin);
