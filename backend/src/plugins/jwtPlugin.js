import fastifyJwt from "@fastify/jwt";
import fp from "fastify-plugin";
import { config } from "../config/index.js";

async function jwtPlugin(app) {
  app.register(fastifyJwt, {
    secret: config.jwt.secret,
  });

  app.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: "Unauthorized" });
    }
  });
}

export default fp(jwtPlugin);
