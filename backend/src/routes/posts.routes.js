import {
  createPost,
  updatePost,
  softDeletePost,
  restorePost,
  getPosts,
  getPost,
  getPostsByHashtag,
  getTrendingHashtags,
} from "../controllers/posts.controller.js";
import {
  createPostSchema,
  updatePostSchema,
  softDeletePostSchema,
  restorePostSchema,
  getPostsSchema,
  getPostSchema,
  getPostsByHashtagSchema,
  getTrendingHashtagsSchema,
} from "../schema/postSchema.js";

export default async function postRoutes(fastify, opts) {
  fastify.addHook("preHandler", fastify.authenticate);
  
  fastify.get("/", { schema: getPostsSchema }, getPosts);
  fastify.get("/trending-hashtags", { schema: getTrendingHashtagsSchema }, getTrendingHashtags);
  fastify.get("/hashtag/:hashtag", { schema: getPostsByHashtagSchema }, getPostsByHashtag);
  fastify.get("/:postId", { schema: getPostSchema }, getPost);
  fastify.post("/create", { schema: createPostSchema }, createPost);
  fastify.patch("/:postId", { schema: updatePostSchema }, updatePost);
  fastify.delete("/:postId", { schema: softDeletePostSchema }, softDeletePost);
  fastify.post("/:postId/restore", { schema: restorePostSchema }, restorePost);
}
