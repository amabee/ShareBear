import { sayHello } from "../controllers/hello.controller.js";
import { config } from "../config/index.js";

export default async function helloRoutes(fastify, opts) {
  // fastify.get("/", {
  //   preValidation: [fastify.authenticate],
  //   handler: sayHello,
  // });

  fastify.get("/", sayHello);
}
