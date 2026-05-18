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
  likePost as likePostService,
  unlikePost as unlikePostService,
  createComment as createCommentService,
  updateComment as updateCommentService,
  deleteComment as deleteCommentService,
  getComments as getCommentsService,
  sharePost as sharePostService,
  unsharePost as unsharePostService,
  getShares as getSharesService,
  upsertPostReaction as upsertPostReactionService,
  deletePostReaction as deletePostReactionService,
  getPostReactions as getPostReactionsService,
  upsertCommentReaction as upsertCommentReactionService,
  deleteCommentReaction as deleteCommentReactionService,
  getCommentReactions as getCommentReactionsService,
  getReplies as getRepliesService,
  savePost as savePostService,
  unsavePost as unsavePostService,
} from "../services/posts.service.js";
import {
  sanitizeInput,
  encodeOutput,
  safeDecodeOutput,
} from "../utils/sanitize.js";
import { config } from "../config/index.js";

export const getPosts = async (req, rep) => {
  const currentUserId = req.user.userId;
  const { page = 1, limit = 10, cursor } = req.query;

  try {
    const result = await getPostsService(req.server.prisma, currentUserId, {
      page: parseInt(page),
      limit: parseInt(limit),
      cursor,
    });

    // DEBUG: log feed composition so we can verify reposts are included
    const reposts = result.posts.filter((p) => p.isRepost);
    req.log.info(
      `[getPosts] userId=${currentUserId} page=${page} total=${result.posts.length} reposts=${reposts.length} repostKeys=${JSON.stringify(reposts.map((p) => p.feedKey))}`
    );

    const encodedPosts = result.posts.map((post) => ({
      ...post,
      caption: safeDecodeOutput(post.caption),
      location: encodeOutput(post.location),
      taggedUsers: post.taggedUsers,
    }));

    return rep.send({
      posts: encodedPosts,
      pagination: result.pagination,
    });
  } catch (error) {
    req.log.error(error);
    return rep.status(500).send({ error: "Failed to fetch posts" });
  }
};

export const getPost = async (req, rep) => {
  const { postId } = req.params;
  const currentUserId = req.user?.userId; // Make optional for public posts

  try {
    const post = await getPostService(req.server.prisma, postId, currentUserId);

    if (!post) {
      return rep.status(404).send({ error: "Post not found" });
    }

    const encodedPost = {
      ...post,
      caption: safeDecodeOutput(post.caption),
      location: safeDecodeOutput(post.location),
      taggedUsers: post.taggedUsers,
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
  post.caption = encodeOutput(safeDecodeOutput(post.caption));
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
  post.caption = encodeOutput(safeDecodeOutput(post.caption));
  post.location = encodeOutput(safeDecodeOutput(post.location));
  post.taggedUsers = encodeOutput(safeDecodeOutput(post.taggedUsers));
  return reply.send({ message: "Post restored", post });
};

export const getPostsByHashtag = async (req, rep) => {
  const { hashtag } = req.params;
  const currentUserId = req.user.userId;
  const { page = 1, limit = 10, cursor } = req.query;

  try {
    const result = await getPostsByHashtagService(
      req.server.prisma,
      hashtag,
      currentUserId,
      {
        page: parseInt(page),
        limit: parseInt(limit),
        cursor,
      }
    );

    const encodedPosts = result.posts.map((post) => ({
      ...post,
      caption: encodeOutput(safeDecodeOutput(post.caption)),
      location: encodeOutput(safeDecodeOutput(post.location)),
      taggedUsers: encodeOutput(safeDecodeOutput(post.taggedUsers)),
    }));

    return rep.send({
      posts: encodedPosts,
      hashtag,
      pagination: result.pagination,
    });
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

// ========== LIKE CONTROLLERS ==========
export const likePost = async (req, reply) => {
  const userId = req.user.userId;
  const { postId } = req.params;

  try {
    // Just add the extra parameters to your existing service call
    const like = await likePostService(
      req.server.prisma,
      postId,
      userId,
      req.server, // Pass fastify instance for notifications
      req.user // Pass user info for notification display name
    );

    return reply.status(201).send({
      message: "Post liked successfully",
      like,
    });
  } catch (error) {
    req.log.error(error);

    if (error.message.includes("Post not found")) {
      return reply.status(404).send({ error: error.message });
    }
    if (error.message.includes("already liked")) {
      return reply.status(409).send({ error: error.message });
    }

    return reply.status(500).send({ error: "Failed to like post" });
  }
};

export const unlikePost = async (req, reply) => {
  const userId = req.user.userId;
  const { postId } = req.params;

  try {
    const result = await unlikePostService(req.server.prisma, postId, userId);

    return reply.send(result);
  } catch (error) {
    req.log.error(error);

    if (error.message.includes("Like not found")) {
      return reply.status(404).send({ error: error.message });
    }

    return reply.status(500).send({ error: "Failed to unlike post" });
  }
};

// ========== COMMENT CONTROLLERS ==========
export const createComment = async (req, reply) => {
  const userId = req.user.userId;
  const { postId } = req.params;
  const { content, parentCommentId } = req.body;


  // Validate required fields
  if (!content || content.trim().length === 0) {
    return reply.status(400).send({ error: "Comment content is required" });
  }

  if (content.length > 1000) {
    return reply.status(400).send({
      error: "Comment too long. Maximum 1000 characters allowed.",
    });
  }

  try {
    const commentData = {
      content: sanitizeInput(content),
      parentCommentId: parentCommentId || null, // Fixed field name
    };

    const comment = await createCommentService(
      req.server.prisma,
      postId,
      userId,
      commentData
    );

    // Encode output before sending
    const encodedComment = {
      ...comment,
      content: encodeOutput(comment.content),
    };

    return reply.status(201).send({
      message: "Comment created successfully",
      comment: encodedComment,
    });
  } catch (error) {
    req.log.error(error);

    if (error.message.includes("Post not found")) {
      return reply.status(404).send({ error: error.message });
    }
    if (error.message.includes("Comments are not allowed")) {
      return reply.status(403).send({ error: error.message });
    }

    return reply.status(500).send({ error: "Failed to create comment" });
  }
};

export const updateComment = async (req, reply) => {
  const userId = req.user.userId;
  const { commentId } = req.params;
  const { content } = req.body;

  // Validate required fields
  if (!content || content.trim().length === 0) {
    return reply.status(400).send({ error: "Comment content is required" });
  }

  if (content.length > 1000) {
    return reply.status(400).send({
      error: "Comment too long. Maximum 1000 characters allowed.",
    });
  }

  try {
    const updateData = {
      content: sanitizeInput(content),
    };

    const comment = await updateCommentService(
      req.server.prisma,
      parseInt(commentId), // Convert to integer
      userId,
      updateData
    );

    // Encode output before sending
    const encodedComment = {
      ...comment,
      content: encodeOutput(comment.content),
    };

    return reply.send({
      message: "Comment updated successfully",
      comment: encodedComment,
    });
  } catch (error) {
    req.log.error(error);

    if (
      error.message.includes("Comment not found") ||
      error.message.includes("don't have permission")
    ) {
      return reply.status(404).send({ error: error.message });
    }

    return reply.status(500).send({ error: "Failed to update comment" });
  }
};

export const deleteComment = async (req, reply) => {
  const userId = req.user.userId;
  const { commentId } = req.params;

  try {
    const result = await deleteCommentService(
      req.server.prisma,
      parseInt(commentId), // Convert to integer
      userId
    );
    return reply.send(result);
  } catch (error) {
    req.log.error(error);

    if (
      error.message.includes("Comment not found") ||
      error.message.includes("don't have permission")
    ) {
      return reply.status(404).send({ error: error.message });
    }

    return reply.status(500).send({ error: "Failed to delete comment" });
  }
};

export const getComments = async (req, reply) => {
  const currentUserId = req.user?.userId ?? null;
  const { postId } = req.params;
  const { page = 1, limit = 20, cursor } = req.query;

  try {
    const result = await getCommentsService(req.server.prisma, postId, {
      page: parseInt(page),
      limit: parseInt(limit),
      cursor: cursor ? parseInt(cursor) : undefined,
    }, currentUserId);

    // Encode output for all comments and replies
    const encodedComments = result.comments.map((comment) => ({
      ...comment,
      content: encodeOutput(comment.content),
      myReaction: comment.reactions?.[0]?.reaction ?? null,
      reactions: undefined,
      replies: comment.replies?.map((reply) => ({
        ...reply,
        content: encodeOutput(reply.content),
      })),
    }));

    return reply.send({
      comments: encodedComments,
      pagination: result.pagination,
    });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ error: "Failed to fetch comments" });
  }
};

// ========== SHARE CONTROLLERS ==========
export const sharePost = async (req, reply) => {
  const userId = req.user.userId;
  const { postId } = req.params;
  const { caption, privacyLevel } = req.body;

  try {
    const shareData = {
      caption: caption ? sanitizeInput(caption) : null,
      privacyLevel: privacyLevel || "PUBLIC",
    };

    // Validate privacy level
    const validPrivacyLevels = ["PUBLIC", "FRIENDS", "PRIVATE"];
    if (!validPrivacyLevels.includes(shareData.privacyLevel)) {
      return reply.status(400).send({
        error: "Invalid privacy level. Must be PUBLIC, FRIENDS, or PRIVATE",
      });
    }

    const share = await sharePostService(
      req.server.prisma,
      postId,
      userId,
      shareData
    );

    // Encode output before sending
    const encodedShare = {
      ...share,
      caption: share.caption ? encodeOutput(share.caption) : null,
    };

    return reply.status(201).send({
      message: "Post shared successfully",
      share: encodedShare,
    });
  } catch (error) {
    req.log.error(error);

    if (error.message.includes("Post not found")) {
      return reply.status(404).send({ error: error.message });
    }
    if (error.message.includes("Shares are not allowed")) {
      return reply.status(403).send({ error: error.message });
    }
    // "already shared" is no longer thrown; left as dead-code guard just in case
    if (error.message.includes("already shared")) {
      return reply.status(409).send({ error: error.message });
    }

    return reply.status(500).send({ error: "Failed to share post" });
  }
};

export const unsharePost = async (req, reply) => {
  const userId = req.user.userId;
  const { postId } = req.params;

  try {
    const result = await unsharePostService(req.server.prisma, postId, userId);
    return reply.send(result);
  } catch (error) {
    req.log.error(error);

    if (error.message.includes("Share not found")) {
      return reply.status(404).send({ error: error.message });
    }

    return reply.status(500).send({ error: "Failed to unshare post" });
  }
};

export const getShares = async (req, reply) => {
  const { postId } = req.params;
  const { page = 1, limit = 20, cursor } = req.query;

  try {
    const result = await getSharesService(req.server.prisma, postId, {
      page: parseInt(page),
      limit: parseInt(limit),
      cursor,
    });

    // Encode output for all shares
    const encodedShares = result.shares.map((share) => ({
      ...share,
      caption: share.caption ? encodeOutput(share.caption) : null,
    }));

    return reply.send({
      shares: encodedShares,
      pagination: result.pagination,
    });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ error: "Failed to fetch shares" });
  }
};

// ─── REACTIONS ───────────────────────────────────────────────────────────────

const VALID_REACTIONS = ["LIKE", "LOVE", "HAHA", "WOW", "SAD", "ANGRY"];

export const reactToPost = async (req, reply) => {
  const userId = req.user.userId;
  const { postId } = req.params;
  const { reaction } = req.body;

  if (!VALID_REACTIONS.includes(reaction)) {
    return reply.status(400).send({ error: "Invalid reaction type" });
  }

  try {
    const result = await upsertPostReactionService(req.server.prisma, postId, userId, reaction);
    return reply.status(201).send({ reaction: result });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ error: "Failed to react to post" });
  }
};

export const removePostReaction = async (req, reply) => {
  const userId = req.user.userId;
  const { postId } = req.params;

  try {
    await deletePostReactionService(req.server.prisma, postId, userId);
    return reply.send({ message: "Reaction removed" });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ error: "Failed to remove reaction" });
  }
};

export const getPostReactions = async (req, reply) => {
  const { postId } = req.params;

  try {
    const reactions = await getPostReactionsService(req.server.prisma, postId);
    return reply.send({ reactions });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ error: "Failed to fetch reactions" });
  }
};

export const reactToComment = async (req, reply) => {
  const userId = req.user.userId;
  const { commentId } = req.params;
  const { reaction } = req.body;

  if (!VALID_REACTIONS.includes(reaction)) {
    return reply.status(400).send({ error: "Invalid reaction type" });
  }

  try {
    const result = await upsertCommentReactionService(req.server.prisma, parseInt(commentId), userId, reaction);
    return reply.status(201).send({ reaction: result });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ error: "Failed to react to comment" });
  }
};

export const removeCommentReaction = async (req, reply) => {
  const userId = req.user.userId;
  const { commentId } = req.params;

  try {
    await deleteCommentReactionService(req.server.prisma, parseInt(commentId), userId);
    return reply.send({ message: "Reaction removed" });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ error: "Failed to remove reaction" });
  }
};

// ─── REPLIES PAGINATION ──────────────────────────────────────────────────────

export const getReplies = async (req, reply) => {
  const { commentId } = req.params;
  const { limit = 10, cursor } = req.query;

  try {
    const result = await getRepliesService(req.server.prisma, parseInt(commentId), {
      limit: parseInt(limit),
      cursor: cursor ? parseInt(cursor) : undefined,
    });
    return reply.send(result);
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ error: "Failed to fetch replies" });
  }
};

// ─── SAVED POSTS ─────────────────────────────────────────────────────────────

export const savePost = async (req, reply) => {
  const userId = req.user.userId;
  const { postId } = req.params;
  try {
    await savePostService(req.server.prisma, postId, userId);
    return reply.status(201).send({ bookmarked: true });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ error: "Failed to save post" });
  }
};

export const unsavePost = async (req, reply) => {
  const userId = req.user.userId;
  const { postId } = req.params;
  try {
    await unsavePostService(req.server.prisma, postId, userId);
    return reply.send({ bookmarked: false });
  } catch (error) {
    req.log.error(error);
    return reply.status(500).send({ error: "Failed to unsave post" });
  }
};

