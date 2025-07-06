import { sayHello } from "../controllers/hello.controller.js";

export default async function helloRoutes(fastify, opts) {
  fastify.get("/", {
    preValidation: [fastify.authenticate],
    handler: sayHello,
  });
}
