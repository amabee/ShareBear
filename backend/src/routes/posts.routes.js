import { createPost } from "../controllers/posts.controller.js";

export default async function postRoutes(fastify, opts) {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.post("/create", createPost);
}
