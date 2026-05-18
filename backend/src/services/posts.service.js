import {
  updatePost as updatePostRepo,
  softDeletePost as softDeletePostRepo,
  restorePost as restorePostRepo,
  getPosts as getPostsRepo,
  getPost as getPostRepo,
  getPostsByHashtag as getPostsByHashtagRepo,
  getTrendingHashtags as getTrendingHashtagsRepo,
  createPost as createPostRepo,
  likePost as likePostRepo,
  unlikePost as unlikePostRepo,
  createComment as createCommentRepo,
  updateComment as updateCommentRepo,
  deleteComment as deleteCommentRepo,
  getComments as getCommentsRepo,
  sharePost as sharePostRepo,
  unsharePost as unsharePostRepo,
  getShares as getSharesRepo,
  upsertPostReaction as upsertPostReactionRepo,
  deletePostReaction as deletePostReactionRepo,
  getPostReactions as getPostReactionsRepo,
  upsertCommentReaction as upsertCommentReactionRepo,
  deleteCommentReaction as deleteCommentReactionRepo,
  getCommentReactions as getCommentReactionsRepo,
  getReplies as getRepliesRepo,
  savePost as savePostRepo,
  unsavePost as unsavePostRepo,
} from "../repositories/posts.repository.js";
import * as notificationService from "./notifications.service.js";

export const createPost = async (prisma, userId, postData) => {
  return await prisma.$transaction(async (tx) => {
    return await createPostRepo(tx, userId, postData);
  });
};

export const updatePost = async (prisma, postId, userId, updateData) => {
  return await prisma.$transaction(async (tx) => {
    return await updatePostRepo(tx, postId, userId, updateData);
  });
};

export const softDeletePost = async (prisma, postId, userId) => {
  return await prisma.$transaction(async (tx) => {
    return await softDeletePostRepo(tx, postId, userId);
  });
};

export const restorePost = async (prisma, postId, userId) => {
  return await prisma.$transaction(async (tx) => {
    return await restorePostRepo(tx, postId, userId);
  });
};

export const getPosts = async (prisma, userId, paginationOptions = {}) => {
  return await prisma.$transaction(async (tx) => {
    return await getPostsRepo(tx, userId, paginationOptions);
  });
};

export const getPost = async (prisma, postId, userId) => {
  return await prisma.$transaction(async (tx) => {
    return await getPostRepo(tx, postId, userId);
  });
};

export const getPostsByHashtag = async (
  prisma,
  hashtagName,
  userId,
  paginationOptions = {}
) => {
  return await prisma.$transaction(async (tx) => {
    return await getPostsByHashtagRepo(
      tx,
      hashtagName,
      userId,
      paginationOptions
    );
  });
};

export const getTrendingHashtags = async (prisma, limit) => {
  return await prisma.$transaction(async (tx) => {
    return await getTrendingHashtagsRepo(tx, limit);
  });
};

// Like functionality
// Modified to cater the fastify websocket functionality
export const likePost = async (
  prisma,
  postId,
  userId,
  fastify = null,
  userInfo = null
) => {
  return await prisma.$transaction(async (tx) => {
    // Your existing repository call
    const like = await likePostRepo(tx, postId, userId);

    // Already liked — skip notification, return early
    if (like.alreadyLiked) return like;

    // Get post details for notification (add this query to your transaction)
    const post = await tx.post.findFirst({
      where: { id: postId, isDeleted: false },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            userInfo: {
              select: {
                displayName: true,
              },
            },
          },
        },
      },
    });

    // Send notification after successful like creation (outside transaction)
    if (fastify && post && post.user.id !== userId) {
      // Use setImmediate to ensure this runs after transaction commits
      setImmediate(async () => {
        try {
          const senderDisplayName =
            userInfo?.displayName || userInfo?.username || "Someone";

          await notificationService.createSmartNotification(prisma, fastify, {
            type: "LIKE",
            title: "New Like",
            content: `${senderDisplayName} liked your post`,
            recipientId: post.user.id,
            senderId: userId,
            postId: postId,
            metadata: {
              postCaption: post.caption?.substring(0, 50) || "",
              postThumbnail: post.thumbnailUrl,
              likedBy: senderDisplayName,
            },
            // senderName: senderDisplayName,
          });
        } catch (notificationError) {
          console.error("Failed to send like notification:", notificationError);
        }
      });
    }

    return like;
  });
};

export const unlikePost = async (prisma, postId, userId) => {
  return await prisma.$transaction(async (tx) => {
    return await unlikePostRepo(tx, postId, userId);
  });
};

// Comment functionality
export const createComment = async (prisma, postId, userId, commentData) => {
  return await prisma.$transaction(async (tx) => {
    return await createCommentRepo(tx, postId, userId, commentData);
  });
};

export const updateComment = async (prisma, commentId, userId, updateData) => {
  return await prisma.$transaction(async (tx) => {
    return await updateCommentRepo(tx, commentId, userId, updateData);
  });
};

export const deleteComment = async (prisma, commentId, userId) => {
  return await prisma.$transaction(async (tx) => {
    return await deleteCommentRepo(tx, commentId, userId);
  });
};

export const getComments = async (prisma, postId, paginationOptions = {}, userId = null) => {
  return await prisma.$transaction(async (tx) => {
    return await getCommentsRepo(tx, postId, paginationOptions, userId);
  });
};

// Share functionality
export const sharePost = async (prisma, postId, userId, shareData = {}) => {
  return await prisma.$transaction(async (tx) => {
    return await sharePostRepo(tx, postId, userId, shareData);
  });
};

export const unsharePost = async (prisma, postId, userId) => {
  return await prisma.$transaction(async (tx) => {
    return await unsharePostRepo(tx, postId, userId);
  });
};

export const getShares = async (prisma, postId, paginationOptions = {}) => {
  return await prisma.$transaction(async (tx) => {
    return await getSharesRepo(tx, postId, paginationOptions);
  });
};

// ─── REACTIONS ────────────────────────────────────────────────────────────────

export const upsertPostReaction = async (prisma, postId, userId, reaction) => {
  return await prisma.$transaction(async (tx) => {
    return await upsertPostReactionRepo(tx, postId, userId, reaction);
  });
};

export const deletePostReaction = async (prisma, postId, userId) => {
  return await prisma.$transaction(async (tx) => {
    return await deletePostReactionRepo(tx, postId, userId);
  });
};

export const getPostReactions = async (prisma, postId) => {
  return await prisma.$transaction(async (tx) => {
    return await getPostReactionsRepo(tx, postId);
  });
};

export const upsertCommentReaction = async (prisma, commentId, userId, reaction) => {
  return await prisma.$transaction(async (tx) => {
    return await upsertCommentReactionRepo(tx, commentId, userId, reaction);
  });
};

export const deleteCommentReaction = async (prisma, commentId, userId) => {
  return await prisma.$transaction(async (tx) => {
    return await deleteCommentReactionRepo(tx, commentId, userId);
  });
};

export const getCommentReactions = async (prisma, commentId) => {
  return await prisma.$transaction(async (tx) => {
    return await getCommentReactionsRepo(tx, commentId);
  });
};

// ─── REPLIES PAGINATION ───────────────────────────────────────────────────────

export const getReplies = async (prisma, commentId, paginationOptions = {}) => {
  return await prisma.$transaction(async (tx) => {
    return await getRepliesRepo(tx, commentId, paginationOptions);
  });
};

// ─── SAVED POSTS ─────────────────────────────────────────────────────────────

export const savePost = async (prisma, postId, userId) => {
  return await prisma.$transaction(async (tx) => {
    return await savePostRepo(tx, postId, userId);
  });
};

export const unsavePost = async (prisma, postId, userId) => {
  return await prisma.$transaction(async (tx) => {
    return await unsavePostRepo(tx, postId, userId);
  });
};
