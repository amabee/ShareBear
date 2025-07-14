import { uploadFile } from "../services/fileStorage/index.js";
import { createPost as createPostService, updatePost as updatePostService, softDeletePost as softDeletePostService, restorePost as restorePostService } from "../services/posts.service.js";
import { sanitizeInput, encodeOutput } from "../utils/sanitize.js";

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
  if (updateData.location) updateData.location = sanitizeInput(updateData.location);
  if (updateData.taggedUsers) updateData.taggedUsers = sanitizeInput(updateData.taggedUsers);

  const post = await updatePostService(req.server.prisma, postId, userId, updateData);
  if (!post) return reply.status(404).send({ error: "Post not found or not owned by user" });

  // Encode output fields before sending
  post.caption = encodeOutput(post.caption);
  post.location = encodeOutput(post.location);
  post.taggedUsers = encodeOutput(post.taggedUsers);

  return reply.send({ message: "Post updated", post });
};

export const softDeletePost = async (req, reply) => {
  const userId = req.user.userId;
  const postId = parseInt(req.params.postId, 10);
  const success = await softDeletePostService(req.server.prisma, postId, userId);
  if (!success) return reply.status(404).send({ error: "Post not found or not owned by user" });
  return reply.send({ message: "Post deleted (soft)" });
};

export const restorePost = async (req, reply) => {
  const userId = req.user.userId;
  const postId = parseInt(req.params.postId, 10);
  const post = await restorePostService(req.server.prisma, postId, userId);
  if (!post) return reply.status(404).send({ error: "Post not found or not owned by user or not deleted" });
  // Encode output fields before sending
  post.caption = encodeOutput(post.caption);
  post.location = encodeOutput(post.location);
  post.taggedUsers = encodeOutput(post.taggedUsers);
  return reply.send({ message: "Post restored", post });
};

export const addFriend = async (req, reply) => {
  return reply.status(501).send({ error: "Route not implemented yet." });
};
