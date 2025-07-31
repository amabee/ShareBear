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
  createPostMultipartSchema,
  updatePostSchema,
  softDeletePostSchema,
  restorePostSchema,
  getPostsSchema,
  getPostSchema,
  getPostsByHashtagSchema,
  getTrendingHashtagsSchema,
} from "../schema/postSchema.js";
import { handleMultipart } from "../middleware/multer.js";

export default async function postRoutes(fastify, opts) {
  fastify.addHook("preHandler", fastify.authenticate);

  // GETTING THE POSTS
  fastify.get("/", { schema: getPostsSchema }, getPosts);

  // GETTING THE POSTS FOM TRENDING HASHTAGS
  fastify.get(
    "/trending-hashtags",
    { schema: getTrendingHashtagsSchema },
    getTrendingHashtags
  );

  // GETTING THE POSTS FROM A CERTAIN HASHTAG
  fastify.get(
    "/hashtag/:hashtag",
    { schema: getPostsByHashtagSchema },
    getPostsByHashtag
  );

  // GETTING A CERTAIN POST
  fastify.get("/:postId", { schema: getPostSchema }, getPost);


  // Single route that handles both JSON and multipart requests
  fastify.post(
    "/create",
    {
      schema: createPostMultipartSchema,
      preValidation: handleMultipart,
      config: {
        requestTimeout: 15000,
      },
    },
    createPost
  );

  
  fastify.patch("/:postId", { schema: updatePostSchema }, updatePost);
  fastify.delete("/:postId", { schema: softDeletePostSchema }, softDeletePost);
  fastify.post("/:postId/restore", { schema: restorePostSchema }, restorePost);
}
