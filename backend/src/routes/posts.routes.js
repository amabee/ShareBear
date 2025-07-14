import {
  createPost,
  updatePost,
  softDeletePost,
  restorePost,
} from "../controllers/posts.controller.js";
import {
  createPostSchema,
  updatePostSchema,
  softDeletePostSchema,
  restorePostSchema,
} from "../schema/postSchema.js";

export default async function postRoutes(fastify, opts) {
  fastify.addHook("preHandler", fastify.authenticate);

  fastify.post("/create", { schema: createPostSchema }, createPost);
  fastify.patch("/:postId", { schema: updatePostSchema }, updatePost);
  fastify.delete("/:postId", { schema: softDeletePostSchema }, softDeletePost);
  fastify.post("/:postId/restore", { schema: restorePostSchema }, restorePost);
}
