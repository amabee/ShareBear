import { uploadFile } from "../services/fileStorage/index.js";
import {
  createPost as createPostService,
  updatePost as updatePostService,
  softDeletePost as softDeletePostService,
  restorePost as restorePostService,
  getPosts as getPostsService,
  getPost as getPostService,
  getPostsByHashtag as getPostsByHashtagService,
  getTrendingHashtags as getTrendingHashtagsService,
} from "../services/posts.service.js";
import { sanitizeInput, encodeOutput } from "../utils/sanitize.js";

export const getPosts = async (req, rep) => {
  const currentUserId = req.user.userId;

  try {
    const posts = await getPostsService(req.server.prisma, currentUserId);

    const encodedPosts = posts.map((post) => ({
      ...post,
      caption: encodeOutput(post.caption),
      location: encodeOutput(post.location),
      taggedUsers: encodeOutput(post.taggedUsers),
    }));

    return rep.send({ posts: encodedPosts });
  } catch (error) {
    req.log.error(error);
    return rep.status(500).send({ error: "Failed to fetch posts" });
  }
};

export const getPost = async (req, rep) => {
  const { postId } = req.params;

  try {
    const post = await getPostService(req.server.prisma, parseInt(postId, 10));

    if (!post) {
      return rep.status(404).send({ error: "Post not found" });
    }

    const encodedPost = {
      ...post,
      caption: encodeOutput(post.caption),
      location: encodeOutput(post.location),
      taggedUsers: encodeOutput(post.taggedUsers),
    };

    return rep.send({ post: encodedPost });
  } catch (error) {
    req.log.error(error);
    return rep.status(500).send({ error: "Failed to fetch post" });
  }
};

export const createPost = async (req, reply) => {
  let fileUrl = undefined;
  if (req.file) {
    fileUrl = await uploadFile(req.file, "posts");
  }

  const userId = req.user.userId;
  const postData = {
    contentType: req.body.contentType,
    // Do NOT sanitize caption, just store as-is
    caption: req.body.caption,
    contentUrl: fileUrl,
    thumbnailUrl: req.body.thumbnailUrl,
    location: sanitizeInput(req.body.location),
    taggedUsers: sanitizeInput(req.body.taggedUsers),
    privacyLevel: req.body.privacyLevel,
    allowsComments: req.body.allowsComments,
    allowsShares: req.body.allowsShares,
    expiresAt: req.body.expiresAt,
  };

  const post = await createPostService(req.server.prisma, userId, postData);
  // Encode output fields before sending
  if (post) {
    post.caption = encodeOutput(post.caption); // Always encode on output
    post.location = encodeOutput(post.location);
    post.taggedUsers = encodeOutput(post.taggedUsers);
  }
  return reply.status(201).send({ message: "Post created", post });
};

export const updatePost = async (req, reply) => {
  const userId = req.user.userId;
  const postId = parseInt(req.params.postId, 10);
  const updateData = { ...req.body };

  // Sanitize fields except caption (which may contain HTML for WYSIWYG)
  if (updateData.location)
    updateData.location = sanitizeInput(updateData.location);
  if (updateData.taggedUsers)
    updateData.taggedUsers = sanitizeInput(updateData.taggedUsers);

  const post = await updatePostService(
    req.server.prisma,
    postId,
    userId,
    updateData
  );
  if (!post)
    return reply
      .status(404)
      .send({ error: "Post not found or not owned by user" });

  // Encode output fields before sending
  post.caption = encodeOutput(post.caption);
  post.location = encodeOutput(post.location);
  post.taggedUsers = encodeOutput(post.taggedUsers);

  return reply.send({ message: "Post updated", post });
};

export const softDeletePost = async (req, reply) => {
  const userId = req.user.userId;
  const postId = parseInt(req.params.postId, 10);
  const success = await softDeletePostService(
    req.server.prisma,
    postId,
    userId
  );
  if (!success)
    return reply
      .status(404)
      .send({ error: "Post not found or not owned by user" });
  return reply.send({ message: "Post deleted (soft)" });
};

export const restorePost = async (req, reply) => {
  const userId = req.user.userId;
  const postId = parseInt(req.params.postId, 10);
  const post = await restorePostService(req.server.prisma, postId, userId);
  if (!post)
    return reply
      .status(404)
      .send({ error: "Post not found or not owned by user or not deleted" });
  // Encode output fields before sending
  post.caption = encodeOutput(post.caption);
  post.location = encodeOutput(post.location);
  post.taggedUsers = encodeOutput(post.taggedUsers);
  return reply.send({ message: "Post restored", post });
};

export const getPostsByHashtag = async (req, rep) => {
  const { hashtag } = req.params;
  const currentUserId = req.user.userId;

  try {
    const posts = await getPostsByHashtagService(req.server.prisma, hashtag, currentUserId);

    const encodedPosts = posts.map((post) => ({
      ...post,
      caption: encodeOutput(post.caption),
      location: encodeOutput(post.location),
      taggedUsers: encodeOutput(post.taggedUsers),
    }));

    return rep.send({ posts: encodedPosts, hashtag });
  } catch (error) {
    req.log.error(error);
    return rep.status(500).send({ error: "Failed to fetch posts by hashtag" });
  }
};

export const getTrendingHashtags = async (req, rep) => {
  const limit = parseInt(req.query.limit) || 10;

  try {
    const hashtags = await getTrendingHashtagsService(req.server.prisma, limit);
    return rep.send({ hashtags });
  } catch (error) {
    req.log.error(error);
    return rep.status(500).send({ error: "Failed to fetch trending hashtags" });
  }
};
