import { addFriend } from "../controllers/posts.controller";

export default async function postRoutes(fastify, opts) {
  fastify.get("/friends", addFriend);
}
