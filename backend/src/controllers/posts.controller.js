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
import {
  sanitizeInput,
  encodeOutput,
  safeDecodeOutput,
} from "../utils/sanitize.js";
import { config } from "../config/index.js";

export const getPosts = async (req, rep) => {
  const currentUserId = req.user.userId;

  try {
    const posts = await getPostsService(req.server.prisma, currentUserId);

    const encodedPosts = posts.map((post) => ({
      ...post,
      caption: safeDecodeOutput(post.caption),
      location: encodeOutput(post.location),
      taggedUsers: post.taggedUsers,
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
    const post = await getPostService(req.server.prisma, postId);

    if (!post) {
      return rep.status(404).send({ error: "Post not found" });
    }

    const encodedPost = {
      ...post,
      caption: encodeOutput(safeDecodeOutput(post.caption)), // Safely decode first, then encode for output
      location: encodeOutput(safeDecodeOutput(post.location)),
      taggedUsers: encodeOutput(safeDecodeOutput(post.taggedUsers)),
    };

    return rep.send({ post: encodedPost });
  } catch (error) {
    req.log.error(error);
    return rep.status(500).send({ error: "Failed to fetch post" });
  }
};

export const createPost = async (req, reply) => {
  const MAX_CAPTION_LENGTH = 2000;

  try {
    const userId = req.user.userId;
    const images = [];

    // Handle multiple file uploads from Fastify multipart
    if (req.files && req.files.length > 0) {
      console.log(`Processing ${req.files.length} file uploads`);

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        console.log(`Processing file ${i + 1}:`, file.filename);

        const fileUrl = await uploadFile(file, "posts", {
          userId: userId,
          renameStrategy: config.upload.renameStrategy,
        });
        console.log(`File ${i + 1} uploaded successfully:`, fileUrl);

        images.push({
          url: fileUrl,
          altText: req.body[`altText_${i}`] || null,
          width: req.body[`width_${i}`]
            ? parseInt(req.body[`width_${i}`])
            : null,
          height: req.body[`height_${i}`]
            ? parseInt(req.body[`height_${i}`])
            : null,
          fileSize: req.body[`fileSize_${i}`]
            ? parseInt(req.body[`fileSize_${i}`])
            : null,
        });
      }
    }

    const postData = {
      contentType: req.body.contentType,
      // Do NOT sanitize caption, just store as-is
      caption: req.body.caption,
      images: images,
      thumbnailUrl: req.body.thumbnailUrl,
      location: sanitizeInput(req.body.location),
      taggedUsers: sanitizeInput(req.body.taggedUsers),
      privacyLevel: req.body.privacyLevel,
      allowsComments:
        req.body.allowsComments === "true" || req.body.allowsComments === true,
      allowsShares:
        req.body.allowsShares === "true" || req.body.allowsShares === true,
      expiresAt: req.body.expiresAt || null,
    };

    if (postData.caption && postData.caption.length > MAX_CAPTION_LENGTH) {
      return reply.status(400).send({
        error: `Caption too long. Maximum ${MAX_CAPTION_LENGTH} characters allowed.`,
      });
    }

    const post = await createPostService(req.server.prisma, userId, postData);
    if (post) {
      post.caption = encodeOutput(safeDecodeOutput(post.caption));
      post.location = encodeOutput(safeDecodeOutput(post.location));
      post.taggedUsers = encodeOutput(safeDecodeOutput(post.taggedUsers));
    }
    return reply.status(201).send({ message: "Post created", post });
  } catch (error) {
    console.error("Create post error:", error);
    return reply
      .status(500)
      .send({ error: "Failed to create post: " + error.message });
  }
};

export const updatePost = async (req, reply) => {
  const userId = req.user.userId;
  const postId = req.params.postId;
  const updateData = { ...req.body };

  // Convert string boolean values to actual booleans
  if (updateData.allowsComments !== undefined) {
    updateData.allowsComments =
      updateData.allowsComments === "true" ||
      updateData.allowsComments === true;
  }
  if (updateData.allowsShares !== undefined) {
    updateData.allowsShares =
      updateData.allowsShares === "true" || updateData.allowsShares === true;
  }

  // Sanitize fields except caption (which may contain HTML for WYSIWYG)
  if (updateData.location)
    updateData.location = sanitizeInput(updateData.location);
  if (updateData.taggedUsers)
    updateData.taggedUsers = sanitizeInput(updateData.taggedUsers);

  // Handle image updates if files are provided
  if (req.files && req.files.length > 0) {
    const images = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const fileUrl = await uploadFile(file, "posts", {
        userId: userId,
        renameStrategy: config.upload.renameStrategy,
      });

      images.push({
        url: fileUrl,
        altText: req.body[`altText_${i}`] || null,
        width: req.body[`width_${i}`] ? parseInt(req.body[`width_${i}`]) : null,
        height: req.body[`height_${i}`]
          ? parseInt(req.body[`height_${i}`])
          : null,
        fileSize: req.body[`fileSize_${i}`]
          ? parseInt(req.body[`fileSize_${i}`])
          : null,
      });
    }

    updateData.images = images;
  }

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
  post.caption = encodeOutput(safeDecodeOutput(post.caption)); // Safely decode first, then encode for output
  post.location = encodeOutput(safeDecodeOutput(post.location));
  post.taggedUsers = encodeOutput(safeDecodeOutput(post.taggedUsers));

  return reply.send({ message: "Post updated", post });
};

export const softDeletePost = async (req, reply) => {
  const userId = req.user.userId;
  const postId = req.params.postId;
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
  const postId = req.params.postId;
  const post = await restorePostService(req.server.prisma, postId, userId);
  if (!post)
    return reply
      .status(404)
      .send({ error: "Post not found or not owned by user or not deleted" });
  // Encode output fields before sending
  post.caption = encodeOutput(safeDecodeOutput(post.caption)); // Safely decode first, then encode for output
  post.location = encodeOutput(safeDecodeOutput(post.location));
  post.taggedUsers = encodeOutput(safeDecodeOutput(post.taggedUsers));
  return reply.send({ message: "Post restored", post });
};

export const getPostsByHashtag = async (req, rep) => {
  const { hashtag } = req.params;
  const currentUserId = req.user.userId;

  try {
    const posts = await getPostsByHashtagService(
      req.server.prisma,
      hashtag,
      currentUserId
    );

    const encodedPosts = posts.map((post) => ({
      ...post,
      caption: encodeOutput(safeDecodeOutput(post.caption)), // Safely decode first, then encode for output
      location: encodeOutput(safeDecodeOutput(post.location)),
      taggedUsers: encodeOutput(safeDecodeOutput(post.taggedUsers)),
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
